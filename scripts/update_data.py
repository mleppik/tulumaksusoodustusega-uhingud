#!/usr/bin/env python3
"""Download and parse the EMTA list of Estonian non-profits with income tax
incentive (tulumaksusoodustusega ühingute nimekiri) and write site/data.json.

The official dataset is published only as a PDF behind a stable Nextcloud
share URL. The PDF is a plain table: organisation name, registry code,
date added to the list, county, city/village, with an "as of" (Seisuga)
date on the first page.

Exits non-zero (and leaves data.json untouched) if anything about the PDF
looks unexpected, so the CI workflow never commits a bad parse.
"""

import json
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from datetime import date
from pathlib import Path

SOURCE_URL = "https://ncfailid.emta.ee/s/69dm4GRbczHFbWQ/download"
DATASET_PAGE = "https://andmed.eesti.ee/datasets/tulumaksusoodustusega-uhingute-nimekiri"
REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT = REPO_ROOT / "site" / "data.json"

MIN_ROWS = 2500
MAX_COUNT_DRIFT = 0.15  # vs. the previously committed data.json

ROW_RE = re.compile(
    r"^\s*(?P<name>\S.*?)\s{2,}"
    r"(?P<code>[89]\d{7})\s+"
    r"(?P<date>\d{2}\.\d{2}\.\d{4})\s{2,}"
    r"(?P<county>\S.*?maakond)\s+"
    r"(?P<place>\S.*?)\s*$"
)
ASOF_RE = re.compile(r"Seisuga\s+(\d{2})\.(\d{2})\.(\d{4})")

# Non-data lines we expect to see and silently skip (page headers, page
# numbers, report title). Anything else that fails ROW_RE is an error.
SKIP_RES = [
    re.compile(r"^\s*$"),
    re.compile(r"^\s*\d{1,4}\s*$"),  # page number
    re.compile(r"^\s*Tulumaksusoodustusega mittetulundusühingute"),
    re.compile(r"^\s*Seisuga\s+\d{2}\.\d{2}\.\d{4}\s*$"),
    re.compile(r"^\s*Mittetulundusühingud, sihtasutused, usulised ühingud\b"),
    # The "Nimekirja kandmine" column header wraps; depending on the extractor
    # (pdftotext vs ghostscript) its words can land on lines of their own.
    re.compile(r"^\s*Nimekirja\s*$"),
    re.compile(r"^\s*kandmine\s*$"),
]


def fail(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def download_pdf(dest: Path) -> None:
    req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "tulumaksusoodustus-site-updater"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        if resp.status != 200:
            fail(f"download returned HTTP {resp.status}")
        content_type = resp.headers.get("Content-Type", "")
        data = resp.read()
    if "pdf" not in content_type.lower():
        fail(f"unexpected content type: {content_type!r}")
    if len(data) < 100_000:
        fail(f"PDF suspiciously small: {len(data)} bytes")
    if not data.startswith(b"%PDF"):
        fail("downloaded file is not a PDF")
    dest.write_bytes(data)


def extract_text(pdf: Path, txt: Path) -> str:
    """Layout-preserving text extraction via poppler, or Ghostscript as fallback."""
    if shutil.which("pdftotext"):
        subprocess.run(["pdftotext", "-layout", str(pdf), str(txt)], check=True)
    elif shutil.which("gs"):
        subprocess.run(
            ["gs", "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=txtwrite",
             f"-sOutputFile={txt}", str(pdf)],
            check=True,
        )
    else:
        fail("need either pdftotext (poppler) or gs (ghostscript) on PATH")
    return txt.read_text(encoding="utf-8")


def iso(d: str) -> str:
    day, month, year = d.split(".")
    return str(date(int(year), int(month), int(day)))


def parse(text: str) -> tuple[str, list[dict]]:
    m = ASOF_RE.search(text)
    if not m:
        fail('no "Seisuga DD.MM.YYYY" date found in the PDF')
    as_of = str(date(int(m.group(3)), int(m.group(2)), int(m.group(1))))

    rows: list[dict] = []
    bad: list[str] = []
    for line in text.splitlines():
        row = ROW_RE.match(line)
        if row:
            rows.append(
                {
                    "name": re.sub(r"\s+", " ", row["name"]).strip(),
                    "code": row["code"],
                    "since": iso(row["date"]),
                    "county": row["county"].strip(),
                    "place": row["place"].strip(),
                }
            )
        elif not any(p.match(line) for p in SKIP_RES):
            bad.append(line.strip())

    if bad:
        preview = "\n  ".join(bad[:10])
        fail(f"{len(bad)} unrecognised line(s) in the PDF, e.g.:\n  {preview}")
    if len(rows) < MIN_ROWS:
        fail(f"only {len(rows)} rows parsed (expected >= {MIN_ROWS})")

    # The source occasionally contains literal duplicate rows; drop those but
    # keep distinct rows that share a registry code (we mirror the source).
    seen: set[tuple] = set()
    unique: list[dict] = []
    for r in rows:
        key = tuple(r.values())
        if key not in seen:
            seen.add(key)
            unique.append(r)
    return as_of, unique


def check_drift(new_count: int) -> None:
    if not OUTPUT.exists():
        return
    try:
        old_count = json.loads(OUTPUT.read_text(encoding="utf-8"))["count"]
    except (json.JSONDecodeError, KeyError):
        return
    if old_count and abs(new_count - old_count) / old_count > MAX_COUNT_DRIFT:
        fail(f"row count changed too much: {old_count} -> {new_count}")


def write_output(as_of: str, orgs: list[dict]) -> None:
    # One organisation per line: small file, readable git diffs, and the
    # output is deterministic so unchanged data produces no commit.
    org_lines = ",\n    ".join(json.dumps(o, ensure_ascii=False) for o in orgs)
    OUTPUT.write_text(
        "{\n"
        f'  "asOf": {json.dumps(as_of)},\n'
        f'  "source": {json.dumps(SOURCE_URL)},\n'
        f'  "datasetPage": {json.dumps(DATASET_PAGE)},\n'
        f'  "count": {len(orgs)},\n'
        f'  "organizations": [\n    {org_lines}\n  ]\n'
        "}\n",
        encoding="utf-8",
    )


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        pdf = Path(tmp) / "nimekiri.pdf"
        download_pdf(pdf)
        text = extract_text(pdf, Path(tmp) / "nimekiri.txt")
    as_of, orgs = parse(text)
    check_drift(len(orgs))
    write_output(as_of, orgs)
    print(f"OK: {len(orgs)} organisations, seisuga {as_of} -> {OUTPUT.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()

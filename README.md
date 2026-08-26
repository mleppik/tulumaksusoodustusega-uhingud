# Tulumaksusoodustusega ühingud

**[English below](#in-english)**

Otsitav nimekiri Eesti mittetulundusühingutest, sihtasutustest ja usulistest ühendustest, kellele tehtud annetused on ettevõttele tulumaksusoodustusega — koos annetuse maksukalkulaatoriga.

Maksu- ja Tolliamet avaldab ametliku koondnimekirja ainult PDF-ina. See projekt laeb PDF-i automaatselt alla, teisendab masinloetavaks ja avaldab staatilise veebilehena.

## Kuidas see töötab

1. **Andmed** — [`scripts/update_data.py`](scripts/update_data.py) laeb alla [ametliku PDF-i](https://ncfailid.emta.ee/s/69dm4GRbczHFbWQ), parsib tabeli ja kirjutab [`site/data.json`](site/data.json). Range valideerimine (ridade arv, tundmatud read, kuupäevad) tagab, et vigast parsimist kunagi ei avaldata.
2. **Uuendused** — GitHub Actions ([`update-data.yml`](.github/workflows/update-data.yml)) kontrollib andmeid iga päev ja teeb muudatuse korral commit'i. `data.json`-i git-ajalugu on ühtlasi nimekirja muudatuste logi.
3. **Veebileht** — [`site/`](site) on sõltuvusteta staatiline leht (HTML + CSS + JS), mille GitHub Actions avaldab GitHub Pages'is.

## Arendamine

```bash
# Andmete uuendamine (vajab poppler'it või ghostscript'i)
brew install poppler        # macOS
python3 scripts/update_data.py

# Lehe vaatamine
cd site && python3 -m http.server 8000
# ava http://localhost:8000
```

## Andmeallikad

- [Tulumaksusoodustusega ühingute nimekiri](https://andmed.eesti.ee/datasets/tulumaksusoodustusega-uhingute-nimekiri) — Maksu- ja Tolliamet, avaandmed (CC0 1.0), uueneb umbes kord kuus
- [Kingitused, annetused ja vastuvõtukulud](https://www.emta.ee/ariklient/maksud-ja-tasumine/tulumaks-ja-sotsiaalmaks/kingitused-annetused-ja-vastuvotukulud) — maksureeglid (emta.ee)

See on **mitteametlik** leht, millel puudub seos Maksu- ja Tolliametiga. Kalkulaator on informatiivne ega asenda maksunõustamist.

---

## In English

A searchable list of Estonian non-profit associations, foundations and religious associations to which donations qualify for a corporate income tax incentive — with a donation tax calculator.

The Estonian Tax and Customs Board publishes the official consolidated list only as a PDF. This project automatically downloads the PDF, converts it to machine-readable data and publishes it as a static website.

## How it works

1. **Data** — [`scripts/update_data.py`](scripts/update_data.py) downloads the [official PDF](https://ncfailid.emta.ee/s/69dm4GRbczHFbWQ), parses the table and writes [`site/data.json`](site/data.json). Strict validation (row count, unrecognised lines, dates) guarantees a bad parse is never published.
2. **Updates** — GitHub Actions ([`update-data.yml`](.github/workflows/update-data.yml)) checks daily and commits when the data changes. The git history of `data.json` doubles as a changelog of the list.
3. **Website** — [`site/`](site) is a dependency-free static page (HTML + CSS + JS) deployed to GitHub Pages by GitHub Actions.

## Development

```bash
# Update the data (needs poppler or ghostscript)
brew install poppler        # macOS
python3 scripts/update_data.py

# Preview the site
cd site && python3 -m http.server 8000
# open http://localhost:8000
```

## Data sources

- [List of associations benefiting from income tax incentives](https://andmed.eesti.ee/datasets/tulumaksusoodustusega-uhingute-nimekiri) — Estonian Tax and Customs Board, open data (CC0 1.0), updated roughly monthly
- [Gifts, donations and entertainment expenses](https://www.emta.ee/en/business-client/taxes-and-payment/income-and-social-taxes/gifts-and-donations) — tax rules (emta.ee)

This is an **unofficial** site with no affiliation to the Estonian Tax and Customs Board. The calculator is informational and does not replace tax advice.

## License

Code: [MIT](LICENSE). Data: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) by the Estonian Tax and Customs Board.

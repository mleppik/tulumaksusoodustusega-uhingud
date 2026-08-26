// UI strings. Organisation data itself (names, counties) stays in Estonian —
// that is the official registry data.
window.I18N = {
  et: {
    "lang.name": "Eesti",
    "site.title": "Tulumaksusoodustusega ühingud",
    "site.tagline":
      "Otsitav nimekiri mittetulundusühingutest, sihtasutustest ja usulistest ühendustest, kellele tehtud annetused on tulumaksusoodustusega.",
    "notice.unofficial":
      "Mitteametlik leht. Allikas: Maksu- ja Tolliameti koondnimekiri seisuga {date}.",
    "notice.sourceLink": "Ametlik nimekiri (PDF)",

    "search.placeholder": "Otsi nime või registrikoodi järgi…",
    "search.label": "Otsing",
    "filter.county.all": "Kõik maakonnad",
    "filter.county.label": "Maakond",
    "filter.type.all": "Kõik liigid",
    "filter.type.mtu": "MTÜ / usuline ühendus",
    "filter.type.sa": "Sihtasutus",
    "filter.type.label": "Liik",

    "th.name": "Nimi",
    "th.code": "Registrikood",
    "th.county": "Maakond",
    "th.place": "Linn/küla",
    "th.since": "Nimekirjas alates",
    "results.showing": "Kuvatud {shown} ühingut {total}-st",
    "results.showAll": "Näita kõiki",
    "results.none": "Otsingule ei vastanud ükski ühing.",
    "row.registerLink": "Vaata äriregistris",

    "calc.title": "Annetuse maksukalkulaator",
    "calc.lead":
      "Ettevõtte annetused nimekirja kantud ühingutele on tulumaksuvabad kuni piirmäärani: 3% samal kalendriaastal tehtud sotsiaalmaksuga maksustatud väljamaksetest (palgafond) või 10% eelmise majandusaasta kasumist — rakendub soodsam.",
    "calc.donation": "Annetused kokku kalendriaastas (€)",
    "calc.payroll": "Palgafond samal kalendriaastal (€)",
    "calc.payrollHint": "Sotsiaalmaksuga maksustatud väljamaksed",
    "calc.profit": "Eelmise majandusaasta kasum (€)",
    "calc.limit": "Tulumaksuvaba piirmäär",
    "calc.limitBasisPayroll": "3% palgafondist",
    "calc.limitBasisProfit": "10% eelmise aasta kasumist",
    "calc.excess": "Piirmäära ületav osa",
    "calc.tax": "Tulumaks (22/78)",
    "calc.total": "Annetuste kogukulu ettevõttele",
    "calc.unlisted":
      "Kui saaja ei ole nimekirjas, maksustatakse kogu annetus määraga 22/78 — sama annetus maksaks siis kokku {amount}.",
    "calc.disclaimer":
      "Kalkulaator on informatiivne ega asenda maksunõustamist. Annetused deklareeritakse TSD lisas 5 järgmise kuu 10. kuupäevaks.",
    "calc.emtaLink": "Loe täpsemalt Maksu- ja Tolliameti lehelt",

    "info.title": "Mis nimekiri see on?",
    "info.p1":
      "Maksu- ja Tolliamet peab nimekirja mittetulundusühingutest, sihtasutustest ja usulistest ühendustest, mis tegutsevad avalikes huvides ja heategevuslikult. Nimekirja kantud ühingule tehtud annetused on ettevõttele piirmäära ulatuses tulumaksuvabad.",
    "info.p2":
      "Nimekirja uuendatakse umbes kord kuus. See leht laeb ametliku PDF-i automaatselt alla, teisendab masinloetavaks ja avaldab otsitava tabelina. Andmete litsents on CC0 (avaandmed).",
    "info.link.emta": "Kingitused, annetused ja vastuvõtukulud (emta.ee)",
    "info.link.emtaList": "Nimekirjas olevad ühingud (emta.ee)",
    "info.link.dataset": "Andmestik avaandmete portaalis (andmed.eesti.ee)",
    "info.link.sourcePdf": "Ametlik koondnimekiri (PDF)",

    "footer.openSource": "Avatud lähtekoodiga projekt",
    "footer.data": "Andmed: Maksu- ja Tolliamet (CC0)",
    "footer.code": "Kood: MIT litsents",
    "footer.updated": "Andmed seisuga {date}",
  },

  en: {
    "lang.name": "English",
    "site.title": "Estonian non-profits with income tax incentive",
    "site.tagline":
      "A searchable list of Estonian non-profit associations, foundations and religious associations — donations to them qualify for an income tax incentive.",
    "notice.unofficial":
      "Unofficial site. Source: the Estonian Tax and Customs Board's consolidated list as of {date}.",
    "notice.sourceLink": "Official list (PDF)",

    "search.placeholder": "Search by name or registry code…",
    "search.label": "Search",
    "filter.county.all": "All counties",
    "filter.county.label": "County",
    "filter.type.all": "All types",
    "filter.type.mtu": "Non-profit / religious assoc.",
    "filter.type.sa": "Foundation",
    "filter.type.label": "Type",

    "th.name": "Name",
    "th.code": "Registry code",
    "th.county": "County",
    "th.place": "City/village",
    "th.since": "Listed since",
    "results.showing": "Showing {shown} of {total} organisations",
    "results.showAll": "Show all",
    "results.none": "No organisations matched your search.",
    "row.registerLink": "View in e-Business Register",

    "calc.title": "Donation tax calculator",
    "calc.lead":
      "A company's donations to listed organisations are exempt from income tax up to a limit: 3% of payroll subject to social tax in the same calendar year, or 10% of the previous financial year's profit — whichever is more favourable.",
    "calc.donation": "Total donations in a calendar year (€)",
    "calc.payroll": "Payroll in the same calendar year (€)",
    "calc.payrollHint": "Payments subject to social tax",
    "calc.profit": "Previous financial year's profit (€)",
    "calc.limit": "Tax-free limit",
    "calc.limitBasisPayroll": "3% of payroll",
    "calc.limitBasisProfit": "10% of last year's profit",
    "calc.excess": "Amount exceeding the limit",
    "calc.tax": "Income tax (22/78)",
    "calc.total": "Total cost to the company",
    "calc.unlisted":
      "If the recipient is not on the list, the entire donation is taxed at 22/78 — the same donation would then cost {amount} in total.",
    "calc.disclaimer":
      "This calculator is informational and does not replace tax advice. Donations are declared in Annex 5 of form TSD by the 10th of the following month.",
    "calc.emtaLink": "Read more on the Tax and Customs Board's website",

    "info.title": "What is this list?",
    "info.p1":
      "The Estonian Tax and Customs Board maintains a list of non-profit associations, foundations and religious associations that operate in the public interest and for charitable purposes. Donations made by a company to a listed organisation are exempt from income tax up to a limit.",
    "info.p2":
      "The list is updated roughly once a month. This site automatically downloads the official PDF, converts it to machine-readable data and publishes it as a searchable table. The data is licensed under CC0 (open data).",
    "info.link.emta": "Gifts, donations and entertainment expenses (emta.ee)",
    "info.link.emtaList": "Organisations in the list (emta.ee)",
    "info.link.dataset": "Dataset on the Estonian open data portal (andmed.eesti.ee)",
    "info.link.sourcePdf": "Official consolidated list (PDF)",

    "footer.openSource": "Open-source project",
    "footer.data": "Data: Estonian Tax and Customs Board (CC0)",
    "footer.code": "Code: MIT license",
    "footer.updated": "Data as of {date}",
  },
};

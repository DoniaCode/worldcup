function createMatch(
  id,
  homeTeam,
  awayTeam,
  apiHomeTeam,
  apiAwayTeam,
  date
) {
  return {
    id,
    homeTeam,
    awayTeam,
    apiHomeTeam,
    apiAwayTeam,
    date,
    apiFixtureId: null,
    realHomeScore: null,
    realAwayScore: null,
    finished: false
  };
}

const scores = [
  /*
  |--------------------------------------------------------------------------
  | GRUPPO A
  |--------------------------------------------------------------------------
  */

  createMatch(
    "messico-sudafrica",
    "Messico",
    "Sudafrica",
    "Mexico",
    "South Africa",
    "2026-06-11"
  ),

  createMatch(
    "corea-del-sud-cechia",
    "Corea del Sud",
    "Repubblica Ceca",
    "South Korea",
    "Czech Republic",
    "2026-06-11"
  ),

  createMatch(
    "repubblica-ceca-sudafrica",
    "Repubblica Ceca",
    "Sudafrica",
    "Czech Republic",
    "South Africa",
    "2026-06-18"
  ),

  createMatch(
    "messico-corea-del-sud",
    "Messico",
    "Corea del Sud",
    "Mexico",
    "South Korea",
    "2026-06-18"
  ),

  createMatch(
    "repubblica-ceca-messico",
    "Repubblica Ceca",
    "Messico",
    "Czech Republic",
    "Mexico",
    "2026-06-24"
  ),

  createMatch(
    "sudafrica-corea-del-sud",
    "Sudafrica",
    "Corea del Sud",
    "South Africa",
    "South Korea",
    "2026-06-24"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO B
  |--------------------------------------------------------------------------
  */

  createMatch(
    "canada-bosnia-ed-erzegovina",
    "Canada",
    "Bosnia ed Erzegovina",
    "Canada",
    "Bosnia & Herzegovina",
    "2026-06-12"
  ),

  createMatch(
    "svizzera-qatar",
    "Svizzera",
    "Qatar",
    "Switzerland",
    "Qatar",
    "2026-06-13"
  ),

  createMatch(
    "svizzera-bosnia-ed-erzegovina",
    "Svizzera",
    "Bosnia ed Erzegovina",
    "Switzerland",
    "Bosnia & Herzegovina",
    "2026-06-18"
  ),

  createMatch(
    "canada-qatar",
    "Canada",
    "Qatar",
    "Canada",
    "Qatar",
    "2026-06-18"
  ),

  createMatch(
    "svizzera-canada",
    "Svizzera",
    "Canada",
    "Switzerland",
    "Canada",
    "2026-06-24"
  ),

  createMatch(
    "bosnia-ed-erzegovina-qatar",
    "Bosnia ed Erzegovina",
    "Qatar",
    "Bosnia & Herzegovina",
    "Qatar",
    "2026-06-24"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO C
  |--------------------------------------------------------------------------
  */

  createMatch(
    "brasile-marocco",
    "Brasile",
    "Marocco",
    "Brazil",
    "Morocco",
    "2026-06-13"
  ),

  createMatch(
    "haiti-scozia",
    "Haiti",
    "Scozia",
    "Haiti",
    "Scotland",
    "2026-06-13"
  ),

  createMatch(
    "scozia-marocco",
    "Scozia",
    "Marocco",
    "Scotland",
    "Morocco",
    "2026-06-19"
  ),

  createMatch(
    "brasile-haiti",
    "Brasile",
    "Haiti",
    "Brazil",
    "Haiti",
    "2026-06-19"
  ),

  createMatch(
    "scozia-brasile",
    "Scozia",
    "Brasile",
    "Scotland",
    "Brazil",
    "2026-06-24"
  ),

  createMatch(
    "marocco-haiti",
    "Marocco",
    "Haiti",
    "Morocco",
    "Haiti",
    "2026-06-24"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO D
  |--------------------------------------------------------------------------
  */

  createMatch(
    "stati-uniti-paraguay",
    "Stati Uniti",
    "Paraguay",
    "USA",
    "Paraguay",
    "2026-06-12"
  ),

  createMatch(
    "australia-turchia",
    "Australia",
    "Turchia",
    "Australia",
    "Turkey",
    "2026-06-13"
  ),

  createMatch(
    "stati-uniti-australia",
    "Stati Uniti",
    "Australia",
    "USA",
    "Australia",
    "2026-06-19"
  ),

  createMatch(
    "turchia-paraguay",
    "Turchia",
    "Paraguay",
    "Turkey",
    "Paraguay",
    "2026-06-19"
  ),

  createMatch(
    "turchia-stati-uniti",
    "Turchia",
    "Stati Uniti",
    "Turkey",
    "USA",
    "2026-06-25"
  ),

  createMatch(
    "paraguay-australia",
    "Paraguay",
    "Australia",
    "Paraguay",
    "Australia",
    "2026-06-25"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO E
  |--------------------------------------------------------------------------
  */

  createMatch(
    "germania-curacao",
    "Germania",
    "Curaçao",
    "Germany",
    "Curaçao",
    "2026-06-14"
  ),

  createMatch(
    "costa-davorio-ecuador",
    "Costa d’Avorio",
    "Ecuador",
    "Ivory Coast",
    "Ecuador",
    "2026-06-14"
  ),

  createMatch(
    "germania-costa-davorio",
    "Germania",
    "Costa d’Avorio",
    "Germany",
    "Ivory Coast",
    "2026-06-20"
  ),

  createMatch(
    "ecuador-curacao",
    "Ecuador",
    "Curaçao",
    "Ecuador",
    "Curaçao",
    "2026-06-20"
  ),

  createMatch(
    "curacao-costa-davorio",
    "Curaçao",
    "Costa d’Avorio",
    "Curaçao",
    "Ivory Coast",
    "2026-06-25"
  ),

  createMatch(
    "ecuador-germania",
    "Ecuador",
    "Germania",
    "Ecuador",
    "Germany",
    "2026-06-25"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO F
  |--------------------------------------------------------------------------
  */

  createMatch(
    "paesi-bassi-giappone",
    "Paesi Bassi",
    "Giappone",
    "Netherlands",
    "Japan",
    "2026-06-14"
  ),

  createMatch(
    "svezia-tunisia",
    "Svezia",
    "Tunisia",
    "Sweden",
    "Tunisia",
    "2026-06-14"
  ),

  createMatch(
    "paesi-bassi-svezia",
    "Paesi Bassi",
    "Svezia",
    "Netherlands",
    "Sweden",
    "2026-06-20"
  ),

  createMatch(
    "tunisia-giappone",
    "Tunisia",
    "Giappone",
    "Tunisia",
    "Japan",
    "2026-06-20"
  ),

  createMatch(
    "giappone-svezia",
    "Giappone",
    "Svezia",
    "Japan",
    "Sweden",
    "2026-06-25"
  ),

  createMatch(
    "tunisia-paesi-bassi",
    "Tunisia",
    "Paesi Bassi",
    "Tunisia",
    "Netherlands",
    "2026-06-25"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO G
  |--------------------------------------------------------------------------
  */

  createMatch(
    "belgio-egitto",
    "Belgio",
    "Egitto",
    "Belgium",
    "Egypt",
    "2026-06-15"
  ),

  createMatch(
    "iran-nuova-zelanda",
    "Iran",
    "Nuova Zelanda",
    "Iran",
    "New Zealand",
    "2026-06-15"
  ),

  createMatch(
    "belgio-iran",
    "Belgio",
    "Iran",
    "Belgium",
    "Iran",
    "2026-06-21"
  ),

  createMatch(
    "nuova-zelanda-egitto",
    "Nuova Zelanda",
    "Egitto",
    "New Zealand",
    "Egypt",
    "2026-06-21"
  ),

  createMatch(
    "egitto-iran",
    "Egitto",
    "Iran",
    "Egypt",
    "Iran",
    "2026-06-26"
  ),

  createMatch(
    "nuova-zelanda-belgio",
    "Nuova Zelanda",
    "Belgio",
    "New Zealand",
    "Belgium",
    "2026-06-26"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO H
  |--------------------------------------------------------------------------
  */

  createMatch(
    "spagna-capo-verde",
    "Spagna",
    "Capo Verde",
    "Spain",
    "Cape Verde",
    "2026-06-15"
  ),

  createMatch(
    "arabia-saudita-uruguay",
    "Arabia Saudita",
    "Uruguay",
    "Saudi Arabia",
    "Uruguay",
    "2026-06-15"
  ),

  createMatch(
    "spagna-arabia-saudita",
    "Spagna",
    "Arabia Saudita",
    "Spain",
    "Saudi Arabia",
    "2026-06-21"
  ),

  createMatch(
    "uruguay-capo-verde",
    "Uruguay",
    "Capo Verde",
    "Uruguay",
    "Cape Verde",
    "2026-06-21"
  ),

  createMatch(
    "capo-verde-arabia-saudita",
    "Capo Verde",
    "Arabia Saudita",
    "Cape Verde",
    "Saudi Arabia",
    "2026-06-26"
  ),

  createMatch(
    "uruguay-spagna",
    "Uruguay",
    "Spagna",
    "Uruguay",
    "Spain",
    "2026-06-26"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO I
  |--------------------------------------------------------------------------
  */

  createMatch(
    "francia-senegal",
    "Francia",
    "Senegal",
    "France",
    "Senegal",
    "2026-06-16"
  ),

  createMatch(
    "iraq-norvegia",
    "Iraq",
    "Norvegia",
    "Iraq",
    "Norway",
    "2026-06-16"
  ),

  createMatch(
    "francia-iraq",
    "Francia",
    "Iraq",
    "France",
    "Iraq",
    "2026-06-22"
  ),

  createMatch(
    "norvegia-senegal",
    "Norvegia",
    "Senegal",
    "Norway",
    "Senegal",
    "2026-06-22"
  ),

  createMatch(
    "norvegia-francia",
    "Norvegia",
    "Francia",
    "Norway",
    "France",
    "2026-06-26"
  ),

  createMatch(
    "senegal-iraq",
    "Senegal",
    "Iraq",
    "Senegal",
    "Iraq",
    "2026-06-26"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO J
  |--------------------------------------------------------------------------
  */

  createMatch(
    "argentina-algeria",
    "Argentina",
    "Algeria",
    "Argentina",
    "Algeria",
    "2026-06-16"
  ),

  createMatch(
    "austria-giordania",
    "Austria",
    "Giordania",
    "Austria",
    "Jordan",
    "2026-06-16"
  ),

  createMatch(
    "argentina-austria",
    "Argentina",
    "Austria",
    "Argentina",
    "Austria",
    "2026-06-22"
  ),

  createMatch(
    "giordania-algeria",
    "Giordania",
    "Algeria",
    "Jordan",
    "Algeria",
    "2026-06-22"
  ),

  createMatch(
    "algeria-austria",
    "Algeria",
    "Austria",
    "Algeria",
    "Austria",
    "2026-06-27"
  ),

  createMatch(
    "giordania-argentina",
    "Giordania",
    "Argentina",
    "Jordan",
    "Argentina",
    "2026-06-27"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO K
  |--------------------------------------------------------------------------
  */

  createMatch(
    "portogallo-congo",
    "Portogallo",
    "RD Congo",
    "Portugal",
    "DR Congo",
    "2026-06-17"
  ),

  createMatch(
    "uzbekistan-colombia",
    "Uzbekistan",
    "Colombia",
    "Uzbekistan",
    "Colombia",
    "2026-06-17"
  ),

  createMatch(
    "portogallo-uzbekistan",
    "Portogallo",
    "Uzbekistan",
    "Portugal",
    "Uzbekistan",
    "2026-06-23"
  ),

  createMatch(
    "colombia-rd-congo",
    "Colombia",
    "RD Congo",
    "Colombia",
    "DR Congo",
    "2026-06-23"
  ),

  createMatch(
    "colombia-portogallo",
    "Colombia",
    "Portogallo",
    "Colombia",
    "Portugal",
    "2026-06-27"
  ),

  createMatch(
    "rd-congo-uzbekistan",
    "RD Congo",
    "Uzbekistan",
    "DR Congo",
    "Uzbekistan",
    "2026-06-27"
  ),

  /*
  |--------------------------------------------------------------------------
  | GRUPPO L
  |--------------------------------------------------------------------------
  */

  createMatch(
    "inghilterra-croazia",
    "Inghilterra",
    "Croazia",
    "England",
    "Croatia",
    "2026-06-17"
  ),

  createMatch(
    "ghana-panama",
    "Ghana",
    "Panama",
    "Ghana",
    "Panama",
    "2026-06-17"
  ),

  createMatch(
    "inghilterra-ghana",
    "Inghilterra",
    "Ghana",
    "England",
    "Ghana",
    "2026-06-23"
  ),

  createMatch(
    "panama-croazia",
    "Panama",
    "Croazia",
    "Panama",
    "Croatia",
    "2026-06-23"
  ),

  createMatch(
    "panama-inghilterra",
    "Panama",
    "Inghilterra",
    "Panama",
    "England",
    "2026-06-27"
  ),

  createMatch(
    "croazia-ghana",
    "Croazia",
    "Ghana",
    "Croatia",
    "Ghana",
    "2026-06-27"
  ),

  /*
  |--------------------------------------------------------------------------
  | PARTITE SUCCESSIVE
  |--------------------------------------------------------------------------
  */

  // 29 giugno
  createMatch(
    "brasile-giappone",
    "Brasile",
    "Giappone",
    "Brazil",
    "Japan",
    "2026-06-29"
  ),

  createMatch(
    "germania-paraguay",
    "Germania",
    "Paraguay",
    "Germany",
    "Paraguay",
    "2026-06-29"
  ),

  // 30 giugno
  createMatch(
    "paesi-bassi-marocco",
    "Paesi Bassi",
    "Marocco",
    "Netherlands",
    "Morocco",
    "2026-06-30"
  ),

  createMatch(
    "costa-davorio-norvegia",
    "Costa d’Avorio",
    "Norvegia",
    "Ivory Coast",
    "Norway",
    "2026-06-30"
  ),

  createMatch(
    "francia-svezia",
    "Francia",
    "Svezia",
    "France",
    "Sweden",
    "2026-06-30"
  ),

  // 1 luglio
  createMatch(
    "messico-ecuador",
    "Messico",
    "Ecuador",
    "Mexico",
    "Ecuador",
    "2026-07-01"
  ),

  createMatch(
    "inghilterra-rd-congo",
    "Inghilterra",
    "RD Congo",
    "England",
    "DR Congo",
    "2026-07-01"
  ),

  createMatch(
    "belgio-senegal",
    "Belgio",
    "Senegal",
    "Belgium",
    "Senegal",
    "2026-07-01"
  ),

  // 2 luglio
  createMatch(
    "stati-uniti-bosnia-ed-erzegovina",
    "Stati Uniti",
    "Bosnia ed Erzegovina",
    "USA",
    "Bosnia & Herzegovina",
    "2026-07-02"
  ),

  createMatch(
    "spagna-austria",
    "Spagna",
    "Austria",
    "Spain",
    "Austria",
    "2026-07-02"
  ),

  // 3 luglio
  createMatch(
    "portogallo-croazia",
    "Portogallo",
    "Croazia",
    "Portugal",
    "Croatia",
    "2026-07-03"
  ),

  createMatch(
    "svizzera-algeria",
    "Svizzera",
    "Algeria",
    "Switzerland",
    "Algeria",
    "2026-07-03"
  ),

  createMatch(
    "australia-egitto",
    "Australia",
    "Egitto",
    "Australia",
    "Egypt",
    "2026-07-03"
  ),

  // 4 luglio
  createMatch(
    "argentina-capo-verde",
    "Argentina",
    "Capo Verde",
    "Argentina",
    "Cape Verde",
    "2026-07-04"
  ),

  createMatch(
    "colombia-ghana",
    "Colombia",
    "Ghana",
    "Colombia",
    "Ghana",
    "2026-07-04"
  )
];
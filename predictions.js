const predictionData = {

  Donia: [
    // Prima giornata
    ["messico-sudafrica", 1, 2],
    ["corea-del-sud-cechia", 2, 1],
    ["canada-bosnia-ed-erzegovina", 0, 2],
    ["svizzera-qatar", 1, 1],
    ["stati-uniti-paraguay", 0, 3],
    ["brasile-marocco", 2, 2],
    ["haiti-scozia", 0, 1],
    ["australia-turchia", 1, 3],
    ["germania-curacao", 4, 1],
    ["paesi-bassi-giappone", 2, 3],
    ["costa-davorio-ecuador", 1, 0],
    ["svezia-tunisia", 2, 3],
    ["belgio-egitto", 3, 2],
    ["spagna-capo-verde", 3, 0],
    ["iran-nuova-zelanda", 0, 1],
    ["arabia-saudita-uruguay", 0, 3],
    ["francia-senegal", 4, 1],
    ["iraq-norvegia", 0, 2],
    ["argentina-algeria", 4, 2],
    ["austria-giordania", 2, 0],
    ["portogallo-congo", 3, 1],
    ["inghilterra-croazia", 3, 0],

    // 18 giugno
    ["repubblica-ceca-sudafrica", 1, 2],
    ["svizzera-bosnia-ed-erzegovina", 2, 1],
    ["canada-qatar", 1, 1],

    // 19 giugno
    ["messico-corea-del-sud", 1, 2],
    ["stati-uniti-australia", 1, 1],
    ["scozia-marocco", 0, 4],

    // 20 giugno
    ["brasile-haiti", 5, 0],
    ["turchia-paraguay", 3, 1],
    ["paesi-bassi-svezia", 1, 3],
    ["germania-costa-davorio", 2, 1],

    // 21 giugno
    ["ecuador-curacao", 1, 0],
    ["tunisia-giappone", 1, 4],
    ["spagna-arabia-saudita", 2, 1],
    ["belgio-iran", 3, 1],
    ["uruguay-capo-verde", 2, 1],

    // 22 giugno
    ["nuova-zelanda-egitto", 0, 2],
    ["argentina-austria", 3, 0],
    ["francia-iraq", 4, 0],

    // 23 giugno
    ["norvegia-senegal", 3, 1],
    ["giordania-algeria", 1, 2],
    ["portogallo-uzbekistan", 2, 0],
    ["inghilterra-ghana", 1, 0],

    // 24 giugno
    ["panama-croazia", 1, 3],
    ["colombia-rd-congo", 1, 0],
    ["svizzera-canada", 2, 1],
    ["bosnia-ed-erzegovina-qatar", 2, 1],
    ["scozia-brasile", 1, 3],

    // Marocco - Haiti non presente perché manca il punteggio

    // 25 giugno
    ["sudafrica-corea-del-sud", 2, 1],
    ["repubblica-ceca-messico", 1, 2],
    ["curacao-costa-davorio", 0, 2],
    ["ecuador-germania", 2, 1],

    // 26 giugno
    ["tunisia-paesi-bassi", 0, 4],
    ["giappone-svezia", 2, 1],
    ["turchia-stati-uniti", 1, 2],
    ["paraguay-australia", 2, 3],
    ["norvegia-francia", 2, 3],
    ["senegal-iraq", 3, 1],

    // 27 giugno
    ["capo-verde-arabia-saudita", 1, 1],
    ["uruguay-spagna", 2, 3],
    ["nuova-zelanda-belgio", 1, 2],
    ["egitto-iran", 3, 1],
    ["panama-inghilterra", 1, 3],
    ["croazia-ghana", 2, 1],

    // 28 giugno
    ["colombia-portogallo", 0, 2],
    ["rd-congo-uzbekistan", 2, 0],
    ["algeria-austria", 1, 3],
    ["giordania-argentina", 1, 3],

    // 29 giugno
    ["brasile-giappone", 2, 1],
    ["germania-paraguay", 2, 0],

    // 30 giugno
    ["paesi-bassi-marocco", 2, 3],
    ["costa-davorio-norvegia", 1, 2],
    ["francia-svezia", 2, 0],

    // 1 luglio
    ["messico-ecuador", 1, 1],
    ["inghilterra-rd-congo", 2, 1],
    ["belgio-senegal", 1, 2],

    // 2 luglio
    ["stati-uniti-bosnia-ed-erzegovina", 1, 1],
    ["spagna-austria", 2, 1],

    // 3 luglio
    ["portogallo-croazia", 1, 1],
    ["svizzera-algeria", 1, 2],
    ["australia-egitto", 0, 2],

    // 4 luglio
    ["argentina-capo-verde", 2, 1],
    ["colombia-ghana", 1, 1]
  ],


  Alessia: [
    // Prima giornata
    ["messico-sudafrica", 1, 3],
    ["corea-del-sud-cechia", 0, 0],
    ["canada-bosnia-ed-erzegovina", 0, 3],
    ["svizzera-qatar", 4, 5],
    ["stati-uniti-paraguay", 0, 2],
    ["brasile-marocco", 5, 3],
    ["haiti-scozia", 1, 1],
    ["australia-turchia", 1, 4],
    ["germania-curacao", 5, 2],
    ["paesi-bassi-giappone", 2, 0],
    ["costa-davorio-ecuador", 2, 4],
    ["svezia-tunisia", 3, 2],
    ["belgio-egitto", 3, 2],
    ["spagna-capo-verde", 5, 1],
    ["iran-nuova-zelanda", 3, 1],
    ["arabia-saudita-uruguay", 4, 1],
    ["francia-senegal", 5, 3],
    ["iraq-norvegia", 3, 0],
    ["argentina-algeria", 3, 1],
    ["austria-giordania", 1, 1],
    ["portogallo-congo", 4, 1],
    ["inghilterra-croazia", 5, 2],

    // 18 giugno
    ["repubblica-ceca-sudafrica", 1, 1],
    ["svizzera-bosnia-ed-erzegovina", 2, 0],
    ["canada-qatar", 1, 1],

    // 19 giugno
    ["messico-corea-del-sud", 1, 2],
    ["stati-uniti-australia", 1, 1],
    ["scozia-marocco", 1, 2],

    // 20 giugno
    ["brasile-haiti", 3, 0],
    ["turchia-paraguay", 2, 0],
    ["paesi-bassi-svezia", 2, 4],
    ["germania-costa-davorio", 4, 1],

    // 21 giugno
    ["ecuador-curacao", 0, 0],
    ["tunisia-giappone", 1, 2],
    ["spagna-arabia-saudita", 1, 0],
    ["belgio-iran", 1, 2],
    ["uruguay-capo-verde", 1, 0],

    // 22 giugno
    ["nuova-zelanda-egitto", 1, 1],
    ["argentina-austria", 3, 2],
    ["francia-iraq", 4, 1],

    // 23 giugno
    ["norvegia-senegal", 2, 1],
    ["giordania-algeria", 0, 0],
    ["portogallo-uzbekistan", 1, 0],
    ["inghilterra-ghana", 4, 1],

    // 24 giugno
    ["panama-croazia", 0, 0],
    ["colombia-rd-congo", 2, 1],
    ["svizzera-canada", 3, 1],
    ["bosnia-ed-erzegovina-qatar", 1, 1],
    ["marocco-haiti", 2, 0],
    ["scozia-brasile", 0, 3],

    // 25 giugno
    ["sudafrica-corea-del-sud", 1, 0],
    ["repubblica-ceca-messico", 1, 2],
    ["curacao-costa-davorio", 0, 0],
    ["ecuador-germania", 0, 2],

    // 26 giugno
    ["tunisia-paesi-bassi", 1, 2],
    ["giappone-svezia", 2, 3],
    ["turchia-stati-uniti", 1, 2],
    ["paraguay-australia", 1, 0],
    ["norvegia-francia", 0, 3],
    ["senegal-iraq", 1, 1],

    // 27 giugno
    ["capo-verde-arabia-saudita", 0, 0],
    ["uruguay-spagna", 0, 3],
    ["nuova-zelanda-belgio", 0, 0],
    ["egitto-iran", 2, 1],
    ["panama-inghilterra", 0, 4],
    ["croazia-ghana", 1, 1],

    // 28 giugno
    ["colombia-portogallo", 0, 1],
    ["rd-congo-uzbekistan", 0, 0],
    ["algeria-austria", 0, 1],
    ["giordania-argentina", 0, 2],

    // 29 giugno
    ["brasile-giappone", 3, 0],
    ["germania-paraguay", 3, 1],

    // 30 giugno
    ["paesi-bassi-marocco", 1, 2],
    ["costa-davorio-norvegia", 2, 1],
    ["francia-svezia", 3, 2],

    // 1 luglio
    ["messico-ecuador", 1, 0],
    ["inghilterra-rd-congo", 3, 1],
    ["belgio-senegal", 2, 1],

    // 2 luglio
    ["stati-uniti-bosnia-ed-erzegovina", 1, 2],
    ["spagna-austria", 3, 1],

    // 3 luglio
    ["portogallo-croazia", 3, 0],
    ["svizzera-algeria", 1, 0],
    ["australia-egitto", 2, 1],

    // 4 luglio
    ["argentina-capo-verde", 3, 0],
    ["colombia-ghana", 0, 1]
  ],



  Hiba: [
    // Prima giornata
    ["messico-sudafrica", 1, 4],
    ["corea-del-sud-cechia", 1, 1],
    ["canada-bosnia-ed-erzegovina", 2, 1],
    ["svizzera-qatar", 2, 3],
    ["stati-uniti-paraguay", 1, 3],
    ["brasile-marocco", 2, 3],
    ["haiti-scozia", 1, 0],
    ["australia-turchia", 1, 2],
    ["germania-curacao", 3, 1],
    ["paesi-bassi-giappone", 3, 1],
    ["costa-davorio-ecuador", 4, 2],
    ["svezia-tunisia", 1, 2],
    ["belgio-egitto", 1, 3],
    ["spagna-capo-verde", 5, 1],
    ["iran-nuova-zelanda", 0, 1],
    ["arabia-saudita-uruguay", 2, 1],
    ["francia-senegal", 4, 2],
    ["iraq-norvegia", 0, 1],
    ["argentina-algeria", 4, 2],
    ["austria-giordania", 2, 0],
    ["portogallo-congo", 3, 1],
    ["inghilterra-croazia", 4, 1],

    // 18 giugno
    ["repubblica-ceca-sudafrica", 1, 1],
    ["svizzera-bosnia-ed-erzegovina", 1, 0],
    ["canada-qatar", 0, 1],

    // 19 giugno
    ["messico-corea-del-sud", 3, 1],
    ["stati-uniti-australia", 2, 1],
    ["scozia-marocco", 1, 3],

    // 20 giugno
    ["brasile-haiti", 4, 0],
    ["turchia-paraguay", 1, 1],
    ["paesi-bassi-svezia", 1, 2],
    ["germania-costa-davorio", 3, 1],

    // 21 giugno
    ["ecuador-curacao", 1, 0],
    ["tunisia-giappone", 1, 2],
    ["spagna-arabia-saudita", 2, 1],
    ["belgio-iran", 1, 1],
    ["uruguay-capo-verde", 1, 2],

    // 22 giugno
    ["nuova-zelanda-egitto", 1, 2],
    ["argentina-austria", 3, 1],
    ["francia-iraq", 5, 1],

    // 23 giugno
    ["norvegia-senegal", 2, 3],
    ["giordania-algeria", 1, 2],
    ["portogallo-uzbekistan", 3, 0],
    ["inghilterra-ghana", 3, 1],

    // 24 giugno
    ["panama-croazia", 0, 1],
    ["colombia-rd-congo", 1, 2],
    ["svizzera-canada", 1, 2],
    ["bosnia-ed-erzegovina-qatar", 0, 2],
    ["marocco-haiti", 3, 0],
    ["scozia-brasile", 0, 2],

    // 25 giugno
    ["sudafrica-corea-del-sud", 2, 2],
    ["repubblica-ceca-messico", 1, 1],
    ["curacao-costa-davorio", 0, 3],
    ["ecuador-germania", 1, 4],

    // 26 giugno
    ["tunisia-paesi-bassi", 0, 3],
    ["giappone-svezia", 0, 1],
    ["turchia-stati-uniti", 1, 2],
    ["paraguay-australia", 0, 2],
    ["norvegia-francia", 2, 3],
    ["senegal-iraq", 3, 1],

    // 27 giugno
    ["capo-verde-arabia-saudita", 2, 1],
    ["uruguay-spagna", 0, 3],
    ["nuova-zelanda-belgio", 0, 1],
    ["egitto-iran", 2, 0],
    ["panama-inghilterra", 0, 2],
    ["croazia-ghana", 1, 1],

    // 28 giugno
    ["colombia-portogallo", 0, 1],
    ["rd-congo-uzbekistan", 2, 0],
    ["algeria-austria", 1, 1],
    ["giordania-argentina", 0, 5],

    // 29 giugno
    ["brasile-giappone", 2, 1],
    ["germania-paraguay", 1, 0],

    // 30 giugno
    ["paesi-bassi-marocco", 2, 3],
    ["costa-davorio-norvegia", 2, 2],
    ["francia-svezia", 3, 1],

    // 1 luglio
    ["messico-ecuador", 1, 1],
    ["inghilterra-rd-congo", 2, 1],
    ["belgio-senegal", 1, 2],

    // 2 luglio
    ["stati-uniti-bosnia-ed-erzegovina", 3, 1],
    ["spagna-austria", 2, 0],

    // 3 luglio
    ["portogallo-croazia", 3, 0],
    ["svizzera-algeria", 1, 1],
    ["australia-egitto", 1, 2],

    // 4 luglio
    ["argentina-capo-verde", 4, 2],
    ["colombia-ghana", 1, 2]
  ]
};



const predictions = Object.entries(predictionData).flatMap(
  ([player, playerPredictions]) =>
    playerPredictions.map(
      ([matchId, predHomeScore, predAwayScore]) => ({
        player,
        matchId,
        predHomeScore,
        predAwayScore
      })
    )
);
// Netlify Function for questions API - Mixed order version
exports.handler = async (event, context) => {
  const questions = [
    // Začínáme ekonomikou
    {id: 1, text: "Daně by měly být co nejnižší", dimension: "EKO", polarity: -1},
    
    // Pak sociální téma
    {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 23, text: "Česko by mělo přijmout euro", dimension: "SUV", polarity: 1},
    
    // Zpět k ekonomice
    {id: 2, text: "Stát by měl podporovat domácí firmy", dimension: "EKO", polarity: -1},
    
    // Sociální
    {id: 14, text: "Společnost funguje nejlépe s tradičním rodinným modelem", dimension: "SOC", polarity: -1},
    
    // Suverenita
    {id: 29, text: "NATO je zárukou naší bezpečnosti", dimension: "SUV", polarity: 1},
    
    // Ekonomika
    {id: 10, text: "Zdravotnictví by mělo zůstat primárně veřejné", dimension: "EKO", polarity: -1},
    
    // Sociální
    {id: 13, text: "Dospělí by měli mít právo rozhodovat o užívání konopí", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 25, text: "Státy by si měly zachovat kontrolu nad klíčovými rozhodnutími", dimension: "SUV", polarity: -1},
    
    // Ekonomika
    {id: 3, text: "Soukromé firmy jsou efektivnější než státní podniky", dimension: "EKO", polarity: 1},
    
    // Sociální
    {id: 20, text: "Náboženství a politika by měly zůstat oddělené", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 24, text: "EU Green Deal je správná cesta", dimension: "SUV", polarity: 1},
    
    // Ekonomika
    {id: 4, text: "Minimální mzda je prospěšná pro zaměstnance", dimension: "EKO", polarity: -1},
    
    // Sociální
    {id: 15, text: "Ženy by měly mít právo rozhodovat o svém těle", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 30, text: "Sankce proti Rusku poškozují hlavně nás", dimension: "SUV", polarity: -1},
    
    // Ekonomika
    {id: 5, text: "Všichni by měli platit stejné procento daní", dimension: "EKO", polarity: 1},
    
    // Sociální
    {id: 16, text: "Multikulturalismus obohacuje společnost", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 26, text: "EU migrační pakt je pro Česko přijatelný", dimension: "SUV", polarity: 1},
    
    // Ekonomika
    {id: 6, text: "Sociální podpora vytváří závislost", dimension: "EKO", polarity: -1},
    
    // Sociální
    {id: 17, text: "Národní identita je důležitější než evropská", dimension: "SOC", polarity: -1},
    
    // Suverenita
    {id: 33, text: "Podpora Ukrajiny by měla pokračovat", dimension: "SUV", polarity: 1},
    
    // Ekonomika
    {id: 9, text: "Státní důchody jsou udržitelný systém", dimension: "EKO", polarity: -1},
    
    // Sociální
    {id: 19, text: "Nové pojetí pohlaví narušuje osvědčené společenské normy", dimension: "SOC", polarity: -1},
    
    // Suverenita
    {id: 27, text: "Vystoupení z EU by bylo pro Česko přínosné", dimension: "SUV", polarity: -1},
    
    // Ekonomika
    {id: 7, text: "Zrušení superhrubé mzdy bylo správné", dimension: "EKO", polarity: 1},
    
    // Sociální
    {id: 18, text: "Registrované partnerství by mělo být nahrazeno manželstvím pro všechny", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 31, text: "Spojené státy evropské jsou správný cíl integrace", dimension: "SUV", polarity: 1},
    
    // Ekonomika
    {id: 8, text: "Podpora podnikání je důležitější než sociální výdaje", dimension: "EKO", polarity: 1},
    
    // Sociální
    {id: 21, text: "Integrace menšin závisí především na jejich vlastním úsilí", dimension: "SOC", polarity: -1},
    
    // Suverenita
    {id: 28, text: "Uprchlické kvóty jsou solidární řešení", dimension: "SUV", polarity: 1},
    
    // Ekonomika
    {id: 11, text: "Ekonomika funguje nejlépe s minimálními zásahy státu", dimension: "EKO", polarity: 1},
    
    // Sociální
    {id: 22, text: "Sexuální výchova by měla být povinná na školách", dimension: "SOC", polarity: 1},
    
    // Suverenita
    {id: 32, text: "Visegrádská skupina je důležitější než EU", dimension: "SUV", polarity: -1}
  ];
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(questions)
  };
};
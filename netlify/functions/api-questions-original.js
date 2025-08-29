// Netlify Function for questions API
exports.handler = async (event, context) => {
  const questions = [
    // Economic dimension (EKO) - 11 questions
    {id: 1, text: "Výše daní by měla odpovídat rozsahu státních služeb", dimension: "EKO", polarity: 1},
    {id: 2, text: "Domácí firmy potřebují státní podporu pro konkurenceschopnost", dimension: "EKO", polarity: -1},
    {id: 3, text: "Soukromé firmy jsou efektivnější než státní podniky", dimension: "EKO", polarity: 1},
    {id: 4, text: "Minimální mzda by měla zaručit důstojný život", dimension: "EKO", polarity: -1},
    {id: 5, text: "Všichni by měli platit stejné procento daní", dimension: "EKO", polarity: 1},
    {id: 6, text: "Sociální dávky jsou často zneužívány", dimension: "EKO", polarity: 1},
    {id: 7, text: "Zrušení superhrubé mzdy bylo správné", dimension: "EKO", polarity: 1},
    {id: 8, text: "Podpora podnikání je důležitější než sociální výdaje", dimension: "EKO", polarity: 1},
    {id: 9, text: "Důchodový věk by neměl dále růst", dimension: "EKO", polarity: -1},
    {id: 10, text: "Zdravotnictví by mělo zůstat primárně veřejné", dimension: "EKO", polarity: -1},
    {id: 11, text: "Ekonomika funguje nejlépe s minimálními zásahy státu", dimension: "EKO", polarity: 1},
    
    // Social dimension (SOC) - 11 questions  
    {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", dimension: "SOC", polarity: 1},
    {id: 13, text: "Dospělí by měli mít právo rozhodovat o užívání konopí", dimension: "SOC", polarity: 1},
    {id: 14, text: "Společnost funguje nejlépe s tradičním rodinným modelem", dimension: "SOC", polarity: -1},
    {id: 15, text: "Ženy by měly mít právo rozhodovat o svém těle", dimension: "SOC", polarity: 1},
    {id: 16, text: "Multikulturalismus obohacuje společnost", dimension: "SOC", polarity: 1},
    {id: 17, text: "Národní identita je důležitější než evropská", dimension: "SOC", polarity: -1},
    {id: 18, text: "Registrované partnerství by mělo být nahrazeno manželstvím pro všechny", dimension: "SOC", polarity: 1},
    {id: 19, text: "Nové pojetí pohlaví narušuje osvědčené společenské normy", dimension: "SOC", polarity: -1},
    {id: 20, text: "Náboženství a politika by měly zůstat oddělené", dimension: "SOC", polarity: 1},
    {id: 21, text: "Integrace menšin závisí především na jejich vlastním úsilí", dimension: "SOC", polarity: -1},
    {id: 22, text: "Sexuální výchova by měla být povinná na školách", dimension: "SOC", polarity: 1},
    
    // Sovereignty dimension (SUV) - 11 questions
    {id: 23, text: "Česko by mělo přijmout euro", dimension: "SUV", polarity: 1},
    {id: 24, text: "EU Green Deal je správná cesta", dimension: "SUV", polarity: 1},
    {id: 25, text: "Státy by si měly zachovat kontrolu nad klíčovými rozhodnutími", dimension: "SUV", polarity: -1},
    {id: 26, text: "EU migrační pakt je pro Česko přijatelný", dimension: "SUV", polarity: 1},
    {id: 27, text: "Vystoupení z EU by bylo pro Česko přínosné", dimension: "SUV", polarity: -1},
    {id: 28, text: "Uprchlické kvóty jsou solidární řešení", dimension: "SUV", polarity: 1},
    {id: 29, text: "NATO je zárukou naší bezpečnosti", dimension: "SUV", polarity: 1},
    {id: 30, text: "Sankce proti Rusku poškozují hlavně nás", dimension: "SUV", polarity: -1},
    {id: 31, text: "Spojené státy evropské jsou správný cíl integrace", dimension: "SUV", polarity: 1},
    {id: 32, text: "Visegrádská skupina je důležitější než EU", dimension: "SUV", polarity: -1},
    {id: 33, text: "Podpora Ukrajiny by měla pokračovat", dimension: "SUV", polarity: 1}
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
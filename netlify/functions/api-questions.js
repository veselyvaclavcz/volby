// Netlify Function for questions API
exports.handler = async (event, context) => {
  const questions = [
    // Economic dimension (EKO) - 11 questions
    {id: 1, text: "Daně by měly být co nejnižší", dimension: "EKO", polarity: 1},
    {id: 2, text: "Stát by měl aktivně podporovat domácí firmy", dimension: "EKO", polarity: -1},
    {id: 3, text: "Privatizace státních podniků prospívá ekonomice", dimension: "EKO", polarity: 1},
    {id: 4, text: "Minimální mzda by měla výrazně růst", dimension: "EKO", polarity: -1},
    {id: 5, text: "Plochá daň je lepší než progresivní", dimension: "EKO", polarity: 1},
    {id: 6, text: "Sociální dávky jsou často zneužívány", dimension: "EKO", polarity: 1},
    {id: 7, text: "Zrušení superhrubé mzdy bylo správné", dimension: "EKO", polarity: 1},
    {id: 8, text: "Podpora podnikání je důležitější než sociální výdaje", dimension: "EKO", polarity: 1},
    {id: 9, text: "Důchodový věk by neměl dále růst", dimension: "EKO", polarity: -1},
    {id: 10, text: "Zdravotnictví by mělo zůstat primárně veřejné", dimension: "EKO", polarity: -1},
    {id: 11, text: "Trh si vše vyřeší lépe než státní regulace", dimension: "EKO", polarity: 1},
    
    // Social dimension (SOC) - 11 questions  
    {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", dimension: "SOC", polarity: 1},
    {id: 13, text: "Cannabis by měl být legalizován pro rekreační užívání", dimension: "SOC", polarity: 1},
    {id: 14, text: "Tradiční rodina je základem společnosti", dimension: "SOC", polarity: -1},
    {id: 15, text: "Právo na potrat by mělo zůstat liberální", dimension: "SOC", polarity: 1},
    {id: 16, text: "Multikulturalismus obohacuje společnost", dimension: "SOC", polarity: 1},
    {id: 17, text: "Národní identita je důležitější než evropská", dimension: "SOC", polarity: -1},
    {id: 18, text: "Registrované partnerství by mělo být nahrazeno manželstvím pro všechny", dimension: "SOC", polarity: 1},
    {id: 19, text: "Gender ideologie ohrožuje tradiční hodnoty", dimension: "SOC", polarity: -1},
    {id: 20, text: "Církve by neměly mít vliv na politiku", dimension: "SOC", polarity: 1},
    {id: 21, text: "Romská integrace selhává kvůli jejich neochotě", dimension: "SOC", polarity: -1},
    {id: 22, text: "Sexuální výchova by měla být povinná na školách", dimension: "SOC", polarity: 1},
    
    // Sovereignty dimension (SUV) - 11 questions
    {id: 23, text: "Česko by mělo přijmout euro", dimension: "SUV", polarity: 1},
    {id: 24, text: "EU Green Deal je správná cesta", dimension: "SUV", polarity: 1},
    {id: 25, text: "Národní suverenita je důležitější než evropská integrace", dimension: "SUV", polarity: -1},
    {id: 26, text: "EU migrační pakt je pro Česko přijatelný", dimension: "SUV", polarity: 1},
    {id: 27, text: "Měli bychom vystoupit z EU (Czexit)", dimension: "SUV", polarity: -1},
    {id: 28, text: "Uprchlické kvóty jsou solidární řešení", dimension: "SUV", polarity: 1},
    {id: 29, text: "NATO je zárukou naší bezpečnosti", dimension: "SUV", polarity: 1},
    {id: 30, text: "Sankce proti Rusku poškozují hlavně nás", dimension: "SUV", polarity: -1},
    {id: 31, text: "Evropská federace by byla prospěšná", dimension: "SUV", polarity: 1},
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
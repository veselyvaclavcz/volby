// Test script to verify all party answers make sense

const questions = [
    {id: 1, text: "Daně by měly být co nejnižší", dimension: "EKO", polarity: 1},
    {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", dimension: "SOC", polarity: 1},
    {id: 23, text: "Česko by mělo přijmout euro", dimension: "SUV", polarity: 1},
    {id: 2, text: "Stát by měl podporovat domácí firmy", dimension: "EKO", polarity: -1},
    {id: 14, text: "Společnost funguje nejlépe s tradičním rodinným modelem", dimension: "SOC", polarity: -1},
    {id: 29, text: "NATO je zárukou naší bezpečnosti", dimension: "SUV", polarity: 1},
    {id: 10, text: "Zdravotnictví by mělo zůstat primárně veřejné", dimension: "EKO", polarity: -1},
    {id: 13, text: "Dospělí by měli mít právo rozhodovat o užívání konopí", dimension: "SOC", polarity: 1},
    {id: 25, text: "Státy by si měly zachovat kontrolu nad klíčovými rozhodnutími", dimension: "SUV", polarity: -1},
    {id: 3, text: "Soukromé firmy jsou efektivnější než státní podniky", dimension: "EKO", polarity: 1},
    {id: 20, text: "Náboženství a politika by měly zůstat oddělené", dimension: "SOC", polarity: 1},
    {id: 24, text: "EU Green Deal je správná cesta", dimension: "SUV", polarity: 1},
    {id: 4, text: "Minimální mzda je prospěšná pro zaměstnance", dimension: "EKO", polarity: -1},
    {id: 15, text: "Ženy by měly mít právo rozhodovat o svém těle", dimension: "SOC", polarity: 1},
    {id: 30, text: "Sankce proti Rusku poškozují hlavně nás", dimension: "SUV", polarity: -1},
    {id: 5, text: "Všichni by měli platit stejné procento daní", dimension: "EKO", polarity: 1},
    {id: 16, text: "Multikulturalismus obohacuje společnost", dimension: "SOC", polarity: 1},
    {id: 26, text: "EU migrační pakt je pro Česko přijatelný", dimension: "SUV", polarity: 1},
    {id: 6, text: "Sociální podpora vytváří závislost", dimension: "EKO", polarity: 1},
    {id: 17, text: "Národní identita je důležitější než evropská", dimension: "SOC", polarity: -1},
    {id: 33, text: "Podpora Ukrajiny by měla pokračovat", dimension: "SUV", polarity: 1},
    {id: 9, text: "Státní důchody jsou udržitelný systém", dimension: "EKO", polarity: -1},
    {id: 19, text: "Nové pojetí pohlaví narušuje osvědčené společenské normy", dimension: "SOC", polarity: -1},
    {id: 27, text: "Vystoupení z EU by bylo pro Česko přínosné", dimension: "SUV", polarity: -1},
    {id: 7, text: "Zrušení superhrubé mzdy bylo správné", dimension: "EKO", polarity: 1},
    {id: 18, text: "Registrované partnerství by mělo být nahrazeno manželstvím pro všechny", dimension: "SOC", polarity: 1},
    {id: 31, text: "Spojené státy evropské jsou správný cíl integrace", dimension: "SUV", polarity: 1},
    {id: 8, text: "Podpora podnikání je důležitější než sociální výdaje", dimension: "EKO", polarity: 1},
    {id: 21, text: "Integrace menšin závisí především na jejich vlastním úsilí", dimension: "SOC", polarity: -1},
    {id: 28, text: "Uprchlické kvóty jsou solidární řešení", dimension: "SUV", polarity: 1},
    {id: 11, text: "Ekonomika funguje nejlépe s minimálními zásahy státu", dimension: "EKO", polarity: 1},
    {id: 22, text: "Sexuální výchova by měla být povinná na školách", dimension: "SOC", polarity: 1},
    {id: 32, text: "Visegrádská skupina je důležitější než EU", dimension: "SUV", polarity: -1}
];

const parties = [
    {code: "ANO", name: "ANO", compass_position: {EKO: -0.36, SOC: 0.23, SUV: -0.41}},
    {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.64, SOC: -0.05, SUV: 0.64}},
    {code: "SPD", name: "SPD", compass_position: {EKO: -0.41, SOC: 0.86, SUV: -0.82}},
    {code: "PIRATI", name: "Piráti", compass_position: {EKO: -0.32, SOC: -0.95, SUV: 0.68}},
    {code: "STAN", name: "STAN", compass_position: {EKO: 0.14, SOC: -0.18, SUV: 0.73}},
    {code: "KSČM", name: "KSČM", compass_position: {EKO: -0.95, SOC: 0.23, SUV: -0.73}},
    {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.77, SOC: 0.82, SUV: -0.68}},
    {code: "PRISAHA", name: "Přísaha", compass_position: {EKO: 0.23, SOC: 0.27, SUV: 0.09}},
    {code: "SOCDEM", name: "SOCDEM", compass_position: {EKO: -0.68, SOC: -0.55, SUV: 0.36}},
    {code: "ZELENI", name: "Zelení", compass_position: {EKO: -0.50, SOC: -1.00, SUV: 1.00}},
    {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.95, SOC: -0.45, SUV: -0.77}},
    {code: "MOTORISTE", name: "Motoristé", compass_position: {EKO: 0.55, SOC: 0.32, SUV: -0.50}},
    {code: "PRO", name: "PRO", compass_position: {EKO: 0.32, SOC: 0.41, SUV: -0.64}},
    {code: "REPUBLIKA", name: "REPUBLIKA", compass_position: {EKO: 0.27, SOC: 0.82, SUV: -0.68}},
    {code: "STACILO", name: "Stačilo!", compass_position: {EKO: -0.95, SOC: -0.45, SUV: -0.41}},
    {code: "VYZVA2025", name: "Výzva2025", compass_position: {EKO: 0.00, SOC: 0.14, SUV: 0.14}},
    {code: "KRUH", name: "KRUH", compass_position: {EKO: 0.00, SOC: -0.45, SUV: -0.18}},
    {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.59}},
    {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.32, SOC: -0.50, SUV: -0.64}},
    {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.55, SOC: 0.36, SUV: 0.23}},
    {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -1.00, SOC: -0.91, SUV: 0.09}},
    {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.27, SOC: 0.86, SUV: -0.77}},
    {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.00, SOC: 0.00, SUV: 0.00}},
    {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.18, SOC: 0.23, SUV: 0.09}},
    {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.27, SOC: 0.59, SUV: -0.73}},
    {code: "VOLT", name: "Volt", compass_position: {EKO: -0.05, SOC: -0.86, SUV: 1.00}}
];

function estimatePartyAnswer(party, question) {
    const position = party.compass_position[question.dimension];
    const adjustedPosition = position * question.polarity;
    const answer = 3 - (adjustedPosition * 2);
    return Math.round(answer * 10) / 10;
}

function answerToText(answer) {
    if (answer < 1.5) return "Rozhodně souhlasí";
    if (answer < 2.5) return "Souhlasí";
    if (answer < 3.5) return "Neutrální";
    if (answer < 4.5) return "Nesouhlasí";
    return "Rozhodně nesouhlasí";
}

// Test specific problematic cases
console.log("=== KONTROLA KLÍČOVÝCH OTÁZEK ===\n");

// Test otázka 1 - Daně
const q1 = questions.find(q => q.id === 1);
console.log(`Otázka 1: "${q1.text}"`);
console.log("SPOLU:", answerToText(estimatePartyAnswer(parties.find(p => p.code === "SPOLU"), q1)), "- OK? (pravice pro nízké daně)");
console.log("ANO:", answerToText(estimatePartyAnswer(parties.find(p => p.code === "ANO"), q1)), "- OK? (populisté pro vyšší výdaje)");
console.log("Svobodní:", answerToText(estimatePartyAnswer(parties.find(p => p.code === "SVOBODNI"), q1)), "- OK? (libertariáni)");
console.log("KSČM:", answerToText(estimatePartyAnswer(parties.find(p => p.code === "KSČM"), q1)), "- OK? (komunisté)");

console.log("\n=== KONTROLA VŠECH STRAN NA UPRAVENÝCH OTÁZKÁCH ===\n");

// Test all modified questions
const modifiedQuestions = [1, 2, 4, 6, 9];
modifiedQuestions.forEach(qId => {
    const q = questions.find(q => q.id === qId);
    console.log(`\nOtázka ${qId}: "${q.text}"`);
    
    parties.forEach(party => {
        const answer = estimatePartyAnswer(party, q);
        const text = answerToText(answer);
        console.log(`${party.name}: ${text} (${answer.toFixed(1)})`);
    });
});

console.log("\n=== KONTROLA EXTREMNÍCH STRAN ===\n");

// Check extreme parties on key questions
const extremeParties = ["SVOBODNI", "VOLUNTIA", "KSČM", "LEVY_BLOK"];
const keyQuestions = [1, 2, 4, 6, 9, 10, 23, 29];

extremeParties.forEach(partyCode => {
    const party = parties.find(p => p.code === partyCode);
    console.log(`\n${party.name}:`);
    keyQuestions.forEach(qId => {
        const q = questions.find(q => q.id === qId);
        const answer = estimatePartyAnswer(party, q);
        console.log(`  ${qId}. "${q.text}" → ${answerToText(answer)}`);
    });
});
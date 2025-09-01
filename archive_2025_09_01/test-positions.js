// Testovací pozice pro ověření správného umístění v kvadrantech

// 1. LIBERTARIÁN
// Očekávání: volný trh + minimální stát + liberální společnost
const libertarian = {
    name: "Test: Libertarián",
    economy: -1.5,      // Volný trh (levá strana)
    state: -1.5,        // Minimální stát (nahoře)
    society: -1.0,      // Liberální (nahoře v 3. grafu)
    sovereignty: 0.0    // Neutrální
};
console.log("🔥 Libertarián:", libertarian);
console.log("Očekávaná pozice:");
console.log("- Graf 1 (Eko×Stát): Levý horní roh");
console.log("- Graf 2 (Společnost×Suverenita): Levý střed");
console.log("- Graf 3 (Eko×Společnost): Levý horní roh");
console.log("- Graf 4 (Stát×Suverenita): Levý střed");

// 2. NÁRODNÍ KONZERVATIVEC (typ SPD)
const nationalConservative = {
    name: "Test: Národní konzervativec",
    economy: 0.6,       // Mírně státní kontrola (pravá strana)
    state: 1.1,         // Silný stát (dole)
    society: 1.2,       // Konzervativní (dole v 3. grafu)
    sovereignty: 2.0    // Národní (dole v 2. a 4. grafu)
};
console.log("\n🇨🇿 Národní konzervativec:", nationalConservative);
console.log("Očekávaná pozice:");
console.log("- Graf 1 (Eko×Stát): Pravý dolní kvadrant");
console.log("- Graf 2 (Společnost×Suverenita): Pravý dolní roh");
console.log("- Graf 3 (Eko×Společnost): Pravý dolní kvadrant");
console.log("- Graf 4 (Stát×Suverenita): Pravý dolní kvadrant");

// 3. LEVICOVÝ CENTRISTA
const leftCentrist = {
    name: "Test: Levicový centrista",
    economy: 0.8,       // Sociální tržní ekonomika (pravá strana)
    state: 0.5,         // Aktivní stát (mírně dole)
    society: -0.2,      // Mírně liberální (mírně nahoře)
    sovereignty: -0.5   // Pro-EU/globální (mírně nahoře)
};
console.log("\n⚖️ Levicový centrista:", leftCentrist);
console.log("Očekávaná pozice:");
console.log("- Graf 1 (Eko×Stát): Pravý střed (mírně dole)");
console.log("- Graf 2 (Společnost×Suverenita): Levý horní kvadrant");
console.log("- Graf 3 (Eko×Společnost): Pravá horní část");
console.log("- Graf 4 (Stát×Suverenita): Střed-pravý horní");

// 4. LEVICOVÝ ANARCHISTA
const leftAnarchist = {
    name: "Test: Levicový anarchista",
    economy: 1.5,       // Antikapitalismus (pravá strana)
    state: -1.8,        // Bez státu (nahoře)
    society: -1.5,      // Radikálně liberální (nahoře)
    sovereignty: -1.0   // Internacionální/globální (nahoře)
};
console.log("\nⒶ Levicový anarchista:", leftAnarchist);
console.log("Očekávaná pozice:");
console.log("- Graf 1 (Eko×Stát): Pravý horní roh");
console.log("- Graf 2 (Společnost×Suverenita): Levý horní roh");
console.log("- Graf 3 (Eko×Společnost): Pravý horní roh");
console.log("- Graf 4 (Stát×Suverenita): Levý horní kvadrant");

// Funkce pro testování v konzoli
function testPosition(position) {
    // Simulace user_compass objektu
    const testData = {
        user_compass: position,
        svobodometr: 50, // dummy hodnota
        dimensions: {
            economy: position.economy,
            state: position.state,
            society: position.society,
            sovereignty: position.sovereignty
        }
    };
    
    // Zavolat renderCompass funkce pro každý graf
    console.log(`\nTestuji pozici: ${position.name}`);
    console.log("Pozice:", position);
    
    // Uložit do localStorage pro zobrazení
    localStorage.setItem('testUserPosition', JSON.stringify(testData));
    
    // Refresh kompasů
    if (typeof renderAllCompasses === 'function') {
        renderAllCompasses();
    }
    
    return testData;
}

// Instrukce pro použití v konzoli:
console.log("\n📍 JAK TESTOVAT:");
console.log("1. Otevři konzoli na localhost:8888");
console.log("2. Zkopíruj tento soubor do konzole");
console.log("3. Zavolej: testPosition(libertarian)");
console.log("4. Nebo: testPosition(nationalConservative)");
console.log("5. Nebo: testPosition(leftCentrist)");
console.log("6. Nebo: testPosition(leftAnarchist)");
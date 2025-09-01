# Kontext projektu Politický kompas 2025

## Poslední stav (1.9.2025)

### Co bylo vyřešeno
1. **Opraveny Netlify Functions** - Chyba 500 při volání API
   - Změněno z `fs.readFileSync()` na `require()` pro načítání JSON dat
   - Funkce teď správně načítají data z embedded JSON souborů

2. **Odstraněny debug logy** - Vyčištěno přes 40 console.log výpisů
   - Při mazání vznikly syntaktické chyby (neúplné fragmenty kódu)
   - Všechny syntaktické chyby opraveny

3. **Kompas vizualizace**
   - Přidána robustnější inicializace s retry logikou
   - Kontrola existence elementů před vykreslením
   - Funkční lokálně, na produkci závisí na API

### Struktura projektu
```
/
├── index.html                    # Hlavní HTML soubor
├── static/
│   ├── css/style-ankap.css      # Styly aplikace
│   └── js/app-ankap.js          # Hlavní JavaScript aplikace
├── netlify/
│   └── functions/                # Serverless funkce
│       ├── api-calculate.js     # Výpočet shody
│       ├── api-parties.js       # Data stran
│       ├── api-questions.js     # Otázky testu
│       ├── api-party-answers.js # Odpovědi stran
│       └── data/                # JSON data
│           ├── parties-unified.json
│           ├── questions-28.json
│           └── ...
├── party-answers-raw.json       # Surová data odpovědí stran
└── README.md                     # Dokumentace
```

### Hlavní funkcionality
1. **28 otázek** ve 4 dimenzích (EKO, STA, SOC, SUV)
2. **37 politických stran** s jejich pozicemi
3. **4D politický kompas** - dvě vizualizace:
   - Společnost × Ekonomika
   - Role státu × Suverenita
4. **Svobodometr** - měření preference svobody (0-100%)
5. **Detailní shoda** - zobrazení shody na jednotlivých otázkách

### Technické detaily

#### Výpočet pozice
- Škála odpovědí: 1-5 (1=max svoboda, 5=max stát)
- Polarita otázek: EKO, STA, SOC jsou invertované, SUV ne
- Rozsah pozice: -1 (libertariánský) až +1 (autoritářský)
- Svobodometr: průměr 4 dimenzí převedený na 0-100%

#### API endpointy (Netlify Functions)
- `/.netlify/functions/api-questions` - vrací 28 otázek
- `/.netlify/functions/api-parties` - vrací data stran
- `/.netlify/functions/api-calculate` - počítá shodu
- `/.netlify/functions/api-party-answers` - odpovědi stran

### Známé problémy (vyřešené)
- ✅ Netlify Functions vracely 500 - opraveno použitím require()
- ✅ Syntaktické chyby po odstranění logů - všechny opraveny
- ✅ Kompas se nezobrazoval - přidána retry logika

### Deployment
- GitHub: https://github.com/veselyvaclavcz/volby
- Produkce: https://volby.kdobystavelsilnice.cz/
- Automatický deploy přes Netlify při push do main

### Poslední commity
- `5a28635` Fix final syntax error - remove last console.log fragment
- `cf395a6` Fix another syntax error - remove incomplete console.log fragment
- `f20b787` Fix syntax error - remove incomplete code fragment
- `a3e1f85` Fix Netlify Functions - use require() instead of fs.readFileSync

### Kontakt
Projekt vytvořen pro podcast "A kdo by stavěl silnice?"
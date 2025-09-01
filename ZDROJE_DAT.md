# Zdroje dat pro politický kompas

## HLAVNÍ ZDROJ PRAVDY

### `party-positions-unified-2025.md`
- **Co obsahuje:** Autoritativní zdroj všech dat
- **37 politických stran** (26 oficiálních + 11 z koalic)
- **28 otázek** s odpověďmi každé strany (škála 1-5)
- **Metadata stran:** popis, web, zdroj informací

## GENEROVANÉ SOUBORY

### `netlify/functions/data/parties-unified.json`
- **Generuje:** `create_unified_party_data.py`
- **Ze zdroje:** `party-positions-unified-2025.md`
- **Obsahuje:** 
  - Pozice stran vypočítané z odpovědí
  - Rozdělení na mainParties a coalitionParties
  - Metadata stran

### `party-answers-raw.json`
- **Generuje:** `create_unified_party_data.py`
- **Obsahuje:** Surové odpovědi stran (1-5) pro referenci

## 28 OTÁZEK KOMPASU

### Ekonomika (EKO) - otázky 1-7
1. **Jak by měly fungovat daně z příjmu?**
   - 1 = Zrušit daně → 5 = Vysoké progresivní daně
2. **Jak má být organizováno zdravotnictví?**
   - 1 = Plně soukromé → 5 = Plně státní
3. **Jak má fungovat vzdělávání?**
   - 1 = Plně soukromé → 5 = Povinné státní
4. **Jak má být řešen důchodový systém?**
   - 1 = Každý sám → 5 = Plně státní
5. **Jak má stát přistupovat k soukromým firmám?**
   - 1 = Žádná regulace → 5 = Silná regulace
6. **Jak má být řešeno bydlení?**
   - 1 = Volný trh → 5 = Státní byty
7. **Kdo má stavět a spravovat silnice?**
   - 1 = Soukromé → 5 = Jen státní

### Stát (STA) - otázky 8-14
8. **Kdo má zajišťovat bezpečnost?**
   - 1 = Soukromé agentury → 5 = Státní monopol
9. **Jak má fungovat obrana státu?**
   - 1 = Dobrovolníci → 5 = Povinná služba
10. **Jak má být organizována spravedlnost?**
    - 1 = Soukromé arbitráže → 5 = Jen státní soudy
11. **Do jaké míry má stát zasahovat do ekonomiky?**
    - 1 = Vůbec → 5 = Centrální plánování
12. **Jak má být řešena chudoba?**
    - 1 = Charita → 5 = Státní redistribuce
13. **Jak má stát využívat technologie?**
    - 1 = Žádný dohled → 5 = Totální sledování
14. **Kdo má vlastnit půdu?**
    - 1 = Soukromá → 5 = Státní

### Společnost (SOC) - otázky 15-21
15. **Jak má být upraveno manželství?**
    - 1 = Svobodné svazky → 5 = Tradiční model
16. **Jak má být řešena otázka potratů?**
    - 1 = Volba ženy → 5 = Zákaz
17. **Jak má stát přistupovat k drogám?**
    - 1 = Legalizace → 5 = Zákaz
18. **Jak má být chráněna svoboda slova?**
    - 1 = Bez omezení → 5 = Cenzura
19. **Jak má být řešena migrace?**
    - 1 = Otevřené hranice → 5 = Zákaz
20. **Jak má stát přistupovat k náboženství?**
    - 1 = Oddělení → 5 = Státní náboženství
21. **Jak má stát podporovat kulturu?**
    - 1 = Bez dotací → 5 = Jen státní

### Suverenita (SUV) - otázky 22-28
22. **Jaký by měl být vztah k EU?**
    - 1 = Vystoupit → 5 = Federace
23. **Jaká měna by se měla používat?**
    - 1 = Národní → 5 = Euro/globální
24. **Jak řešit klimatické změny?**
    - 1 = Dobrovolně → 5 = Globální řízení
25. **Jak má fungovat obrana v mezinárodním kontextu?**
    - 1 = Bez aliancí → 5 = Globální armáda
26. **Jak má být řešena migrace v rámci EU?**
    - 1 = Národní kontrola → 5 = EU kvóty
27. **Jak má být organizován mezinárodní obchod?**
    - 1 = Národní → 5 = Globální správa
28. **Kde by se měla rozhodovat politika?**
    - 1 = Lokálně → 5 = Globálně

## WORKFLOW

1. **Strany odpovídají** na 28 otázek (škála 1-5)
2. **Odpovědi jsou zapsány** do `party-positions-unified-2025.md`
3. **Python skript** `create_unified_party_data.py`:
   - Parsuje MD soubor
   - Počítá pozice stran (převod 1-5 na -1 až +1)
   - Generuje `parties-unified.json`
4. **API endpointy** (`/api-parties`, `/api-calculate`) používají unified JSON
5. **Frontend** zobrazuje strany na dvou 2D kompasech

## DŮLEŽITÉ

- **NIKDY** neupravujte přímo JSON soubory
- **VŽDY** upravujte pouze `party-positions-unified-2025.md`
- Po úpravě MD souboru spusťte `python create_unified_party_data.py`
- Tím zajistíte konzistenci dat
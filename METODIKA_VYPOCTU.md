# Metodika výpočtu politického kompasu

## Dimenze kompasu

Politický kompas má 4 dimenze, každá v rozsahu -1 až +1:

### 1. EKO (Ekonomika)
- **-1** = Volný trh, minimální regulace, nízké daně
- **0** = Smíšená ekonomika
- **+1** = Plánovaná ekonomika, vysoké daně, státní podniky

### 2. STA (Stát)
- **-1** = Minimální stát, malá vláda
- **0** = Umírněný stát
- **+1** = Velký stát, silná vláda

### 3. SOC (Společnost)
- **-1** = Liberální, progresivní, individuální svobody
- **0** = Umírněný
- **+1** = Konzervativní, tradiční hodnoty

### 4. SUV (Suverenita)
- **-1** = Národní suverenita, proti EU, lokální rozhodování
- **0** = Neutrální
- **+1** = Globální/EU integrace, federalismus

## Výpočet z odpovědí

### Škála odpovědí
Každá otázka má škálu 1-5:
- **1** = Silný souhlas s první možností
- **3** = Neutrální/střed
- **5** = Silný souhlas s druhou možností

### Přiřazení otázek k dimenzím

#### EKO otázky (1-7): Ekonomika
1. **Daně**: 1=žádné daně → 5=vysoké daně
2. **Zdravotnictví**: 1=soukromé → 5=státní
3. **Vzdělávání**: 1=soukromé → 5=státní
4. **Důchody**: 1=soukromé → 5=státní
5. **Regulace**: 1=žádná → 5=silná
6. **Bydlení**: 1=volný trh → 5=státní
7. **Silnice**: 1=soukromé → 5=státní

#### STA otázky (8-14): Velikost státu
8. **Bezpečnost**: 1=soukromé → 5=státní monopol
9. **Obrana**: 1=dobrovolníci → 5=povinná služba
10. **Spravedlnost**: 1=arbitráže → 5=jen státní soudy
11. **Ekonomické zásahy**: 1=žádné → 5=centrální plánování
12. **Chudoba**: 1=charita → 5=státní redistribuce
13. **Technologie**: 1=žádný dohled → 5=totální sledování
14. **Půda**: 1=soukromá → 5=státní

#### SOC otázky (15-21): Společnost
15. **Manželství**: 1=svobodné svazky → 5=tradiční model
16. **Potraty**: 1=volba ženy → 5=zákaz
17. **Drogy**: 1=legální → 5=zákaz
18. **Svoboda slova**: 1=bez omezení → 5=cenzura
19. **Migrace**: 1=otevřené hranice → 5=zákaz
20. **Náboženství**: 1=žádná regulace → 5=státní náboženství
21. **Kultura**: 1=bez dotací → 5=jen státní

#### SUV otázky (22-28): Suverenita
22. **EU**: 1=vystoupit → 5=federace
23. **Měna**: 1=národní → 5=euro/globální
24. **Klima**: 1=dobrovolně → 5=globální řízení
25. **Obrana**: 1=bez aliancí → 5=globální armáda
26. **EU migrace**: 1=národní kontrola → 5=EU kvóty
27. **Obchod**: 1=národní → 5=globální správa
28. **Rozhodování**: 1=lokální → 5=globální

### Vzorec výpočtu

Pro každou otázku:
1. Převod odpovědi (1-5) na hodnotu (-2 až +2):
   - Odpověď 1 → -2
   - Odpověď 2 → -1
   - Odpověď 3 → 0
   - Odpověď 4 → +1
   - Odpověď 5 → +2

2. Pro všechny dimenze platí stejná logika:
   - **Nízké odpovědi (1,2)** = záporné hodnoty (libertariánské/liberální/národní)
   - **Vysoké odpovědi (4,5)** = kladné hodnoty (etatistické/konzervativní/globální)

3. Výpočet pozice v dimenzi:
   - Průměr všech otázek dané dimenze
   - Vydělení 2 pro převod na škálu -1 až +1

### Příklad výpočtu

**URZA (anarcho-kapitalismus)** - všechny odpovědi = 1:
- Každá otázka: 1 → -2
- EKO: průměr 7 otázek × (-2) = -14 / 7 = -2, pak / 2 = **-1.0**
- STA: průměr 7 otázek × (-2) = -14 / 7 = -2, pak / 2 = **-1.0**
- SOC: průměr 7 otázek × (-2) = -14 / 7 = -2, pak / 2 = **-1.0**
- SUV: průměr 7 otázek × (-2) = -14 / 7 = -2, pak / 2 = **-1.0**

**Středová strana** - všechny odpovědi = 3:
- Každá otázka: 3 → 0
- Všechny dimenze = **0.0**

## Implementace v kódu

```python
def calculate_positions(answers):
    # Převod odpovědi na hodnotu
    normalized = (answer_value - 3)  # 1→-2, 3→0, 5→+2
    
    # Průměr pro dimenzi
    dimension_avg = sum(values) / len(values)
    
    # Škálování na -1 až +1
    final_position = dimension_avg / 2
```

## Validace

Očekávané pozice klíčových stran:
- **Libertariáni** (URZA, Voluntia, Svobodní): záporné hodnoty v EKO, STA, SOC
- **Socialisté** (KSČM, Levice): kladné hodnoty v EKO a STA
- **Konzervativci** (SPD, Trikolora): kladné hodnoty v SOC
- **Nacionalisté**: záporné hodnoty v SUV
- **Federalisté** (Volt): kladné hodnoty v SUV
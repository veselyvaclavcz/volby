# Svobodometr - Přehled bodování otázek

## Jak funguje bodování:
- **Rozhodně souhlasím** = 1
- **Spíše souhlasím** = 2  
- **Neutrální** = 3
- **Spíše nesouhlasím** = 4
- **Rozhodně nesouhlasím** = 5

## PRO-SVOBODNÉ OTÁZKY (souhlas = +svoboda)
Při souhlasu přičítáme body ke svobodě: (3 - odpověď) × váha

| ID | Otázka | Souhlas (1) | Nesouhlas (5) |
|----|---------|-------------|---------------|
| 1 | Výše daní by měla odpovídat rozsahu státních služeb | +2 body | -2 body |
| 3 | Soukromé firmy jsou efektivnější než státní podniky | +2 body | -2 body |
| 5 | Všichni by měli platit stejné procento daní | +2 body | -2 body |
| 11 | Ekonomika funguje nejlépe s minimálními zásahy státu | +2 body | -2 body |
| 12 | Stejnopohlavní páry by měly mít právo na adopce | +2 body | -2 body |
| 13 | Dospělí by měli mít právo rozhodovat o užívání konopí | +2 body | -2 body |
| 15 | Ženy by měly mít právo rozhodovat o svém těle | +2 body | -2 body |
| 20 | Náboženství a politika by měly zůstat oddělené | +2 body | -2 body |
| 25 | Státy by si měly zachovat kontrolu nad klíčovými rozhodnutími | +2 body | -2 body |
| 27 | Česko by prospělo mimo struktury EU | +2 body | -2 body |
| 32 | Visegrádská skupina je důležitější než EU | +2 body | -2 body |

## PRO-STÁTNÍ OTÁZKY (souhlas = -svoboda)
Při souhlasu odečítáme body od svobody: (odpověď - 3) × váha

| ID | Otázka | Souhlas (1) | Nesouhlas (5) |
|----|---------|-------------|---------------|
| 2 | Domácí firmy potřebují státní podporu pro konkurenceschopnost | -2 body | +2 body |
| 4 | Minimální mzda by měla zaručit důstojný život | -2 body | +2 body |
| 9 | Důchodový věk by neměl dále růst | -2 body | +2 body |
| 10 | Zdravotnictví by mělo zůstat primárně veřejné | -2 body | +2 body |
| 14 | Společnost funguje nejlépe s tradičním rodinným modelem | -2 body | +2 body |
| 17 | Národní identita je důležitější než evropská | -2 body | +2 body |
| 19 | Nové pojetí pohlaví narušuje osvědčené společenské normy | -2 body | +2 body |
| 21 | Integrace menšin závisí především na jejich vlastním úsilí | -2 body | +2 body |
| 23 | Česko by mělo přijmout euro | -2 body | +2 body |
| 24 | EU Green Deal je správná cesta | -2 body | +2 body |
| 26 | EU migrační pakt je pro Česko přijatelný | -2 body | +2 body |
| 28 | Uprchlické kvóty jsou solidární řešení | -2 body | +2 body |
| 31 | Spojené státy evropské jsou správný cíl integrace | -2 body | +2 body |

## NEUTRÁLNÍ OTÁZKY (neovlivňují svobodometr)
Tyto otázky jsou používány pouze pro 3D kompas, ne pro svobodometr:

| ID | Otázka | Dimenze |
|----|---------|---------|
| 6 | Sociální dávky jsou často zneužívány | EKO |
| 7 | Zrušení superhrubé mzdy bylo správné | EKO |
| 8 | Podpora podnikání je důležitější než sociální výdaje | EKO |
| 16 | Multikulturalismus obohacuje společnost | SOC |
| 18 | Registrované partnerství by mělo být nahrazeno manželstvím pro všechny | SOC |
| 22 | Sexuální výchova by měla být povinná na školách | SOC |
| 29 | NATO je zárukou naší bezpečnosti | SUV |
| 30 | Sankce proti Rusku poškozují hlavně nás | SUV |
| 33 | Podpora Ukrajiny by měla pokračovat | SUV |

## Výpočet skóre:
1. Každá odpověď má váhu 1 (nebo 2 pokud je označena jako důležitá)
2. Pro-svobodné otázky: skóre += (3 - odpověď) × váha
3. Pro-státní otázky: skóre += (odpověď - 3) × váha
4. Finální normalizace: 50 + (skóre / (skutečná_celková_váha × 2)) × 50
   - skutečná_celková_váha = součet všech vah (respektuje "důležité" otázky)
   - Dělíme 2× protože maximum na otázku je ±2
5. Rozmezí: 0-100%, kde 50% = neutrální postoj

## Interpretace výsledků:
- **0-20%**: Silná preference státní kontroly
- **20-40%**: Mírná preference státní regulace
- **50%**: Neutrální postoj (NE průměrná svoboda!)
- **40-60%**: Vyvážený přístup s mírným sklonem
- **60-80%**: Mírná preference osobní svobody
- **80-100%**: Silná preference osobní svobody (libertariánský)

## Příklady extrémů:

### Maximum svobody (100%):
- Na všechny pro-svobodné otázky: "Rozhodně souhlasím"
- Na všechny pro-státní otázky: "Rozhodně nesouhlasím"

### Minimum svobody (0%):
- Na všechny pro-svobodné otázky: "Rozhodně nesouhlasím"
- Na všechny pro-státní otázky: "Rozhodně souhlasím"

### Neutrální pozice (50%):
- Na všechny otázky: "Neutrální"
- Nebo vyvážená kombinace pro a proti svobodě
# Metodika pro 4D kompas a Svobodometr

Tento dokument popisuje, jak vyhodnocovat odpovědi uživatelů i stran v
rámci volební kalkulačky, jak spočítat shodu a jak určit hodnotu tzv.
**Svobodometru**.

------------------------------------------------------------------------

## 1. 4D politický kompas

### Osy kompasu

1.  **Ekonomická osa (x)** -- míra svobody trhu vs. státní kontrola.\
    -- (--2) absolutní volný trh → (+2) centrálně plánovaná ekonomika.

2.  **Role státu (y)** -- rozsah pravomocí a zásahů státu do života
    lidí.\
    -- (--2) minimální stát → (+2) etatismus / policejní stát.

3.  **Společenská osa (z)** -- individuální svobody
    vs. kolektivní/tradiční normy.\
    -- (--2) maximální osobní autonomie → (+2) povinný kolektivismus /
    státní normy.

4.  **Suverenitní osa (w)** -- úroveň, na které se mají rozhodnutí
    dělat.\
    -- (--2) lokální/komunitní → (+2) globální (EU federace, OSN,
    světová vláda).

Každý uživatel i strana má tedy souřadnice:\
**(x, y, z, w) ∈ \[--2, +2\]\^4**.

------------------------------------------------------------------------

## 2. Výpočet pozice

### Uživatel

-   Každá otázka má 5 odpovědí mapovaných na --2 ... +2.\
-   Souřadnice osy = průměr odpovědí na otázky patřící k ose.

\$ score\_{axis} =
`\frac{\sum odpovědí}{\text{počet otázek na ose}}`{=tex} \$

### Strana

-   Programy stran jsou převedeny do odpovědí --2 ... +2.\
-   Stejným postupem jako u uživatele se spočítá průměr na každou osu.

------------------------------------------------------------------------

## 3. Výpočet shody se stranami

-   Uživatel = bod U = (x_u, y_u, z_u, w_u).\
-   Strana = bod S = (x_s, y_s, z_s, w_s).

**Euklidovská vzdálenost:**\
\$ d(U, S) =
`\sqrt{(x_u - x_s)^2 + (y_u - y_s)^2 + (z_u - z_s)^2 + (w_u - w_s)^2}`{=tex}
\$

**Normalizace do shody (%):**\
- Maximální vzdálenost je 8 (mezi body (--2,--2,--2,--2) a
(+2,+2,+2,+2)).\
- Shoda se spočítá jako:

\$ shoda(U,S) = `\left`{=tex}(1 -
`\frac{d(U,S)}{8}`{=tex}`\right`{=tex}) `\times 100`{=tex}% \$

### Váhy

-   Standardně mají všechny otázky stejnou váhu.\
-   Pokud uživatel označí otázku jako „důležitou", zvýší se její váha.\
-   Souřadnice osy se pak počítá jako vážený průměr.

\$ score\_{axis} =
`\frac{\sum (odpověď_i \times váha_i)}{\sum váha_i}`{=tex} \$

------------------------------------------------------------------------

## 4. Svobodometr

### Princip

Svobodometr má ukázat, do jaké míry odpovědi uživatele vedou ke zvýšení
nebo snížení osobní svobody.

### Postup

1.  Každá otázka je označena, zda se týká **zvýšení svobody**
    (liberální/anarchistický směr) nebo **omezení svobody**
    (etatistický/totalitní směr).\
    -- Odpovědi v rozsahu --2 ... +2 se tedy převádí na skóre
    „svobody".\
    -- --2 a --1 = ztráta svobody, 0 = neutrální, +1 a +2 = rozšíření
    svobody.

2.  Výpočet skóre:

    -   Každá odpověď → hodnota v intervalu --2 ... +2.\
    -   Sečtou se všechny odpovědi, případně váženě.

\$ svoboda = `\frac{\sum odpovědí}{\text{maximální možný součet}}`{=tex}
`\times 100`{=tex}% \$

3.  Normalizace:\
    -- Pokud by všechny odpovědi byly maximálně pro-svobodné (--2 nebo
    +2 podle směru otázky), dostane uživatel 100 %.\
    -- Pokud by všechny byly proti svobodě, dostane 0 %.\
    -- 50 % odpovídá neutrální pozici.

### Interpretace

-   **80--100 %** → velmi svobodomyslný postoj.\
-   **50--80 %** → smíšený, spíše svobodomyslný.\
-   **20--50 %** → smíšený, spíše etatistický.\
-   **0--20 %** → silně autoritářský/etatistický.

------------------------------------------------------------------------

## 5. Shrnutí metodiky

1.  **Kompas:** 4D prostor, každá osa od --2 do +2.\
2.  **Pozice:** průměrné (nebo vážené) odpovědi na otázky.\
3.  **Shoda:** vzdálenost mezi uživatelem a stranami → převedeno na %
    shody.\
4.  **Svobodometr:** ukazuje čistý trend odpovědí -- zda posouvají
    společnost k větší nebo menší osobní svobodě.

------------------------------------------------------------------------

Tento systém zajišťuje transparentní, reprodukovatelný a férový výpočet
výsledků volební kalkulačky.

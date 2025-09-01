#!/usr/bin/env python3
"""
Vytvoří jednotný JSON soubor se všemi stranami a jejich odpověďmi
z party-positions-unified-2025.md
"""

import re
import json

def parse_md_file(filepath):
    """Parse the MD file and extract party data."""
    parties = []
    current_party = None
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Find party header (## 1. Party Name)
        if line.startswith('## ') and '. ' in line:
            if current_party and 'answers' in current_party:
                parties.append(current_party)
            
            # Extract party number and name
            match = re.match(r'^## (\d+)\. (.+)$', line)
            if match:
                party_num = int(match.group(1))
                party_name = match.group(2).strip()
                current_party = {
                    'number': party_num,
                    'name': party_name,
                    'answers': {},
                    'description': None,
                    'web': None,
                    'source': None
                }
        
        # Parse party metadata
        elif current_party:
            if line.startswith('**Popis:**'):
                desc_text = line.replace('**Popis:**', '').strip()
                current_party['description'] = desc_text
            elif line.startswith('**Web:**'):
                web_text = line.replace('**Web:**', '').strip()
                current_party['web'] = web_text
            elif line.startswith('**Zdroj:**'):
                source_text = line.replace('**Zdroj:**', '').strip()
                current_party['source'] = source_text
            
            # Parse answers - look for pattern like "1. **Question:** answer"
            match = re.match(r'^(\d+)\.\s+\*\*[^:]+:\*\*\s*([\d.]+)', line)
            if match:
                q_num = int(match.group(1))
                answer = float(match.group(2))
                current_party['answers'][q_num] = answer
        
        i += 1
    
    # Add last party
    if current_party and 'answers' in current_party:
        parties.append(current_party)
    
    return parties

def calculate_positions(answers):
    """
    Calculate 4D positions from answers to 28 questions.
    Based on question dimensions and polarities.
    
    For each dimension:
    - EKO: -1 = free market, +1 = planned economy
    - STA: -1 = small state, +1 = big state
    - SOC: -1 = liberal, +1 = conservative
    - SUV: -1 = national, +1 = global/EU
    """
    # Question mappings (dimension, inverted)
    # inverted=True means answer 1 gives negative value (libertarian/liberal)
    question_config = {
        # EKO questions - answer 1 = free market (negative), 5 = planned (positive)
        1: ('EKO', True),   # Daně: 1=žádné daně (free) -> 5=vysoké daně (planned)
        2: ('EKO', True),   # Zdravotnictví: 1=soukromé -> 5=státní
        3: ('EKO', True),   # Vzdělávání: 1=soukromé -> 5=státní
        4: ('EKO', True),   # Důchody: 1=soukromé -> 5=státní
        5: ('EKO', True),   # Regulace: 1=žádná -> 5=silná
        6: ('EKO', True),   # Bydlení: 1=trh -> 5=státní
        7: ('EKO', True),   # Silnice: 1=soukromé -> 5=státní
        
        # STA questions - answer 1 = small state (negative), 5 = big state (positive)
        8: ('STA', True),   # Bezpečnost: 1=soukromé -> 5=státní monopol
        9: ('STA', True),   # Obrana: 1=dobrovolníci -> 5=povinná služba
        10: ('STA', True),  # Spravedlnost: 1=arbitráže -> 5=jen státní soudy
        11: ('STA', True),  # Ekonomické zásahy: 1=žádné -> 5=centrální plánování
        12: ('STA', True),  # Chudoba: 1=charita -> 5=státní redistribuce
        13: ('STA', True),  # Technologie: 1=žádný dohled -> 5=totální sledování
        14: ('STA', True),  # Půda: 1=soukromá -> 5=státní
        
        # SOC questions - answer 1 = liberal (negative), 5 = conservative (positive)
        15: ('SOC', True),  # Manželství: 1=svobodné svazky -> 5=tradiční model
        16: ('SOC', True),  # Potraty: 1=volba ženy -> 5=zákaz
        17: ('SOC', True),  # Drogy: 1=legální -> 5=zákaz
        18: ('SOC', True),  # Svoboda slova: 1=bez omezení -> 5=cenzura
        19: ('SOC', True),  # Migrace: 1=otevřené hranice -> 5=zákaz
        20: ('SOC', True),  # Náboženství: 1=žádná regulace -> 5=státní náboženství
        21: ('SOC', True),  # Kultura: 1=bez dotací -> 5=jen státní
        
        # SUV questions - answer 1 = national (negative), 5 = global (positive)
        22: ('SUV', True),  # EU: 1=vystoupit -> 5=federace
        23: ('SUV', True),  # Měna: 1=národní -> 5=euro/globální
        24: ('SUV', True),  # Klima: 1=dobrovolně -> 5=globální řízení
        25: ('SUV', True),  # Obrana: 1=bez aliancí -> 5=globální armáda
        26: ('SUV', True),  # EU migrace: 1=národní kontrola -> 5=EU kvóty
        27: ('SUV', True),  # Obchod: 1=národní -> 5=globální správa
        28: ('SUV', True),  # Rozhodování: 1=lokální -> 5=globální
    }
    
    dimensions = {'EKO': [], 'STA': [], 'SOC': [], 'SUV': []}
    
    for q_num, answer_value in answers.items():
        if q_num in question_config:
            dim, inverted = question_config[q_num]
            # Convert 1-5 scale to -2 to +2
            # answer_value 1 = -2, 3 = 0, 5 = +2
            if inverted:
                # For inverted questions: 1 -> -2, 5 -> +2
                normalized = (answer_value - 3)
            else:
                # For non-inverted questions: 1 -> +2, 5 -> -2
                normalized = (3 - answer_value)
            dimensions[dim].append(normalized)
    
    # Calculate average for each dimension
    result = {}
    for dim, values in dimensions.items():
        if values:
            # Average and scale to -1 to 1 range
            result[dim] = sum(values) / len(values) / 2
        else:
            result[dim] = 0.0
    
    return result

def generate_party_code(name):
    """Generate a short code for the party."""
    # Special cases
    special_codes = {
        'Voluntia': 'VOLUNTIA',
        'Svobodní': 'SVOBODNI',
        'Balbínova poetická strana': 'BALBINOVA',
        'Nevolte Urza.cz': 'URZA',
        'ANO 2011': 'ANO',
        'Spolu (ODS–KDU–TOP09)': 'SPOLU',
        'SPD': 'SPD',
        'Česká pirátská strana': 'PIRATI',
        'Starostové a nezávislí (STAN)': 'STAN',
        'Přísaha občanské hnutí': 'PRISAHA',
        'Motoristé sobě': 'MOTORISTE',
        'Stačilo!': 'STACILO',
        'Výzva 2025': 'VYZVA2025',
        'Hnutí Kruh': 'KRUH',
        'Jasný signál nezávislých (JaSaN)': 'JASAN',
        'Levice': 'LEVY_BLOK',
        'ČSSD – Česká suverenita sociální demokracie': 'CESKA_SUVERENITA',
        'Česká republika na 1. místě': 'REPUBLIKA',
        'Volt Česko': 'VOLT',
        'Hnutí občanů a podnikatelů (HOP)': 'HOP',
        'Hnutí Generace': 'GENERACE',
        'Koruna česká (monarchistická strana)': 'MONARCHISTE',
        'Volte Pravý Blok (Cibulka)': 'CIBULKA',
        'Moravské zemské hnutí': 'MORAVANE',
        'Rebelové': 'REBELOVE',
        'SMS - Stát má sloužit': 'SMS',
        'Švýcarská demokracie': 'SVYCARSKO',
        # Coalition parties
        'ODS': 'ODS',
        'TOP 09': 'TOP09',
        'KDU-ČSL': 'KDU',
        'Trikolora': 'TRIKOLORA',
        'PRO Jindřicha Rajchla': 'PRO',
        'Strana zelených': 'ZELENI',
        'KSČM': 'KSCM',
        'ČSNS': 'CSNS',
        'SD-SN': 'SDSN',
        'SOCDEM': 'SOCDEM'
    }
    
    if name in special_codes:
        return special_codes[name]
    
    # Generate from name
    return name.upper().replace(' ', '_')[:20]

def main():
    # Parse MD file
    print("Parsing party-positions-unified-2025.md...")
    parties = parse_md_file('party-positions-unified-2025.md')
    print(f"Found {len(parties)} parties")
    
    # Process each party
    main_parties = []
    coalition_parties = []
    
    for party in parties:
        # Skip Balbínova (satirical party)
        if 'Balbínova' in party['name']:
            print(f"Skipping satirical party: {party['name']}")
            party_data = {
                'code': 'BALBINOVA',
                'name': party['name'],
                'compass_position': {'EKO': 0.0, 'SOC': 0.0, 'STA': 0.0, 'SUV': 0.0},
                'satirical': True
            }
            main_parties.append(party_data)
            continue
        
        # Calculate positions if we have answers
        if party['answers']:
            positions = calculate_positions(party['answers'])
        else:
            print(f"Warning: No answers for {party['name']}")
            positions = {'EKO': 0.0, 'SOC': 0.0, 'STA': 0.0, 'SUV': 0.0}
        
        # Create party data structure
        party_data = {
            'code': generate_party_code(party['name']),
            'name': party['name'],
            'compass_position': positions
        }
        
        # Add metadata if available
        if party.get('description'):
            party_data['description'] = party['description']
        if party.get('web'):
            party_data['web'] = party['web']
        if party.get('source'):
            party_data['source'] = party['source']
        
        # Determine if coalition party (numbered 27-37)
        if party['number'] >= 27:
            coalition_parties.append(party_data)
        else:
            main_parties.append(party_data)
        
        try:
            print(f"{party['number']}. {party['name']}: EKO={positions['EKO']:.2f}, SOC={positions['SOC']:.2f}, STA={positions['STA']:.2f}, SUV={positions['SUV']:.2f}")
        except UnicodeEncodeError:
            # Fallback for Windows console encoding issues
            safe_name = party['name'].encode('ascii', 'replace').decode('ascii')
            print(f"{party['number']}. {safe_name}: EKO={positions['EKO']:.2f}, SOC={positions['SOC']:.2f}, STA={positions['STA']:.2f}, SUV={positions['SUV']:.2f}")
    
    # Create complete data structure
    complete_data = {
        'mainParties': main_parties,
        'coalitionParties': coalition_parties,
        'metadata': {
            'source': 'party-positions-unified-2025.md',
            'questions': 28,
            'scale': '1-5 with half-steps',
            'dimensions': ['EKO', 'SOC', 'STA', 'SUV']
        }
    }
    
    # Save to JSON
    output_file = 'netlify/functions/data/parties-unified.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(complete_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved unified party data to {output_file}")
    print(f"Main parties: {len(main_parties)}")
    print(f"Coalition parties: {len(coalition_parties)}")
    
    # Also save raw answers for reference
    raw_data = {
        'parties': [
            {
                'name': p['name'],
                'number': p['number'],
                'answers': p['answers']
            }
            for p in parties
        ]
    }
    
    with open('party-answers-raw.json', 'w', encoding='utf-8') as f:
        json.dump(raw_data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved raw answers to party-answers-raw.json")

if __name__ == '__main__':
    main()
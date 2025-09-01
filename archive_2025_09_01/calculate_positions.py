import re
import json

# Mapování otázek na dimenze
QUESTION_MAPPING = {
    # EKO (Ekonomika) - otázky 1-7
    'EKO': [1, 2, 3, 4, 5, 6, 7],
    # SOC (Společnost) - otázky 15-21  
    'SOC': [15, 16, 17, 18, 19, 20, 21],
    # STA (Role státu) - otázky 8-14
    'STA': [8, 9, 10, 11, 12, 13, 14],
    # SUV (Suverenita) - otázky 22-28
    'SUV': [22, 23, 24, 25, 26, 27, 28]
}

def parse_md_file(filename):
    """Parse MD file and extract party positions"""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parties = {}
    current_party = None
    current_answers = {}
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # Detect party header
        if line.startswith('## ') and '. ' in line:
            # Save previous party if exists
            if current_party and current_answers:
                parties[current_party] = current_answers
            
            # Extract party name
            party_match = re.match(r'## \d+\. (.+)', line)
            if party_match:
                current_party = party_match.group(1).strip()
                current_answers = {}
                # print(f"Found party: {current_party}")
        
        # Detect answers (format: number. **text:** value)
        elif current_party and '**' in line and ':' in line:
            answer_match = re.match(r'(\d+)\.\s+\*\*[^:]+:\*\*\s+([0-9.]+)', line)
            if answer_match:
                question_num = int(answer_match.group(1))
                value = float(answer_match.group(2))
                current_answers[question_num] = value
    
    # Save last party
    if current_party and current_answers:
        parties[current_party] = current_answers
    
    return parties

def convert_scale(value):
    """Convert 1-5 scale to -1 to 1 scale"""
    # 1 = -1.0 (silně libertariánské)
    # 2 = -0.5 (mírně libertariánské) 
    # 3 = 0 (neutrální)
    # 4 = 0.5 (mírně etatistické)
    # 5 = 1.0 (silně etatistické)
    return (value - 3) * 0.5

def calculate_positions(parties_data):
    """Calculate compass positions for each party"""
    results = {}
    
    for party_name, answers in parties_data.items():
        positions = {}
        
        for dimension, questions in QUESTION_MAPPING.items():
            values = []
            for q in questions:
                if q in answers:
                    values.append(convert_scale(answers[q]))
            
            if values:
                positions[dimension] = round(sum(values) / len(values), 2)
            else:
                positions[dimension] = 0.0
        
        results[party_name] = positions
        # print(f"{party_name}: EKO={positions.get('EKO', 0):.2f}, SOC={positions.get('SOC', 0):.2f}, STA={positions.get('STA', 0):.2f}, SUV={positions.get('SUV', 0):.2f}")
    
    return results

# Main execution
if __name__ == "__main__":
    # Parse MD file - use the unified version
    parties_data = parse_md_file('party-positions-unified-2025.md')
    print(f"\nFound {len(parties_data)} parties in MD file")
    
    # Calculate positions
    positions = calculate_positions(parties_data)
    
    # Load current JSON
    with open('netlify/functions/data/parties.json', 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    
    # Create mapping for easier updates
    party_mapping = {
        'ANO 2011': 'ANO',
        'Spolu (ODS, KDU-ČSL, TOP 09)': 'SPOLU',
        'Svoboda a přímá demokracie (SPD) + koalice': 'SPD',
        'SPD': 'SPD',
        'Pirátská strana': 'PIRATI',
        'Česká pirátská strana': 'PIRATI',
        'Starostové a nezávislí (STAN)': 'STAN',
        'Přísaha občanské hnutí': 'PRISAHA',
        'Přísaha': 'PRISAHA',
        'Motoristé sobě': 'MOTORISTE',
        'Stačilo!': 'STACILO',
        'Výzva 2025': 'VYZVA2025',
        'Hnutí Kruh': 'KRUH',
        'Voluntia': 'VOLUNTIA',
        'Jasný signál nezávislých (JaSaN)': 'JASAN',
        'Levice': 'LEVY_BLOK',
        'ČSSD - Česká suverenita sociální demokracie': 'CESKA_SUVERENITA',
        'ČSSD - Česká suverenita': 'CESKA_SUVERENITA',
        'Česká republika na 1. místě': 'REPUBLIKA',
        'Volt Česko': 'VOLT',
        'Hnutí občanů a podnikatelů (HOP)': 'HOP',
        'Hnutí občanů a podnikatelů': 'HOP',
        'Hnutí Generace': 'GENERACE',
        'Koruna česká (monarchistická strana)': 'MONARCHISTE',
        'Koruna česká (monarchisté)': 'MONARCHISTE',
        'Volte Pravý Blok (Cibulka)': 'CIBULKA',
        'Balbínova poetická strana': 'BALBINOVA',
        'Moravské zemské hnutí': 'MORAVANE',
        'Rebelové': 'REBELOVE',
        'SMS – Stát má sloužit': 'SMS',  # en dash
        'SMS - Stát má sloužit': 'SMS',  # hyphen
        'SMS — Stát má sloužit': 'SMS',  # em dash
        'Švýcarská demokracie': 'SVYCARSKO',
        'Nevolte Urza.cz': 'URZA',
        # Coalition parties
        'ODS (Občanská demokratická strana)': 'ODS',
        'TOP 09': 'TOP09',
        'KDU-ČSL (Křesťanská a demokratická unie - Československá strana lidová)': 'KDU',
        'KDU-ČSL': 'KDU',
        'Trikolora': 'TRIKOLORA',
        'PRO Jindřicha Rajchla': 'PRO',
        'Svobodní': 'SVOBODNI',
        'Strana zelených': 'ZELENI',
        'KSČM (Komunistická strana Čech a Moravy)': 'KSCM',
        'KSČM': 'KSCM',
        'ČSNS (Česká strana národně sociální)': 'CSNS',
        'ČSNS': 'CSNS',
        'SD-SN (Severočeši.cz)': 'SDSN',
        'SD-SN': 'SDSN',
        'SOCDEM (Sociální demokracie)': 'SOCDEM',
        'SOCDEM': 'SOCDEM'
    }
    
    # Update JSON with calculated positions
    updated_count = 0
    for md_name, code in party_mapping.items():
        if md_name in positions:
            pos = positions[md_name]
            # Find and update in main parties
            for party in json_data['mainParties']:
                if party['code'] == code:
                    party['compass_position'] = {
                        'EKO': pos['EKO'],
                        'SOC': pos['SOC'],
                        'STA': pos['STA'],
                        'SUV': pos['SUV']
                    }
                    updated_count += 1
                    break
            # Find and update in coalition parties
            for party in json_data['coalitionParties']:
                if party['code'] == code:
                    party['compass_position'] = {
                        'EKO': pos['EKO'],
                        'SOC': pos['SOC'],
                        'STA': pos['STA'],
                        'SUV': pos['SUV']
                    }
                    updated_count += 1
                    break
    
    print(f"\nUpdated {updated_count} parties in JSON")
    
    # Check which parties were not updated
    print("\nParties in MD but not updated in JSON:")
    missing = []
    for md_name in positions.keys():
        if md_name not in party_mapping:
            missing.append(f"{md_name} (no mapping)")
        else:
            found = False
            code = party_mapping[md_name]
            for party in json_data['mainParties'] + json_data['coalitionParties']:
                if party['code'] == code:
                    found = True
                    break
            if not found:
                missing.append(f"{md_name} -> {code} (not found in JSON)")
    
    # for m in missing:
    #     print(f"  - {m}")
    
    # Save updated JSON
    with open('netlify/functions/data/parties.json', 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)
    
    print("\nJSON file updated successfully!")
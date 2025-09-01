import re
import json

# Load unified questions
with open('unified_questions.json', 'r', encoding='utf-8') as f:
    unified = json.load(f)

# Map old inconsistent questions to new unified ones
# Creating comprehensive question mappings
question_mappings = {
    # Economic questions (1-7) 
    'Minimální mzda': 1,  # Maps to "Jak by měly fungovat daně z příjmu?"
    'Sociální dávky': 4,  # Maps to "Jak má být řešen důchodový systém?"
    'Zdanění bohatých': 1,  # Also maps to daně
    'Privatizace': 5,  # Maps to "Jak má stát přistupovat k soukromým firmám?"
    'Regulace': 5,  # Also maps to firmy
    'Bytová politika': 6,  # Maps to "Jak má být řešeno bydlení?"
    'Dotace': 5,  # Maps to firmy/stát
    'Státní investice': 7,  # Maps to "Kdo má stavět a spravovat silnice?"
    'Daně z příjmu': 1,
    'Zdravotnictví': 2,
    'Vzdělávání': 3,
    'Důchody': 4,
    'Soukromé firmy': 5,
    'Bydlení': 6,
    'Silnice': 7,
    
    # State questions (8-14)
    'Školství': 3,  # Actually maps to vzdělávání
    'Občanský průkaz': 13,  # Maps to "Jak má stát využívat technologie?"
    'Sňatky': 15,  # Actually a society question
    'Adopce': 15,  # Also society
    'Regulace internetu': 13,  # Maps to technologie
    'Represe': 8,  # Maps to "Kdo má zajišťovat bezpečnost?"
    'Surveillance': 13,  # Maps to technologie
    'Centralizace': 11,  # Maps to "Do jaké míry má stát zasahovat do ekonomiky?"
    'Bezpečnost': 8,
    'Obrana': 9,
    'Spravedlnost': 10,
    'Ekonomika': 11,
    'Chudoba': 12,
    'Technologie': 13,
    'Půda': 14,
    
    # Society questions (15-21)
    'Drogy': 17,  # Maps to "Jak má být upraveno užívání drog?"
    'Migrace': 19,  # Maps to "Jak přistupovat k migraci?"
    'EU integrace': 22,  # Actually sovereignty 
    'Eutanázie': 16,  # Maps to právo na potrat (body autonomy)
    'Potrat': 16,
    'Transgender': 15,  # Maps to manželství (social issues)
    'Církve': 20,  # Maps to "Jak má stát regulovat náboženství?"
    'Manželství': 15,
    'Konopí': 17,
    'Svoboda slova': 18,
    'Náboženství': 20,
    'Kultura': 21,
    
    # Sovereignty questions (22-28)
    'EU vystoupení': 22,  # Maps to "Jak má být řešeno členství v EU?"
    'NATO': 25,  # Maps to "Jak řešit obranu?"
    'Globální daně': 24,  # Maps to "Jak řešit klima?"
    'OSN migrace': 26,  # Maps to "Jak řešit evropskou migrační politiku?"
    'Suverenita': 28,  # Maps to "Kdo má mít konečné slovo v rozhodování?"
    'Měna': 23,
    'Evropský stát': 28,  # Also maps to konečné slovo
    'EU': 22,
    'Euro': 23,
    'Klima': 24,
    'Obchod': 27,
    'Rozhodování': 28
}

# Read MD file
with open('party-positions-detailed-2025.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse parties and their current answers
parties = {}
lines = content.split('\n')
current_party = None
current_answers = {}
in_answers_section = False

for i, line in enumerate(lines):
    # Detect party header
    if line.startswith('## ') and '. ' in line:
        # Save previous party if exists
        if current_party and current_answers:
            parties[current_party] = {
                'answers': current_answers,
                'start_line': party_start_line,
                'end_line': i - 1
            }
        
        # Extract party name
        party_match = re.match(r'## \d+\. (.+)', line)
        if party_match:
            current_party = party_match.group(1).strip()
            current_answers = {}
            in_answers_section = False
            party_start_line = i
    
    # Detect answers section
    elif '### Odpovědi:' in line:
        in_answers_section = True
    
    # Parse answers
    elif in_answers_section and current_party:
        # Match various answer formats
        answer_match = re.match(r'(\d+)\.\s+\*\*([^:*]+):\*\*\s+([0-9.]+)', line)
        if not answer_match:
            # Try alternative format without bold
            answer_match = re.match(r'(\d+)\.\s+([^:]+):\s+([0-9.]+)', line)
        
        if answer_match:
            q_num = int(answer_match.group(1))
            q_text = answer_match.group(2).strip()
            value = float(answer_match.group(3))
            
            # Map to unified question ID
            for key in question_mappings:
                if key.lower() in q_text.lower():
                    unified_id = question_mappings[key]
                    current_answers[unified_id] = value
                    break
            else:
                # Direct mapping if already using correct numbering
                if q_num <= 28:
                    current_answers[q_num] = value

# Save last party
if current_party and current_answers:
    parties[current_party] = {
        'answers': current_answers,
        'start_line': party_start_line,
        'end_line': len(lines) - 1
    }

print(f"Found {len(parties)} parties to update")

# Generate standardized answers for each party
updated_content = []
current_line = 0

for line_num, line in enumerate(lines):
    # Check if we're at a party section that needs updating
    party_found = None
    for party_name, party_data in parties.items():
        if line_num == party_data['start_line']:
            party_found = party_name
            break
    
    if party_found:
        # Copy lines until answers section
        i = line_num
        while i < len(lines) and '### Odpovědi:' not in lines[i]:
            updated_content.append(lines[i])
            i += 1
        
        # Add answers header
        if i < len(lines) and '### Odpovědi:' in lines[i]:
            updated_content.append(lines[i])
            i += 1
            
            # Skip any existing answer explanation
            while i < len(lines) and lines[i].startswith('*'):
                updated_content.append(lines[i])
                i += 1
            
            # Add empty line
            if i < len(lines) and lines[i].strip() == '':
                updated_content.append('')
                i += 1
            
            # Generate all 28 standardized answers
            party_answers = parties[party_found]['answers']
            
            for q in unified['questions']:
                q_id = q['id']
                
                # Get answer value - use existing or default to 3
                if q_id in party_answers:
                    value = party_answers[q_id]
                else:
                    # Try to infer from party type
                    value = 3  # Default neutral
                
                # Format answer line
                answer_line = f"{q_id}. **{q['text']}:** {value}"
                updated_content.append(answer_line)
            
            # Skip to next party or end
            while i < len(lines):
                if lines[i].startswith('## ') and '. ' in lines[i]:
                    break
                i += 1
            
            # Update line counter
            line_num = i - 1
    else:
        updated_content.append(line)

# Save updated MD file
with open('party-positions-unified-2025.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(updated_content))

print("Created party-positions-unified-2025.md with standardized 28 questions for all parties")

# Also create a summary of what values each party has
summary = {}
for party_name, party_data in parties.items():
    answers = party_data['answers']
    filled = len(answers)
    missing = 28 - filled
    summary[party_name] = {
        'filled': filled,
        'missing': missing,
        'has_answers': list(answers.keys())
    }

with open('party_answers_summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, indent=2, ensure_ascii=False)

print(f"\nSummary:")
for party, info in summary.items():
    print(f"  {party}: {info['filled']}/28 answers")
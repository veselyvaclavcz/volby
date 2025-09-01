import re
import json

# Parse MD file
with open('party-positions-detailed-2025.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all parties in MD
md_parties = re.findall(r'^## \d+\. (.+)$', content, re.MULTILINE)
print(f"Total parties in MD: {len(md_parties)}")

# Load JSON
with open('netlify/functions/data/parties.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

json_parties = [p['name'] for p in json_data['mainParties']] + [p['name'] for p in json_data['coalitionParties']]
print(f"Total parties in JSON: {len(json_parties)}")

# Compare
print("\nParties in MD but not in JSON:")
for p in md_parties:
    found = False
    for jp in json_parties:
        if jp.lower() in p.lower() or p.lower() in jp.lower():
            found = True
            break
    if not found:
        print(f"  - {p}")

print("\nParties in JSON but not in MD:")
for jp in json_parties:
    found = False
    for p in md_parties:
        if jp.lower() in p.lower() or p.lower() in jp.lower():
            found = True
            break
    if not found:
        print(f"  - {jp}")
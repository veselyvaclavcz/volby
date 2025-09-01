import json

# Read parties backup
with open('netlify/functions/data/parties-backup.json', 'r', encoding='utf-8') as f:
    parties_data = json.load(f)

# Read new questions
with open('netlify/functions/data/questions-28.json', 'r', encoding='utf-8') as f:
    new_questions = json.load(f)

# Update questions
parties_data['questions'] = new_questions

# Save updated parties.json
with open('netlify/functions/data/parties.json', 'w', encoding='utf-8') as f:
    json.dump(parties_data, f, ensure_ascii=False, indent=2)

print(f"Successfully updated {len(new_questions)} questions in parties.json")
print("First question:", new_questions[0]['text'])
print("Last question:", new_questions[-1]['text'])
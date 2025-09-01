import json

# Load correct question format from v2
with open('v2/volebni_otazky.json', 'r', encoding='utf-8') as f:
    v2_questions = json.load(f)

# Load 4D question structure  
with open('questions-4d-correct.json', 'r', encoding='utf-8') as f:
    questions_4d = json.load(f)

# Create mapping of questions
unified_questions = []
question_id = 1

# Process in correct order: EKO (1-7), STA (8-14), SOC (15-21), SUV (22-28)
for category, questions in [
    ('economy', v2_questions['economy']),
    ('state', v2_questions['state']), 
    ('society', v2_questions['society']),
    ('sovereignty', v2_questions['sovereignty'])
]:
    for q in questions:
        # Find matching question from 4D structure
        matching_4d = next((q4d for q4d in questions_4d['questions'] if q4d['id'] == question_id), None)
        
        unified_questions.append({
            'id': question_id,
            'text': q['question'],
            'dimension': matching_4d['dimension'] if matching_4d else category.upper()[:3],
            'polarity': matching_4d['polarity'] if matching_4d else 1,
            'answers': q['answers']
        })
        question_id += 1

# Save unified questions
with open('unified_questions.json', 'w', encoding='utf-8') as f:
    json.dump({'questions': unified_questions}, f, indent=2, ensure_ascii=False)

print(f"Created {len(unified_questions)} unified questions")

# Save template to file instead of printing
template_lines = ["### Standard 28 Questions Template for MD file:\n"]
for q in unified_questions:
    template_lines.append(f"{q['id']}. **{q['text']}:** [VALUE] - Reason: [REASON]\n")

with open('question_template.txt', 'w', encoding='utf-8') as f:
    f.writelines(template_lines)
    
print("Template saved to question_template.txt")
import json
import sys
import io

# Set UTF-8 encoding for output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load updated party data
with open('netlify/functions/data/parties.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Key parties to check
key_checks = {
    'VOLT': {
        'name': 'Volt Česko',
        'expected': {
            'SUV': 'positive (pro-EU)',
            'SOC': 'negative (liberal)',
            'EKO': 'neutral to positive',
            'STA': 'neutral'
        }
    },
    'SVOBODNI': {
        'name': 'Svobodní',
        'expected': {
            'SUV': 'negative (euroskeptic)',
            'SOC': 'negative (libertarian)',
            'EKO': 'negative (free market)',
            'STA': 'negative (minimal state)'
        }
    },
    'VOLUNTIA': {
        'name': 'Voluntia',
        'expected': {
            'SUV': 'negative (sovereignty)',
            'SOC': 'negative (libertarian)',
            'EKO': 'negative (anarcho-cap)',
            'STA': 'negative (minimal state)'
        }
    },
    'SPD': {
        'name': 'SPD',
        'expected': {
            'SUV': 'negative (nationalist)',
            'SOC': 'positive (conservative)',
            'EKO': 'positive (state intervention)',
            'STA': 'positive (strong state)'
        }
    },
    'URZA': {
        'name': 'Nevolte Urza.cz',
        'expected': {
            'SUV': 'very negative (anarcho)',
            'SOC': 'very negative (anarcho)',
            'EKO': 'very negative (anarcho-cap)',
            'STA': 'very negative (no state)'
        }
    },
    'KSCM': {
        'name': 'KSČM',
        'expected': {
            'SUV': 'negative (anti-NATO/EU)',
            'SOC': 'neutral to positive',
            'EKO': 'very positive (communist)',
            'STA': 'positive (strong state)'
        }
    }
}

print("Verifying key party positions:\n")
print("-" * 60)

all_parties = data['mainParties'] + data['coalitionParties']

for code, check in key_checks.items():
    party = next((p for p in all_parties if p['code'] == code), None)
    if party:
        pos = party['compass_position']
        print(f"\n{check['name']} ({code}):")
        print(f"  Expected:")
        for dim, exp in check['expected'].items():
            print(f"    {dim}: {exp}")
        print(f"  Actual:")
        print(f"    EKO: {pos['EKO']:.2f}")
        print(f"    SOC: {pos['SOC']:.2f}")
        print(f"    STA: {pos['STA']:.2f}")
        print(f"    SUV: {pos['SUV']:.2f}")
        
        # Check if positions match expectations
        issues = []
        if 'pro-EU' in check['expected']['SUV'] and pos['SUV'] < 0:
            issues.append(f"SUV should be positive (pro-EU) but is {pos['SUV']}")
        if 'euroskeptic' in check['expected']['SUV'] and pos['SUV'] > 0:
            issues.append(f"SUV should be negative (euroskeptic) but is {pos['SUV']}")
        if 'libertarian' in check['expected']['SOC'] and pos['SOC'] > 0.2:
            issues.append(f"SOC should be negative (libertarian) but is {pos['SOC']}")
        if 'conservative' in check['expected']['SOC'] and pos['SOC'] < -0.2:
            issues.append(f"SOC should be positive (conservative) but is {pos['SOC']}")
        if 'free market' in check['expected']['EKO'] and pos['EKO'] > 0.2:
            issues.append(f"EKO should be negative (free market) but is {pos['EKO']}")
        if 'communist' in check['expected']['EKO'] and pos['EKO'] < 0.5:
            issues.append(f"EKO should be very positive (communist) but is {pos['EKO']}")
        
        if issues:
            print("  ⚠️ ISSUES:")
            for issue in issues:
                print(f"    - {issue}")
        else:
            print("  ✓ Position looks correct")
    else:
        print(f"\n{check['name']} ({code}): NOT FOUND")

print("\n" + "-" * 60)
print("\nComparison of similar parties:")
print("-" * 60)

# Compare libertarian parties
print("\nLibertarian parties (should have similar patterns):")
for code in ['VOLUNTIA', 'SVOBODNI', 'URZA']:
    party = next((p for p in all_parties if p['code'] == code), None)
    if party:
        pos = party['compass_position']
        print(f"  {party['name']:30} EKO:{pos['EKO']:6.2f} SOC:{pos['SOC']:6.2f} STA:{pos['STA']:6.2f} SUV:{pos['SUV']:6.2f}")

print("\nPro-EU parties (should have positive SUV):")
for code in ['VOLT', 'TOP09', 'ZELENI']:
    party = next((p for p in all_parties if p['code'] == code), None)
    if party:
        pos = party['compass_position']
        print(f"  {party['name']:30} SUV:{pos['SUV']:6.2f}")

print("\nEuroskeptic parties (should have negative SUV):")
for code in ['SPD', 'REPUBLIKA', 'TRIKOLORA', 'SVOBODNI']:
    party = next((p for p in all_parties if p['code'] == code), None)
    if party:
        pos = party['compass_position']
        print(f"  {party['name']:30} SUV:{pos['SUV']:6.2f}")
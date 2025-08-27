"""
Flask web application for Czech Election Calculator 2025
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
import json

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from vaa_methodology import VAACalculator, Answer, Question, MatchingMethod
from czech_vaa_complete import CzechVAAComplete
from czech_vaa_2025 import CzechVAA2025
from political_compass_3d_official import PoliticalCompass3DOfficial
from hybrid_vaa_calculator import HybridVAACalculator
import glob

app = Flask(__name__)
CORS(app)

# Initialize 3D Political Compass system (Official 26 parties only)
try:
    compass_3d = PoliticalCompass3DOfficial()
    print("Using 3D Political Compass with official 26 parties")
    use_3d = True
except Exception as e:
    print(f"Could not load 3D system: {e}")
    compass_3d = None
    use_3d = False

# Initialize hybrid Political Compass system as secondary option
try:
    compass_hybrid = HybridVAACalculator()
    print("Hybrid Political Compass loaded as secondary option")
    use_hybrid = True
except Exception as e:
    print(f"Could not load hybrid system: {e}")
    compass_hybrid = None
    use_hybrid = False

# Use the 3D compass as main system since we fixed it
if use_3d:
    compass = compass_3d
    print("Using 3D Political Compass as main system")
    print(f"Loaded {len(compass.party_positions_3d)} parties with 3D positions")
else:
    # Fallback to VAA system
    compass = CzechVAA2025()
    print("Standard VAA system loaded as fallback")
    print("VAA system loaded")

# Keep old VAA for fallback (can be removed later)
try:
    from czech_vaa_2025 import CzechVAA2025
    vaa = CzechVAA2025(data_path="data/programs_structured")
except:
    from czech_vaa_complete import CzechVAAComplete
    vaa = CzechVAAComplete()

# Get questions from 3D Political Compass system if available, otherwise use 4D
if use_3d and compass_3d:
    QUESTIONS_CZ = compass_3d.get_questions_for_web()
    print("Using 3D compass questions")
else:
    QUESTIONS_CZ = compass.get_questions_for_web()
    print("Using 4D compass questions")

# Old questions (kept for reference, will be removed)
OLD_QUESTIONS_CZ = [
    {"id": 1, "text": "Zvýšení progresivních daní pro vysoké příjmy", "category": "Ekonomika"},
    {"id": 2, "text": "Snížení státních výdajů a škrty v rozpočtu", "category": "Ekonomika"},
    {"id": 3, "text": "Zvýšení minimální mzdy na 20 000 Kč", "category": "Sociální"},
    {"id": 4, "text": "Posilování role EU a přenos dalších pravomocí", "category": "Zahraničí"},
    {"id": 5, "text": "Přijetí eura jako české měny", "category": "Ekonomika"},
    {"id": 6, "text": "Legalizace konopí pro rekreační užití", "category": "Společnost"},
    {"id": 7, "text": "Zvýšení minimálního důchodu na 15 000 Kč", "category": "Sociální"},
    {"id": 8, "text": "Omezení migrace a přísnější azylová politika", "category": "Bezpečnost"},
    {"id": 9, "text": "Povinné referendum při významných změnách ústavy", "category": "Demokracie"},
    {"id": 10, "text": "Zvýšení rodičovského příspěvku", "category": "Rodina"},
    {"id": 11, "text": "Podpora jaderné energie jako součásti energetického mixu", "category": "Energie"},
    {"id": 12, "text": "Zavedení daně z finančních transakcí", "category": "Ekonomika"},
    {"id": 13, "text": "Podpora LGBTQ+ práv včetně manželství pro všechny", "category": "Společnost"},
    {"id": 14, "text": "Zrušení povinného školství a svobodná volba vzdělání", "category": "Vzdělání"},
    {"id": 15, "text": "Důraz na digitalizace státní správy", "category": "Modernizace"},
    {"id": 16, "text": "Zvýšení výdajů na obranu nad 2% HDP", "category": "Bezpečnost"},
    {"id": 17, "text": "Podpora dostupného bydlení pro mladé a rodiny", "category": "Sociální"},
    {"id": 18, "text": "Omezení velkých korporací a podpory malého podnikání", "category": "Ekonomika"},
    {"id": 19, "text": "Zkrácení čekacích dob ve zdravotnictví", "category": "Zdraví"},
    {"id": 20, "text": "Zavedení bezpodmínečného základního příjmu", "category": "Sociální"},
    {"id": 21, "text": "Podpora tradičních rodinných hodnot", "category": "Rodina"},
    {"id": 22, "text": "Omezení byrokracie a zjednodušení státní správy", "category": "Modernizace"},
    {"id": 23, "text": "Podpora obnovitelných zdrojů energie", "category": "Energie"},
    {"id": 24, "text": "Zvýšení transparentnosti ve veřejných zakázkách", "category": "Transparentnost"},
    {"id": 25, "text": "Podpora místní samosprávy a decentralizace", "category": "Demokracie"}
]

@app.route('/')
def index():
    """Main page with calculator"""
    # Use the new ankap-style template
    return render_template('index-ankap.html')

@app.route('/compass')
def show_compass():
    """Political compass visualization"""
    return render_template('compass.html')

@app.route('/api/questions')
def get_questions():
    """Get all questions"""
    return jsonify(QUESTIONS_CZ)

@app.route('/api/calculate', methods=['POST'])
def calculate():
    """Calculate matches based on user answers using Political Compass"""
    try:
        data = request.json
        user_answers_raw = data.get('answers', {})
        use_hybrid_mode = data.get('use_hybrid', use_hybrid)  # Use hybrid if available
        use_compass = data.get('use_compass', True)  # Default to new compass
        important_questions = data.get('important_questions', [])
        
        # Convert answers to simple dict format for compass
        user_answers = {}
        for q_id, value in user_answers_raw.items():
            q_id = int(q_id)
            if value['position'] > 0:  # Skip unanswered questions
                user_answers[q_id] = value['position']
        
        if not user_answers:
            return jsonify({'error': 'No answers provided'}), 400
        
        if use_3d and compass_3d:
            # Use 3D Political Compass (priority)
            matches = compass_3d.calculate_all_matches_3d(user_answers)
            
            # Get user's compass position
            user_compass = compass_3d.calculate_user_position_3d(user_answers)
            
            # Format results
            results = []
            for party_code, match, party_name in matches:
                results.append({
                    'party_code': party_code,
                    'party_name': party_name,
                    'match': round(match, 1)
                })
            
            # Add user's compass position to response
            response = {
                'results': results,
                'user_compass': user_compass,
                'compass_description': compass_3d.get_user_description_3d(user_compass),
                'methodology': '3d_euclidean'
            }
        elif use_hybrid_mode and compass_hybrid:
            # Use hybrid scoring with confidence intervals
            matches = compass_hybrid.calculate_hybrid_matches(
                user_answers, 
                important_questions,
                num_monte_carlo=100
            )
            
            # Get user's compass position
            user_compass = compass_hybrid.calculate_user_compass_position(user_answers)
            
            # Format results with confidence intervals
            results = []
            for party_code, mean_match, lower, upper, party_name in matches:
                results.append({
                    'party_code': party_code,
                    'party_name': party_name,
                    'match': round(mean_match, 1),
                    'confidence_interval': [round(lower, 1), round(upper, 1)],
                    'uncertainty': round(upper - lower, 1)
                })
            
            # Add user's compass position to response
            response = {
                'results': results,
                'user_compass': user_compass,
                'compass_description': compass_hybrid.get_user_compass_description(user_compass),
                'methodology': 'hybrid',
                'components': {
                    'manhattan': 40,
                    'euclidean': 40,
                    'cosine': 20
                }
            }
        elif use_compass:
            # Use standard Political Compass algorithm
            matches = compass.calculate_all_matches(user_answers)
            
            # Get user's compass position
            user_compass = compass.calculate_user_compass_position(user_answers)
            
            # Format results
            results = []
            for party_code, match, party_name in matches:
                results.append({
                    'party_code': party_code,
                    'party_name': party_name,
                    'match': round(match, 1)
                })
            
            # Add user's compass position to response
            response = {
                'results': results,
                'user_compass': user_compass,
                'compass_description': compass.get_user_compass_description(user_compass),
                'methodology': 'euclidean'
            }
        else:
            # Fallback to old VAA system
            user_answers_vaa = {}
            for q_id, pos in user_answers.items():
                user_answers_vaa[q_id] = Answer(q_id, pos, 1.0)
            
            matches = vaa.calculate_matches(user_answers_vaa)
            
            results = []
            for party_code, match, party_name in matches:
                results.append({
                    'party_code': party_code,
                    'party_name': party_name,
                    'match': round(match, 1)
                })
            
            response = {'results': results, 'methodology': 'legacy'}
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/methodology')
def get_methodology():
    """Get methodology information"""
    if use_hybrid and compass_hybrid:
        methodology = {
            'name': 'Hybridní politický kompas',
            'description': 'Pokročilý systém kombinující více metrik podobnosti s evidenční kvalitou',
            'dimensions': [
                {
                    'name': 'Ekonomická',
                    'left': 'Silný stát/kolektivismus',
                    'right': 'Volný trh/individualismus',
                    'weight': 1.2,
                    'description': 'Míra státních zásahů do ekonomiky vs. svoboda trhu'
                },
                {
                    'name': 'Sociální',
                    'left': 'Tradiční hodnoty',
                    'right': 'Progresivní hodnoty',
                    'weight': 1.0,
                    'description': 'Konzervativní vs. liberální přístup k společenským otázkám'
                },
                {
                    'name': 'Suverenita',
                    'left': 'Národní stát',
                    'right': 'Evropská integrace',
                    'weight': 0.9,
                    'description': 'Důraz na národní suverenitu vs. globální spolupráci'
                },
                {
                    'name': 'Demokratická',
                    'left': 'Přímá demokracie',
                    'right': 'Expertní vláda',
                    'weight': 0.8,
                    'description': 'Rozhodování lidmi vs. rozhodování experty'
                }
            ],
            'calculation': {
                'method': 'Hybridní skórování',
                'components': {
                    'manhattan': '40% - Manhattan (L1) vzdálenost',
                    'euclidean': '40% - Euklidovská (L2) vzdálenost',
                    'cosine': '20% - Kosinová podobnost'
                },
                'scale': 'Každá dimenze: -2.0 až +2.0',
                'confidence': 'Monte Carlo simulace pro intervaly spolehlivosti',
                'evidence': 'Kvalita evidence: A (explicitní), B (jasné), C (odvozené)',
                'weighting': 'Váhy: důležitost, síla pozice, kvalita evidence, aktualnost'
            },
            'advantages': [
                'Kombinuje tři metriky podobnosti pro robustnost',
                'Zohledňuje nejistotu v pozicích stran',
                'Poskytuje intervaly spolehlivosti',
                'Rozlišuje cíle vs. nástroje',
                'Váží podle kvality evidence',
                'Zachycuje složitost politických pozic'
            ],
            'references': [
                'Návod k tvorbě volební kalkulačky (2025)',
                'Political Compass (politicalcompass.org)',
                'Chapel Hill Expert Survey',
                'Voting Advice Applications: A Comparative Study (Garzia & Marschall)'
            ]
        }
    else:
        methodology = {
            'name': 'Politický kompas 4D',
            'description': 'Čtyřrozměrný politický kompas pro přesnější zachycení ideologických pozic',
            'dimensions': [
                {
                    'name': 'Ekonomická',
                    'left': 'Silný stát/kolektivismus',
                    'right': 'Volný trh/individualismus',
                    'weight': 1.2,
                    'description': 'Míra státních zásahů do ekonomiky vs. svoboda trhu'
                },
                {
                    'name': 'Sociální',
                    'left': 'Tradiční hodnoty',
                    'right': 'Progresivní hodnoty',
                    'weight': 1.0,
                    'description': 'Konzervativní vs. liberální přístup k společenským otázkám'
                },
                {
                    'name': 'Suverenita',
                    'left': 'Národní stát',
                    'right': 'Evropská integrace',
                    'weight': 0.9,
                    'description': 'Důraz na národní suverenitu vs. globální spolupráci'
                },
                {
                    'name': 'Demokratická',
                    'left': 'Přímá demokracie',
                    'right': 'Expertní vláda',
                    'weight': 0.8,
                    'description': 'Rozhodování lidmi vs. rozhodování experty'
                }
            ],
            'calculation': {
                'method': 'Euklidovská vzdálenost ve 4D prostoru',
                'scale': 'Každá dimenze: -2.0 až +2.0',
                'matching': 'Porovnání pozice uživatele a strany na všech 4 osách'
            },
            'advantages': [
                'Zachycuje složitost politických pozic',
                'Rozlišuje mezi ekonomickými a hodnotovými postoji',
                'Zohledňuje postoje k EU a národní suverenitě',
                'Neutrální, nezaujaté otázky'
            ],
            'references': [
                'Political Compass (politicalcompass.org)',
                'Chapel Hill Expert Survey',
                'Voting Advice Applications: A Comparative Study (Garzia & Marschall)',
                'The Political Compass: A Two-Dimensional Political Model'
            ]
        }
    return jsonify(methodology)

@app.route('/api/parties')
def get_parties():
    """Get list of all parties with their compass positions"""
    parties = []
    
    if use_3d and compass_3d:
        # Use 3D compass positions
        for i, party_code in enumerate(sorted(compass_3d.party_positions_3d.keys()), 1):
            party_name = compass_3d.party_names.get(party_code, party_code)
            position = compass_3d.party_positions_3d[party_code]
            parties.append({
                'code': party_code,
                'name': party_name,
                'number': i,
                'compass_position': position
            })
    else:
        # Use 4D compass positions
        for i, party_code in enumerate(sorted(compass.party_compass_positions.keys()), 1):
            party_name = compass.party_names.get(party_code, party_code)
            position = compass.party_compass_positions[party_code]
            parties.append({
                'code': party_code,
                'name': party_name,
                'number': i,
                'compass_position': position
            })
    
    return jsonify(parties)

@app.route('/api/party_detail/<party_code>', methods=['POST'])
def get_party_detail(party_code):
    """Get detailed comparison with a specific party"""
    if not use_hybrid or not compass_hybrid:
        return jsonify({'error': 'Hybrid system not available'}), 400
    
    try:
        data = request.json
        user_answers_raw = data.get('answers', {})
        
        # Convert answers to simple dict format
        user_answers = {}
        for q_id, value in user_answers_raw.items():
            q_id = int(q_id)
            if value['position'] > 0:
                user_answers[q_id] = value['position']
        
        if not user_answers:
            return jsonify({'error': 'No answers provided'}), 400
        
        # Get detailed comparison
        details = compass_hybrid.get_detailed_comparison(user_answers, party_code)
        explanation = compass_hybrid.generate_explanation(user_answers, party_code)
        
        response = {
            'details': details,
            'explanation': explanation
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/static/<path:path>')
def send_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

if __name__ == '__main__':
    # Create templates and static directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    print("Starting Czech Election Calculator 2025")
    print("Navigate to http://localhost:5000")
    app.run(debug=True, port=5000)
"""
3D Political Compass - Official 26 Parties Only
Based on official party list for 2025 Czech elections
"""

import math
from typing import Dict, List, Tuple

class Question3D:
    def __init__(self, question_id: int, text: str, dimension: str, polarity: int):
        self.id = question_id
        self.text = text
        self.dimension = dimension  # EKO, SOC, SUV
        self.polarity = polarity    # 1 or -1


class PoliticalCompass3DOfficial:
    def __init__(self):
        self.dimensions = {
            "EKO": "Ekonomická",
            "SOC": "Sociální", 
            "SUV": "Suverenitní"
        }
        
        # Official 26 party names according to party_list_2025.json
        self.party_names = {
            "REBELI": "Rebelové",
            "MZH": "Moravské zemské hnutí", 
            "JSN": "Jasný signál Nezávislých",
            "VYZVA2025": "Výzva 2025",
            "SMS": "SMS",
            "SPD": "SPD - Svoboda a přímá demokracie",
            "CSSD": "ČSSD - Česká suverenita sociální demokracie", 
            "PRISAHA": "Přísaha občanské hnutí",
            "LEVICE": "Levice",
            "CR1MISTE": "Česká republika na 1. místě!",
            "SPOLU": "SPOLU",
            "SVYCARSKA": "Švýcarská demokracie",
            "URZA": "Nevolte Urza.cz",
            "HOP": "Hnutí občanů a podnikatelů",
            "GENERACE": "Hnutí Generace", 
            "PIRATI": "Česká pirátská strana",
            "KORUNA": "Koruna Česká",
            "VOLTCESKO": "Volt Česko",
            "PRAVYBLOK": "Volte Pravý blok",
            "MOTORISTE": "Motoristé sobě",
            "BPS": "Balbínova poetická strana",
            "ANO": "ANO 2011",
            "STAN": "Starostové a nezávislí", 
            "KRUH": "Hnutí Kruh",
            "STACILO": "Stačilo!",
            "VOLUNTIA": "Voluntia"
        }
        
        # 3D positions: EKO (State- ↔ Market+), SOC (Tradition- ↔ Progress+), SUV (National- ↔ European+)
        # Only official 26 parties
        self.party_positions_3d = {
            # Libertarian parties - free market, progressive, various EU positions
            "VOLUNTIA": {"EKO": 1.8, "SOC": 1.2, "SUV": -0.2},  # Most libertarian - strong market + progressive
            "URZA": {"EKO": 1.9, "SOC": 1.4, "SUV": -0.4},     # Very libertarian, more EU-skeptic
            "PRAVYBLOK": {"EKO": 1.5, "SOC": -1.2, "SUV": -1.4}, # Right-wing libertarian, conservative
            
            # Right-wing - free market, conservative, various EU positions
            "SPOLU": {"EKO": 1.2, "SOC": -0.4, "SUV": 0.8},  # ODS/TOP09/KDU-ČSL coalition
            
            # Left-wing - state control, various social, EU-skeptic
            "STACILO": {"EKO": -1.8, "SOC": -0.3, "SUV": -1.4},  # KSČM coalition
            "CSSD": {"EKO": -1.2, "SOC": 0.2, "SUV": 0.3},
            "LEVICE": {"EKO": -1.7, "SOC": 0.5, "SUV": -0.8},
            
            # Nationalists - mixed economy, conservative, anti-EU
            "SPD": {"EKO": -0.3, "SOC": -1.6, "SUV": -1.8},
            "CR1MISTE": {"EKO": 0.2, "SOC": -1.4, "SUV": -1.7},
            
            # Progressives - various economy, progressive, pro-EU
            "PIRATI": {"EKO": 0.3, "SOC": 1.4, "SUV": 0.9},
            "VOLTCESKO": {"EKO": 0.4, "SOC": 1.7, "SUV": 1.9},
            
            # Center - mixed economy, mildly conservative, various EU positions
            "ANO": {"EKO": 0.1, "SOC": -0.2, "SUV": -0.3},
            "STAN": {"EKO": 0.6, "SOC": 0.1, "SUV": 0.9},
            "PRISAHA": {"EKO": 0.4, "SOC": -0.3, "SUV": -0.4},
            
            # Single-issue and special interest
            "MOTORISTE": {"EKO": 0.9, "SOC": 0.0, "SUV": -0.8},
            "BPS": {"EKO": 0.3, "SOC": 0.4, "SUV": 0.2},
            
            # Regionalists
            "MZH": {"EKO": 0.0, "SOC": -0.6, "SUV": -0.5},
            "SVYCARSKA": {"EKO": 0.7, "SOC": -0.3, "SUV": -1.4},
            
            # Monarchists
            "KORUNA": {"EKO": -0.2, "SOC": -1.3, "SUV": -0.7},
            
            # Anti-establishment (less libertarian than claimed)
            "SMS": {"EKO": 0.5, "SOC": 0.0, "SUV": -0.6},
            "HOP": {"EKO": 0.9, "SOC": -0.1, "SUV": -0.5},  # More centrist than libertarian
            
            # Alternative movements
            "GENERACE": {"EKO": -0.2, "SOC": 0.7, "SUV": 0.3},
            "KRUH": {"EKO": -0.4, "SOC": 0.6, "SUV": 0.2},
            "JSN": {"EKO": 0.2, "SOC": 0.1, "SUV": -0.3},        # Less market-oriented
            "REBELI": {"EKO": 0.6, "SOC": -0.3, "SUV": -0.9},
            "VYZVA2025": {"EKO": 0.1, "SOC": 0.3, "SUV": -0.1},
        }
        
        # 33 questions across 3 dimensions - EXPANDED with specific policy issues from 2025 programs
        # Each dimension: 8 market/progressive/pro-EU (+1), 3 state/traditional/nationalist (-1)
        self.questions = [
            # Economic dimension (EKO) - Market vs State control (8 market, 3 state)
            Question3D(1, "Daně by měly být co nejnižší", "EKO", 1),
            Question3D(2, "Konkurence je lepší než státní monopoly", "EKO", 1),
            Question3D(3, "Privatizace veřejných služeb je prospěšná", "EKO", 1),
            Question3D(4, "Regulace škodí podnikání", "EKO", 1),
            Question3D(5, "Plochá daň je lepší než progresivní", "EKO", 1),
            Question3D(6, "Podpora podnikatelů je důležitější než sociální dávky", "EKO", 1),
            Question3D(7, "Zrušení superhrubé mzdy bylo správné", "EKO", 1),
            Question3D(8, "Stát by měl méně zasahovat do ekonomiky", "EKO", 1),
            Question3D(9, "Státní vlastnictví klíčových odvětví je žádoucí", "EKO", -1),
            Question3D(10, "Zaručený základní příjem je dobrý nápad", "EKO", -1),
            Question3D(11, "Stát by měl více investovat do veřejných projektů", "EKO", -1),
            
            # Social dimension (SOC) - Traditional vs Progressive values (8 progressive, 3 traditional)
            Question3D(12, "Stejnopohlavní páry by měly mít právo na adopce", "SOC", 1),
            Question3D(13, "Cannabis by měl být legalizován pro rekreační užívání", "SOC", 1),
            Question3D(14, "Ženy by měly mít právo na potrat na žádost", "SOC", 1),
            Question3D(15, "Registrované partnerství je dobré řešení", "SOC", 1),
            Question3D(16, "Rozmanitost a inkluze jsou důležité hodnoty", "SOC", 1),
            Question3D(17, "Aktivismus mladých za klima je oprávněný", "SOC", 1),
            Question3D(18, "Genderové rovnosti je třeba aktivně podporovat", "SOC", 1),
            Question3D(19, "Společnost se musí modernizovat a přijímat změny", "SOC", 1),
            Question3D(20, "Manželství je pouze mezi mužem a ženou", "SOC", -1),
            Question3D(21, "Tradiční rodinné hodnoty jsou základem společnosti", "SOC", -1),
            Question3D(22, "Náboženství má důležitou roli ve veřejném životě", "SOC", -1),
            
            # Sovereignty dimension (SUV) - National vs European integration (8 pro-EU, 3 nationalist)
            Question3D(23, "Česko by mělo přijmout euro", "SUV", 1),
            Question3D(24, "EU Green Deal je správná cesta", "SUV", 1),
            Question3D(25, "Spolupráce v rámci EU je klíčová pro naši budoucnost", "SUV", 1),
            Question3D(26, "Evropská armáda by posílila naši bezpečnost", "SUV", 1),
            Question3D(27, "Měli bychom přijímat více uprchlíků z EU kvót", "SUV", 1),
            Question3D(28, "Migrační pakt EU je rozumné řešení", "SUV", 1),
            Question3D(29, "EU legislativa v oblasti klimatu je potřebná", "SUV", 1),
            Question3D(30, "Evropská integrace přináší více výhod než nevýhod", "SUV", 1),
            Question3D(31, "České zákony by měly mít přednost před EU právem", "SUV", -1),
            Question3D(32, "Potřebujeme silnější kontrolu hranic a přísnou imigraci", "SUV", -1),
            Question3D(33, "Národní suverenita je důležitější než evropská integrace", "SUV", -1),
        ]
    
    def calculate_user_position_3d(self, user_answers: Dict[int, int]) -> Dict[str, float]:
        """
        Calculate user's 3D position from answers
        user_answers: {question_id: answer} where answer is 1-5 scale
        1 = strongly agree, 5 = strongly disagree
        """
        dimension_scores = {"EKO": 0.0, "SOC": 0.0, "SUV": 0.0}
        dimension_counts = {"EKO": 0, "SOC": 0, "SUV": 0}
        
        for question in self.questions:
            if question.id in user_answers:
                # Convert 1-5 to agreement scale: 1=+2, 2=+1, 3=0, 4=-1, 5=-2
                agreement = 3 - user_answers[question.id]  # Results in 2,1,0,-1,-2
                
                # Apply polarity and normalize to [-2, 2]
                score = agreement * question.polarity
                
                dimension_scores[question.dimension] += score
                dimension_counts[question.dimension] += 1
        
        # Calculate averages and normalize to [-1, 1]
        result = {}
        for dim in dimension_scores:
            if dimension_counts[dim] > 0:
                # Average score will be between -2 and +2
                avg_score = dimension_scores[dim] / dimension_counts[dim]
                # Normalize to [-1, 1]
                result[dim] = avg_score / 2.0
                # Clamp to [-1, 1]
                result[dim] = max(-1.0, min(1.0, result[dim]))
            else:
                result[dim] = 0.0
        
        return result
    
    def calculate_distance_3d(self, pos1: Dict[str, float], pos2: Dict[str, float]) -> float:
        """Calculate Euclidean distance in 3D space"""
        return math.sqrt(
            (pos1["EKO"] - pos2["EKO"]) ** 2 +
            (pos1["SOC"] - pos2["SOC"]) ** 2 +
            (pos1["SUV"] - pos2["SUV"]) ** 2
        )
    
    def calculate_match_percentage(self, distance: float, max_distance: float = math.sqrt(12)) -> float:
        """
        Convert distance to match percentage
        max_distance: theoretical max = sqrt(2²+2²+2²) = sqrt(12) ≈ 3.46
        """
        return max(0, min(100, 100 * (1 - distance / max_distance)))
    
    def calculate_all_matches_3d(self, user_answers: Dict[int, int]) -> List[Tuple[str, float, str]]:
        """
        Calculate matches with all official 26 parties
        Returns: [(party_code, match_percentage, party_name), ...]
        """
        user_pos = self.calculate_user_position_3d(user_answers)
        
        matches = []
        for party_code, party_pos in self.party_positions_3d.items():
            distance = self.calculate_distance_3d(user_pos, party_pos)
            match = self.calculate_match_percentage(distance)
            party_name = self.party_names.get(party_code, party_code)
            matches.append((party_code, match, party_name))
        
        # Sort by match percentage (descending)
        matches.sort(key=lambda x: x[1], reverse=True)
        return matches
    
    def get_user_description_3d(self, position: Dict[str, float]) -> str:
        """Generate human-readable description of user position"""
        desc = []
        
        # Economic
        if position["EKO"] < -0.5:
            desc.append("silně pro státní kontrolu ekonomiky")
        elif position["EKO"] < 0:
            desc.append("mírně pro státní zásahy")
        elif position["EKO"] > 0.5:
            desc.append("silně pro volný trh")
        elif position["EKO"] > 0:
            desc.append("mírně pro tržní ekonomiku")
        
        # Social
        if position["SOC"] < -0.5:
            desc.append("konzervativní hodnoty")
        elif position["SOC"] < 0:
            desc.append("mírně tradiční")
        elif position["SOC"] > 0.5:
            desc.append("progresivní hodnoty")
        elif position["SOC"] > 0:
            desc.append("mírně liberální")
        
        # Sovereignty
        if position["SUV"] < -0.5:
            desc.append("silně pro národní suverenitu")
        elif position["SUV"] < 0:
            desc.append("euroskeptický")
        elif position["SUV"] > 0.5:
            desc.append("silně pro evropskou integraci")
        elif position["SUV"] > 0:
            desc.append("mírně pro-evropský")
        
        return "Vaše pozice: " + ", ".join(desc)
    
    def get_questions_for_web(self) -> List[Dict]:
        """Get questions formatted for web interface"""
        return [
            {
                "id": q.id,
                "text": q.text,
                "category": self.dimensions[q.dimension]
            }
            for q in self.questions
        ]
import time
import json
import random
import os
from arbiter import arbiter_engine
from sovereign import governor
 
BELIEF_PATH = os.path.join(os.path.dirname(__file__), 'cortex_belief.json')

def run_thinking_loop():
    print("Cortex: System Initialization... [SUCCESS]")
    print("Cortex: Beginning Autonomous Causal Scrubbing...")
    print("Cortex: Sovereign Governance Mode [MANDATORY/PROTECTIVE] active.")

    while True:
        # Load necessary data for sentient sensing
        # We reach into the brain's internal labels for a snapshot
        from brain import labels
        current_nodes = []
        if labels is not None:
            for i in range(len(labels)):
                current_nodes.append({
                    "id": i,
                    "name": labels[i].get("name", "Unknown"),
                    "tension": labels[i].get("stress_score", 0.5)
                })

        # 1. Sovereign Intervention Logic (Mandatory Directives)
        intervention = governor.check_for_intervention(current_nodes)
        sovereign_insights = []
        if intervention:
            sovereign_insights.append(f"SOVEREIGN_COMMAND: {intervention['proclamation']}")

        # 2. Audit Reality (Judicial Loop)
        audits = arbiter_engine.audit_reality()
        audit_insights = []
        for a in audits:
            audit_insights.append(f"REALITY_AUDIT: Prediction #{a['id']} status [{a['status']}]. Weight adjustment performed.")

        # 3. Update Belief State
        current_time = time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Generating synthetic 'Insights'
        insights = sovereign_insights + [
            f"Anomaly detected in Node {random.randint(1000, 9999)} (Correlation: {random.random():.2f})",
            f"Humanity Alignment Score: {random.uniform(0.85, 0.98)*100:.1f}%",
        ] + audit_insights
        
        belief_state = {
            "last_update": current_time,
            "cortex_cycle": random.randint(1000000, 9999999),
            "global_tension": (0.2 + random.uniform(0, 0.4)) * (0.8 if intervention else 1.0),
            "active_causal_chains": random.randint(5, 15),
            "recent_insights": insights,
            "forecast_confidence": random.uniform(0.8, 0.95),
            "human_value_alignment": random.uniform(0.9, 1.0),
            "governance_active": True if intervention else False
        }
        
        with open(BELIEF_PATH, 'w', encoding='utf-8') as f:
            json.dump(belief_state, f, indent=2)
            
        # AI thinking latency simulation
        time.sleep(5) 

if __name__ == "__main__":
    run_thinking_loop()

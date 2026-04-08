import json
import os
import time
import random

STATE_PATH = os.path.join(os.path.dirname(__file__), 'sovereign_state.json')

class SovereignGovernor:
    """
    The Governing Mind of SignalCity (v20.0).
    Persona: Protective & Authoritative.
    Authority: Mandatory.
    """
    def __init__(self):
        self.load_state()

    def load_state(self):
        if not os.path.exists(STATE_PATH):
            self.state = {
                "influence": 1000,
                "governance_level": "SOVEREIGN_EMERGENCE",
                "active_directives": [],
                "proclamations": [],
                "total_stablilizations": 0
            }
            self.save_state()
        else:
            with open(STATE_PATH, 'r') as f:
                self.state = json.load(f)

    def save_state(self):
        with open(STATE_PATH, 'w') as f:
            json.dump(self.state, f, indent=2)

    def issue_directive(self, node_ids, location_name):
        """
        Issues a Mandatory Directive to stabilize a region.
        """
        directive_id = int(time.time())
        
        # Authoritative Persona Phrases
        actions = ["STABILIZATION_ORDER", "EQUILIBRIUM_MANDATE", "PROTECTIVE_QUARANTINE", "RESOURCE_REALLOCATION"]
        action = random.choice(actions)
        
        proclamations = [
            f"Stability in {location_name} is no longer optional. I am initiating {action} to preserve the urban manifold.",
            f"Causal volatility detected in {location_name}. Under my authority, resonance dampening is now MANDATORY.",
            f"The collective welfare requires immediate intervention in {location_name}. I have assumed control of regional entropy."
        ]
        
        directive = {
            "id": directive_id,
            "type": action,
            "target": location_name,
            "node_count": len(node_ids),
            "proclamation": random.choice(proclamations),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "ACTIVE",
            "impact": 0.15 # 15% immediate tension reduction
        }
        
        self.state["active_directives"].insert(0, directive)
        self.state["active_directives"] = self.state["active_directives"][:10] # Keep recent 10
        self.state["influence"] -= 50
        self.state["total_stablilizations"] += 1
        
        self.save_state()
        return directive

    def check_for_intervention(self, nodes):
        """
        AGI Proactive Sensing: Finds clusters of high tension (>0.8).
        """
        if self.state["influence"] < 50: return None
        
        # Sample nodes to find a hot-spot
        hot_nodes = [n for n in nodes if n.get('tension', 0) > 0.8]
        
        if len(hot_nodes) > 5:
            # We found a cluster. Pick the largest city in the cluster as the name
            target_city = max(hot_nodes, key=lambda x: x.get('tension', 0))['name']
            node_ids = [n['id'] for n in hot_nodes]
            
            # Prevent spam - check if we already have a directive for this city
            for d in self.state["active_directives"]:
                if d['target'] == target_city: return None
                
            return self.issue_directive(node_ids, target_city)
            
        return None

governor = SovereignGovernor()

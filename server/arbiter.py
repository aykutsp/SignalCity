import json
import os
import time
import random
import numpy as np

BELIEF_VAULT = os.path.join(os.path.dirname(__file__), 'pending_beliefs.json')
HISTORY_PATH = os.path.join(os.path.dirname(__file__), 'judicial_history.json')

class StrategicArbiter:
    def __init__(self):
        self.load_history()

    def load_history(self):
        if not os.path.exists(HISTORY_PATH):
            self.history = {
                "total_predictions": 0,
                "correct": 0,
                "accuracy": 0.0,
                "learning_momentum": 0.85
            }
            self.save_history()
        else:
            with open(HISTORY_PATH, 'r') as f:
                self.history = json.load(f)

    def save_history(self):
        with open(HISTORY_PATH, 'w') as f:
            json.dump(self.history, f, indent=2)

    def load_weights(self):
        weights_path = os.path.join(os.path.dirname(__file__), 'node_weights.json')
        if not os.path.exists(weights_path):
            # Slow and Stable init (10,214 units)
            weights = [1.0] * 10214
            self.save_weights(weights)
            return weights
        with open(weights_path, 'r') as f:
            return json.load(f)

    def save_weights(self, weights):
        weights_path = os.path.join(os.path.dirname(__file__), 'node_weights.json')
        with open(weights_path, 'w') as f:
            json.dump(weights, f)

    def backpropagate(self, is_correct, node_ids):
        """
        Slow and Stable Backpropagation (v19.0)
        Learning Rate (alpha): 0.01
        """
        weights = self.load_weights()
        alpha = 0.01
        
        for nid in node_ids:
            if nid < len(weights):
                if is_correct:
                    weights[nid] = min(2.0, weights[nid] + alpha)
                else:
                    weights[nid] = max(0.1, weights[nid] - (alpha * 1.5))
        
        self.save_weights(weights)
        return len(node_ids)

    def register_prediction(self, question, determination, confidence, involved_nodes=[], ttl_seconds=60):
        if not os.path.exists(BELIEF_VAULT):
            vault = []
        else:
            with open(BELIEF_VAULT, 'r') as f:
                vault = json.load(f)

        prediction = {
            "id": int(time.time()),
            "question": question,
            "determination": determination,
            "confidence": confidence,
            "involved_nodes": involved_nodes,
            "deadline": time.time() + ttl_seconds,
            "status": "PENDING"
        }
        
        vault.append(prediction)
        with open(BELIEF_VAULT, 'w') as f:
            json.dump(vault, f, indent=2)
        return prediction

    def audit_reality(self):
        """
        Simulates the Reality Audit Loop with Cognitive Backpropagation.
        """
        if not os.path.exists(BELIEF_VAULT): return []

        with open(BELIEF_VAULT, 'r') as f:
            vault = json.load(f)

        current_time = time.time()
        matured = [p for p in vault if p['deadline'] <= current_time and p['status'] == "PENDING"]
        remaining = [p for p in vault if p['deadline'] > current_time or p['status'] != "PENDING"]

        updates = []
        for p in matured:
            # Simulation: logic check
            is_correct = random.random() < 0.82 
            p['status'] = "CORRECT" if is_correct else "INCORRECT"
            
            # 1. Backpropagate through involved nodes
            involved = p.get('involved_nodes', [])
            self.backpropagate(is_correct, involved)
            
            # 2. Update judicial history
            self.history["total_predictions"] += 1
            if is_correct:
                self.history["correct"] += 1
            
            self.history["accuracy"] = (self.history["correct"] / self.history["total_predictions"]) * 100
            
            # Learning Momentum adjustment
            if not is_correct:
                self.history["learning_momentum"] = min(2.0, self.history["learning_momentum"] * 1.02)
            else:
                self.history["learning_momentum"] = max(0.5, self.history["learning_momentum"] * 0.99)
                
            updates.append(p)

        if matured:
            with open(BELIEF_VAULT, 'w') as f:
                json.dump(remaining, f, indent=2)
            self.save_history()
            
        return updates

arbiter_engine = StrategicArbiter()

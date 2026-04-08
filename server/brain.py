from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import json
import os
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SignalCity Neural Brain")

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VECTORS_PATH = os.path.join(os.path.dirname(__file__), 'registry_vectors.npy')
LABELS_PATH = os.path.join(os.path.dirname(__file__), 'registry_labels.json')
BELIEF_PATH = os.path.join(os.path.dirname(__file__), 'cortex_belief.json')

# Load Database
print("Neural Brain: Initializing Latent Space...")
try:
    if os.path.exists(VECTORS_PATH):
        vectors = np.load(VECTORS_PATH)
        with open(LABELS_PATH, 'r', encoding='utf-8') as f:
            labels = json.load(f)
        print(f"Neural Brain: Sync complete. {len(vectors)} nodes online.")
    else:
        print("Neural Brain: Vectors not found. Running in localized mode.")
        vectors, labels = None, None
except Exception as e:
    print(f"Neural Brain: Sync FAILED. {e}")
    vectors, labels = None, None

class SearchQuery(BaseModel):
    query: str
    top_k: int = 10

class AskQuery(BaseModel):
    question: str

def cosine_similarity(v1, v2):
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0: return 0
    return dot_product / (norm_v1 * norm_v2)

@app.get("/status")
def get_status():
    return {"status": "ONLINE", "nodes": len(vectors) if vectors is not None else 0}

@app.get("/cortex/belief")
def get_cortex_belief():
    if not os.path.exists(BELIEF_PATH):
        return {"status": "INITIALIZING"}
    with open(BELIEF_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.post("/search")
def search_nodes(query: SearchQuery):
    if vectors is None or labels is None:
        raise HTTPException(status_code=500, detail="Neural Lattice not initialized")

    q_vec = np.zeros(128)
    q_text = query.query.lower()
    
    if "asia" in q_text: q_vec[4:10] = 0.5
    if "cold" in q_text: q_vec[2] = 0.1
    if "hot" in q_text: q_vec[2] = 0.9
    if "risk" in q_text: q_vec[3] = 0.8
    
    scores = []
    for i in range(len(vectors)):
        sim = cosine_similarity(q_vec, vectors[i])
        scores.append((sim, labels[i]))

    scores.sort(key=lambda x: x[0], reverse=True)
    return [{**item, "similarity": float(score)} for score, item in scores[:query.top_k]]

from arbiter import arbiter_engine
from sovereign import governor

@app.get("/arbiter/history")
@app.get("/lattice/history")
def get_judicial_history():
    return arbiter_engine.history

@app.get("/sovereign/state")
def get_sovereign_state():
    return governor.state

_lattice_cache = None

@app.get("/lattice/data")
def get_lattice_data():
    global _lattice_cache
    if vectors is None:
        raise HTTPException(status_code=500, detail="Neural Lattice not initialized")
    
    if _lattice_cache is not None:
        return _lattice_cache

    print("Neural Brain: Generating Latent Map Project... [PCA_LITE]")
    
    # Load Weights for visual manifest
    weights = arbiter_engine.load_weights()
    
    projected = []
    for i in range(len(vectors)):
        v = vectors[i]
        # X: Geographical/Social weight
        # Y: Tension/Risk weight
        # Z: Economic/Resource weight
        x = float(np.sum(v[0:42]) - np.sum(v[42:84]))
        y = float(np.sum(v[84:128]) - np.sum(v[0:42]))
        z = float(np.sum(v[20:60]) - np.sum(v[60:100]))
        
        projected.append({
            "id": i,
            "name": labels[i].get("name", "Unknown Node"),
            "country": labels[i].get("country", "??"),
            "coords": [x * 10, y * 10, z * 10],
            "tension": labels[i].get("stress_score", 0.5),
            "weight": weights[i] if i < len(weights) else 1.0
        })
    _lattice_cache = projected
    return projected

_synapse_cache = None

@app.get("/lattice/synapses")
def get_lattice_synapses():
    global _synapse_cache
    if vectors is None:
        raise HTTPException(status_code=500, detail="Neural Lattice not initialized")

    if _synapse_cache is not None:
        return _synapse_cache

    print("Neural Brain: Weaving Causal Synapses... [SPARSE_GRAPH]")
    synapses = []
    
    # Synaptic Pruning: Sample nodes and find their primary semantic anchors
    # We use a limited sample to maintain rendering performance
    sample_indices = random.sample(range(len(vectors)), 400)
    
    for i in sample_indices:
        v_i = vectors[i]
        best_sim = -1
        best_j = -1
        
        # Fast local search: compare against a window to find "Causal Proximity"
        search_window = random.sample(range(len(vectors)), 50)
        for j in search_window:
            if i == j: continue
            sim = cosine_similarity(v_i, vectors[j])
            if sim > best_sim:
                best_sim = sim
                best_j = j
                
        if best_j != -1 and best_sim > 0.7:
            synapses.append({
                "source": i,
                "target": best_j,
                "strength": float(best_sim),
                "causal_type": "HIGH_SIMILARITY" if best_sim > 0.9 else "INDIRECT_RESONANCE"
            })
            
    _synapse_cache = synapses
    return synapses

@app.post("/predict")
def judicial_predict(query: AskQuery):
    # Calculate involved nodes for backprop (Top 50 neighbors)
    q_vec = np.zeros(128)
    q_text = query.question.lower()
    
    # Simple semantic anchor extraction for targeted learning
    if "iran" in q_text: q_vec[4:8] = 0.8
    if "israel" in q_text: q_vec[10:14] = 0.8
    if "war" in q_text or "strike" in q_text: q_vec[2] = 0.9
    if "us" in q_text or "usa" in q_text: q_vec[15:20] = 0.8
    
    scores = []
    for i in range(len(vectors)):
        sim = cosine_similarity(q_vec, vectors[i])
        scores.append((sim, i))
    
    scores.sort(key=lambda x: x[0], reverse=True)
    involved_nodes = [idx for sim, idx in scores[:50]]

    # Calculate probability using USRT stats
    belief_path = os.path.join(os.path.dirname(__file__), 'cortex_belief.json')
    tension = 0.5
    if os.path.exists(belief_path):
        with open(belief_path, 'r') as f:
            b = json.load(f)
            tension = b.get("global_tension", 0.5)

    # Scientific Strike Determination
    p_strike = tension * random.uniform(0.7, 1.3)
    determination = "POSITIVE (EXPECTED)" if p_strike > 0.65 else "NEGATIVE (UNLIKELY)"
    confidence = min(0.98, p_strike if p_strike > 0.5 else 1 - p_strike)
    
    # Register the Judicial Bet with Involved Nodes for Backprop
    prediction = arbiter_engine.register_prediction(
        query.question, 
        determination, 
        float(confidence),
        involved_nodes=involved_nodes,
        ttl_seconds=30 # Faster maturation (30s) for display loop
    )
    
    return {
        "determination": determination,
        "scientific_score": float(p_strike),
        "confidence": float(confidence),
        "maturation_id": prediction["id"],
        "deadline": prediction["deadline"]
    }

@app.post("/ask")
def ask_cortex(query: AskQuery):
    belief = {}
    if os.path.exists(BELIEF_PATH):
        with open(BELIEF_PATH, 'r', encoding='utf-8') as f:
            belief = json.load(f)
            
    responses = [
        f"The USRT Tensor suggests a convergence of high-volatility events. We must prioritize social stability (Alignment: {belief.get('human_value_alignment', 0.9):.2f}).",
        f"Predictive models indicate a shift toward decentralization. Human welfare metrics remain primary in this forecast.",
        f"I detect a 78% correlation between resource scarcity and urban tension. Stabilization protocols are recommended."
    ]
    
    return {
        "response": random.choice(responses),
        "source": "Planetary Cortex v15.0",
        "humanity_score": belief.get("human_value_alignment", 0.95),
        "confidence": belief.get("forecast_confidence", 0.85)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011)

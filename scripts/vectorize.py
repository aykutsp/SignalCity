import json
import numpy as np
import os

def vectorize_registry():
    registry_path = os.path.join('src', 'lib', 'sdk', 'registry.json')
    output_path = os.path.join('server', 'registry_vectors.npy')
    labels_path = os.path.join('server', 'registry_labels.json')

    if not os.path.exists('server'):
        os.makedirs('server')

    print(f"Loading registry from {registry_path}...")
    with open(registry_path, 'r', encoding='utf-8') as f:
        registry = json.load(f)

    # We will compress the registry to top 10,214 for semantic searching
    # Vectors will include normalized [lat, lon, tempMedian, risk_bias]
    # In a real scenario, we'd use an LLM for embeddings, 
    # but here we build a statistical semantic space.
    
    vectors = []
    labels = []

    for item in registry[:10214]:
        # Normalize Geo
        lat = (item['lat'] + 90) / 180
        lon = (item['lon'] + 180) / 360
        temp = (item.get('tempMedian', 15) + 50) / 100
        
        # Risk bias (derived from name hash / country for consistency)
        risk_bias = (hash(item['name']) % 100) / 100
        
        # Create a 128-d pseudo-embedding by expanding the core stats
        # This creates a "Statistical Vibe" vector
        base = np.array([lat, lon, temp, risk_bias] + [0.0] * 124)
        # Add some country-specific noise to cluster regions semantically
        base[4:10] = [(ord(c) % 256) / 256 for c in (item['country'] * 3)[:6]]
        
        vectors.append(base)
        labels.append({
            "name": item['name'],
            "country": item['country'],
            "lat": item['lat'],
            "lon": item['lon']
        })

    vectors = np.array(vectors).astype('float32')
    
    print(f"Saving {len(vectors)} vectors to {output_path}...")
    np.save(output_path, vectors)
    
    with open(labels_path, 'w', encoding='utf-8') as f:
        json.dump(labels, f)

    print("Vectorization complete.")

if __name__ == "__main__":
    vectorize_registry()

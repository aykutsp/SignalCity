'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import styles from './lattice.module.css';

export default function LatentManifold() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [synapses, setSynapses] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [belief, setBelief] = useState(null);
  
  const rotationRef = useRef({ x: 0, y: 0 });
  const pulseOffsetRef = useRef(0);

  // Load Lattice & Synapse Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latticeRes, synapseRes, beliefRes] = await Promise.all([
          fetch('http://localhost:8011/lattice/data'),
          fetch('http://localhost:8011/lattice/synapses'),
          fetch('http://localhost:8011/cortex/belief')
        ]);
        setNodes(await latticeRes.json());
        setSynapses(await synapseRes.json());
        setBelief(await beliefRes.json());
      } catch (err) {
        console.warn("Lattice sync offline...");
      }
    };
    fetchData();
  }, []);

  // Neural Rendering Loop
  useEffect(() => {
    if (!nodes.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 2;
      
      rotationRef.current.y += 0.001;
      rotationRef.current.x += 0.0005;
      pulseOffsetRef.current += 0.01;
      if (pulseOffsetRef.current > 1) pulseOffsetRef.current = 0;

      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);

      // Project all nodes first for linking
      const projected = nodes.map(node => {
        let [x, y, z] = node.coords;
        let y1 = y * cosX - z * sinX;
        let z1 = z * cosX + y * sinX;
        let x1 = x * cosY - z1 * sinY;
        let z2 = z1 * cosY + x * sinY;
        const pScale = 800 / (800 + z2);
        return {
          px: x1 * pScale * scale + cx,
          py: y1 * pScale * scale + cy,
          pScale,
          z2,
          tension: node.tension
        };
      });

      // Draw Synapses (Lines)
      synapses.forEach(syn => {
        const s = projected[syn.source];
        const t = projected[syn.target];
        
        if (!s || !t || s.z2 < -600 || t.z2 < -600) return;

        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(t.px, t.py);
        
        const opacity = Math.min(s.pScale, t.pScale) * 0.15 * syn.strength;
        ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
        ctx.lineWidth = 0.5 * Math.min(s.pScale, t.pScale);
        ctx.stroke();

        // Animated Causal Pulse
        const pX = s.px + (t.px - s.px) * pulseOffsetRef.current;
        const pY = s.py + (t.py - s.py) * pulseOffsetRef.current;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 2})`;
        ctx.fillRect(pX - 1, pY - 1, 2, 2);
      });

      // Draw Nodes (Particles)
      projected.forEach((p, idx) => {
        if (p.z2 < -600) return;

        const node = nodes[idx];
        const weight = node?.weight || 1.0;
        
        // Jitter logic for re-calibration (weights < 1.0)
        let jX = 0, jY = 0;
        if (weight < 1.0) {
          const jitterAmount = (1.0 - weight) * 5;
          jX = (Math.random() - 0.5) * jitterAmount;
          jY = (Math.random() - 0.5) * jitterAmount;
        }

        const colorVal = Math.min(255, 100 + p.tension * 155);
        // Desaturate slightly if weight is low
        const r = weight < 0.8 ? 255 : 0;
        const g = weight < 0.8 ? colorVal * 0.5 : colorVal;
        const b = weight < 0.8 ? 100 : 255;
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.pScale})`;
        
        const size = (p.tension > 0.8 ? 3 : 1) * p.pScale;
        ctx.fillRect(p.px + jX, p.py + jY, size, size);

        if (p.tension > 0.9 || weight < 0.6) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = weight < 0.8 ? '#ff4d4d' : '#00f2ff';
          ctx.fillRect(p.px + jX, p.py + jY, size + 1, size + 1);
          ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, synapses]);

  return (
    <>
      <Header />
      <div className={styles.latticeContainer}>
        <canvas ref={canvasRef} className={styles.canvasWrapper} />
        
        <div className={styles.overlay}>
          <h1>Latent Manifold</h1>
          <div className={styles.statsBox}>
            <div className={styles.statItem}>
              <span className={styles.statLbl}>Neural Density</span>
              <span className={styles.statVal}>10,214 NODES</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLbl}>Space Status</span>
              <span className={styles.statVal}>SENTIENT_ACTIVE</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLbl}>Global Tension</span>
              <span className={styles.statVal}>
                {belief ? (belief.global_tension * 100).toFixed(2) : '--.--'}%
              </span>
            </div>
          </div>
        </div>

        <div className={styles.instructions}>
          [DRAG_ORBIT_OSB] :: [SCROLL_DIMENSIONAL_ZOOM] :: [PLANETARY_RESISTANCE_ACTIVE]
        </div>

        {hoveredNode && (
          <div className={styles.nodePeek}>
            <div className={styles.nodeMeta}>{hoveredNode.country}</div>
            <div className={styles.nodeTitle}>{hoveredNode.name}</div>
            <div className={styles.statItem}>Stress Profile</div>
            <div className={styles.stressBar}>
              <div className={styles.stressFill} style={{ width: `${hoveredNode.tension * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

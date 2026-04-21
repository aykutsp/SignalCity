/**
 * SignalCity Planetary Hum Engine (v10.0)
 * Generates a procedural, real-time audio soundscape driven by global planetary stress.
 * World-first implementation of 'Planetary Sonification'.
 */

class PlanetaryHum {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.resonanceNode = null;
    this.isActive = false;
  }

  init() {
    if (this.audioCtx) return;
    
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Low frequency drone oscillator
    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.type = 'sine';
    
    // Gain for volume control (very subtle)
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime); 
    
    // Lowpass filter for 'planetary density'
    this.resonanceNode = this.audioCtx.createBiquadFilter();
    this.resonanceNode.type = 'lowpass';
    this.resonanceNode.frequency.setValueAtTime(200, this.audioCtx.currentTime);
    
    this.oscillator.connect(this.resonanceNode);
    this.resonanceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    
    this.oscillator.start();
  }

  /**
   * Adjusts the hum based on the current planetary heartbeat (0-100)
   */
  update(pulse) {
    if (!this.audioCtx || !this.isActive) return;

    const baseFreq = 40 + (pulse * 0.4); // 40Hz to 80Hz drone
    const filterFreq = 100 + (pulse * 5); // Brighter sound as stress increases
    const volume = 0.02 + (pulse * 0.0005); // Very subtle volume shift

    this.oscillator.frequency.setTargetAtTime(baseFreq, this.audioCtx.currentTime, 0.5);
    this.resonanceNode.frequency.setTargetAtTime(filterFreq, this.audioCtx.currentTime, 0.5);
    this.gainNode.gain.setTargetAtTime(volume, this.audioCtx.currentTime, 0.2);
  }

  start() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isActive = true;
    this.gainNode.gain.setTargetAtTime(0.04, this.audioCtx.currentTime, 1);
  }

  stop() {
    if (!this.gainNode) return;
    this.isActive = false;
    this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 1);
  }
}

// Singleton instance
const globalHum = typeof window !== 'undefined' ? new PlanetaryHum() : null;
export default globalHum;

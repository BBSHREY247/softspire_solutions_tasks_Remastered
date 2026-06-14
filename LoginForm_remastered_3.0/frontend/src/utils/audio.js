// Web Audio API synthesizer for massive, heavy anime-style sound effects
class SoundSynth {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    // Play a dramatic anime whoosh sound (moving wind filter on white noise + rumble)
    playWhoosh() {
        try {
            this.init();
            const audioCtx = this.ctx;
            const now = audioCtx.currentTime;

            // Generate white noise buffer
            const bufferSize = audioCtx.sampleRate * 2.0; // 2 seconds
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = buffer;

            // Lowpass/Bandpass sweeps to create wind whoosh effect
            const filter = audioCtx.createBiquadFilter();
            filter.type = "bandpass";
            filter.Q.value = 5.0; // High resonance
            filter.frequency.setValueAtTime(60, now);
            filter.frequency.exponentialRampToValueAtTime(2200, now + 1.2);
            filter.frequency.exponentialRampToValueAtTime(300, now + 2.0);

            // Sub-rumble oscillator for power
            const rumble = audioCtx.createOscillator();
            const rumbleGain = audioCtx.createGain();
            rumble.type = "sine";
            rumble.frequency.setValueAtTime(45, now);
            rumble.frequency.exponentialRampToValueAtTime(120, now + 1.2);
            
            rumbleGain.gain.setValueAtTime(0.001, now);
            rumbleGain.gain.linearRampToValueAtTime(0.7, now + 1.0);
            rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            // Envelope for noise
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.6, now + 1.0); // Peak
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

            noiseSource.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            rumble.connect(rumbleGain);
            rumbleGain.connect(audioCtx.destination);

            noiseSource.start(now);
            rumble.start(now);

            noiseSource.stop(now + 2.0);
            rumble.stop(now + 2.0);
        } catch (e) {
            console.error("Audio Synthesis Error: ", e);
        }
    }

    // Play a massive destructive punch impact + metallic/glass shatter sound
    playImpact() {
        try {
            this.init();
            const audioCtx = this.ctx;
            const now = audioCtx.currentTime;

            // 1. MASSIVE SUB-BASS BOOM (The Punch Impact)
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = "sine";
            subOsc.frequency.setValueAtTime(150, now);
            subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.6); // Deep bass drop

            subGain.gain.setValueAtTime(2.2, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

            subOsc.connect(subGain);
            subGain.connect(audioCtx.destination);
            subOsc.start(now);
            subOsc.stop(now + 0.9);

            // 2. MID-FREQUENCY CRUNCH (Flesh & Wall destruction)
            const crunchOsc = audioCtx.createOscillator();
            const crunchGain = audioCtx.createGain();
            crunchOsc.type = "sawtooth";
            crunchOsc.frequency.setValueAtTime(220, now);
            crunchOsc.frequency.linearRampToValueAtTime(80, now + 0.35);

            crunchGain.gain.setValueAtTime(0.9, now);
            crunchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            crunchOsc.connect(crunchGain);
            crunchGain.connect(audioCtx.destination);
            crunchOsc.start(now);
            crunchOsc.stop(now + 0.45);

            // 3. LOUD DESTRUCTIVE GLASS SHATTER (Irregular high-frequency cracks)
            const shardFrequencies = [980, 1420, 2400, 3900, 5200, 7500];
            shardFrequencies.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(freq, now);
                
                // Add minor pitch modulation for glass tension cracking
                osc.frequency.linearRampToValueAtTime(freq * 0.75, now + 0.3 + (index * 0.05));

                // Add random delay to each shard crack so it's a realistic shatter roll
                const startDelay = index * 0.02;
                const decayDuration = 0.4 + (index * 0.1);

                gainNode.gain.setValueAtTime(0.001, now);
                gainNode.gain.linearRampToValueAtTime(0.4, now + startDelay + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + startDelay + decayDuration);

                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start(now + startDelay);
                osc.stop(now + startDelay + decayDuration + 0.1);
            });

            // 4. CRACKING SURFACE WHITE NOISE BURST
            const bufferSize = audioCtx.sampleRate * 1.5;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = buffer;

            const highpass = audioCtx.createBiquadFilter();
            highpass.type = "highpass";
            highpass.frequency.setValueAtTime(1500, now);

            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(1.1, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            noiseSource.connect(highpass);
            highpass.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);

            noiseSource.start(now);
            noiseSource.stop(now + 1.3);

        } catch (e) {
            console.error("Audio Synthesis Error: ", e);
        }
    }
}

export const synth = new SoundSynth();
export default SoundSynth;

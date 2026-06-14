// Web Audio API synthesizer for whoosh and loader for custom mp3 sound effects
class SoundSynth {
    constructor() {
        this.ctx = null;
        this.audio = null;
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

    // Play synthesized whoosh sound at login click
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

    // Play the user's custom sound_effect.mp3
    playImpact() {
        try {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }
            this.audio = new Audio("/sound_effect.mp3");
            this.audio.volume = 1.0;
            this.audio.play();
        } catch (e) {
            console.error("Error playing sound_effect.mp3:", e);
        }
    }

    // Stop all sound playback
    stopAll() {
        try {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }
        } catch (e) {
            console.error("Error stopping sound:", e);
        }
    }
}

export const synth = new SoundSynth();
export default SoundSynth;

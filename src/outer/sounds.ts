/** Tiny synthesized sound kit (no audio files): POST beep, mouse/keyboard clicks, office room tone. */
class Sounds {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: AudioBufferSourceNode | null = null;
  muted = false;

  private ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private noiseBuffer(seconds: number, brown = false) {
    const ctx = this.ensure();
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      } else d[i] = w;
    }
    return buf;
  }

  private click(freq: number, gain: number, dur = 0.03) {
    if (this.muted) return;
    const ctx = this.ensure();
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(dur);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq * (0.9 + Math.random() * 0.2);
    bp.Q.value = 2.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp).connect(g).connect(this.master!);
    src.start();
  }

  mouseDown = () => this.click(2600, 0.35, 0.025);
  mouseUp = () => this.click(3200, 0.22, 0.02);
  key = () => this.click(1500 + Math.random() * 900, 0.3, 0.045);

  startup() {
    if (this.muted) return;
    const ctx = this.ensure();
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = 880;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.setValueAtTime(0, ctx.currentTime + 0.18);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + 0.2);
    this.startAmbience();
  }

  private startAmbience() {
    if (this.ambience) return;
    const ctx = this.ensure();
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(6, true);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    src.connect(lp).connect(g).connect(this.master!);
    src.start();
    this.ambience = src;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.05);
  }
}

export const sounds = new Sounds();

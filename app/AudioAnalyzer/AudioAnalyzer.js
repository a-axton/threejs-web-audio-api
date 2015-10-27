import _ from 'lodash';

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);
let analyser = audioCtx.createAnalyser();
let beatCutOff = 0;
let beatTime = 0;
let msecsAvg = 640;
let bpmTime = 0;
let ratedBPMTime = 550;
let bpmStart = Date.now();

export default class SoundAnalyzer {
  constructor(opts = {}) {
    // init options
    this.beatHoldTime = opts.beatHoldTime || 45;
    this.beatDecayRate = opts.beatDecayRate || .9;
    this.beatMin = opts.beatMin || .2;
    this.volSens = opts.volSens || 1;
    this.levelsCount = opts.levelsCount || 16;

    // private
    this.source = null;
    this.requestAnimationFrame = null;
  }

  readStream(stream) {
    // populates raw sound data arrays
    analyser.getByteFrequencyData(this.freqByteData);
    analyser.getByteTimeDomainData(this.timeByteData);
    analyser.getFloatTimeDomainData(this.dataArray);

    this.waveform = this.getNormalizedWaveform();
    this.levels = this.getNormalizedLevels();
    this.volume = this.getAverageVolumeLevel();
    this.beat = this.getBeatTime();
    
    if (this.callback) {
      this.callback({
        waveform: this.waveform,
        levels: this.levels,
        volume: this.volume,
        isBeat: this.beat.isBeat,
        beatCutOff: this.beat.beatCutOff
      });
    }
  }

  getBeatTime() {
    if (this.volume > beatCutOff && this.volume > this.beatMin) {
      beatCutOff = this.volume * 1.1;
      beatTime = 0;
    } else {
      if (beatTime <= this.beatHoldTime) {
        beatTime++;
      } else {
        beatCutOff *= this.beatDecayRate;
        beatCutOff = Math.max(beatCutOff, this.beatMin);
      }
    }

    bpmTime = (Date.now() - bpmStart) / msecsAvg;

    return {
      isBeat: beatTime < 6,
      beatCutOff: beatCutOff
    };
  }

  getNormalizedWaveform() {
    return _.times(this.bufferLength, (i) => {
      return ((this.timeByteData[i] - 128) / 128) * this.volSens;
    });
  }

  getNormalizedLevels() {
    let bufferLength = this.bufferLength;
    let levelBins = Math.floor(bufferLength / this.levelsCount);
    return _.times(this.levelsCount, (i) => {
      let sum = 0;
      _.times(levelBins, (j) => {
        sum += this.freqByteData[(i * levelBins) + j];
      });
      return sum / levelBins / 256 * this.volSens;
    });
  }

  getAverageVolumeLevel() {
    let sum = 0;
    _.times(this.levelsCount, (i) => {
      sum += this.levels[i];
    });
    return sum / this.levelsCount;
  }

  start(callback) {
    navigator.getUserMedia(
      {audio: true},
      (stream) => {
        let self = this;
        this.callback = callback;

        // web audio api stuff
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;

        // raw data
        this.bufferLength = analyser.frequencyBinCount;
        this.timeByteData = new Uint8Array(this.bufferLength);
        this.freqByteData = new Uint8Array(this.bufferLength);
        this.dataArray = new Float32Array(analyser.fftSize);

        // start beat detection baseline
        bpmStart = Date.now();

        // create audio source
        this.source = audioCtx.createMediaStreamSource(stream);
        this.source.connect(analyser);

        // requestAnimationFrame loop
        function read() {
          self.requestAnimationFrame = requestAnimationFrame(read);
          self.readStream(stream);
        }
        read();
      },
      (err) => {
        console.log('The following error occured: ' + err);
      }
    );
  }

  stop() {
    window.cancelAnimationFrame(this.requestAnimationFrame);
  }
}

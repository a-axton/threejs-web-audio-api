import _ from 'lodash';

let averageBarWidth = 30;
let debugSpacing = 2;

export default class Debug {
  constructor(opts = {}) {
    this.opts = {
      canvasId: opts.canvasId || 'debug-canvas',
      width: opts.width || 240,
      height: opts.height || 140
    };
    this.init();
  }

  init() {
    let canvas = document.getElementById(this.opts.canvasId);
    let debugCtx = canvas.getContext('2d');
    let gradient = debugCtx.createLinearGradient(0, 0, 0, 256);

    debugCtx.width = this.width;
    debugCtx.height = this.height;
    debugCtx.fillStyle = 'rgb(40, 40, 40)';
    debugCtx.lineWidth = 2;
    debugCtx.strokeStyle = 'rgb(255, 255, 255)';

    gradient.addColorStop(1, '#330000');
    gradient.addColorStop(0.75, '#aa0000');
    gradient.addColorStop(0.25, '#aaaa00');
    gradient.addColorStop(0, '#aaaaaa');

    this.debugCtx = debugCtx;
    this.gradient = gradient;
  }

  draw(soundData) {
    let {width, height} = this.opts;
    let {debugCtx, gradient} = this;
    let {levels, waveform, beatCutOff, isBeat, volume} = soundData;
    let bpmHeight = height - chartHeight;
    let chartHeight = height;
    let chartWidth = width - 40;

    debugCtx.clearRect(0, 0, width, height);
    
    // background
    debugCtx.fillStyle = '#000';
    debugCtx.fillRect(0, 0, width, height);

    // levels bar chart
    let barWidth = chartWidth / levels.length;
    debugCtx.fillStyle = gradient;
    _.times(levels.length, (i) => {
      debugCtx.fillRect(i * barWidth, chartHeight, barWidth - debugSpacing, levels[i] * chartHeight * -1);
    });

    // volume level + beat
    if (isBeat){
      debugCtx.fillStyle = '#ffffff';
    }
    debugCtx.fillRect(chartWidth, chartHeight, averageBarWidth, volume * chartHeight *-1);

    // beat cut off
    debugCtx.beginPath();
    debugCtx.moveTo(chartWidth , chartHeight - beatCutOff * chartHeight);
    debugCtx.lineTo(chartWidth + averageBarWidth, chartHeight - beatCutOff * chartHeight);
    debugCtx.stroke();

    // waveform
    debugCtx.beginPath();
    _.times(waveform.length, (i) => {
      debugCtx.lineTo(i / waveform.length * chartWidth, waveform[i] * chartHeight / 2 + chartHeight / 2);
    });
    debugCtx.stroke();

    // DRAW BPM
    // var bpmMaxSize = bpmHeight;
    // var size = bpmMaxSize - bpmTime * bpmMaxSize;
    // debugCtx.fillStyle="#020";
    // debugCtx.fillRect(0,chartHeight, bpmMaxSize, bpmMaxSize);
    // debugCtx.fillStyle="#0F0";
    // debugCtx.fillRect((bpmMaxSize - size)/2,chartHeight + (bpmMaxSize - size)/2, size, size);
  }
}

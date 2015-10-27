import dat from 'dat-gui';

export default function(audioAnalyzer) {
  let gui = new dat.GUI();
  let guiDom = gui.domElement.querySelectorAll('ul')[0];
  // add extra row for canvas element
  gui.add(audioAnalyzer, 'volSens', 0, 5);
  gui.add(audioAnalyzer, 'volSens', 0, 5);
  gui.add(audioAnalyzer, 'beatHoldTime', 0, 100);
  gui.add(audioAnalyzer, 'beatDecayRate', 0.9, 1);
  gui.add(audioAnalyzer, 'beatMin', 0, 1);
  // add debugger canvas to gui
  guiDom.firstChild.replaceChild(document.getElementById('debug-canvas'), guiDom.firstChild.firstChild)
  guiDom.firstChild.setAttribute('style', 'height: auto;');
}

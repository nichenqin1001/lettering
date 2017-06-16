const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

// define cancelAnimationFrame function
const cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

const x = p => { throw new Error(`Missing Parameter: ${p}`) }

class Lettering {
  constructor(el = x`el`, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;

    this.string = this.el.textContent;
  }
}

export default Lettering;
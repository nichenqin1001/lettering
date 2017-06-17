const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

// define cancelAnimationFrame function
const cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

const x = p => { throw new Error(`Missing Parameter: ${p}`); };

const defaultOptions = {
  fps: 3
};

const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

class Lettering {
  /**
   * Creates an instance of Lettering.
   * @param {HTMLElement} el 
   * @param {object} options 
   * 
   * @memberof Lettering
   */
  constructor(el = x`el`, options = {}) {
    // init type element
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // init options
    this.options = Object.assign({}, defaultOptions, options);

    this.string = this.el.textContent;

    this.stringArrLike = Array.prototype.slice.call(this.string);

    this.stringIndex = 0;

    this.lastTime = null;

    this._animate = this._animate.bind(this);

    this._init();
  }

  _init() {
    removeChild(this.el);
    this.print();
  }

  _printChar(num) {
    this.el.appendChild(document.createTextNode(this.stringArrLike[num]));
    this.stringIndex++;
  }

  _removeChar() {

  }

  _animate() {
    const now = Date.now();
    const delta = now - this.lastTime;

    // the 1000 here presents 1000ms;
    if (delta > 1000 / this.options.fps) {
      this._printChar(this.stringIndex);
      this.lastTime = now;
    }


    if (this.stringIndex < this.stringArrLike.length) return this.requestId = rAF(this._animate);
  }

  print() {
    this.lastTime = Date.now();

    this._animate();
  }

  remove() {

  }

}

export default Lettering;
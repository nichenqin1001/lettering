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
  fps: 10
};

class Lettering {
  /**
   * Creates an instance of Lettering.
   * @param {HTMLElement} el required
   * @param {object} options configs
   * 
   * @memberof Lettering
   */
  constructor(el = x`el`, options = {}) {
    // init type element
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!!this.el.children.length) console.warn('lettering:', 'HTMLCollection in the element will be ignored, only text inside will remain');
    // init options
    this.options = Object.assign({}, defaultOptions, options);
    // string inside the element
    this.string = this.el.innerText;

    let _index;
    Object.defineProperties(this, {
      // cause using String.substring function
      'maxStringIndex': { value: this.string.length + 1 },
      'stringIndex': {
        get() { return _index; },
        set(value) {
          if (value < 0) value = 0;
          if (value > this.maxStringIndex) value = this.maxStringIndex;
          _index = value;
        }
      }
    });

    this.stringIndex = 1;
    // time stamp used to control frame speed, set to null initialize
    this.lastTime = null;
    this.isAnitmating = false;

    this._init();
  }

  _init() {
    // this.typing();
  }

  _printChar() {
    this.el.textContent = this.string.substring(0, this.stringIndex);
    this.stringIndex++;
  }

  _removeChar() {

  }

  _animate() {
    const now = Date.now();
    const delta = now - this.lastTime;
    // the 1000 here means 1000ms;
    const shouldAnimate = delta > 1000 / this.options.fps;
    if (shouldAnimate) {
      // print char into document
      this._printChar();
      // update timestamp
      this.lastTime = now;
    }
    if (this.stringIndex === this.maxStringIndex) return this.stop();
    if (this.isAnitmating) return this.requestId = rAF(this._animate.bind(this));
  }

  typing() {
    this.isAnitmating = true;
    this.lastTime = Date.now();

    this._animate();
  }

  backspace() {
    this.isAnitmating = true;
    this.lastTime = Date.now();

    this._animate();
  }

  stop() {
    cAF(this.requestId);
    this.isAnitmating = false;
  }

}

export default Lettering;
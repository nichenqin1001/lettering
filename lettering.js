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

const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
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
    // init options
    this.options = Object.assign({}, defaultOptions, options);
    // string inside the element
    this.string = this.el.textContent;

    let _index;
    Object.defineProperties(this, {
      'maxStringIndex': { value: this.string.length },
      'stringIndex': {
        get() { return _index; },
        set(value) {
          if (value < 1) value = 1;
          if (value >= this.maxStringIndex) value = this.maxStringIndex;
          _index = value;
        }
      }
    });

    this.stringIndex = 1;
    // time stamp used to control frame speed, set to null initialize
    this.lastTime = null;

    this._init();
  }

  _init() {
    removeChild(this.el);
    this.print();
  }

  _printChar(num) {
    // this.el.appendChild(document.createTextNode(this.stringArrLike[num]));
    this.el.textContent = this.string.substring(0, num);
    this.stringIndex++;
  }

  _removeChar() {

  }

  _animate() {
    const now = Date.now();
    const delta = now - this.lastTime;

    // the 1000 here presents 1000ms;
    if (delta > 1000 / this.options.fps) {
      // print char into document
      this._printChar(this.stringIndex);
      // update timestamp
      this.lastTime = now;
    }

    if (this.stringIndex <= this.string.length) return this.requestId = rAF(this._animate.bind(this));
  }

  print() {
    this.lastTime = Date.now();

    this._animate();
  }

  remove() {

  }

}

export default Lettering;
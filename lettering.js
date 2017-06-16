const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

// define cancelAnimationFrame function
const cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

const x = p => { throw new Error(`Missing Parameter: ${p}`) }

const defaultOptions = {
  speed: 150
}

const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

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
    this.options = Object.assign({}, defaultOptions, options)

    this.string = this.el.textContent;

    this.stringArrLike = Array.prototype.slice.call(this.string);

    this.stringIndex = 0;

    this.print = this.print.bind(this);

    this._init();
  }

  _init() {
    removeChild(this.el);

    this.print();
  }

  _renderText(num) {
    this.el.appendChild(document.createTextNode(this.stringArrLike[num]));
  }

  print() {
    this._renderText(this.stringIndex);

    this.stringIndex++;

    if (this.stringIndex < this.stringArrLike.length) return this.requestId = rAF(this.print);
  }

  back() {

  }

}

export default Lettering;
const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

// define cancelAnimationFrame function
const cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

const x = p => { throw new Error(`Missing Parameter: ${p}`); };

const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

const defaultOptions = {
  fps: 10,
  autoStart: true,
  caretShow: true
};

class Lettering {
  /**
   * Creates an instance of Lettering.
   * @param {HTMLElement} el required
   * @param {object} options configs
   * 
   * @memberof Lettering
   */
  constructor(el = x`el`, options = defaultOptions) {
    // init type element
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!!this.el.children.length) console.warn('lettering:', 'HTMLCollection in the element will be ignored, only text inside will remain');
    // init options
    this.options = Object.assign({}, defaultOptions, options);
    // string inside the element
    this.string = this.el.innerText;

    let _index;
    Object.defineProperties(this, {
      'outputElement': { value: document.createElement('span') },
      'outputText': { value: document.createElement('span') },
      'outputCaret': { value: document.createElement('span') },
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
    this.requestId = null;
    this.isAnitmating = false;
    this.isBackspace = false;
    // todo: calculate caretShow with options
    this.caretShow = false;

    this._init();
  }

  _init() {
    removeChild(this.el);
    this.outputElement.appendChild(this.outputText);
    this.outputElement.appendChild(this.outputCaret);
    this.el.appendChild(this.outputElement);
    this._cssOutputElement();
    this.options.autoStart && this.typing();
  }

  _cssOutputElement() {
    this.outputElement.style.position = 'relative';
    this.outputElement.style.display =
      this.outputText.style.display =
      this.outputCaret.style.display = 'inline-block';
    this.outputCaret.style.position = 'absolute';
    this.outputCaret.style.top = 0;
    this.outputCaret.style.bottom = 0;
    this.outputCaret.style.right = '-5px';
    this.outputCaret.style.width = '5px';
    this.outputCaret.style.backgroundColor = 'inherit';
  }

  _printChar() {
    this.outputText.textContent = this.string.substring(0, this.stringIndex);
    this.stringIndex++;
  }

  _removeChar() {
    this.outputText.textContent = this.string.substring(0, this.stringIndex - 1);
    this.stringIndex--;
  }

  _animate() {
    // create new time stamp
    const now = Date.now();
    // calculate time delta
    const delta = now - this.lastTime;
    // the 1000 here means 1000ms;
    const shouldAnimate = delta > 1000 / this.options.fps;
    // main animation here
    if (shouldAnimate) {
      // print char into document
      this.isBackspace ? this._removeChar() : this._printChar();
      // update timestamp to calculate delta again in next animation loop
      this.lastTime = now;
    }
    if (this.stringIndex === this.maxStringIndex || this.stringIndex === 0) return this.stop();
    if (this.isAnitmating) return this.requestId = rAF(this._animate.bind(this));
  }

  typing() {
    this.isBackspace = false;
    this.isAnitmating = true;
    this.lastTime = Date.now();

    this._animate();
  }

  backspace() {
    this.isBackspace = true;
    this.isAnitmating = true;
    this.lastTime = Date.now();

    this._animate();
  }

  stop() {
    cAF(this.requestId);
    this.isAnitmating = false;
    this.isBackspace ? this.stringIndex++ : this.stringIndex--;
  }

}

export default Lettering;
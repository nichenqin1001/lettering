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
    this.mainColor = window.getComputedStyle(this.el).getPropertyValue('color');
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
    this.isBackspace = false;
    this.isAnitmating = false;
    // time stamp used to control frame speed, set to null initialize
    this.lastTime = null;
    this.requestId = null;

    this._init();
  }

  _init() {
    removeChild(this.el);
    this.el.appendChild(this.outputElement);
    this.outputElement.appendChild(this.outputText);
    if (this.options.caretShow) {
      this.outputElement.appendChild(this.outputCaret);
      this._blink();
    }
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
    this.outputCaret.style.width = '3px';
    this.outputCaret.style.backgroundColor = this.options.caretColor || this.mainColor;
    this.outputCaret.style.opacity = 1;
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
    this.isAnitmating = true;
    // create new time stamp
    const now = Date.now();
    // calculate time delta
    const delta = now - this.lastTime;
    // the 1000 here means 1000ms;
    const shouldAnimate = delta > 1000 / this.options.fps;
    // main animation here
    if (shouldAnimate) {
      // the caret always show when you are typing, right?
      this.outputCaret.style.opacity = 1;
      // print char into document
      this.isBackspace ? this._removeChar() : this._printChar();
      // update timestamp to calculate delta again in next animation loop
      this.lastTime = now;
    }
    if (this.stringIndex === this.maxStringIndex || this.stringIndex === 0) return this.stop();
    if (this.isAnitmating) return this.requestId = rAF(this._animate.bind(this));
  }

  _blink() {
    let lastTime = Date.now();

    const _blinkAnimate = () => {
      const now = Date.now();
      const delta = now - lastTime;

      if (delta > 1000 / 2) {
        this.outputCaret.style.opacity--;
        console.log(this.outputCaret.style.opacity);
        if (this.outputCaret.style.opacity < 0) this.outputCaret.style.opacity = 1;
        lastTime = now;
      }

      rAF(_blinkAnimate.bind(this));
    };

    _blinkAnimate();

  }


  typing() {
    this.isAnitmating = true;
    this.isBackspace = false;
    this.lastTime = Date.now();

    this._animate();
  }

  backspace() {
    this.isAnitmating = true;
    this.isBackspace = true;
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
import EventEmitter from './eventEmitter';
import { rAF, cAF, x, removeChild } from './utils';

const defaultOptions = {
  fps: 15,
  autoStart: true,
  caretShow: true
};

/**
 * 
 * 
 * @class Lettering
 * @extends {EventEmitter}
 */
class Lettering extends EventEmitter {
  /**
   * Creates an instance of Lettering.
   * @param {HTMLElement} el required
   * @param {object} options configs
   * 
   * @memberof Lettering
   */
  constructor(el = x`el`, options = defaultOptions) {
    super();
    // init type element
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!!this.el.children.length) console.warn('lettering:', 'HTMLCollection in the element will be ignored, only text inside will remain');
    this.isInput = !!this.el.placeholder;
    // init options
    this.options = Object.assign({}, defaultOptions, options);
    this.caretColor = this.options.caretColor || window.getComputedStyle(this.el).getPropertyValue('color');
    // string inside the element
    this.string = this.isInput ? this.el.placeholder : this.el.innerText;
    this.stringUpdated = false;

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
    !this.isInput && this._createOutput()._cssOutputElement();
    this.options.autoStart && this.typing();
  }

  _createOutput() {
    this.el.appendChild(this.outputElement);
    this.outputElement.appendChild(this.outputText);
    if (this.options.caretShow) {
      this.outputElement.appendChild(this.outputCaret);
      this._blink();
    }
    return this;
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
    this.outputCaret.style.width = '2px';
    this.outputCaret.style.backgroundColor = this.options.caretColor || this.caretColor;
    this.outputCaret.style.opacity = 1;
  }

  _printChar() {
    const newString = this.string.substring(0, this.stringIndex);
    this.isInput
      ? this.el.placeholder = newString
      : this.outputText.textContent = newString;
    this.stringIndex++;
  }

  _removeChar() {
    const newString = this.string.substring(0, this.stringIndex - 1);
    this.isInput
      ? this.el.placeholder = newString
      : this.outputText.textContent = newString;
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

    if (this.stringIndex === this.maxStringIndex) {
      return this
        .stop()
        .trigger('afterTyping');
    }

    if (this.stringIndex === 0) {
      return this
        .stop()
        .trigger('afterBackspace');
    }

    if (this.isAnitmating) return this.requestId = rAF(this._animate.bind(this));
  }

  /**
   * caret blink animation
   * all the time stamp will wrapped inside the function
   * because the rate of blink animation is constant
   * @memberof Lettering
   */
  _blink() {
    let lastTime = Date.now();

    const _blinkAnimate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      const shouldBlink = delta > 1000 / 2;

      if (shouldBlink) {
        this.outputCaret.style.opacity--;
        if (this.outputCaret.style.opacity < 0) this.outputCaret.style.opacity = 1;
        lastTime = now;
      }

      rAF(_blinkAnimate.bind(this));
    };

    _blinkAnimate();

  }

  updateContent(string) {
    this.stringUpdated = true;
    this
      .backspace()
      .on('afterBackspace', () => {
        this.string = string;
        this.stringUpdated && this.typing();
        this.stringUpdated = false;
      });
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
    return this;
  }

  stop() {
    cAF(this.requestId);
    this.isAnitmating = false;
    this.isBackspace ? this.stringIndex++ : this.stringIndex--;
    return this;
  }

}

export default Lettering;

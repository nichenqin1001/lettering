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
    // the string will render into which element
    this.output = this.isInput ? 'placeholder' : 'textContent';
    // init options
    this.options = Object.assign({}, defaultOptions, options);
    this.caretColor = this.options.caretColor || window.getComputedStyle(this.el).getPropertyValue('color');
    // string inside the element
    this.string = this.isInput ? this.el.placeholder : this.el.innerText;

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
    this.isBackspace = false;
    this.isAnitmating = false;
    // time stamp used to control frame speed, set to null initialize
    this.lastTime = null;
    this.requestId = null;

    this._init();
  }

  _init() {
    removeChild(this.el);
    this.options.autoStart && this.typing();
  }

  _printChar() {
    const newString = this.string.substring(0, this.stringIndex);
    this.el[this.targetEl] = newString;
    this.stringIndex++;
  }

  _removeChar() {
    const newString = this.string.substring(0, this.stringIndex - 1);
    this.el[this.output] = newString;
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

  updateContent(string) {
    this
      .backspace()
      .once('afterBackspace', () => {
        this.string = string;
        this.typing();
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

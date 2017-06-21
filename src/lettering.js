import EventEmitter from './eventEmitter';
import { rAF, cAF, throwDefaultError as x, removeChild } from './utils';

const defaultOptions = {
  fps: 15,
  autoStart: true,
  caretShow: true,
  caretContent: '|',
  caretClassName: 'lettering-caret'
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
    // check if is input element
    this.isInput = !!this.el.placeholder;
    // string inside the element
    this.string = this.isInput ? this.el.placeholder : this.el.innerText;
    // the string will render into which element
    this.target = this.isInput ? 'placeholder' : 'textContent';

    this.outputElement = this.isInput ? this.el : document.createElement('span');


    // init options
    this.options = Object.assign({}, defaultOptions, options);

    this.caretShow = this.options.caretShow && !this.isInput;

    let _index;
    Object.defineProperties(this, {
      'caretElement': { value: document.createElement('span') },
      'stringIndex': {
        get() { return _index; },
        set(value) {
          if (value < 0) value = 0;
          if (value > this.maxStringIndex) value = this.maxStringIndex;
          _index = value;
        }
      }
    });

    this.maxStringIndex = this.string.length + 1;

    this.stringIndex = 1;
    this.isBackspace = false;
    this.isAnitmating = false;
    // time stamp used to control frame speed, set to null initialize
    this.lastTime = null;
    this.requestId = null;

    this._init();
  }

  _init() {
    this._refresh(true);

    this.caretShow && this._createCaret()._cssCaret()._caretBlink();

    this.options.autoStart && this.typing();
  }

  _refresh(force) {
    if (force) {
      removeChild(this.el);
      this.isInput || this.el.appendChild(this.outputElement);
      this.stringIndex === 1;
    }
    this.maxStringIndex = this.string.length + 1;
    return this;
  }

  _createCaret() {
    this.caret = document.createElement('span');
    this.el.appendChild(this.caret);
    return this;
  }

  _cssCaret() {
    this.caret.className = this.options.caretClassName;
    this.caret.innerHTML = this.options.caretContent;
    this.caret.style.opacity = 1;
    return this;
  }

  _caretBlink() {
    let lastTime = Date.now();

    const blink = () => {
      const now = Date.now();
      const delta = now - lastTime;
      const shouldBlink = delta > 1000 / 2;

      if (shouldBlink) {
        this.caret.style.opacity--;
        if (this.caret.style.opacity < 0) this.caret.style.opacity = 1;
        lastTime = now;
      }

      rAF(blink.bind(this));
    };

    blink();

  }

  _renderChar() {
    const newString = this.string.substring(0, this.stringIndex);
    this.outputElement[this.target] = newString;
  }

  _printChar() {
    this._renderChar();
    this.stringIndex++;
  }

  _removeChar() {
    this.stringIndex--;
    this._renderChar();
  }

  _animate() {
    if (!this.isAnitmating) return;
    // create new time stamp
    const now = Date.now();
    // calculate time delta
    const delta = now - this.lastTime;
    // the 1000 here means 1000ms;
    const shouldAnimate = delta > 1000 / this.options.fps;
    // main animation here
    if (shouldAnimate) {
      this.caretShow && (this.caret.style.opacity = 1);
      // print char into document
      this.isBackspace ? this._removeChar() : this._printChar();
      // update timestamp to calculate delta again in next animation loop
      this.lastTime = now;
    }

    if (this.stringIndex === this.maxStringIndex) {
      return this
        ._stop()
        .emit('afterTyping');
    }

    if (this.stringIndex === 0) {
      return this
        ._stop()
        .emit('afterBackspace');
    }

    if (this.isAnitmating) {
      return (
        this.requestId = rAF(this._animate.bind(this))
      );
    };
  }

  updateContent(string) {
    this
      .backspace()
      .once('afterBackspace', () => {
        this.string = string;
        this._refresh().typing();
      });

    return this;
  }

  typing() {
    this.isAnitmating = true;
    this.isBackspace = false;
    this.lastTime = Date.now();

    this._animate();

    return this;
  }

  backspace() {
    this.isAnitmating = true;
    this.isBackspace = true;
    this.lastTime = Date.now();

    this._animate();

    return this;
  }

  _stop() {
    cAF(this.requestId);
    this.isAnitmating = false;
    this.isBackspace ? this.stringIndex++ : this.stringIndex--;
    return this;
  }

}

export default Lettering;

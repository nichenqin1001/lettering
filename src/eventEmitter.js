class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, fn, context = this) {
    if (!this._events[event]) this._events[event] = new Map();
    this._events[event].set(fn, context);
  }

  once(type, fn, context = this) {
    let fired = false;

    function magic() {
      this.off(type, magic);

      if (!fired) {
        fired = true;
        fn.apply(context, arguments);
      }
    }

    this.on(type, magic);
  }

  off(type, fn) {
    let _events = this._events[type];
    if (!_events) {
      return;
    }

    let count = _events.length;
    while (count--) {
      if (_events[count][0] === fn) {
        _events[count][0] = undefined;
      }
    }
  }

  trigger(event, ...args) {
    const events = this._events[event];

    if (!events) return;

    [...events].forEach(event => {
      const [fn, context] = event;
      if (!fn) return;
      fn.apply(context, args);
    });
  }
}

export default EventEmitter;

class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, fn, context = this) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event] = [...this._events[event], [fn, context]];
  }

  trigger(event, ...args) {
    const events = this._events[event];

    if (!events) return;

    [...events].forEach(event => {
      const [fn, context] = event;
      fn.apply(context, args);
    });
  }
}

export default EventEmitter;

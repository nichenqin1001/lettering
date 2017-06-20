export const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

// define cancelAnimationFrame function
export const cAF = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  function (id) { clearTimeout(id); };

export const throwDefaultError = p => { throw new Error(`Missing Parameter: ${p}`); };

export const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

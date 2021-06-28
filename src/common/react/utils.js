import { PROPS, RESERVE_PROPS, EVENT_MAP } from './constants';

export function isString(str) {
  return typeof str === 'string';
}

export function isFunction(func) {
  return typeof func === 'function';
}

export function isComponent(type) {
  return isFunction(type) && !!(type.prototype && type.prototype.render);
}

export function isChanged(state, newState) {
  return newState
    ? !Object.keys(newState).every((k) => {
        return Object.is(newState[k], state[k]);
      })
    : false;
}

export function isDepsChanged(x, y) {
  if (x === undefined && y === undefined) {
    // undefined undefined
    return true;
  } else if (Object.is(x, y)) {
    // deps, deps
    return false;
  } else if (!x || !y || x.length !== y.length) {
    // undefined, [1]
    // [], [1]
    return true;
  } else {
    // [1, 2], [1, 3]
    let changed = false;
    x.some((dep, i) => (changed = !Object.is(dep, y[i])));
    return changed;
  }
}

export function setProp(node, prop, val, remove) {
  if (/^on[A-Z]/.test(prop)) {
    node[EVENT_MAP[prop] || prop.toLowerCase()] = val; // TODO addEventListener
  } else if (PROPS.includes(prop)) {
    node[prop] = val;
  } else {
    node[remove ? 'removeAttribute' : 'setAttribute'](prop, val);
  }
}

export function setProps(domNode, props) {
  props && Object.entries(props).forEach(([prop, value]) => {
    if (RESERVE_PROPS.includes(prop)) return;
    setProp(domNode, prop, value);
  });
}

export function flatten(array) {
  return array.reduce((prev, next) => prev.concat(next), []);
}

export function runLifeCycle(vdom, lifeCycle, ...args) {
  if (vdom && vdom._instance) {
    const arr = lifeCycle.split(/\s+/);
    const name = arr.pop();
    return vdom[arr[0] === 'static' ? 'type' : '_instance'][name]?.(...args);
  }
}
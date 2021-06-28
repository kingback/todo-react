import { TEXT } from './constants';
import { flatten, isFunction } from './utils';

export default function createElement(type, allProps, ...children) {
  const { ref, key, ...props } = allProps || {};

  props.children = flatten(children).map((child) => {
    return child != null && !child.type
      ? {
          type: TEXT,
          text: child.toString(),
        }
      : child;
  });

  const element = {
    type,
    props,
    _children: [],
    _domNode: null
  };

  key != null && (element.key = key);
  ref != null && (element.ref = ref);

  isFunction(type) && Object.assign(element, {
    _vdom: null,
    _parent: null,
    _instance: null,
    _container: null,
  });

  return element;
}

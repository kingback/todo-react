import { setProps, runLifeCycle } from './utils';
import { TEXT } from './constants';
import createInstance from './createInstance';
import Fragment from './Fragment';

function mountChildren(vdom, container) {
  const children = vdom.props?.children;
  return children && children.map((child) => {
    (vdom._owner || vdom)._children.push(child);
    return mount(child, vdom, container);
  }).filter(domNode => !!domNode);
}

export function mountDomNode(vdom, container, domNode, type) {
  if (vdom && container) {
    if (vdom._domNode) {
      if (domNode) {
        if (type === 'replace') {
          container.replaceChild(vdom._domNode, domNode);
        } else {
          container.insertBefore(vdom._domNode, domNode);
        }
      } else {
        container.appendChild(vdom._domNode)
      }
    }
    vdom._container = container;
  }
}

export function clear(vdom) {
  if (vdom) {
    delete vdom._container;
    delete vdom._instance;
    delete vdom._domNode;
    delete vdom._vdom;
  }
}

export function unmount(vdom) {
  if (vdom) {
    runLifeCycle(vdom, 'componentWillUnmount');
    vdom._domNode?.parentNode.removeChild(vdom._domNode);
    clear(vdom);
  }
}

export function mount(vdom, parent, container) {
  let domNode;

  if (vdom) {
    const { type, text, props } = vdom;
    const children = props?.children;

    vdom._parent = parent;
    
    if (type === TEXT) { // text
      vdom._domNode = domNode = document.createTextNode(text);
      mountDomNode(vdom, container);
    } else if (type === Fragment) { // fragment
      const domNodes = mountChildren(vdom, domNode);
      vdom._domNode = domNode = domNodes ? domNodes[domNodes.length - 1] : null;
      children?.forEach((child) => mountDomNode(child, container));
    } else if (typeof type === 'string') { // div
      vdom._domNode = domNode = document.createElement(type);
      setProps(domNode, props);
      mountChildren(vdom, domNode);
      mountDomNode(vdom, container);
    } else { // App
      createInstance(vdom);
      vdom._domNode = domNode = mount(vdom._vdom, vdom, container);
      container && runLifeCycle(vdom, 'componentDidMount');
    }
  }


  return domNode;
}
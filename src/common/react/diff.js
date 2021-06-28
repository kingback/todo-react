import { TEXT, RESERVE_PROPS } from './constants';
import { clear, mount, unmount, mountDomNode } from './mount';
import { setProp, runLifeCycle } from './utils';
import Fragment from './Fragment';

function getParentNode(domNode) {
  if (Array.isArray(domNode)) {
    return domNode[0]?.parentNode;
  } else {
    return domNode;
  }
}

function findChildIndexBy(children, key, value, ignore) {
  return children.findIndex(
    (child, index) => !ignore.includes(index) && child?.[key] === value
  );
}

function diffChildren(node, newNode) {
  const children = node._children || [];
  const newChildren = newNode._children || [];
  const updatedChildren = [];
  const updated = [];

  function addUpdatedChild(child) {
    child._domNode && updatedChildren.push(child);
  }

  newChildren.forEach((newChild) => {
    const key = newChild?.key;
    const type = newChild?.type;

    if (key != null || type != null) {
      const index = findChildIndexBy(
        children,
        key != null ? 'key' : 'type',
        key != null ? key : type,
        updated
      );

      if (index > -1) {
        const child = children[index];
        updated.push(index);
        diff(child, newChild, newNode);
      } else {
        mount(newChild, newNode);
      }

      addUpdatedChild(newChild);
    }
  });

  children.forEach((child, index) => {
    if (!updated.includes(index)) diff(child, null);
  });

  updatedChildren.forEach((newChild, index) => {
    const domNode = getParentNode(node._domNode);
    const newChildNode = newChild._domNode;
    const childNode = domNode.childNodes[index];

    if (childNode) {
      if (childNode !== newChildNode) {
        mountDomNode(newChild, domNode, childNode, 'insert');
      }
    } else {
      mountDomNode(newChild, domNode);
    }
  });

  // const max = Math.max(children.length, newChildren.length);
  // for (let i = 0; i < max; i++) {
  //   diff(children[i], newChildren[i], node);
  // }
}

function diffText(node, newNode) {
  if (node.text !== newNode.text) {
    node._domNode.textContent = newNode.text;
  }
}

function diffProps(node, newNode) {
  const props = Object.keys(node.props || {});
  const newProps = Object.keys(node.props || {});
  const allProps = Array.from(new Set([...props, ...newProps]));

  allProps.forEach((prop) => {
    if (RESERVE_PROPS.includes(prop)) return;

    const hasProp = prop in node.props;
    const newHasProp = prop in newNode.props;
    const val = node.props[prop];
    const newVal = newNode.props[prop];

    if (hasProp && newHasProp) {
      if (val !== newVal) {
        setProp(node._domNode, prop, newVal);
      }
    } else if (hasProp && !newHasProp) {
      setProp(node._domNode, prop, undefined, true);
    } else if (!hasProp && newHasProp) {
      setProp(node._domNode, prop, newVal);
    }
  });
}

function diffComponent(node, newNode, container) {
  const { _vdom: vdom, _instance: instance } = node;
  const { props: nextProps } = newNode;
  const { props: prevProps, state: prevState, updater } = instance;
  const nextState = instance._nextState || prevState;
  
  delete instance._nextState;
  newNode._instance = instance;

  const derivedState = runLifeCycle(node, 'static getDerivedStateFromProps', nextProps, nextState);
  derivedState && Object.assign(nextState, derivedState);
  
  if (runLifeCycle(node, 'shouldComponentUpdate', nextProps, nextState) !== false) {
    instance.props = nextProps; // update props
    nextState && (instance.state = nextState); // update state;
    updater && (updater._vdom = newNode);
    newNode._vdom = instance.render(); // rerender
    const snapshot = runLifeCycle(node, 'getSnapshotBeforeUpdate', prevProps, prevState); // snapshot
    diff(vdom, newNode._vdom, newNode, container); // update
    runLifeCycle(node, 'componentDidUpdate', prevProps, prevState, snapshot); // didUpdate
    updater?.runCallbacks();
  }
}

// PATCH
// REPLACE
// DELETE
// APPEND

// TODO render + commit
export function diff(node, newNode, parent, container) {
  if (node && newNode) {
    if (node.type === newNode.type) {
      if (node.type === TEXT) {
        // Text
        diffText(node, newNode);
      } else if (node.type === Fragment) {
        diffChildren(node, newNode);
      } else if (typeof node.type === 'string') {
        // Native
        diffChildren(node, newNode);
        diffProps(node, newNode);
      } else {
        // Component
        diffChildren(node, newNode);
        diffComponent(node, newNode, container);
      }
      newNode._domNode = node._domNode;
    } else {
      mount(newNode, parent, container, node._domNode); // replace
    }
  } else if (node && !newNode) {
    unmount(node);
  } else if (!node && newNode) {
    mount(newNode, parent, container);
  }

  if (node !== newNode) {
    clear(node);
  }
}

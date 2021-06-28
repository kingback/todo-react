import { isComponent, runLifeCycle } from './utils';
import Dispatcher from './Dispatcher';
import Component from './Component';
import Updater from './Updater';

export default function createInstance(vdom) {
  const { type, props } = vdom;
  const updater = new Updater(vdom);
  let instance;

  if (isComponent(type)) {
    const TypeComponent = type;
    instance = new TypeComponent(props);
  } else {
    instance = new Component(props);
    instance.render = function() {
      Dispatcher.current = this.dispatcher;
      const ret = type(this.props);
      Dispatcher.current.reset();
      Dispatcher.current = null;
      return ret;
    };
    instance.dispatcher = new Dispatcher(() => {
      instance.updater.update();
    });
  }

  instance.updater = updater;
  vdom._instance = instance;

  const derivedState = runLifeCycle(vdom, 'static getDerivedStateFromProps', props, vdom._instance.state);
  derivedState && Object.assign(vdom._instance.state, derivedState);
  vdom._vdom = vdom._instance.render();
  vdom._vdom._owner = instance._owner = vdom._owner = vdom;

  return instance;
}

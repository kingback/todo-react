import { diff } from './diff';

const updateQueue = [];
let enqueueUpdater = null;

function commitUpdate(update) {
  updateQueue.push(update);
  if (!enqueueUpdater) {
    enqueueUpdater = Promise.resolve();
    enqueueUpdater.then(() => {
      while (updateQueue.length) {
        updateQueue.shift()();
      }
    }).then(() => {
      enqueueUpdater = null;
    });
  }
}

export default class Updater {
  constructor(vdom) {
    this.vdom = vdom;
    this.callbackQueue = [];
  }
  
  update(callback) {
    // TODO 同步
    typeof callback === 'function' && this.callbackQueue.push(callback);
    commitUpdate(() => diff(this.vdom, this.vdom, this.vdom._parent, this.vdom.domNode?.parentNode));
  }

  runCallbacks() {
    while (this.callbackQueue.length) {
      this.callbackQueue.shift()();
    }
  }
}
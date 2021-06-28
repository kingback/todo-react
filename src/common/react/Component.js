import { isChanged } from './utils';

export default class Component {
  constructor(props = {}) {
    this.props = props;
  }

  setState(nextState, callback) {
    if (typeof nextState === 'function') {
      nextState = nextState.call(this, this._nextState || this.state);
    }
    
    if (isChanged(this.state, nextState)) {
      this._nextState = Object.assign({}, this.state, nextState);
      this.updater && this.updater.update(callback);
    }
  }

  render() {
    return null;
  }
}
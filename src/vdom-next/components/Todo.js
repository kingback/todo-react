import { createElement, Component } from 'preact';
import cx from 'classnames';

export default class Todo extends Component {

  static getDerivedStateFromProps(nextProps, nextState) {
    console.log('Todo', 'getDerivedStateFromProps', nextProps, nextState);
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Todo', 'shouldComponentUpdate', nextProps, nextState);
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('Todo', 'getSnapshotBeforeUpdate', prevProps, prevState);
    return { snapCount: prevProps.count };
  }

  componentDidMount() {
    console.log('Todo', 'componentDidMount');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('Todo', 'componentDidUpdate', prevProps, prevState, snapshot);
  }

  componentWillUnmount() {
    console.log('Todo', 'componentWillUnmount', this.props);
  }

  render() {
    const {
      id,
      text,
      done,
      onEdit,
      onToggle,
      onRemove,
      onUpdate,
    } = this.props;

    console.log('Todo', 'render');

    return (
      <li data-id={id} className={cx({ completed: done })}>
        <div className="view">
          <input
            className="toggle"
            checked={done}
            type="checkbox"
            onChange={() => onToggle(id)}
          />
          <label onDoubleClick={onEdit}>{text}</label>
          <button className="destroy" onClick={() => onRemove(id)}></button>
        </div>
        <input className="edit" value={text} onBlur={(e) => onUpdate(e, id)} />
      </li>
    );
  }
}

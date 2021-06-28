import { createElement, Fragment, Component } from 'preact';
import Todo from './Todo';

export default class TodoList extends Component {

  static getDerivedStateFromProps(nextProps, nextState) {
    console.log('TodoList', 'getDerivedStateFromProps', nextProps, nextState);
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('TodoList', 'shouldComponentUpdate', nextProps, nextState);
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('TodoList', 'getSnapshotBeforeUpdate', prevProps, prevState);
    return { snapCount: prevProps.count };
  }

  componentDidMount() {
    console.log('TodoList', 'componentDidMount');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('TodoList', 'componentDidUpdate', prevProps, prevState, snapshot);
  }

  componentWillUnmount() {
    console.log('TodoList', 'componentWillUnmount');
  }

  render() {
    console.log('TodoList', 'render');
    const { items, selectAll, onEdit, onToggle, onRemove, onUpdate, onToggleAll } = this.props;

    return (
      <Fragment>
        <input
          id="toggle-all"
          className="toggle-all"
          checked={selectAll}
          type="checkbox"
          onChange={onToggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {items.map(({ id, text, done }) => (
            <Todo
              id={id}
              key={id}
              text={text}
              done={done}
              onEdit={onEdit}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </ul>
      </Fragment>
    );
  }
}

import { createElement, Component } from './diff';
import Todo from './Todo';

export default class List extends Component {
  render() {
    const { filteredList, ...callbacks} = this.props;

    return (
      <ul className="todo-list">
        {filteredList.map((todo) => <Todo key={todo.id} {...todo} {...callbacks} />)}
      </ul>
    );
  }
}

import { createElement, PureComponent } from './diff';
import cx from 'classnames';

export default class List extends PureComponent {
  componentDidMount() {
    console.log('componentDidMount');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  render() {
    const { id, text, done, onEdit, onToggle, onRemove, onUpdate } = this.props;

    return (
      <li data-id={id} key={id} className={cx({ completed: done })}>
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

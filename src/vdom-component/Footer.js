import { createElement } from './diff';
import cx from 'classnames';

export default function Footer({ total, leftCount, filterType, onFilter, onClear }) {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{leftCount}</strong> items left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={cx({ selected: filterType === '' })}
            onClick={() => onFilter('')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={cx({ selected: filterType === 'active' })}
            onClick={() => onFilter('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={cx({ selected: filterType === 'completed' })}
            onClick={() => onFilter('completed')}
          >
            Completed
          </a>
        </li>
      </ul>
      <button
        className={cx({
          'clear-completed': true,
          hidden: total === leftCount,
        })}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
}

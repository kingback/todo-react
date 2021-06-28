import cx from 'classnames';
import createStore from '@/common/store';
import { createElement, Component } from './diff';
import Header from './Header';
import Footer from './Footer';
import List from './List';
import '@/common/base.css';

// 优点
// 1. 数据与模板绑定，数据更新则同步到UI，无需过多 dom 操作
// 2. 可以直接在 jsx 里绑定事件
// 3. 可以保留一些状态，如输入框的内容等
// 4. 不依赖 jQuery 等库

export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(this.props.cacheKey, (action) => {
      const { type, ...payload } = action;
      console.log(type, payload);
      this.setState({
        ...this.store.state
      });
    });
    this.state = {
      ...this.store.state
    };
  }

  onAdd = (e) => {
    if (e.key === 'Enter') {
      const text = e.currentTarget.value;
      const input = e.currentTarget;
      this.store.add(text);
      input.value = '';
      input.focus();
    }
  };

  onRemove = (id) => {
    this.store.remove(id);
  };

  onToggle = (id) => {
    this.store.toggle(id);
  };

  onEdit = (e) => {
    const item = e.currentTarget.parentNode.parentNode;
    const input = item.querySelector('.edit');
    const value = input.value;
    item.classList.add('editing');
    input.value = '';
    input.focus();
    input.value = value;
  };

  onUpdate = (e, id) => {
    const item = e.currentTarget.parentNode;
    item.classList.remove('editing');
    this.store.update(id, e.currentTarget.value);
  };

  onToggleAll = () => {
    this.store.toggleAll();
  };

  onClear = () => {
    this.store.toggleAll(false);
  };

  onFilter = (type) => {
    this.store.filter(type);
  };

  render() {
    const { filteredList, leftCount } = this.store;
    const { filterType, todoList } = this.state;

    // create
    return (
      <section className="todoapp">
        <Header placeholder="What needs to be done?" onAdd={this.onAdd} />
        <section
          className={cx({
            main: true,
            hidden: !todoList.length,
          })}
        >
          <input
            id="toggle-all"
            className="toggle-all"
            checked={!(!todoList.length || leftCount)}
            type="checkbox"
            onChange={this.onToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <List
            filteredList={filteredList}
            onEdit={this.onEdit}
            onToggle={this.onToggle}
            onRemove={this.onRemove}
            onUpdate={this.onUpdate}
          />
          <Footer
            total={todoList.length}
            leftCount={leftCount}
            filterType={filterType}
            onFilter={this.onFilter}
            onClear={this.onClear}
          />
        </section>
      </section>
    );
  }
}

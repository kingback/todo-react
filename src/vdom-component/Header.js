import { createElement, createRef, Component } from './diff';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    const { onAdd, placeholder } = this.props;

    return (
      <header className="header">
        <h1>todos</h1>
        <input
          ref={this.inputRef}
          className="new-todo"
          placeholder={placeholder}
          // autoFocus
          onKeyUp={onAdd}
        />
      </header>
    );
  }
}

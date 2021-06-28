import App from './App';
import { createElement, render } from './diff';

render(<App cacheKey="todo-app-vdom-component" />, document.body);
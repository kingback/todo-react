import { createElement, render } from 'preact';
import App from './App';

const app = <App cacheKey="todo-app-vdom-component" />;
render(app, document.body);
console.log(app);
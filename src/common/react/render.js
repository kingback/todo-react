import { diff } from './diff';
import { mount } from './mount';

export default function render(component, container) {
  mount(component, null, container);
}
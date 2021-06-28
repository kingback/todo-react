export const TEXT = Symbol('VDOM_TEXT');
export const PROPS = ['className', 'htmlFor', 'value', 'checked'];
export const EVENT_MAP = { onDoubleClick: 'ondblclick' };
export const RESERVE_PROPS = ['key', 'ref', 'children'];

export const MEMO = { memo: true };
export const EFFECT = { effect: true };
export const LAYOUT_EFFECT = { layoutEffect: true };
import { isStream, combine } from 'flyd';
import { h as preactH } from 'preact';

import reactive from './reactive.js';

const VNode = preactH('').constructor;

function isValidElement(element) {
  // preact component can return undefined, null, string, vnode, not array, number. But we leave out undefined since flyd stream init undefined
  return (element === null) || (typeof element === 'string') || (element instanceof VNode);
}

function wrapChildren(children) {
  const notValidElement$s = children.filter(child => isStream(child) && !isValidElement(child()));
  if (notValidElement$s.length > 0) {
    return combine(() => {
      return children.map(child => {
        if (!isStream(child)) {
          return child;
        }
        if (notValidElement$s.indexOf(child) > -1) {
          return child();
        }
        return preactH(reactive(), {children$: child});
      });
    }, notValidElement$s);
  }
  return children.map(child => {
    if (!isStream(child)) {
      return child;
    }
    return preactH(reactive(), {children$: child});
  });
}

function hasStream(obj) {
  return Object.keys(obj).some(key => isStream(obj[key]));
}

export default function h(tag, props, ...children) {
  let defaultProps = props || {};
  let wrappedChildren = wrapChildren(children);
  if (hasStream(defaultProps) || isStream(wrappedChildren)) {
    return preactH(reactive(tag), {...defaultProps, children$: wrappedChildren});
  }
  return preactH(tag, defaultProps, ...wrappedChildren);
}

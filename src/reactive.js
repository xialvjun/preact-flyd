import { Component, h, cloneElement } from 'preact';

import { isStream, on } from 'flyd';

const VNode = h('').constructor;

const pool = [];

export default function reactive(tag='') {
  let cache = pool.find(c => c.tag===tag);
  if (cache) {
    return cache.reactive;
  }
  class ReactiveClass extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.subscribe(props);
    }

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    addPropListener(name, prop$) {
      on((value) => {
        // don't re-render if value is the same.
        if (value === this.state[name]) {
          return;
        }
        this.setState({ [name]: value });
      }, prop$);
      // return these prop$ rather than above on$ because we usually create streams in jsx. Just end those on$ will left out those prop$s which will lead to a memory leak.
      // And since prop$ is the parent of on$, just end prop$ is enough.
      // And since we will end prop$, user shouldn't use outter streams directly on jsx. Just a stream.map(v => v) is enough.
      // And in flyd, A$.end(true) will just break the links between streams dependent on A$ and A$, not destroy them
      return prop$;
    }

    subscribe(props) {
      if (this.subscriptions) {
        this.unsubscribe();
      }

      this.subscriptions = Object.entries(props)
        .filter(entry => isStream(entry[1]))
        .map(([key, value]) => this.addPropListener(key, value));
    }

    unsubscribe() {
      this.subscriptions.forEach(subscription => subscription.end(true));
      this.state = {};
      this.subscriptions = null;
    }

    render() {
      const {children$: children, ...props} = {...this.props, ...this.state};
      if (tag) {
        return h(tag, props, ...children);
      }
      return children instanceof VNode ? cloneElement(children, props) : children;
    }
  }

  pool.push({ tag, reactive: ReactiveClass });

  return ReactiveClass;
}

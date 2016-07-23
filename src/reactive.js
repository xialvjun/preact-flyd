import { Component, h } from 'preact'
import { isStream, on } from 'flyd'

let VNode = h('').constructor

export default function reactive(tag='') {
  class ReactiveClass extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.subscribe(props)
    }

    componentWillMount() {
      // move `this.subscribe(props)` from `componentWillMount` to `constructor` because preact sometimes run `render` before `componentWillMount` for unknown reason
      // this.subscribe(props)
    }

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps)
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    addPropListener(name, prop$) {
      on((value) => {
        // don't re-render if value is the same.
        if (value === this.state[name]) {
          return
        }
        this.setState({ [name]: value })
      }, prop$)
      // return these prop$ rather than above on$ because we usually create streams in jsx. Just end those on$ will left out those prop$s which will lead to a memory leak.
      // And since prop$ is the parent of on$, just end prop$ is enough.
      // And since we will end prop$, user shouldn't use outter streams directly on jsx. Just a stream.map(v => v) is enough.
      return prop$
    }

    subscribe(props) {
      if (this.subscriptions) {
        this.unsubscribe()
      }

      this.subscriptions = []

      Object.keys(props).forEach(key => {
        const value = props[key]
        if (isStream(value)) {
          const subscription = this.addPropListener(key, value)
          this.subscriptions.push(subscription)
        }
      })
    }

    unsubscribe() {
      this.subscriptions.forEach(subscription => subscription.end(true))
      this.state = {}
      this.subscriptions = null
    }

    render() {
      const {children$: children, ...props} = {...this.props, ...this.state}
      if (tag) {
        return h(tag, props, ...children)
      }
      return children instanceof VNode ? h(children.nodeName, {...children.attributes, props}, ...children.children) : children
    }
  }

  return ReactiveClass
}

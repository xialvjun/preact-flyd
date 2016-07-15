import { Component, h } from 'preact'
import { isStream, on } from 'flyd'

export default function reactive(tag='') {
  class ReactiveClass extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    componentWillMount() {
      this.subscribe(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps)
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    addPropListener(name, prop$) {
      return on((value) => {
        // don't re-render if value is the same.
        if (value === this.state[name]) {
          return
        }
        this.setState({ [name]: value })
      }, prop$)
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
      this.subscriptions.forEach(subscription => subscription.end())
      this.state = {}
      this.subscriptions = null
    }

    render() {
      const {children$: children, ...props} = {...this.props, ...this.state}
      const finalProps = {...props, children}
      if (tag) {
        return h(tag, finalProps)
      }
      return h(children.nodeName, {...children.attributes, props})
    }
  }

  return ReactiveClass
}

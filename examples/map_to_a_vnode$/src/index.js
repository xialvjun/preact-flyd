import {h} from 'preact-flyd'
import flyd from 'flyd'
import {Component, render} from 'preact'

let num = flyd.stream(0)

setInterval(()=>{
  num(num()+1)
}, 1000)

class App extends Component {
  render() {
    return (
      <div>
        {this.state.show ? (
          <div>
            {num.map(n => <span>{n}</span>)}
          </div>
        ) : null}
        <button onClick={e=>this.setState({show: !this.state.show})}>toggle</button>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))

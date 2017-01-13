import {h} from 'preact-flyd'
import flyd from 'flyd'
import {Component, render} from 'preact'

// use string rather than number because preact component can return string
let num = flyd.stream('0')

setInterval(()=>{
  num((parseInt(num())+1)+'')
}, 1000)

class App extends Component {
  render() {
    return (
      <div>
        {this.state.show ? (
          <div>
            {num.map(n => {
              console.log('reactive span created!!!');
              // this will make a memory leak;
              return [<span>{n}</span>];
              // this won't
              // return <span>{n}</span>;
            })}
          </div>
        ) : null}
        <button onClick={e=>this.setState({show: !this.state.show})}>toggle</button>
        <p>open the console</p>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))

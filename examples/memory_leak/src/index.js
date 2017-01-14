import {h} from 'preact-flyd'
import flyd from 'flyd'
import {Component, render} from 'preact'

// use string rather than number because preact component can return string
let num = flyd.stream('0')

setInterval(()=>{
  num((parseInt(num(), 10)+1)+'')
}, 1000)

class App extends Component {
  render() {
    return (
      <div>
        {this.state.show ? (
          <div>
            {num.map(n => {
              console.log('reactive span created!!!');
              // no memory leak;
              return [<span>{n}</span>];
              // no memory leak too;
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

/**
 * Something about the memory leaking is hard to describe, but it's in fact easy to sense, so I show you the code when it will and will not lead to a memory leaking.
 * 
 * 1. In this example, the important section is line18-line24, it created a stream. 
 * Open the console and click the toggle button and see what will happen.
 * Then click it again and again and again, and see what will happen...
 * 
 * 2. Now replace line21 from `return [<span>{n}</span>];` to `return <span>{n}</span>;`, refresh the browser and see what will happen when we click the toggle button.
 * 
 * 3. Then replace line18-line24 to:
 * ```jsx
 * {num.map(n => {
 *   console.log('reactive span created!!!');
 *   return [<span>{n}</span>];
 * })}
 * {num.map(n => {
 *   console.log('reactive2 span created!!!');
 *   return [<span>{n}</span>];
 * })}
 * ```
 * Yes, two streams with value of array. Now see the console when we click the toggle button when we click it again and again...
 * 
 * 4. And then:
 * ```jsx
 * {num.map(n => {
 *   console.log('reactive span created!!!');
 *   return [<span>{n}</span>];
 * })}
 * {num.map(n => {
 *   console.log('reactive2 span created!!!');
 *   return <span>{n}</span>;
 * })}
 * ```
 * Two streams with one value is array and one is vnode(preact render can return it). See the console...
 * 
 * See the difference in the 4 statuses? Well, 1 and 2 have no difference in the console. That's code block effect.
 * And the problem of the differences of 2, 3, 4 is hard to tell, the best way is to read the source.
 */
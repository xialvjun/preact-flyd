import {h} from 'preact-flyd'
import {render} from 'preact'
import { stream, scan, merge} from 'flyd';

import './index.css'

let items$ = stream([1,2,3,4,5,])

function List() {
  return (
    <div>
      <div>
        <button id="plus" onClick={e => items$(items$().concat(Math.random()))}>+</button>
      </div>
      {/*<ul className={'list'}>
        {items$.map(items => items.map(item => <li key={item}>{item}</li>))}
      </ul>*/}
      {items$.map(items => items.length % 2 === 1 ?
        <ul className={'list'}>
          {items.map(item => <li key={item}>{item}</li>)}
        </ul> :
        null
      )}
    </div>
  );
}

render(<List />, document.getElementById('app'));

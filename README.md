preact-flyd
=========================

Inspired by [theadam/react-flyd](https://github.com/theadam/react-flyd)

Allows for flyd streams to be embedded directly into JSX, and to update content when the streams fire events.

# Counter Example

```javascript
/** @jsx h */

import { render } from 'preact';
import { h } from 'preact-flyd';
import { stream, scan, merge} from 'flyd';


function Counter() {
  const plus$ = stream();
  const minus$ = stream();

  const action$ = merge(
    plus$.map(() => 1),
    minus$.map(() => -1)
  );

  const count$ = scan((x, y) => x + y, 0, action$);

  return (
    <div>
      <div>
        <button id="plus" onClick={ stream(plus$) }>+</button>
        <button id="minus" onClick={ stream(minus$) }>-</button>
      </div>
      <div>
        Count: { count$ }
      </div>
    </div>
  );
}

render(<Counter />, document.getElementById('root'));
```

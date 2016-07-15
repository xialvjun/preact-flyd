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
        <button id="minus" onClick={ stream(minus$) }>-</button>
        <button id="plus" onClick={ stream(plus$) }>+</button>
      </div>
      <div>
        Count: { count$ }
      </div>
    </div>
  );
}

render(<Counter />, document.getElementById('root'));
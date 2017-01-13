# WebpackBin project

## Start

`npm install`

`npm start`

Go to `localhost:8080`

Because we usually use `stream.map` in `render` method and `stream.map` will create a new stream, we should end it in case of memory leaking.

Then, `preact-flyd` take it.

**And also because `preact-flyd` will end all streams mapped directly on the elements, you shouldn't map your global data$ directly on elements.**

In this example, you'll find no matter how many times you create and destroy the reactive `span` element, in the console, `reactive span created!!!` is always be printed once a second.

If `preact-flyd` didn't end `vnode$ =` `num.map(n => { console.log('reactive span created!!!'); return <span>{n}</span> })`, didn't end the `vnode$`, then if you create and destroy the reactive span element twice (ie: click the toggle button three or four times), in the console, `reactive span created!!!` will be printed twice a second.

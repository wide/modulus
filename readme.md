# Modulus

Robust Web Component interface, based on `@wide/dom-observer`.


## Install

```
npm install @wide/modulus --save
```


## Usage


### Register a regular component

```js
import modulus from '@wide/modulus'

modulus.component('foo-bar', class {
  run() {

  }
})

// or batch
modulus.components({
  'foo-bar': class {
    run() {

    }
  }
})
```

```html
<body>
  <div is="foo-bar">Hey!</div>
</body>
```

### Register a web component

The name given to the component must contains a `-` to comply to the custom-element naming convention.

```js
import modulus from '@wide/modulus'

modulus.webComponent('foo-bar', class {
  run() {

  }
})

// or batch
modulus.webComponents({
  'foo-bar': class {
    run() {

    }
  }
})
```

```html
<body>
  <foo-bar>Hey!</foo-bar>
</body>
```

### Get all components by name and selector

```js
import modulus from '@wide/modulus'

modulus.seekAll('foo-bar') // Array<FooBar>
modulus.seekAll('foo-bar', '.visible') // Array<FooBar.visible>
```

### Get one component by name and selector

```js
import modulus from '@wide/modulus'

modulus.seek('foo-bar') // first FooBar instance
modulus.seek('foo-bar', '#foobar1') // FooBar#foobar1 instance
```

### Get component(s) from external source

```js
document.queryComponent('foo-bar') // first FooBar instance
document.queryComponents('foo-bar', '.visible') // Array<FooBar.visible>
```
 
### Call component's method from `html`

Use the `[data-call]` helper with a formatted value `name#id.method`:
```html
<button data-call="modal#register.open">do something</button>
```

will internally trigger:
```js
modulus.seek('modal', '#register').open({ el, e, data })
```

| Value | Description |
|---|---|
| `el` | HTMLElement object binded to the event |
| `e` | `Event` object of the event listener method callback |
| `data` | Optional parameters defined in `[data-call.params]` |

#### Parameters
Use the `[data-call.params]` to pass custom values:

```html
<button data-call="modal#register.open" data-call.params='[{ "myAttr": "myValue" }]'>do something</button>
```

> ⚠️ Note: `data-call.params` is waiting a JSON format only

Exmple with the previous HTML code:
```js
modulus.component('modal', class extends Component {
  run() {
    // ...
  }

  /**
   * Open modal and do some stuff
   *
   * @params {HTMLElement} el
   * @params {Event} e
   * @params {Object|null} [data]
   */
  open({ el, e, data }) {
    // el: <button ...>
    // e: Event{ ... }
    // data: { ... } | null
  }
```

**Deprecated method:** To ensure compatibility with the old `$event` and `$el` parameters (used by Modulus below v2.2.0), it still possible to use them. For this, consult the [old documentation](https://github.com/wide/modulus/tree/2.1.2#parameters). 

> ⚠️ Note: Keep in mind that this method should not be used with new projects. It can be removed at any time on the next release. 

## Component class

The `Component` class offers shortcuts for accessing element or sending events to other components.

```js
import modulus from '@wide/modulus'
import Component from '@wide/modulus/src/component'

modulus.component('foo-bar', class extends Component {
  run() {
    this.log(`I'm in the DOM !`)
  },
  destroy() {
    this.log(`I'm no longer in the DOM...`)
  }
})
```

### Properties

- `el` the DOM element binded to the class
- `uid` unique ID given at the registration
- `attrs` element's attributes
- `dataset` element's data-attributes
- `refs` element's specific children (fetched using `[ref]` and `[ref.dyn]` attributes)
  - `[ref]` elements are computed on component initial load
  - `[ref.dyn]` elements are computed on each access
  - `[ref.group]` elements are grouped in an array under the same key (`[ref=bar]` -> `this.refs.bar[0]`)

### Hooks

- `run()` hook called when the element is inserted in DOM
- `destroy()` hook called when the element is removed from DOM

### Methods

- `child(selector)` alias of `this.el.querySelector()`, return `HTMLElement`
- `children(selector)` alias of `this.el.querySelectorAll()`, return `NodeList`
- `on(event, callback)` listen global event
- `emit(event, callback)` trigger global event
- `off(event, callback)` remove global listener
- `log(...args)` log message with unique identifier
- `log.info(...args)` log message with INFO severity
- `log.warn(...args)` log message with WARN severity
- `log.error(...args)` log message with ERROR severity

### Garbage Collector

Every event listeners created using `this.on()` are automatically `off()`ed on component destruction.


## Config

### Log level

To keep only `warn` and `error` logs (for production usage), set `production` to `true`:
```js
import modulus from '@wide/modulus'

modulus.config({ production: true })
```

Or manually assign a log level:
```js
import modulus, { LOG_LEVELS } from '@wide/modulus'

modulus.config({
  log: {
    level: LOG_LEVELS.INFO // DEBUG (default), INFO, WARN, ERROR, NONE
  }
})
```

> ⚠️ Note: assign a log level will override the `production` setting.

To disable logs, set `enabled` to `false`:
```js
import modulus from '@wide/modulus'

modulus.config({
  log: {
    enabled: false
  }
})
```

The default config is setted to show all kind of logs.


## Authors

- **Aymeric Assier** - [github.com/myeti](https://github.com/myeti)
- **Julien Martins Da Costa** - [github.com/jdacosta](https://github.com/jdacosta)

### Contributors

- **Sébastien Robillard** - [github.com/robiseb](https://github.com/robiseb)
- **Kévin Poccard Soudard** - [github.com/kevpoccs](https://github.com/kevpoccs)


## License

This project is licensed under the MIT License - see the [licence](licence) file for details
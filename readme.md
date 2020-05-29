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
modulus.seek('modal', '#register').open()
```



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


## Authors

- **Aymeric Assier** - [github.com/myeti](https://github.com/myeti)
- **Julien Martins Da Costa** - [github.com/jdacosta](https://github.com/jdacosta)


## License

This project is licensed under the MIT License - see the [licence](licence) file for details
import observe, { seek as _seek } from '@wide/dom-observer'
import { bind, unbind } from './hooks'
import './directives'


/**
 * Register many regular and custom elements
 * @param {Object<string, Component>} many
 */
export default function modulus(many) {
  registerMany(many)
}


/**
 * Register one regular and custom element
 * @param {String} name 
 * @param {Function} Klass 
 */
export function register(name, Klass) {
  registerComponent(name, Klass)
  registerWebComponent(name, Klass)
}


/**
 * Register many regular and custom elements
 * @param {Object<string, Component>} many
 */
export function registerMany(many) {
  registerComponents(many)
  registerWebComponents(many)
}


/**
 * Register one regular component
 * @param {String} name 
 * @param {Function} Klass 
 */
export function registerComponent(name, Klass) {
  console.debug(`# register component [is=${name}]`)
  observe(`[is="${name}"]`, {
    bind: el => bind(el, name, Klass),
    unbind: el => unbind(el)
  })
}


/**
 * Register many regular components
 * @param {Object<string, Component>} collection
 */
export function registerComponents(collection) {
  for(let name in collection) {
    registerComponent(name, collection[name])
  }
}


/**
 * Register one custom element
 * @param {String} name 
 * @param {Function} Klass 
 */
export function registerWebComponent(name, Klass) {
  console.debug(`# register web component <${name}>`)
  try {
    window.customElements.define(name, class extends HTMLElement {
      connectedCallback() {
        bind(this, name, Klass)
      }
      disconnectedCallback() {
        unbind(this)
      }
    })
  }
  catch(err) {
    console.error(err)
  }
}


/**
 * Register many custom elements
 * @param {Object<string, Component>} collection
 */
export function registerWebComponents(collection) {
  for(let name in collection) {
    registerWebComponent(name, collection[name])
  }
}


/**
 * Import components from bundler import (Parcel/Webpack)
 * @param {Object} o object
 * @param {String} k key
 */
export function registerImports(o, k) {
  if(typeof o === 'function') modulus(k, o)
  else if(o.default) modulus(k, o.default)
  else for(let n in o) registerImports(o[n], n)
}


/**
 * Get component by name and selector
 * @param {String} name
 * @param {String} selector
 * @return {Component}
 */
export function seek(name, selector) {
  return seekAll(name, selector).pop()
}


/**
 * Get components by name and selector
 * @param {String} name
 * @param {String} selector
 * @return {Array<Component>}
 */
export function seekAll(name, selector) {
  return [
    ..._seek(`[is="${name}"]`), // regular components
    ...Array.from(document.querySelectorAll(name)) // web components
  ].filter(el => !selector || el.matches(selector))
   .map(el => el.__component)
   .filter(Boolean)
}


/**
 * Extend modulus instance
 */
modulus.register = register
modulus.registerMany = registerMany
modulus.component = registerComponent
modulus.components = registerComponents
modulus.webComponent = registerWebComponent
modulus.webComponents = registerWebComponents
modulus.imports = registerImports
modulus.seek = seek
modulus.seekAll = seekAll


/**
 * Expose seek() and seekAll() in document
 */
document.queryComponent = seek
document.queryComponents = seekAll
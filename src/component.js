import Logger from './logger'
import emitter from '@wide/emitter'
import { parseAttrs, parseRefs } from './utils'


/**
 * UID default incremental value
 * @type {Number}
 */
let uids = 0


/**
 * Base Component Class
 * Provide basic props and methods
 * @class Component
 */
export default class Component {


  /**
   * New Component
   * @param {HTMLElement} el
   * @param {String} name
   */
  constructor(el, name = '') {

    /**
     * Component element
     * @type {HTMLElement}
     */
    this.el = el

    /**
     * Unique ID
     * @type {String}
     */
    this.uid = `${name}#${el.id || ++uids}`

    /**
     * Element data attributes
     * @type {DOMStringMap}
     */
    this.dataset = el.dataset

    /**
     * Element attributes
     * @type {Object<string, string>}
     */
    this.attrs = parseAttrs(el)

    /**
     * Element children with [ref] or [ref.dyn] attributes (camelcased)
     * @type {Object<string, HTMLElement>}
     */
    this.refs = parseRefs(el, this.uid)

    /**
     * Logger instance
     * @type {Logger}
     */
    this.log = new Logger(`[${this.uid}]`)

    /**
     * Meta properties, used internally
     * @type {Object}
     */
    this.__meta = {
      listeners: []
    }
  }


  /**
   * Hook called when connected to DOM
   */
  run() {}


  /**
   * Hook called when disconnected from DOM
   */
  destroy() {}


  /**
   * Alias of querySelector()
   * @param {String} selector
   * @return {HTMLElement}
   */
  child(selector) {
    return this.el.querySelector(selector)
  }


  /**
   * Alias of querySelectorAll()
   * @param {String} selector
   * @return {Array<HTMLElement>}
   */
  children(selector) {
    return Array.from(this.el.querySelectorAll(selector))
  }


  /**
   * Listen to global event bus
   * @param {String} event
   * @param {Function} fn
   */
  on(event, fn) {
    const ref = emitter.on(event, fn)
    this.__meta.listeners.push({ event, ref: ref.ref, opts: ref.opts, keyRef: fn })
  }


  /**
   * Emit to global event bus
   * @param {String} event
   * @param  {...any} args
   */
  emit(event, ...args) {
    emitter.emit(event, ...args)
  }


  /**
   * Remove from global event bus
   * @param {String} event
   * @param {Function} ref
   */
  off(event, ref) {
    const index = this.__meta.listeners.findIndex(item => item.event === event && item.keyRef === ref)
    if (index > -1) {
      emitter.off(event, this.__meta.listeners[index].ref, this.__meta.listeners[index].opts)
      this.__meta.listeners.splice(index, 1)
    }
  }


  /**
   * Garbage collector, used internally
   */
  destructor() {

    // clear event listeners
    for(let i = this.__meta.listeners.length; i--;) {
      const { event, ref, opts } = this.__meta.listeners[i]
      emitter.off(event, ref, opts)
      this.__meta.listeners.splice(i, 1)
    }
  }


  /**
   * Instanciate and run component
   * @param {HTMLElement} el
   * @param {String} name
   * @param  {...any} args
   * @return {this}
   */
  static create(el, name, ...args) {
    const self = new this(el, name)
    self.run(...args)
    return self
  }

}
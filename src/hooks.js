/**
 * Bind component to element
 * @param {HTMLElement} el 
 * @param {String} name 
 * @param {Object} Klass 
 */
export function bind(el, name, Klass) {

  // instanciate component class
  el.__component = new Klass(el, name)

  // apply 'run' hook when connected to DOM
  el.__component.run()
}


/**
 * Unbind component from element
 * @param {HTMLElement} el 
 */
export function unbind(el) {

  // optional, apply 'destroy' hook when disconnected from DOM
  if(el.__component.destroy) {
    el.__component.destroy() // hook
  }

  // optional, apply 'destructor' method as garbage collector
  if(el.__component.destructor) {
    el.__component.destructor() // gc
  }

  // delete component instance
  delete el.__component
}
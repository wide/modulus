/**
 * Parse element attributes
 * @param {HTMLElement} el 
 * @return {Object<string, string>}
 */
export function parseAttrs(el) {
  const attrs = {}
  for(let i = el.attributes.length; i--;) {
    const { name, value } = el.attributes[i]
    attrs[name] = value
  }
  return attrs
}


/**
 * Gather children with [ref] and [ref.dyn] attributes
 * @param {HTMLElement} el 
 * @return {Object<string, HTMLElement>}
 */
export function parseRefs(el) {
  const refs = {}
  const els = el.querySelectorAll(':scope > [ref], :scope > [ref\\.dyn], :scope :not([is]) [ref], :scope :not([is]) [ref\\.dyn]')
  for(let i = els.length; i--;) {
    const staticRef = els[i].getAttribute('ref')
    const dynRef = els[i].getAttribute('ref.dyn')
    const prop = camelize(staticRef || dynRef)
    Object.defineProperty(refs, prop, staticRef
        ? { value: els[i] }
        : { get: () => el.querySelector(`[ref\\.dyn="${dynRef}"]`) })
  }
  return refs
}


/**
 * Camelize string, for parseRefs() purpose only
 * - foo bar        ->  fooBar
 * - foo-bar        ->  fooBar  
 * - foo-bar baz    ->  fooBarBaz
 * - foo--bar  baz  ->  fooBarBaz
 * @param {String} str 
 * @return {String}
 */
export function camelize(str) {
  return str.replace(/[\s-]+(\w)/g, (m, c) => c.toUpperCase())
}
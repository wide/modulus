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
 * @param {String} uid 
 * @return {Object<string, HTMLElement>}
 */
export function parseRefs(el, uid) {

  const refs = {}
  let els = []
  try {
    els = el.querySelectorAll(`:scope > [ref], :scope > [ref\\.dyn],:scope > [ref\\.group],
                               :scope :not([is]) [ref], :scope :not([is]) [ref\\.dyn], :scope :not([is]) [ref\\.group]`)
  }
  // ie + edge legacy
  catch(err) {
    el.setAttribute('data-scope-uid', uid)
    const scope = `[data-scope-uid="${uid}"]`
    els = document.querySelectorAll(`${scope} > [ref], ${scope} > [ref\\.dyn], ${scope} > [ref\\.group],
                                     ${scope} :not([is]) [ref], ${scope} :not([is]) [ref\\.dyn], ${scope} :not([is]) [ref\\.group]`)
  }

  for(let i = els.length; i--;) {

    // assign ref
    const ref = els[i].getAttribute('ref')
    if(ref && !refs[ref]) {
      Object.defineProperty(refs, camelize(ref), { value: els[i] })
    }

    // assign dynamic ref
    const refDyn = els[i].getAttribute('ref.dyn')
    if(refDyn && !refs[refDyn]) {
      Object.defineProperty(refs, camelize(refDyn), {
        get: () => el.querySelector(`[ref\\.dyn="${refDyn}"]`)
      })
    }

    // assign group ref
    const refGroup = els[i].getAttribute('ref.group')
    if(refGroup) {
      if(!refs[refGroup]) {
        Object.defineProperty(refs, camelize(refGroup), { value: [] })
      }
      refs[refGroup].push(els[i])
    }
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


/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key] || !isObject(target[key])) {
          target[key] = source[key]
        }
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
  }
  return target
}
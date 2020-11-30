import observe from '@wide/dom-observer'
import { seek } from './index'
import { parseJSON } from './utils'

const DEFAULT_TOGGLE_CLASS = '-active'


/**
 * Run component's method from HTML
 * Ex: [data-call="modal#register.open"] -> modulus.seek('modal', '#register').open()
 */
observe('[data-call]', {
  bind(el) {
    el.addEventListener('click', e => {
      const [str, name, id, method] = el.dataset.call.match(/([a-zA-Z-]+)([#.].+)\.(.+)/)
      if(name && id && method) {
        const component = seek(name, id)
        if(component) {
          const method = component[method]
          const params = el.dataset['call.params']

          if (params === '$el') method(el)
          else if (params === '$event') method(e)
          else method()
        } else console.error(`Unknown component "${str}"`)
      }
      else console.error(`Invalid call string "${str}"`)
    })
  }
})


/**
 * Toggle class on element
 * Ex: [data-toggle="#target"][data-toggle.class="-visible"]
 */
observe('[data-toggle]', {
  bind(el) {
    el.addEventListener('click', e => {
      const targets = document.querySelectorAll(el.dataset.toggle)
      const targetClass = el.dataset['toggle.class'] || DEFAULT_TOGGLE_CLASS
      const selfClass = el.dataset['toggle.self'] || targetClass
      el.classList.toggle(selfClass)
      for(let i = targets.length; i--;) {
        targets[i].classList.toggle(targetClass)
      }
    })
  }
})
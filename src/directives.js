import observe from '@wide/dom-observer'
import { seek } from './index'
import { parseDataCallParams } from './utils'

const DEFAULT_TOGGLE_CLASS = '-active'


/**
 * Run component's method from HTML
 * Ex: [data-call="modal#register.open"]
 * Ex with params: [data-call="modal#register.open"] [data-call.params='[{ "myAttribute": "myValue" }]']
 * 
*  -> modulus.seek('modal', '#register').open({ el, e, data })
 */
observe('[data-call]', {
  bind(el) {
    el.addEventListener('click', e => {
      const [str, name, id, method] = el.dataset.call.match(/([a-zA-Z-]+)([#.].+)\.(.+)/)
      if(name && id && method) {
        const component = seek(name, id)
        if(component) {
          const params = el.dataset['call.params']
          let data = null
          
          if (params) {
            try {
              data = JSON.parse(params)?.[0]
            } catch(e) {
              console.error('Invalid JSON format in `data-call.params`.', e)
            }
          }

          component[method]({ el, e, data })
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
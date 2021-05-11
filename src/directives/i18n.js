import { i18n } from '../helper'

export function setupI18nDirective (app) {
  app.directive('tvvp', {
    beforeMount: function (el, binding) {
      el.innerText = i18n.t(binding.value)
    }
  })
}

import i18n from './helper/i18n'
import Vue3VideoPlayer from './vue3-video-player.vue'
import BaseVideoCore from './core/base'
import EVENTS from './constants/EVENTS'
import { setupDirectives } from './directives'

const Vue3VideoPlayerPlugin = {
  install (app, options = {}) {
    i18n.setLocale(options.lang)
    app.config.globalProperties.$t = function (expression) {
      return i18n.t(expression)
    }
    setupDirectives(app)
    app.component(Vue3VideoPlayer.name, Vue3VideoPlayer)
  }
}

export default Vue3VideoPlayerPlugin
export {
  BaseVideoCore,
  EVENTS
}

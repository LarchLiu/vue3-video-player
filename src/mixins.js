import ee from 'event-emitter'
import EVENTS from './constants/EVENTS'
import * as types from './helper/type'
import { addClass, removeClass, registerFullScreenChangeListener, registerResizeListener } from './helper/dom'
// import eventBus from './helper/eve'
// import { getVideoCore } from './core'
const _ee = ee()

const mixins = {
  data () {
    return {
      fullscreen: false,
      isPlaying: false,
      isError: false,
      _playerKey: '',
      _events: {},
      _coreID: ''
    }
  },
  beforeMount () {
    this.on(EVENTS.LIFECYCLE_INITING, (player) => {
      this.$player = player
      this.$container = this.$player.$el
    })
    this.on(EVENTS.PLAY, () => {
      this.isPlaying = true
    })
    this.on([EVENTS.PAUSE, EVENTS.ENDED], () => {
      this.isPlaying = false
    })
    this.on(EVENTS.ERROR, () => {
      this.isError = true
    })
    registerFullScreenChangeListener((isFullScreen) => {
      if (isFullScreen) {
        addClass(this.$container, 'fullscreen')
      } else {
        removeClass(this.$container, 'fullscreen')
        if (this.fullscreen) {
          this.fullscreen = false
        }
      }
      this.emit(EVENTS.UI_FULLSCREEN, isFullScreen)
    })
    registerResizeListener(() => {
      this.emit(EVENTS.UI_RESIZE, true)
    })
  },
  methods: {
    play () {
      this.$player.play()
    },
    pause () {
      this.$player.pause()
    },
    enterFullscreen () {
      const el = this.$container
      if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      } else if (el.requestFullScreen) {
        el.requestFullscreen()
      }
      this.fullscreen = true
    },
    cancelFullscreen () {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.cancelFullScreen) {
        document.cancelFullScreen()
      }
      this.fullscreen = false
    },
    getFullscreen () {
      return (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
    },
    on (event, callback) {
      let eventId
      if (types.isString(event)) {
        if (this.isGlobalEvent(event)) {
          eventId = event
        } else {
          eventId = this.eventID(event)
        }
        this._events[eventId] = callback
        _ee.on(eventId, callback)
      } else if (Array.isArray(event)) {
        event.forEach((item) => {
          if (this.isGlobalEvent(item)) {
            eventId = event
          } else {
            eventId = this.eventID(item)
          }
          this._events[eventId] = callback
          _ee.on(eventId, callback)
        })
      }
    },
    emit (event, res) {
      let eventId
      if (this.isGlobalEvent(event)) {
        eventId = event
      } else {
        eventId = this.eventID(event)
      }
      _ee.emit(eventId, res)
    },
    off (event, callback) {
      let eventId
      if (this.isGlobalEvent(event)) {
        eventId = event
      } else {
        eventId = this.eventID(event)
      }
      _ee.off(eventId, callback)
    },
    removeAllEvents () {
      for (const item in this._events) {
        _ee.off(item, this._events[item])
      }
    },
    addClass (cls) {
      this.$container.classList.add(cls)
    },
    removeClass (cls) {
      this.$container.classList.remove(cls)
    },
    eventID (event) {
      return `${event}-${this._playerKey}`
    },
    isGlobalEvent (event) {
      return !!event.match(/global-.*/)
    }
  },
  beforeUnmount () {
    this.removeAllEvents()
  }
}

export default mixins

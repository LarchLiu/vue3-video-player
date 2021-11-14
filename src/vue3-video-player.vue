<template>
  <div class="vcp-container" ref="vcp-el">
    <video
      ref="vcp-video"
      :title="title"
      :cover="cover"
      :loop="loop"
      :playsinline="playsinline"
      :src="source"></video>
    <Layers v-bind="$attrs" />
    <Dashboard v-if="!isMobile" :controls="controls" :muted="muted">
      <template #cusControls>
        <template v-if="slots && slots.cusControls">
          <slot name="cusControls"></slot>
        </template>
      </template>
    </Dashboard>
    <MobileDashboard v-if="isMobile" :controls="controls" :muted="muted" />
  </div>
</template>

<script>
import './style/common.less'

import { provide, getCurrentInstance, reactive } from 'vue'
import { EVENTS, DEFAULT_CONFIG } from './constants'
import { parseMediaList } from './helper/media'
import { initVideoCore } from './core'
import coreMixins from './mixins'
import { isMobile, toCamelCase, guid } from './helper/util.js'
import Dashboard from './dashboard/dashboard.vue'
import MobileDashboard from './dashboard/mobile-dashboard.vue'
import Layers from './layers/layers.vue'

export default {
  name: 'Vue3VideoPlayer',
  inheritAttrs: false,
  mixins: [coreMixins],
  components: {
    Dashboard,
    MobileDashboard,
    Layers
  },
  props: {
    src: [String, Array],
    resolution: {
      type: String,
      default: DEFAULT_CONFIG.resolution
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    playsinline: {
      type: Boolean,
      default: true
    },
    title: String,
    cover: String,
    logo: String,
    muted: {
      type: Boolean,
      default: false
    },
    controls: {
      type: [String, Boolean],
      default: true
    },
    lang: {
      type: [String, Object],
      default: 'en'
    },
    core: {
      type: Function
    },
    viewCore: {
      type: Function
    }
  },
  setup (props) {
    const playerKey = 'key-' + guid()
    provide('playerKey', playerKey)

    const slots = reactive({})
    return {
      playerKey,
      slots
    }
  },
  data () {
    return {
      isMobile: isMobile,
      player: null
    }
  },

  computed: {
    source: function () {
      const { src } = this
      if (!src) {
        return ''
      }
      // const resolution = DEFAULT_CONFIG.resolution
      const medias = parseMediaList(src)
      let url
      medias.forEach((media) => {
        if (media.resolution === this.resolution) {
          url = media.src
        }
      })
      if (!url) {
        if (typeof medias[0] === 'object' && medias[0].src) {
          url = medias[0].src
        } else if (typeof medias[0] === 'string') {
          url = medias[0]
        }
      }
      if (this.player) {
        this.player.setSource(src)
      }
      return url
    }
  },
  created () {
    this._playerKey = this.playerKey
    this.on(EVENTS.GLOBAL_AUTO_PLAY, (status) => {
      this.player.setConfig('autoplay', status)
    })
    const ins = getCurrentInstance()
    this.slots = ins.slots ? ins.slots : {}
  },
  mounted () {
    // const self = this
    this.player = this.videoCore = initVideoCore({
      ...this.$props,
      videoEl: this.$refs['vcp-video'],
      el: this.$refs['vcp-el'],
      eventEmitter: {
        on: this.on,
        emit: this.emit,
        off: this.off
      }
    })
    Object.values(EVENTS).forEach(item => {
      this.player.on(item, (e) => {
        const cc = toCamelCase(`on-${item}`)
        if (typeof this.$attrs[cc] === 'function') {
          this.$attrs[cc](e)
        }
      })
    })
    this._coreID = this.videoCore.id
    this.emit(EVENTS.LIFECYCLE_INITING, this.player)
    if (this.viewCore && typeof this.viewCore === 'function') {
      try {
        this.viewCore(this.player)
      } catch (err) {
        console.error(err)
      }
    }
  },
  beforeUnmount () {
    this.player.destroy()
  }

}
</script>

<style lang="less">

.vcp-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #000;
}
.vcp-container  video{
  display: block;
  background-color: #000;
  // vertical-align: middle;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="vcp-layer cover-layer" v-show="show">
    <img v-if="cover" alt="video cover" :src="cover" />
  </div>
</template>

<script>
import { EVENTS } from '../constants'
import coreMixins from '../mixins'
import { inject } from 'vue'

export default {
  name: 'CoverLayer',
  mixins: [coreMixins],
  props: {
    visible: Boolean
  },
  data () {
    return {
      cover: '',
      show: false
    }
  },
  setup () {
    const playerKey = inject('playerKey')
    return {
      playerKey
    }
  },
  created () {
    this._playerKey = this.playerKey
  },
  beforeMount () {
    this.on(EVENTS.LIFECYCLE_INITING, (player) => {
      const { cover } = player.config
      if (cover) {
        this.cover = cover
        this.show = true
      }
    })
    this.on(EVENTS.ERROR_AUTO_PLAY, () => {
      this.show = true
    })
    this.on(EVENTS.PLAY, () => {
      this.show = false
    })
    this.on(EVENTS.SEEKED, () => {
      this.show = false
    })
  }
}
</script>

<style lang="less">
.cover-layer {
  z-index: 11;
  background-color: #333;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

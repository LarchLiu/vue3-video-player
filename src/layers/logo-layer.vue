<template>
  <div class="vcp-layer logo-layer" v-if="logo">
    <div class="logo-wrap">
      <img alt="logo" :src="logo" />
    </div>
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
  setup () {
    const playerKey = inject('playerKey')
    return {
      playerKey
    }
  },
  created () {
    this._playerKey = this.playerKey
  },
  data () {
    return {
      logo: ''
    }
  },

  mounted () {
    this.on(EVENTS.LIFECYCLE_INITING, (player) => {
      const { logo } = player.config
      if (logo) {
        this.logo = logo
      }
    })
  }
}
</script>

<style lang="less">
.logo-layer {
  z-index: 13;
  text-align: left;
  .logo-wrap{
    position: absolute;
    top: 15px;
    right: 15px;
    opacity: .8;
    text-align: right;
    img {
      max-width: 160px;
      height: 48px;
    }
  }
}
</style>

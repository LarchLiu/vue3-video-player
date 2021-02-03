<template>
  <div class="vcp-layer play-pause-layer" @click="onClick">
    <a href="javascript:;" v-if="!isPlaying" v-show="show" :class="['btn-control', {'mobile': isMobile}]" @click="play">
      <svg xmlns="http://www.w3.org/2000/svg" class="btn-play" :width="isMobile ? 21 : 31" :height="isMobile ? 25 : 35" viewBox="0 0 41 47"><path d="M23.5,0,47,41H0Z" transform="translate(41) rotate(90)" fill="#ff6060"/></svg>
    </a>
    <a href="javascript:;" v-if="isPlaying" v-show="show" :class="['btn-control', {'mobile': isMobile}]" @click="pause">
      <svg xmlns="http://www.w3.org/2000/svg" class="btn-pause" :width="isMobile?17:27" :height="isMobile?26:36" viewBox="0 0 36 48"><g transform="translate(-950 -398)"><rect width="12" height="48" transform="translate(950 398)" fill="#ff6060"/><rect width="12" height="48" transform="translate(974 398)" fill="#ff6060"/></g></svg>
    </a>
  </div>
</template>

<script>
import { isMobile } from '../helper/util'
import { EVENTS } from '../constants'
import coreMixins from '../mixins'
import { inject } from 'vue'

export default {
  name: 'PlayPauseLayer',
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
      show: false,
      isMobile: isMobile
    }
  },
  mounted () {
    this.on(EVENTS.ERROR, () => {
      this.show = false
    })
    if (isMobile) {
      this.on([EVENTS.UI_DASHBOARD_SHOW, EVENTS.ENDED, EVENTS.PAUSE], () => {
        if (this.isError) {
          this.show = false
          return
        }
        this.show = true
      })
      this.on(EVENTS.UI_DASHBOARD_HIDE, () => {
        if (this.isError) {
          this.show = false
          return
        }
        if (this.isPlaying) { this.show = false } else { this.show = true }
      })
    } else {
      this.on([EVENTS.UI_DASHBOARD_HIDE, EVENTS.UI_DASHBOARD_SHOW, EVENTS.PLAY, EVENTS.ENDED, EVENTS.PAUSE], () => {
        if (this.isError) {
          this.show = false
          return
        }
        if (this.isPlaying) { this.show = false } else { this.show = true }
      })
    }
  },
  methods: {
    onClick () {
      if (!isMobile) {
        if (this.isPlaying) {
          this.pause()
        } else {
          this.play()
        }
      }
    }
  }
}
</script>

<style lang="less">
.play-pause-layer {
  z-index: 13;
  background: rgba(0,0,0, 0);
}
.play-pause-layer .btn-control{
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  margin-top: -30px;
  background-color: #fff;
  border-radius: 30px;
}
.play-pause-layer .btn-control:before{
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 72px;
  height: 72px;
  margin-left: -36px;
  margin-top: -36px;
  border-radius: 36px;
  background-color: rgba(255,255,255, .25);
}
.play-pause-layer .btn-control .btn-play {
  margin-left: 10px;
}
.play-pause-layer .mobile {
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  border-radius: 20px;
}
.play-pause-layer .mobile:before{
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  border-radius: 24px;
}
.play-pause-layer .mobile .btn-play{
  margin-left: 7px;
}

</style>

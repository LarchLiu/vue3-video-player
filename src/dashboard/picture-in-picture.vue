<template>
  <div class="vue-core-video-player-control" v-if="show" @click="requestPictureInPicture">
    <div class="btn-control btn-pip" >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16"><g data-name="6 13"><g data-name="5 1" fill="#fff"><path data-name="9" d="M18 14h10v2H18z"/><path data-name="10" d="M26 9h2v6h-2z"/></g></g><g data-name="6 14" fill="#fff"><g data-name="4 1"><path data-name="7" d="M12 16H2v-2h10z"/><path data-name="8" d="M2 16H0V6h2z"/></g><path data-name="41" d="M28 2H0V0h28z"/></g></svg>
      <div class="tips">{{$tvvp('dashboard.btn.pip')}}</div>
    </div>
  </div>
</template>

<script>
// import EVENTS from '../constants/EVENTS'
import coreMixins from '../mixins'
import { inject } from 'vue'
import { isSupportPIP } from '../helper/util'

export default {
  name: 'PictureInPicture',
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
  data () {
    return {
      show: false
    }
  },
  created () {
    if (isSupportPIP) {
      this.show = true
    }
    this._playerKey = this.playerKey
  },
  methods: {
    requestPictureInPicture () {
      this.$player.requestPictureInPicture()
    }
  }
}
</script>

<style lang="less">
.vue-core-video-player-control {
  .btn-pip {
    svg{
      width: 22px;
    }
  }
}
</style>

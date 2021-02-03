<template>
  <div class="vcp-layer error-layer" v-show="show">
   <div class="error-msg-wrap">
     <h2>{{$t('layers.error.title')}}</h2>
     <p class="error-msg">{{errMsg}}</p>
   </div>
  </div>
</template>

<script>
import { EVENTS } from '../constants'
import coreMixins from '../mixins'
import { i18n } from '../helper'
import { inject } from 'vue'

export default {
  name: 'CoverLayer',
  mixins: [coreMixins],
  props: {
    dsiable: Boolean
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
      errMsg: '',
      show: false
    }
  },
  mounted () {
    this.on(EVENTS.ERROR, (e) => {
      console.log(e)
      this.show = true
      var errorKey = 'layers.error.' + e.code
      this.errMsg = i18n.t(errorKey, '')
    })
  }
}
</script>

<style lang="less">
.error-layer {
  z-index: 14;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-repeat: repeat;
  text-align: center;
  .error-msg-wrap {
    border-radius: 10px;
    padding: 10px;
    background-color:#00000090;
  }
  .error-msg{
    font-weight: bold;
    color: rgb(255, 255, 255);
  }
}
</style>

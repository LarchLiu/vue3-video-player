<template>
  <div class="vue-core-video-player-layers">
    <cover-layer></cover-layer>
    <logo-layer></logo-layer>
    <title-layer></title-layer>
    <play-pause-layer></play-pause-layer>
    <loading-layer></loading-layer>
    <error-layer></error-layer>
    <barrage-layer v-bind="$attrs"></barrage-layer>
  </div>
</template>

<script>
import TitleLayer from './title-layer'
import LogoLayer from './logo-layer'
import PlayPauseLayer from './play-pause-layer.vue'
import CoverLayer from './cover-layer'
import LoadingLayer from './loading-layer'
import ErrorLayer from './error-layer'
import BarrageLayer from './barrage-layer'

export default {
  name: 'Layers',
  components: {
    PlayPauseLayer,
    CoverLayer,
    LogoLayer,
    TitleLayer,
    LoadingLayer,
    ErrorLayer,
    BarrageLayer
  },
  inheritAttrs: false,
  props: {
    visible: Boolean
  }
}
</script>

<style>
.vue-core-video-player-layers {
  z-index: 11;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>

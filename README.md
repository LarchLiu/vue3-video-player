# vue3-video-player

#### vue3 version of [vue-core-video-player](https://github.com/core-player/vue-core-video-player)

[![npm version](https://img.shields.io/npm/v/@cloudgeek/vue3-video-player.svg?style=flat-square)](https://www.npmjs.com/package/@cloudgeek/vue3-video-player)
[![npm downloads](https://img.shields.io/npm/dm/@cloudgeek/vue3-video-player.svg?style=flat-square)](https://www.npmjs.com/package/@cloudgeek/vue3-video-player)

## Feature
- multiple instances in the same page
  
- support barrage / danmaku

- customize controls [demo](https://stackblitz.com/edit/vitejs-vite-rf6dum?file=src%2FApp.vue)

- HLS plugin [@cloudgeek/playcore-hls](https://github.com/LarchLiu/playcore-hls)

- i18n: zh-CN | pt-BR | jp | en(default)

- [example](https://github.com/LarchLiu/vue3-video-player/blob/master/src/App.vue) &ensp; [demo](https://cloudgeektech.com/vue3-video-player/)

## Get Started

#### Npm

``` bash
$ npm install @cloudgeek/vue3-video-player --save
```

#### Yarn

``` bash
$ yarn add @cloudgeek/vue3-video-player
```

## Basic Use
```
// main.js
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player'
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css'

const app = createApp(App)

app.use(Vue3VideoPlayer, {
  lang: 'zh-CN'
}).mount('#app')
```
``` vue
// your component
<template>
  <div class="player-container">
    <vue3-video-player @play="your_method" src="./videos/your_video.mp4"></vue3-video-player>
  </div>
<template>
```

## Support barrage / danmaku

``` vue
<div class="test-player-wrap">
  <vue3-video-player @global-auto-play="autoPlay" :src="source2" title="Smartisan T1"
  :barrageConfig="{fontSize: 20, opacity: 90, position: 80, barrageList: barrages2}" :view-core="viewCore">
  </vue3-video-player>
</div>
```

## Customize Controls

Use slot name 'cusControls' like this:

```vue
<vue3-video-player :src="source" :view-core="viewCore.bind(null, 'video1')">
  <template #cusControls>
    <picture-in-picture :player="players['video1']" />
    <span class="btn-play" @click="play('video1')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="41"
        height="47"
        viewBox="0 0 41 47"
      >
        <path
          d="M23.5,0,47,41H0Z"
          transform="translate(41) rotate(90)"
          fill="#fff"
        />
      </svg>
    </span>
  </template>
</vue3-video-player>
```
You can use custom components like [PictureInPicture](https://stackblitz.com/edit/vitejs-vite-rf6dum?file=src%2Fcomponents%2FPictureInPicture.vue)

If you want to use video player funtion, just pass props of view-core and you will get the instance of player.

If there are multiple videos you can control player with id that defined by yourself.

``` vue
viewCore (id, player) {
  console.log(id, player)
  this.players[id] = player
}
```

[example](https://stackblitz.com/edit/vitejs-vite-rf6dum?file=src%2FApp.vue)

## HLS
```
import HLSCore from '@cloudgeek/playcore-hls'
```

``` vue
<div class="test-player-wrap">
  <vue3-video-player :core="HLSCore" :src="liveArrSource" title="test">
  </vue3-video-player>
</div>
```

## i18n
You can use the built-in languages: 'en', 'zh-CN', 'pt-BR', 'jp'
```vue
app.use(Vue3VideoPlayer, {
  lang: 'zh-CN'
}).mount('#app')
```
Or defined by yourself
```vue
const myLang = {
  dashboard: {
    btn: {
      play: '播放',
      pause: 'Pause',
      fullscreen: 'Tela inteira',
      exitFullscreen: 'Sair da tela inteira',
      mute: 'Mute',
      unmute: 'Unmute',
      back: 'Back',
      pip: 'ピクチャインピクチャ',
    },
    settings: {
      autoplay: 'Autoplay',
      loop: 'ループプレイ',
      speed: 'Speed',
      resolution: 'Resolution',
    },
  },
  layers: {
    error: {
      title: 'Error!',
      2404: 'Video Source Undefined',
      2502: 'Media Network Error',
      2503: 'Video Cannot DECODE',
      2504: 'Video Cannot Play!',
      601: 'Live video Cannot Play!',
    },
    loading: {
      msg: 'Loading ...',
    },
  },
};

app.use(Vue3VideoPlayer, {
  lang: myLang
}).mount('#app')
```
[example](https://stackblitz.com/edit/vitejs-vite-rf6dum?file=src%2Fmain.js)
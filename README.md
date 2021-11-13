# vue3-video-player

#### vue3 version of [vue-core-video-player](https://github.com/core-player/vue-core-video-player)

[![npm version](https://img.shields.io/npm/v/@cloudgeek/vue3-video-player.svg?style=flat-square)](https://www.npmjs.com/package/@cloudgeek/vue3-video-player)
[![npm downloads](https://img.shields.io/npm/dm/@cloudgeek/vue3-video-player.svg?style=flat-square)](https://www.npmjs.com/package/@cloudgeek/vue3-video-player)

## Feature
- multiple instances in the same page
  
- support barrage / danmaku

- customize controls [demo](https://stackblitz.com/edit/vitejs-vite-rf6dum?file=src%2FApp.vue)

- HLS plugin [@cloudgeek/playcore-hls](https://github.com/LarchLiu/playcore-hls)

- [example](https://github.com/LarchLiu/vue3-video-player/blob/master/src/App.vue) &ensp; [demo](https://cloudgeektech.com/vue3-video-player/)

## Get Started

#### Npm

``` bash
$ npm install @cloudgeek/vue3-video-player --save
```

#### Yarn

``` bash
$ yarn add @cloudgeek/vue3-video-player --save
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

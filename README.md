# vue3-video-player

#### vue3 version of [vue-core-video-player](https://github.com/core-player/vue-core-video-player)

[![npm version](https://img.shields.io/npm/v/@cloudgeek/vue3-video-player.svg?style=flat-square)](https://www.npmjs.com/package/@cloudgeek/vue3-video-player)
[![npm downloads](https://img.shields.io/npm/dm/@cloudgeek/vue3-video-player.svg?style=flat-square)](https://www.npmjs.com/package/@cloudgeek/vue3-video-player)
## Get Started

### Npm

``` bash
$ npm install @cloudgeek/vue3-video-player --save
```

### Yarn

``` bash
$ yarn add @cloudgeek/vue3-video-player --save
```

#### main.js
```
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player'
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css'

const app = createApp(App)

app.use(Vue3VideoPlayer, {
  lang: 'zh-CN'
}).mount('#app')
```
#### your component
``` vue
<template>
  <div class="player-container">
    <vue3-video-player @play="your_method" src="./videos/your_video.mp4"></vue3-video-player>
  </div>
<template>
```

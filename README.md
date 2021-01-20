# vue3-video-player

## vue3 version of [vue-core-video-player](https://github.com/core-player/vue-core-video-player)

## Get Started

### Npm

``` bash
$ npm install @cloudgeek/vue3-video-playe --save
```

### Yarn

``` bash
$ yarn add @cloudgeek/vue3-video-playe --save
```

#### main.js
```
import Vue3VideoPlayer from '@cloudgeek/vue3-video-playe'

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

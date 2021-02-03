<template>
  <div id="app">
    <div class="test-player-wrap">
      <vue3-video-player @play="playFunc" :src="source" title="《Your Name》OST Sparkle" :view-core="viewCore"
      :cover="cover" :barrageConfig="{barrageList: barrages}" :logo="logo">
      </vue3-video-player>
    </div>
    <div class="test-player-wrap">
      <vue3-video-player @global-auto-play="autoPlay" :src="source2" title="Smartisan T1"
      :barrageConfig="{fontSize: 20, opacity: 90, position: 80, barrageList: barrages2}" :view-core="viewCore">
      </vue3-video-player>
    </div>
  </div>
</template>

<script>

// const barragesJson = window.barragesJson

const videoSource = [
  {
    src: 'https://media.vued.vanthink.cn/y2mate.com%20-%20Sparkle%20_%20Your%20Name%20AMV_K_7To_y9IAM_240p.mp4',
    resolution: '240p'
  },
  {
    src: 'https://media.vued.vanthink.cn/y2mate.com%20-%20Sparkle%20_%20Your%20Name%20AMV_K_7To_y9IAM_360p.mp4',
    resolution: '360p'
  }, {
    src: 'https://media.vued.vanthink.cn/sparkle_your_name_am720p.mp4',
    resolution: '720p'
  }, {
    src: 'https://media.vued.vanthink.cn/y2mate.com%20-%20sparkle_your_name_amv_K_7To_y9IAM_1080p.mp4',
    resolution: '1080p'
  }
]

// const videoSource = [
//   {
//     src: 'https://media.vued.vanthink.cn/sparkle_your_name_am720p.webm',
//     type: 'video/webm'
//   },
//   {
//     src: 'https://media.vued.vanthink.cn/sparkle_your_name_am720p.mp4',
//     type: 'video/mp4'
//   }
// ]

// const videoSource2 = 'https://media.vued.vanthink.cn/the_garden_of_words_trailer_english__1080p.mp4'
const videoSource2 = 'https://static.smartisanos.cn/common/video/smartisant1.mp4'

const cover = 'https://img1.wxzxzj.com/maxresdefault.jpg'

export default {
  name: 'app',
  data () {
    return {
      source: videoSource,
      source2: videoSource2,
      cover: cover,
      logo: require('@/assets/logo.png'),
      barrages: [],
      barrages2: [],
      viewCore: [(_, config) => { console.log(config) }]
    }
  },
  methods: {
    change () {
      this.source = videoSource
    },
    playFunc () {
      console.log('play!!!!')
    },
    autoPlay (b) {
      console.log('auto play change to ' + b)
    },
    loadFile (name) {
      const xhr = new XMLHttpRequest()
      const okStatus = document.location.protocol === 'file:' ? 0 : 200
      xhr.open('GET', name, false)
      xhr.overrideMimeType('text/html;charset=utf-8')// 默认为utf-8
      xhr.send(null)
      return xhr.status === okStatus ? xhr.responseText : null
    }
  },
  created () {
    const arr = [
      'vue3 video player',
      'awesome 棒棒棒',
      '6000 units 6000弹幕',
      'test 测试一下吧',
      '60 FPS',
      'test in fullscreen mode 全屏模式试一试'
    ]
    const temp = []
    for (let i = 0; i < 6; i++) {
      for (let index = 0; index < 1000; index++) {
        const time = parseInt(Math.random() * 408927)
        if (index % 4 === 0) {
          temp.push({
            type: 0,
            content: arr[parseInt(Math.random() * arr.length)],
            avatar: 'https://api.multiavatar.com/LarchLiu.png',
            username: 'LarchLiu' + time,
            time: parseFloat(time / 1000)
          })
        } else if (index % 4 === 1) {
          temp.push({
            type: 3,
            content: arr[parseInt(Math.random() * arr.length)],
            time: parseFloat(time / 1000)
          })
        } else if (index % 4 === 2) {
          temp.push({
            type: 1,
            content: arr[parseInt(Math.random() * arr.length)],
            time: parseFloat(time / 1000)
          })
        } else {
          temp.push({
            type: 2,
            content: arr[parseInt(Math.random() * arr.length)],
            time: parseFloat(time / 1000),
            color: parseInt(Math.random() * 16777215)
          })
        }
      }
    }
    this.barrages = temp.sort((a, b) => { return a.time - b.time })
    // const temp2 = []
    // barragesJson.forEach((item) => {
    //   const barrage = {
    //     time: item[0],
    //     type: item[1],
    //     color: item[2],
    //     content: item[4]
    //   }
    //   temp2.push(barrage)
    // })
    // this.barrages2 = temp2.sort((a, b) => { return a.time - b.time })

    let xmlData = this.loadFile(process.env.BASE_URL + '158231237.xml')
    // eslint-disable-next-line
    xmlData = xmlData.replace(/(?:[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, '')

    var data = (new DOMParser()).parseFromString(xmlData, 'text/xml')
    const temp2 = Array.apply(Array, data.querySelectorAll('d')).map(function (line) {
      var info = line.getAttribute('p').split(','); var text = line.textContent
      return {
        content: text,
        time: parseFloat(parseInt(Math.random() * 86698) / 1000),
        type: [0, 0, 0, 0, 2, 1][Number(info[1])],
        color: parseInt(info[3], 10)
      }
    })
    this.barrages2 = temp2.sort((a, b) => { return a.time - b.time })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
#app .vue-core-video-player-containers {
  margin: 30px auto;
}
#app .test-player-wrap {
  width: 720px;
  position: relative;
  margin: 30px auto;
}

@media all and (max-width: 768px) {
  #app .test-player-wrap {
    width: 100%;
    height: auto;
  }
}
</style>

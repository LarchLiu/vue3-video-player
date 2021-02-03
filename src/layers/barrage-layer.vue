<template>
  <div v-show="show" class="barrage-layer">
    <div class="barrage-wrapper">
      <div class="barrage-container"
        :class="{'ani-pause':isPause,'ani-running':!isPause || isEnded}"
        ref="barrageContainer"
      >
        <div class="barrage-item left-item">
          <div class="item-content" :style="{fontSize: currentFontSize+'px'}" ref="tempItem">
            temp
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { inject } from 'vue'
import { EVENTS, DEFAULT_CONFIG } from '../constants'
import coreMixins from '../mixins'
import multiavatar from '@multiavatar/multiavatar'
import { isSafari, number2Color, number2Type } from '../helper/util'

const defaultConfig = {
  percent: DEFAULT_CONFIG.barragePosition,
  fontSize: DEFAULT_CONFIG.barrageFontSize,
  opacity: DEFAULT_CONFIG.barrageOpacity,
  barrageList: []
}
const speed = 144 // 720 / 5

export default {
  name: 'BarrageLayer',
  mixins: [coreMixins],
  props: {
    barrageConfig: {
      type: Object,
      default: () => {
        return defaultConfig
      }
    }
  },
  setup () {
    const playerKey = inject('playerKey')
    return {
      playerKey
    }
  },
  data () {
    return {
      show: true,
      channelCount: 8,
      hasLeftPosition: [],
      hasRightPosition: [],
      hasTopPosition: [],
      hasBottomPosition: [],
      barrageContainer: null,
      barMainWidth: 500,
      barMainHeight: 0,
      currentTime: 0,
      currentOpacity: this.barrageConfig.opacity ? this.barrageConfig.opacity : DEFAULT_CONFIG.barrageOpacity,
      currentFontSize: this.barrageConfig.fontSize ? this.barrageConfig.fontSize : DEFAULT_CONFIG.barrageFontSize,
      currentPosition: this.barrageConfig.position ? this.barrageConfig.position : DEFAULT_CONFIG.barragePosition,
      barrages: this.barrageConfig.barrageList ? this.barrageConfig.barrageList : [],
      barragesIndex: 0,
      isEnded: false,
      isPause: true,
      svgAvatar: {},
      moveDuration: 5,
      isSafari: isSafari(),
      tempItem: null
    }
  },
  computed: {
    itemHeight () {
      return this.currentFontSize + 4
    }
  },
  created () {
    this._playerKey = this.playerKey
  },
  mounted () {
    this.barrageContainer = this.$refs.barrageContainer
    this.barMainWidth = this.barrageContainer.clientWidth
    this.barMainHeight = this.barrageContainer.clientHeight
    this.moveDuration = Math.min(Math.floor(this.barMainWidth / speed), 10)

    this.getTempItem()
    this.getChannelCount()
    this.positionInit()

    if (this.barrages.length) {
      this.show = true
      window.requestAnimationFrame(() => {
        this.frame()
      })
    } else {
      this.show = false
    }

    this.on(EVENTS.PLAY, () => {
      this.isEnded = false
      this.playBarrage()
    })
    this.on(EVENTS.PAUSE, () => {
      this.pauseBarrage()
    })
    this.on(EVENTS.ENDED, () => {
      this.isEnded = true
    })
    this.on([EVENTS.UI_FULLSCREEN, EVENTS.UI_RESIZE], () => {
      this.resize()
    })
    this.on(EVENTS.SEEKING, () => {
      this.seeking()
    })
    this.on(EVENTS.SEEKED, () => {
      this.seeked()
    })
    this.on(EVENTS.GLOBAL_BARRAGE_FONT_SIZE, (size) => {
      this.currentFontSize = size
      this.getTempItem()
    })
    this.on(EVENTS.GLOBAL_BARRAGE_OPACITY, (opacity) => {
      this.currentOpacity = opacity
    })
    this.on(EVENTS.GLOBAL_BARRAGE_POSITION, (position) => {
      this.currentPosition = position
    })
  },
  watch: {
    currentPosition () {
      this.getChannelCount()
    }
  },
  methods: {
    getMultiavatar (name) {
      const reg = /\s|\+|`|~|!|@|#|\$|\^|&|\*|\(|\)|=|\||\{|\}|'|:|;|'|,|\\|\[|\]|<|>|\/|\?|～|！|@|#|￥|……|&|\*|（|）|——|\||\{|\}|【|】|‘|；|：|”|“|'|。|，|、|？/g
      const formatName = name.replace(reg, '')
      if (this.svgAvatar[`${formatName}`]) {
        return this.svgAvatar[`${formatName}`]
      }
      const svgCode = multiavatar(name)
      this.svgAvatar[`${formatName}`] = svgCode
      return svgCode
    },
    getChannelCount () {
      this.channelCount = Math.floor(this.barMainHeight * (this.currentPosition / 100) / (this.itemHeight))
    },
    getTempItem () {
      const measureStyle = getComputedStyle(this.$refs.tempItem, null)
      this.tempItem = document.createElement('canvas').getContext('2d')
      const fontSize = measureStyle.getPropertyValue('font-size')
      const fontFamily = measureStyle.getPropertyValue('font-family')
      this.tempItem.font = `${fontSize} ${fontFamily}`
    },
    positionInit () {
      for (let i = 0; i < this.channelCount; i++) {
        this.hasLeftPosition[i] = true
        this.hasRightPosition[i] = true
        this.hasTopPosition[i] = true
        this.hasBottomPosition[i] = true
      }
    },
    getChannel (direction) {
      for (let i = 0; i < this.channelCount; i++) {
        switch (direction) {
          case 'left':
            if (this.hasLeftPosition[i]) { return i % this.channelCount }
            break
          case 'right':
            if (this.hasRightPosition[i]) { return i % this.channelCount }
            break
          case 'top':
            if (this.hasTopPosition[i]) { return i % this.channelCount }
            break
          case 'bottom':
            if (this.hasBottomPosition[i]) { return i % this.channelCount }
            break
        }
      }
      return -1
    },
    createBarrageDom (barrage, channel) {
      const classList = ['barrage-item']
      if (barrage.isSelf) {
        classList.push('self-item')
      }
      const direction = number2Type(barrage.type)
      classList.push(`${direction}-item`)

      const dom = document.createElement('div')
      const domA = document.createElement('div')
      const domC = document.createElement('div')

      dom.className = classList.join(' ')
      dom.style.opacity = parseFloat(this.currentOpacity / 100)
      if (barrage.username) {
        domA.className = 'item-avatar'
        const svgCode = this.getMultiavatar(barrage.username)
        domA.innerHTML = svgCode
        domA.style.width = domA.style.height = this.currentFontSize + 'px'
      } else if (barrage.avatar) {
        const domI = document.createElement('img')

        domA.className = 'item-avatar'
        domA.style.width = domA.style.height = this.currentFontSize + 'px'

        domI.style.width = domI.style.height = this.currentFontSize + 'px'
        domI.src = barrage.avatar
        domA.appendChild(domI)
      }
      if (barrage.content) {
        domC.className = 'item-content'
        domC.style.fontSize = this.currentFontSize + 'px'
        if (!barrage.color) {
          barrage.color = 16777215
        }
        domC.style.color = number2Color(barrage.color)
        domC.innerText = barrage.content
      }
      const itemWidth = this.measureItem(barrage.content, barrage.avatar || barrage.username)

      switch (direction) {
        case 'left':
          this.hasLeftPosition[channel] = false
          dom.addEventListener('animationend', () => {
            this.barrageContainer.removeChild(dom)
          })
          if (this.isSafari) {
            dom.style.transform = `translate3d(${this.barMainWidth}px, 0, 0) rotate(0.1deg)`
            dom.style.animation = `barrage-left-safari ${this.moveDuration}s linear`
          } else {
            dom.style.transform = `translate3d(${this.barMainWidth}px, 0, 0)`
            dom.style.animation = `barrage-left ${this.moveDuration}s linear`
          }
          dom.style.top = `${channel * (this.itemHeight)}px`
          dom.appendChild(domC)
          dom.appendChild(domA)
          setTimeout(() => {
            this.hasLeftPosition[channel] = true
          }, itemWidth * this.moveDuration * 1000 / (this.barMainWidth + itemWidth))
          break

        case 'right':
          this.hasRightPosition[channel] = false
          dom.addEventListener('animationend', () => {
            this.barrageContainer.removeChild(dom)
          })
          if (this.isSafari) {
            dom.style.transform = `translate3d(-${this.barMainWidth}px, 0, 0) rotate(0.1deg)`
            dom.style.animation = `barrage-right-safari ${this.moveDuration}s linear`
          } else {
            dom.style.transform = `translate3d(-${this.barMainWidth}px, 0, 0)`
            dom.style.animation = `barrage-right ${this.moveDuration}s linear`
          }
          dom.style.top = `${channel * (this.itemHeight)}px`
          dom.appendChild(domA)
          dom.appendChild(domC)
          setTimeout(() => {
            this.hasRightPosition[channel] = true
          }, itemWidth * this.moveDuration * 1000 / (this.barMainWidth + itemWidth))
          break

        case 'top':
          this.hasTopPosition[channel] = false
          dom.addEventListener('animationend', () => {
            this.barrageContainer.removeChild(dom)
            this.hasTopPosition[channel] = true
          })
          dom.style.top = `${channel * (this.itemHeight)}px`
          dom.appendChild(domA)
          dom.appendChild(domC)
          break

        case 'bottom':
          this.hasBottomPosition[channel] = false
          dom.addEventListener('animationend', () => {
            this.barrageContainer.removeChild(dom)
            this.hasBottomPosition[channel] = true
          })
          dom.style.bottom = `${channel * (this.itemHeight)}px`
          dom.appendChild(domA)
          dom.appendChild(domC)
          break
      }
      return dom
    },
    playBarrage () {
      this.isPause = false
    },
    pauseBarrage () {
      this.isPause = true
    },
    clear () {
      this.barragesIndex = 0
      this.barrageContainer.innerHTML = ''
      this.positionInit()
    },
    seeking () {
      if (this.show) {
        this.pauseBarrage()
        this.clear()
      }
    },
    seeked () {
      if (this.show) {
        this.currentTime = this.$player.getCurrentTime()
        for (let i = 0; i < this.barrages.length; i++) {
          if (this.barrages[i].time >= this.currentTime) {
            this.barragesIndex = i
            break
          }
          this.barragesIndex = this.barrages.length
        }
        if (this.isPlaying) {
          this.playBarrage()
        }
      }
    },
    resize () {
      if (this.show) {
        const beforeCount = this.channelCount
        this.barMainWidth = this.barrageContainer.clientWidth
        this.barMainHeight = this.barrageContainer.clientHeight
        this.moveDuration = Math.min(Math.floor(this.barMainWidth / speed), 10)
        this.getChannelCount()
        if (beforeCount < this.channelCount) {
          for (let i = beforeCount; i < this.channelCount; i++) {
            this.hasLeftPosition[i] = true
            this.hasRightPosition[i] = true
            this.hasTopPosition[i] = true
            this.hasBottomPosition[i] = true
          }
        }
      }
    },
    frame () {
      if (this.barrages.length && !this.isPause && this.show) {
        this.currentTime = this.$player.getCurrentTime()
        const barrages = []
        let item = this.barrages[this.barragesIndex]
        while (item && this.currentTime > (item.time)) {
          barrages.push(item)
          item = this.barrages[++this.barragesIndex]
        }
        this.draw(barrages)
      }
      window.requestAnimationFrame(() => {
        this.frame()
      })
    },
    draw (barrages) {
      const noPosition = { left: false, right: false, top: false, bottom: false }
      const docFragment = document.createDocumentFragment()
      for (let i = 0; i < barrages.length; i++) {
        const barrage = barrages[i]
        const direction = number2Type(barrage.type)
        const channel = this.getChannel(direction)

        if (!noPosition[`${direction}`] && channel !== -1) {
          const dom = this.createBarrageDom(barrage, channel)
          docFragment.appendChild(dom)
        } else {
          noPosition[`${direction}`] = true
        }
        if (noPosition.left && noPosition.right && noPosition.top && noPosition.bottom) {
          break
        }
      }
      this.barrageContainer.appendChild(docFragment)
    },
    measureItem (text, hasAvatar) {
      // text_width + text_padding + avatar_width + avatar_margin
      return this.tempItem.measureText(text).width + 10 + (hasAvatar ? (this.currentFontSize + 10) : 0)
    }
  }
}
</script>
<style lang="less">
.barrage-layer {
  * {
    margin: 0px;
    padding: 0px;
  }
  z-index: 12;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;

  .barrage-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .barrage-container {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;

      .barrage-item {
        z-index: 1;
        display: flex;
        user-select: none;
        white-space: pre;

        .item-avatar {
          position: relative;
          border-radius: 50%;
          margin-left: 5px;
          margin-right: 5px;
          overflow: hidden;
          svg, img {
            position: absolute;
            object-fit: cover;
            left: 0;
            top: 0;
          }
        }
        .item-content {
          display: block;
          color: #ffffff;
          font-family: SimHei, "Microsoft Yahei", Arial, Helvetica, sans-serif;
          line-height: 1;
          text-shadow: .5px .5px .5px rgba(0, 0, 0, .5);
        }
      }
    }
  }
}
.self-item {
  z-index: 2;
  border: 1px solid #87ceeb;
  box-sizing: border-box;
}
.left-item {
  position: absolute;
  padding: 2px 5px;
  left: 0px;
  transform: translate3d(-100%, 0, 0);
  will-change: transform;
}
.right-item {
  position: absolute;
  padding: 2px 5px;
  right: 0px;
  transform: translate3d(100%, 0, 0);
  will-change: transform;
}
.top-item,
.bottom-item {
  position: absolute;
  padding: 2px 0;
  width: 100%;
  left: 0px;
  justify-content: center;
  text-align: center;
  animation: barrage-center 4s linear;
  will-change: visibility;
}
@keyframes barrage-left-safari {
  from {
    transform: translate3d(-100%, 0, 0) rotate(0.1deg);
  }
}
@keyframes barrage-right-safari {
  from {
    transform: translate3d(100%, 0, 0) rotate(0.1deg);
  }
}
@keyframes barrage-left {
  from {
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes barrage-right {
  from {
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes barrage-center {
  from {
    visibility: visible;
  }
  to {
    visibility: hidden;
  }
}
.ani-pause {
  & div {
    animation-play-state: paused !important;
  }
}
.ani-running {
  & div {
    animation-play-state: running !important;
  }
}
.fullscreen .right-item {
  animation: barrage-right 8s linear;
 }
</style>

<template>
  <div class="vcp-switch" :class="{ open: isOpen}" @click="toggle"></div>
</template>

<script>

export default {
  name: 'setting-switch',
  props: {
    openStatus: Boolean
  },

  data () {
    return {
      isOpen: false
    }
  },

  methods: {
    toggle () {
      this.isOpen = !this.isOpen
      this.$emit('change', this.isOpen)
    },
    switch (status) {
      this.isOpen = status
    }
  }
}
</script>

<style lang="less">
.vcp-switch{
  display: inline-block;
  position: relative;
  width: 40px;
  height: 16px;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  &:after{
    content: '';
    display: inline-block;
    position: absolute;
    top: 1px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: #ff6060;
    transition: all .2s ease-in .05s;
  }
  &.open{
    &:after{
      left: 23px;
      background-color: #60ff60;
    }
  }
}
</style>

<template>
    <div ref="lottieContainer" :style="style"></div>
  </template>
  
  <script>
  import lottie from 'lottie-web';
  
  export default {
    props: {
      animationData: {
        type: Object,
        required: true
      },
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        animation: null
      };
    },
    computed: {
      style() {
        return {
          width: this.width,
          height: this.height
        };
      }
    },
    mounted() {
      this.animation = lottie.loadAnimation({
        container: this.$refs.lottieContainer,
        renderer: 'svg',
        loop: this.loop,
        autoplay: this.autoplay,
        animationData: this.animationData
      });
    },
    beforeDestroy() {
      if (this.animation) {
        this.animation.destroy();
      }
    }
  };
  </script>
  
  <style scoped>
  div {
    display: inline-block;
  }
  </style>
  
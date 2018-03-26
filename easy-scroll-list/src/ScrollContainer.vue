<template>
  <div :class="className" class="easy-scroll-container" style="overflow:auto;">
    <ul class="easy-scroll-list" style="transform: translate3D(0, 0, 0);" ref="scrollList">
      <slot></slot>
    </ul>
    <slot name="loading-layer"></slot>
    <div style="width: 2%;">
  
    </div>
  </div>
</template>

<script>
  import ScrollItem from './ScrollItem';
  import {
    throttle
  } from 'lodash'
  export default {
    props: {
      className: {
        type: [String, Array]
      }
    },
    data() {
      return {
        drag: false,
        startClientY: 0,
        startTransY: 0,
        scrollContainerHeight: 0
      }
    },
    methods: {
      handleMounseDown(e) {
        const target = e.target;
        if (target.nodeName === 'LI') {
          e.preventDefault();
          const transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
          const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);
  
          this.drag = true;
          this.startClientY = e.clientY;
          this.startTransY = parseInt(transY[1]);
        }
      },
      handleMouseMove(e) {
        if (this.drag) {
  
          // if (parseInt(transY[1]) > 0 && distance > 50) {
          //   distance = 50 + Math.log2(distance - 50);
          // }
          // if (parseInt(transY[1]) < -995 && distance < -50) {
          //   distance = -(50 + Math.log2(-(50 + distance)));
          // }
          window.requestAnimationFrame(() => {
            const transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
            const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);
            let distance = e.clientY - this.startClientY;
            throttle(() => {
              this.transY = e.clientY;
            }, 100)
            if (parseInt(transY[1]) > 0 && distance > 0) {
              // this.startTransY = 0;
              let result = this.startTransY + distance * 0.8;
              this.$refs.scrollList.style.transform = `translateZ(0) translateY(${result}px)`
            } else {
              this.$refs.scrollList.style.transform = `translateZ(0) translateY(${distance + this.startTransY}px)`
  
            }
  
          })
        }
      },
      handleMouseUp(e) {
        if (this.drag) {
          this.drag = false;
          const transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
          const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp)[1];
          let step = 5;
          if (transY > 0) {
            function refresh() {
              let target = arguments[0];
              const _transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
              let _transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(_transRegexp)[1];
              _transY *= 0.9;
              this.$refs.scrollList.style.transform = `translateZ(0) translateY(${_transY}px)`
              if (parseInt(_transY) > target) {
                window.requestAnimationFrame(refresh.bind(this, target));
              }
            }
            if (transY > 70) {
              refresh.call(this, 70);
              this.$emit('on-refresh', function() {
                refresh.call(this, 0);
              }.bind(this))
            } else {
              refresh.call(this, 0);
            }
          }
        }
      },
  
    },
    mounted() {
      const scrollList = this.$refs.scrollList;
      this.scrollContainerHeight = scrollList.offsetHeight;
      window.addEventListener('mousedown', this.handleMounseDown.bind(this));
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
      window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
  }
</script>

<style>
  .easy-scroll-container::-webkit-scrollbar {
    display: none;
  }
  
  .easy-scroll-container {
    position: relative;
  }
  
  .easy-scroll-list {
    width: 98%;
    padding: 0;
    margin: 0;
  }
</style>
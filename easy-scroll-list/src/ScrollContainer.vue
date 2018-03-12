<template>
  <div :class="className" style="overflow:auto;">
    <ul style="padding: 0;margin:0;transform: translateZ(0) translateY(-10px);width: 98%;" ref="scrollList">
      <slot></slot>
    </ul>
    <div style="width: 2%;">

    </div>
  </div>
</template>
<script>
import ScrollItem from './ScrollItem';
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
    }
  },
  methods: {
    handleMounseDown(e) {
      const target = e.target;
      if (target.nodeName === 'LI') {
        e.preventDefault();
        const transRegexp = window.getComputedStyle(this.$refs.scrollList).transform;
        const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);
        this.drag = true;
        this.startClientY = e.clientY;
        this.startTransY = parseInt(transY[1]);
      }
    },
    handleMouseMove(e) {
      if (this.drag) {
        window.requestAnimationFrame(function () {
          const transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
          const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);
          this.$refs.scrollList.style.transform = `translateZ(0) translateY(${e.clientY - this.startClientY + this.startTransY}px)`
        }.bind(this));

      }
    },
    handleMouseUp(e) {
      if (this.drag) {
        this.drag = false;
        const transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
        const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp)[1];
        if (parseInt(transY) > 50) {
          let step = 20;
          window.requestAnimationFrame(function () {
            const _transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
            const _transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(_transRegexp)[1];
            if (parseInt(transY) > 0 ) {
              this.$refs.scrollList.style.transform = `translateZ(0) translateY(0px)`
            }
          }.bind(this));

        }

      }
    },

  },
  mounted() {
    const scrollList = this.$refs.scrollList;
    window.addEventListener('mousedown', this.handleMounseDown.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }
}
</script>
<style>
  
</style>
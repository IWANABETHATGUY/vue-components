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
import ScrollItem from "./ScrollItem";
export default {
  props: {
    className: {
      type: [String, Array]
    }
  },
  data() {
    return {
      drag: false,
      loadingMore: false,
      startClientY: 0,
      startTransY: 0,
      scrollContainerHeight: 0,
      containerHeight: 0,
      maxScrollHeight: 0
    };
  },
  methods: {
    handleMounseDown(e) {
      const target = e.target;
      if (target.nodeName === "LI") {
        e.preventDefault();
        const transRegexp = window.getComputedStyle(this.$refs.scrollList, null)
          .transform;
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
          const transRegexp = window.getComputedStyle(
            this.$refs.scrollList,
            null
          ).transform;
          const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(
            transRegexp
          );
          let distance = e.clientY - this.startClientY;
          let transYValue = parseInt(transY[1]);
          if (transYValue > 0 && distance > 0) {
            // this.startTransY = 0;
            let result = this.startTransY + distance;
            this.$refs.scrollList.style.transform = `translateZ(0) translateY(${0.5 *
              result}px)`;
          } else if (transYValue <= -this.maxScrollHeight && distance < 0) {
            // this.$refs.scrollList.style.transform = `translateZ(0) translateY(${distance + this.startTransY}px)`
            function afterPreload() {
              this.$nextTick(() => {
                this.scrollContainerHeight = this.$refs.scrollList.offsetHeight;
                this.maxScrollHeight =
                  this.scrollContainerHeight - this.containerHeight;
              });
              this.loadingMore = false;
            }
            if (!this.loadingMore) {
              this.loadingMore = true;
              this.$emit("on-pre-load", afterPreload.bind(this));
            }
          } else {
            this.$refs.scrollList.style.transform = `translateZ(0) translateY(${distance +
              this.startTransY}px)`;
          }
        });
      }
    },
    handleMouseUp(e) {
      if (this.drag) {
        this.drag = false;
        const transRegexp = window.getComputedStyle(this.$refs.scrollList, null)
          .transform;
        const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(
          transRegexp
        )[1];
        let step = 5;
        if (transY > 0) {
          function refresh() {
            let target = arguments[0];
            const _transRegexp = window.getComputedStyle(
              this.$refs.scrollList,
              null
            ).transform;
            let _transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(
              _transRegexp
            )[1];
            _transY *= 0.9;
            this.$refs.scrollList.style.transform = `translateZ(0) translateY(${_transY}px)`;
            if (parseInt(_transY) > target) {
              window.requestAnimationFrame(refresh.bind(this, target));
            }
          }
          if (transY > 70) {
            refresh.call(this, 70);
            this.$emit(
              "on-refresh",
              function() {
                refresh.call(this, 0);
                this.$nextTick(() => {
                  this.scrollContainerHeight = this.$refs.scrollList.offsetHeight;
                  this.maxScrollHeight =
                    this.scrollContainerHeight - this.containerHeight;
                });
              }.bind(this)
            );
          } else {
            refresh.call(this, 0);
          }
        }
      }
    }
  },
  mounted() {
    const scrollList = this.$refs.scrollList;
    this.$nextTick(() => {
      this.scrollContainerHeight = scrollList.offsetHeight;
      this.containerHeight = parseInt(
        window.getComputedStyle(scrollList.parentElement, null).height
      );
      this.maxScrollHeight = this.scrollContainerHeight - this.containerHeight;
    });

    window.addEventListener("mousedown", this.handleMounseDown.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));

    scrollList.addEventListener("mousewheel", e => {
      e.preventDefault();
      window.requestAnimationFrame(() => {
        const transRegexp = window.getComputedStyle(this.$refs.scrollList, null)
          .transform;
        const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);
        let transYValue = parseInt(transY[1]);
        let maxScrollHeight = this.maxScrollHeight;
        let distance = e.deltaY;
        let result;
        if (transYValue <= 0 && distance < 0) {
          result = transYValue - distance > 0 ? 0 : transYValue - distance;
        } else if (transYValue >= -maxScrollHeight && distance > 0) {
          result =
            transYValue - distance < -maxScrollHeight
              ? -maxScrollHeight
              : transYValue - distance;
        }
        this.$refs.scrollList.style.transform = `translateZ(0) translateY(${result}px)`;
      });
    });
  },
  beforeDestroy() {}
};
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
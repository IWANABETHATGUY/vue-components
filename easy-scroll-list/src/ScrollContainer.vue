<template>
  <div :class="className" class="easy-scroll-container" style="overflow:auto;" >
    <ul class="easy-scroll-list" style="transform: translate3D(0, 0, 0);" ref="scrollList">
      <slot></slot>
    </ul>
    <slot name="loading-layer"></slot>
    <div style="width: 2%;">
  
    </div>
  </div>
</template>

<script>
function afterPreload() {
  this.$nextTick(() => {
    this.scrollContainerHeight = this.$refs.scrollList.offsetHeight;
    this.maxScrollHeight =
      this.scrollContainerHeight - this.containerHeight;
  });
  this.loadingMore = false;
}
function inertia() {
  let speed = arguments[0];
  if (!speed) {
    return;
  }
  const _transRegexp = window.getComputedStyle(
    this.$refs.scrollList,
    null
  ).transform;
  let _transY = parseInt(/matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(
    _transRegexp
  )[1]);
  let nextTransY = _transY + speed;

  if(nextTransY < -this.maxScrollHeight) {
    this.$emit("on-pre-load", afterPreload.bind(this));
    return;
  } else if(nextTransY > 0) {
    this.$refs.scrollList.style.transform = `translateZ(0) translateY(0px)`;
    return;
  }
  this.$refs.scrollList.style.transform = `translateZ(0) translateY(${nextTransY}px)`;
  speed *= 0.95;
  if (Math.abs(speed) > 0.1) {
    window.requestAnimationFrame(inertia.bind(this, speed));
  } else {
    if (_transY < 0) {
      return;
    }
    if (_transY >= 70) {
      refresh.call(this, 70);
      this.$emit(
        "on-refresh",
        function () {
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
      maxScrollHeight: 0,
      oldTime: 0
    };
  },
  methods: {
    handleMounseDown(e) {
      if (e.path.indexOf(this.$refs.scrollList) > -1) {
        e.preventDefault();
        const transRegexp = window.getComputedStyle(this.$refs.scrollList, null)
          .transform;
        const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);

        this.drag = true;
        this.startClientY = e.clientY;
        this.startTransY = parseInt(transY[1]);
        this.oldTime = new Date();
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
          this.oldTime = new Date();
          let distance = e.clientY - this.startClientY;
          let transYValue = parseInt(transY[1]);
          if (transYValue > 0 && distance > 0) {
            // this.startTransY = 0;
            let result = this.startTransY + distance;
            this.$refs.scrollList.style.transform = `translateZ(0) translateY(${0.3 *
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
        const transY = parseInt(/matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(
          transRegexp
        )[1]);
        let step = 5;
        if (transY > 0) {
          
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
        } else {
          let curDate = new Date();
          let DateOffset = curDate - this.oldTime;
          if (DateOffset <= 300) {
            let distanceOffset = this.startTransY - transY;
            let speed = distanceOffset / DateOffset;
            inertia.call(this, -speed);
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
        const transRegexp = window.getComputedStyle(this.$refs.scrollList, null).transform;
        const transY = /matrix\(.*?\, ((\-)?\d+(\.\d+)?)\)/g.exec(transRegexp);
        let transYValue = parseInt(transY[1]);
        let maxScrollHeight = this.maxScrollHeight;
        let distance = e.deltaY;
        let result;
        let offset = transYValue - distance
        if (transYValue <= 0 && distance < 0) {
          result =  offset> 0 ? 0 : offset;
        } else if (transYValue > -maxScrollHeight && distance > 0) {
          result = offset < -maxScrollHeight ? -maxScrollHeight : offset;
        } else if (transYValue <= maxScrollHeight) {
          if (!this.loadingMore) {
            this.loadingMore = true;
            this.$emit("on-pre-load", afterPreload.bind(this));
          }
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
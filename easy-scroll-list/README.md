# easy-scroll

## how to use
> you need to register it globally, here is a example

```javascript
import Vue from 'vue'
import App from './App'
import router from './router'
import EasyScroll from './scroll-list/index'
Vue.config.productionTip = true

Vue.use(EasyScroll);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```
> then you can use the components in your template 
```html
<template>
  <scroll-container :className="'container'"  @on-refresh="refreshList">
    <scroll-item :className="'scroll-item'" v-for="(item, index) in list" :key="index" >
      <div slot="content">{{item}}</div>
    </scroll-item>
    <div slot="loading-layer" class="loading-animate" ref="loading"></div>
  </scroll-container>
</template>
```

```javascript
export default {
  data() {
    return {
      list: [],
    }
  },
  methods: {
    refreshList(next) {
      this.$refs.loading.classList.add('active');
      setTimeout(() => {
        this.list = new Array(20).fill().map((item, index) => {
          return parseInt(Math.random() * 20);
        })
        this.$refs.loading.classList.remove('active');
        next();
      }, 3000)
    }
  },
  mounted() {
    this.list = new Array(20).fill().map((item, index) => {
      return parseInt(Math.random() * 20);
    })
  }
}
```
```css
  .container {
    width: 500px;
    border: 1px solid #ccc;
    height: 700px;
  }
  .loading-animate {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    display: none;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    animation: ball 1s  ease-in-out infinite;
    background: #cefece;
  }
  .loading-animate.active {
    display: block;
  }
  @keyframes ball{
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .scroll-item {
    background: #efefef;
    margin: 0 0 5px 0;
    min-height: 80px;
    user-select: none;
  }
```
> then you get the scroller like this   

![](http://ouck2t8ui.bkt.clouddn.com/scrollgif.gif)

# scroll-container
> props

propsName | use
------------ | -------------
className | className for container


> event 

eventName | use
------------ | --------------------------------------------------------------------
on-refresh | when you drag the list to the top, and you continue to pull down the list will emit this event with a function , you need to invoke the  function Explicitly to recover the scroll-list after the asynchronous task

> slot

slotName | use
------------ | -------------
default | to insert the list-item
loading-layer | to display a loading-animate when you start the asynchronous task

# scroll-item

>props

propsName | use
------------ | -------------
className | className for scroll-item

> slot

slotName | use
------------ | -------------
content | to insert the content





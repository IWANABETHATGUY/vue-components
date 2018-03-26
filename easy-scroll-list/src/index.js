import ScrollContainer from './ScrollContainer.vue';
import ScrollItem from './ScrollItem.vue';

export default {
  install(Vue, options) {
    Vue.component('scroll-container', ScrollContainer);
    Vue.component('scroll-item', ScrollItem);
  }
}
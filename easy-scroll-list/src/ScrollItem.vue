<template>
  <li :class="className">
    <slot name="content" ></slot>
  </li>
</template>
<script>
export default {
  props: {
    className: {
      type: [String, Array],
    }
  },
  data() {
    return {}
  },
  methods: {
    
  }
}
</script>
<style>
  .easy-scroll-item {
    display:block;
    width: 100%; 
    list-style:none;
  }
</style>
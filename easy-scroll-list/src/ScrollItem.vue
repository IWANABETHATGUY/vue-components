<template>
  <li  style="width: 100%; list-style:none;display:block;" :class="className">
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

</style>
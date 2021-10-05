<template>
  <path ref="nodePath"
        v-bind:d="`
          M${edge.sections[0].startPoint.x} ${edge.sections[0].startPoint.y}
          L${edge.sections[0].endPoint.x} ${edge.sections[0].endPoint.y}
        `"
        stroke="black"
  ></path>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Edge',
  props: {
    edge: {
      type: Object,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>

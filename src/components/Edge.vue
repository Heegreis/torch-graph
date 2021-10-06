<template>
  <path ref="nodePath"
        v-bind:d="pathData"
        fill="none"
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
  },
  computed: {
    pathData() {
      const startPoint = this.edge.sections[0].startPoint
      const startPoint_path = `M${startPoint.x},${startPoint.y}`

      let bendPoints_path = ''
      if (this.edge.sections[0].bendPoints) {
        const bendPoints = this.edge.sections[0].bendPoints
        bendPoints.forEach(bendPoint => {
          bendPoints_path = bendPoints_path + ` L${bendPoint.x},${bendPoint.y}`
        })
      }

      const endPoint = this.edge.sections[0].endPoint
      const endPoint_path = ` L${endPoint.x},${endPoint.y}`

      return startPoint_path + bendPoints_path + endPoint_path
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>

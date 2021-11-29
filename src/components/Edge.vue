<template>
  <path ref="nodePath"
    v-bind:d="pathData"
    fill="none"
    stroke="black"
    style="stroke: #6666ff; stroke-width: 1px; fill: none;
           marker-start: url(#markerCircle);
           marker-end: url(#markerArrow);"
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
    },
    margin: {
      type: Object,
      required: true
    }
  },
  computed: {
    pathData() {
      if (this.edge.sections === undefined) {
        return ''
      } else {
        const startPoint = this.edge.sections[0].startPoint
        const startPoint_path = `M${startPoint.x},${startPoint.y + this.margin.top}`
  
        let bendPoints_path = ''
        if (this.edge.sections[0].bendPoints) {
          const bendPoints = this.edge.sections[0].bendPoints
          bendPoints.forEach(bendPoint => {
            bendPoints_path = bendPoints_path + ` L${bendPoint.x},${bendPoint.y + this.margin.top}`
          })
        }
  
        const endPoint = this.edge.sections[0].endPoint
        const endPoint_path = ` L${endPoint.x},${endPoint.y + this.margin.top}`
  
        return startPoint_path + bendPoints_path + endPoint_path
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>

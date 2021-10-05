<template>
  <g v-bind:id="node.id" v-bind:ref="node.id" v-bind:transform="`translate(${node.x},${node.y})`">
    <foreignObject width="1" height="1">
      <div ref="nodeContent" class="nodeContent" v-bind:width="node.width" v-bind:height="node.height">
        {{ node.id }}
      </div>
    </foreignObject>
  </g>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'Node',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  emits: ['updateSize'],
  setup(props, context) {
    const nodeContent = ref()
    onMounted(() => {
      const size = {
        width: nodeContent.value.offsetWidth,
        height: nodeContent.value.offsetHeight
      }
      context.emit('updateSize', props.node.id, size)
    })

    return {
      nodeContent
    }
  }
})
</script>

<style lang="scss" scoped>
foreignObject {
  overflow: visible;
}
.nodeContent {
  border: 1px #ffac55 solid;
  // background-color: blueviolet;
  white-space: nowrap;
  display: inline-block;
}
</style>

<template>
  <g v-bind:id="node.id" v-bind:ref="node.id" v-bind:transform="`translate(${node.x},${node.y})`">
    <foreignObject width="1" height="1">
      <div ref="nodeContent" class="nodeContent">
        <div
          v-bind:contenteditable="edit"
          @keyup="updateSize"
          @click="edit = true"
          @blur="updateContent"
          @keyup.enter="updateContent"
          v-focus
        >{{ content }}</div>
      </div>
    </foreignObject>
  </g>
</template>

<script>
import { defineComponent, ref, onMounted, onUpdated } from 'vue';

export default defineComponent({
  name: 'Node',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  emits: [
    'updateSize',
    'updateContent'
  ],
  setup(props, context) {
    const nodeContent = ref()
    let content = ref(props.node.content)
    let edit = ref(false)

    const updateSize = () => {
      const size = {
        width: nodeContent.value.offsetWidth,
        height: nodeContent.value.offsetHeight
      }
      context.emit('updateSize', props.node.id, size)
    }

    const updateContent = () => {
      edit.value = false
      context.emit('updateContent', props.node.id, content.value)
    }

    onMounted(() => {
      updateSize()
    })

    onUpdated(() => {
      updateSize()
      console.log('onUpdated')
    })

    return {
      nodeContent,
      content,
      edit,
      updateSize,
      updateContent
    }
  },
  directives: {
    focus: {
      updated(el) {
        console.log('focus')
        el.focus()
      }
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

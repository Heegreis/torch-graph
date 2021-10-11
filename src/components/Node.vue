<template>
  <g v-bind:id="node.id" v-bind:ref="node.id" v-bind:transform="nodeTransform">
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
  computed: {
    nodeTransform() {
      if ("x" in this.node) {
        return `translate(${this.node.x},${this.node.y})`
      } else {
        return `translate(0,0)`
      }
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

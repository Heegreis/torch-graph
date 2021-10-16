<template>
  <g v-bind:id="node.id" v-bind:ref="node.id" v-bind:transform="nodeTransform">
    <foreignObject width="1" height="1">
      <div ref="nodeContent" class="nodeContent">
        <div
          v-bind:contenteditable="edit"
          @keyup="updateSize"
          @click="clicked"
          @blur="updateContent"
          @keyup.enter="updateContent"
          v-focus
          @contextmenu="$emit('selected', node.id)"
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
    'updateContent',
    'selected'
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

    const clicked = () => {
      // edit.value = true
      // $emit('設定為要被連接的節點 selectedElement')
      context.emit('selected', props.node.id)
    }

    return {
      nodeContent,
      content,
      edit,
      updateSize,
      updateContent,
      clicked
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

<template>
  <g v-bind:id="node.id" v-bind:ref="node.id" v-bind:transform="`translate(${node.x},${node.y})`">
    <foreignObject width="1" height="1">
      <div ref="nodeContent" class="nodeContent" v-bind:width="node.width" v-bind:height="node.height">
        <textarea
          v-if="edit"
          v-model="content"
          @blur="updateContent"
          @keyup.enter="updateContent"
          v-focus
        ></textarea>
        <div
          v-else
          @click="edit = true"
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

    // TODO: 考慮 用 div 模擬 textarea、setup 內容更加 function 化

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
      mounted(el) {
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

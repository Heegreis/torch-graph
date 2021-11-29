<template>
  <g ref="nodeRef" class="node" v-bind:id="node.id" v-bind:transform="nodeTransform">
    <rect class="nodeBackground" v-bind:width="node.width" v-bind:height="node.height" />
    <foreignObject v-bind:width="nodeSize.width" v-bind:height="nodeSize.height">
      <div ref="nodeContent" class="nodeContent">
        <div
          v-bind:contenteditable="edit"
          @keyup="updateSize"
          @click="clicked"
          @dblclick="edit = true"
          @blur="updateContent"
          @keyup.enter="updateContent"
          v-focus
          @contextmenu="$emit('selected', node.id)"
        >{{ content }}</div>
      </div>
    </foreignObject>
    <g>
      <node
        v-for="sub_node in sub_nodes"
        v-bind:key="sub_node.id"
        v-bind:node="sub_node"
        v-bind:margin="{top: nodeSize.height, right: 0, bottom: 0, left: 0}"
        @update-size="updateSubSize"
        @update-content="updateSubContent"
        @selected="subClicked"
      ></node>
      <edge
        v-for="sub_edge in sub_edges"
        v-bind:key="sub_edge.id"
        v-bind:edge="sub_edge"
        v-bind:margin="{top: nodeSize.height, right: 0, bottom: 0, left: 0}"
      ></edge>
    </g>
  </g>
</template>

<script>
import { defineComponent, ref, onMounted, onUpdated } from 'vue';
import Edge from 'components/Edge.vue'

export default defineComponent({
  name: 'Node',
  components: {
    Edge
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    margin: {
      type: Object,
      required: true
    }
  },
  computed: {
    nodeTransform() {
      if ("x" in this.node) {
        return `translate(${this.node.x},${this.node.y + this.margin.top})`
      } else {
        return `translate(0,0)`
      }
    },
    sub_nodes() {
      if ("children" in this.node) {
        return this.node.children
      } else {
        return []
      }
    },
    sub_edges() {
      if ("edges" in this.node) {
        return this.node.edges
      } else {
        return []
      }
    }
  },
  emits: [
    'updateSize',
    'updateContent',
    'selected',
    'update:monuted'
  ],
  setup(props, context) {
    const nodeContent = ref()
    let content = ref(props.node.content)
    const nodeSize = ref({ width: 1, height: 1 })
    let edit = ref(false)


    const updateSize = () => {
      nodeSize.value = {
        width: nodeContent.value.offsetWidth,
        height: nodeContent.value.offsetHeight
      }
      context.emit('updateSize', props.node.id, nodeSize.value)
    }

    const updateContent = () => {
      edit.value = false
      context.emit('updateContent', props.node.id, content.value)
    }

    onMounted(() => {
      context.emit('update:monuted')
      updateSize()
    })

    onUpdated(() => {
      // updateSize()
    })

    function updateSubSize(sub_node_id, sub_node_size) {
      context.emit('updateSize', sub_node_id, sub_node_size)
    }

    function updateSubContent(sub_node_id, sub_node_content) {
      context.emit('updateContent', sub_node_id, sub_node_content)
    }

    const clicked = () => {
      context.emit('selected', props.node.id)
    }

    function subClicked(sub_node_id) {
      context.emit('selected', sub_node_id)
    }

    return {
      nodeContent,
      content,
      nodeSize,
      edit,
      updateSize,
      updateContent,
      updateSubSize,
      updateSubContent,
      clicked,
      subClicked,
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
  border: 1px black solid;
  // background-color: blueviolet;
  white-space: nowrap;
  display: inline-block;
}
.nodeBackground {
  // fill:rgb(0,0,255);
  fill: none;
  outline-color: black;
  outline-style: solid;
  outline-width: 1px;
  outline-offset: -1px;
}
</style>

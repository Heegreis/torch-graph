<template>
  <q-page>
    <div id="graph">
        <svg>
            <g id="canvas">
              <node
                v-for="node in nodes"
                v-bind:key="node.id"
                v-bind:node="node"
                @update-size="updateNodeSize"
                @update-content="updateNodeContent"
              ></node>
              <edge
                v-for="edge in edges"
                v-bind:key="edge.id"
                v-bind:edge="edge"
              ></edge>
            </g>
            <context-menu
              v-model:showContextmenu="showContextmenu"
              v-bind:contextmenuTransform="contextmenuTransform"
              @add-node="addNode"
            ></context-menu>
        </svg>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import * as d3 from 'd3'
import ELK from 'elkjs'
import Node from 'components/Node.vue'
import Edge from 'components/Edge.vue'
import ContextMenu from 'components/ContextMenu.vue'

function setD3() {
  const canvasTransform = ref({ x: 0, y: 0, scale: 1 })
  const showContextmenu = ref(false)
  const contextmenuTransform = ref({ x: 0, y: 0 })
  onMounted(() => {
    const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event, d) => zoomed(event, d))
    d3.select('#graph').select('svg').call(zoom)
    d3.select('#graph')
      .select('svg')
      .on('contextmenu', (event, d) => contextmenu(event, d))
  })
  function zoomed(event, d) {
    const container = d3.select('#canvas')
    container.attr('transform', event.transform)
    canvasTransform.value.x = event.transform.x
    canvasTransform.value.y = event.transform.y
    canvasTransform.value.scale = event.transform.k
  }
  function contextmenu(event, d) {
    event.preventDefault()
    showContextmenu.value = true
    const svg = d3.select('#graph').select('svg').node()
    const mouse = d3.pointer(event, svg)
    const transform = { x: 0, y: 0 }
    // transform.x =
    //   (mouse[0] - canvasTransform.value.x) / canvasTransform.value.scale
    // transform.y =
    //   (mouse[1] - canvasTransform.value.y) / canvasTransform.value.scale
    transform.x = mouse[0]
    transform.y = mouse[1]
    contextmenuTransform.value.x = transform.x
    contextmenuTransform.value.y = transform.y
  }
  return {
    canvasTransform,
    showContextmenu,
    contextmenuTransform
  }
}
function setLayout() {
  const elk = new ELK()
  let graph_data = ref({})
  let nodes = ref([])
  let edges = ref([])
  
  function applyLayout() {
    elk.layout(graph_data.value)
      .then((graph_data_layouted) => {
        nodes.value = graph_data_layouted.children
        edges.value = graph_data_layouted.edges
      })
      .catch(console.error)
  }

  const updateNodeSize = (id, size) => {
    const child_index = graph_data.value.children.findIndex((obj) => obj.id == id)
    graph_data.value.children[child_index].width = size.width
    graph_data.value.children[child_index].height = size.height
    applyLayout()
  }

  onMounted(() => {
    applyLayout()
  })

  return { graph_data, applyLayout, nodes, edges, updateNodeSize }
}

export default defineComponent({
  name: 'Graph',
  components: {
    Node,
    Edge,
    ContextMenu
  },
  setup() {
    const { canvasTransform, showContextmenu, contextmenuTransform } = setD3()
    const { graph_data, applyLayout, nodes, edges, updateNodeSize } = setLayout()

    graph_data.value = {
      id: "root",
      layoutOptions: { 'elk.algorithm': 'layered' },
      children: [
        { id: "n1", width: 0, height: 0, content: "N1" },
        { id: "n2", width: 0, height: 0, content: "N2" },
        { id: "n3", width: 0, height: 0, content: "N3" }
      ],
      edges: [
        { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
        { id: "e2", sources: [ "n1" ], targets: [ "n3" ] }
      ]
    }

    const updateNodeContent = (id, content) => {
      const child_index = graph_data.value.children.findIndex((obj) => obj.id == id)
      graph_data.value.children[child_index].content = content
    }

    const addNode = () => {
      const new_node = { id: "na", width: 0, height: 0, content: "NA" }
      graph_data.value.children.push(new_node)
      applyLayout()
    }

    return {
      canvasTransform,
      showContextmenu,
      contextmenuTransform,
      nodes,
      edges,
      updateNodeSize,
      updateNodeContent,
      addNode
    }
  },
})
</script>

<style lang="scss" scoped>
#graph {
  width: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
}
svg {
  width: 100%;
  flex: 1;
}
</style>

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

function setD3() {
  const canvasTransform = ref({ x: 0, y: 0, scale: 1 })
  onMounted(() => {
    const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event, d) => zoomed(event, d))
    d3.select('#graph').select('svg').call(zoom)
  })
  function zoomed(event, d) {
    const container = d3.select('#canvas')
    container.attr('transform', event.transform)
    canvasTransform.value.x = event.transform.x
    canvasTransform.value.y = event.transform.y
    canvasTransform.value.scale = event.transform.k
  }
  return canvasTransform
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

  return { graph_data, nodes, edges, updateNodeSize }
}

export default defineComponent({
  name: 'Graph',
  components: {
    Node,
    Edge
  },
  setup() {
    const { canvasTransform } = setD3()
    const { graph_data, nodes, edges, updateNodeSize } = setLayout()

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

    return {
      canvasTransform,
      nodes,
      edges,
      updateNodeSize,
      updateNodeContent
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

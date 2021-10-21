<template>
  <q-page>
    <div id="graph">
        <svg>
          <defs>
            <marker id="markerCircle" markerWidth="8" markerHeight="8" refX="5" refY="5">
              <circle cx="5" cy="5" r="3" style="stroke: none; fill:#000000;"/>
            </marker>
            <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="9" refY="6"
                orient="auto">
              <path d="M2,2 L2,11 L10,6 L2,2" style="fill: #000000;" />
            </marker>
          </defs>
          <g id="canvas">
            <node
              v-for="node in nodes"
              v-bind:key="node.id"
              v-bind:node="node"
              @update-size="graphOperations.updateNodeSize"
              @update-content="graphOperations.updateNodeContent"
              @selected="graphOperations.nodeSelected"
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
            @action="contextmenuActions"
            v-bind:contextmenuType="contextmenuType"
          ></context-menu>
        </svg>
    </div>
    <q-dialog v-model="qDialog_seamless" seamless position="bottom">
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">點選要連接的Node</div>
          </div>
          <q-btn flat round icon="close" v-close-popup @click="status = ''" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="qDialog_confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">The node connected edges.</span>
          <span class="q-ml-sm">The edges will be removed.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="contextmenuActions('deleteNodeAndEdges')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  const contextmenuType = ref('background')
  const contextmenuTransform = ref({ x: 0, y: 0 })
  onMounted(() => {
    const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event, d) => zoomed(event, d)).filter((event) => zoomFilter(event))
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
  function zoomFilter(event) {
    // disable drag on div contenteditable
    return (!event.ctrlKey || event.type === 'wheel') && !event.button && !(event.type === 'dblclick') && !(event.target.contentEditable === 'true')
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

    const eleTypes = {
      background: { tag: ['svg'] },
      node: { class: ['nodeContent'] },
      path: { tag: ['path'] }
    }
    function getType(ele) {
      for (const [type, selectors] of Object.entries(eleTypes)) {
        for (const [selector, names] of Object.entries(selectors)) {
          if (selector == 'tag') {
            const eleName = ele.tagName
            for (let index = 0; index < names.length; index++) {
              const name = names[index]
              if (eleName === name) {
                return type
              }
            }
          } else if (selector === 'class') {
            let eleName = ''
            if (typeof(ele.className) === 'object') {
              eleName = ele.className.baseVal.split()
            } else {
              eleName = ele.className.split()
            }
            for (let index = 0; index < names.length; index++) {
              const name = names[index]
              if (eleName.includes(name)) {
                return type
              }
            }
          } else if (selector === 'id') {
            const eleName = ele.getAttribute('id')
            for (let index = 0; index < names.length; index++) {
              const name = names[index]
              if (eleName === name) {
                return type
              }
            }
          } else {
            console.log('selector error')
          }
        }
      }
      return getType(ele.parentElement)
    }

    const mouseDoc = d3.pointer(event, document)
    const elementMouseIsOver = document.elementFromPoint(mouseDoc[0], mouseDoc[1])
    contextmenuType.value = getType(elementMouseIsOver)
  }
  return {
    canvasTransform,
    showContextmenu,
    contextmenuType,
    contextmenuTransform
  }
}
function setLayout(graph_data) {
  const elk = new ELK()
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

  onMounted(() => {
    applyLayout()
  })

  return { applyLayout, nodes, edges }
}
function setGraphOperations(graph_data, applyLayout, status, qDialog_seamless, qDialog_confirm ) {
  const selectedElement = ref('')
  const connectSource = ref('')

  function updateNodeSize(id, size) {
    const child_index = graph_data.value.children.findIndex((obj) => obj.id == id)
    graph_data.value.children[child_index].width = size.width
    graph_data.value.children[child_index].height = size.height
    applyLayout()
  }

  function updateNodeContent(id, content) {
    const child_index = graph_data.value.children.findIndex((obj) => obj.id == id)
    graph_data.value.children[child_index].content = content
  }

  function addNode() {
    const new_node = { id: "na", width: 0, height: 0, content: "NA" }
    graph_data.value.children.push(new_node)
    applyLayout()
  }

  function addEdge (connectSource, connectTarget) {
    const new_edge = { id: "ea", sources: [ connectSource ], targets: [ connectTarget ] }
    graph_data.value.edges.push(new_edge)
    applyLayout()
  }

  function deleteNode() {
    const node_id = selectedElement.value
    if (_searchEdgesIndexesByNode(node_id).length > 0) {
      // 要轉去刪除node和edge
      qDialog_confirm.value = true
    } else {
      const child_index = graph_data.value.children.findIndex((obj) => obj.id == node_id)
      graph_data.value.children.splice(child_index, 1)
      applyLayout()
    }
  }

  function deleteNodeAndEdges() {
    const node_id = selectedElement.value
    const child_index = graph_data.value.children.findIndex((obj) => obj.id == node_id)
    graph_data.value.children.splice(child_index, 1)

    _searchEdgesIndexesByNode(node_id).forEach((index) => {
      graph_data.value.edges.splice(index, 1)
    })

    applyLayout()
    qDialog_confirm.value = false
  }

  function nodeSelected(node_id) {
    selectedElement.value = node_id
    if (status.value === 'connect node') {
      addEdge(connectSource.value, selectedElement.value)
      selectedElement.value = ''
      qDialog_seamless.value = false
      status.value = 'normal'
    }
  }

  function _searchEdgesIndexesByNode(node_id) {
    const edges = graph_data.value.edges
    let indexes = [], i
    for(i = 0; i < edges.length; i++) {
      if (edges[i].sources.includes(node_id) || edges[i].targets.includes(node_id)) {
        indexes.push(i)
      }
    }
    return indexes
  }

  return { updateNodeSize, updateNodeContent, addNode, addEdge, nodeSelected, selectedElement, connectSource, deleteNode, deleteNodeAndEdges }
}
function setContextmenuActions(status, qDialog_seamless, graphOperations) {
  function connect() {
    qDialog_seamless.value = true
    graphOperations.connectSource.value = graphOperations.selectedElement.value
    // selectedElement.value = ''
    status.value = 'connect node'
  }

  const actions = {
    'addNode': graphOperations.addNode,
    'deleteNode': graphOperations.deleteNode,
    'deleteNodeAndEdges': graphOperations.deleteNodeAndEdges,
    connect,
  }

  function contextmenuActions(action) {
    actions[action]()
  }

  return { contextmenuActions }
}

export default defineComponent({
  name: 'Graph',
  components: {
    Node,
    Edge,
    ContextMenu
  },
  setup() {
    // 包成 loadGraph
    const status = ref('normal')
    const qDialog_seamless = ref(false)
    const qDialog_confirm = ref(false)
    const graph_data = ref({})
    graph_data.value = {
      id: "root",
      layoutOptions: { 'elk.algorithm': 'layered', 'nodePlacement.strategy': 'SIMPLE', 'elk.direction': 'DOWN' },
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
    const {
      canvasTransform,
      showContextmenu,
      contextmenuType,
      contextmenuTransform } = setD3()
    const {
      applyLayout,
      nodes,
      edges } = setLayout(graph_data)
    const graphOperations = setGraphOperations(graph_data, applyLayout, status, qDialog_seamless, qDialog_confirm )
    const { contextmenuActions } = setContextmenuActions(
        status, qDialog_seamless, graphOperations)

    // 這些變數和function 可以試試分門別類包在不同obj
    return {
      graphOperations,
      contextmenuActions,
      canvasTransform,
      showContextmenu,
      contextmenuTransform,
      nodes,
      edges,
      contextmenuType,
      qDialog_seamless,
      qDialog_confirm,
      status
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

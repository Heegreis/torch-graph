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
              v-bind:margin="{top: 0, right: 0, bottom: 0, left: 0}"
              @update-size="graphOperations.updateNodeSize"
              @update-content="graphOperations.updateNodeContent"
              @selected="graphOperations.nodeSelected"
            ></node>
            <edge
              v-for="edge in edges"
              v-bind:key="edge.id"
              v-bind:edge="edge"
              v-bind:margin="{top: 0, right: 0, bottom: 0, left: 0}"
              @selected="graphOperations.edgeSelected"
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
import Node from 'components/Node.vue'
import Edge from 'components/Edge.vue'
import ContextMenu from 'components/ContextMenu.vue'
import setD3 from 'components/models/d3'
import setLayout from 'components/models/layout'
import setGraphOperations from 'components/models/graphOperations'
import setContextmenuActions from 'components/models/contextmenuActions'

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
      layoutOptions: { 'elk.algorithm': 'layered', 'nodePlacement.strategy': 'SIMPLE', 'elk.direction': 'DOWN', 'hierarchyHandling': 'INCLUDE_CHILDREN' },
      children: [
        { id: "n1", width: 0, height: 0, content: "N1", nodeContent_width: 0, nodeContent_height: 0 },
        { id: "n2", width: 0, height: 0, content: "N2", nodeContent_width: 0, nodeContent_height: 0 },
        { id: "n3", width: 0, height: 0, content: "N3", nodeContent_width: 0, nodeContent_height: 0,
          children: [
            { id: "n31", width: 0, height: 0, content: "N3 1", nodeContent_width: 0, nodeContent_height: 0 ,
              children: [
                { id: "n311", width: 0, height: 0, content: "N3 1 1", nodeContent_width: 0, nodeContent_height: 0 },
                { id: "n312", width: 0, height: 0, content: "N3 1 2", nodeContent_width: 0, nodeContent_height: 0 },
                { id: "n313", width: 0, height: 0, content: "N3 1 3", nodeContent_width: 0, nodeContent_height: 0 },
              ],
              edges: [
                { id: "e311", sources: [ "n311" ], targets: [ "n312" ] },
                { id: "e312", sources: [ "n311" ], targets: [ "n313" ] },
              ]
            },
            { id: "n32", width: 0, height: 0, content: "N3 2", nodeContent_width: 0, nodeContent_height: 0 },
            { id: "n33", width: 0, height: 0, content: "N3 3", nodeContent_width: 0, nodeContent_height: 0 },
          ],
          edges: [
            { id: "e31", sources: [ "n31" ], targets: [ "n32" ] },
            { id: "e32", sources: [ "n31" ], targets: [ "n33" ] },
          ]
        }
      ],
      edges: [
        { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
        { id: "e2", sources: [ "n1" ], targets: [ "n3" ] },
      ]
    }
    const {
      canvasTransform,
      selectedElement,
      showContextmenu,
      contextmenuType,
      contextmenuTransform } = setD3()
    const {
      applyLayout,
      nodes,
      edges } = setLayout(graph_data)
    const graphOperations = setGraphOperations(graph_data, applyLayout, selectedElement, status, qDialog_seamless, qDialog_confirm )
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

import { defineComponent, ref, onMounted } from 'vue'
import ELK from 'elkjs'


export default function setLayout(graph_data) {
  const elk = new ELK()
  let nodes = ref(graph_data.value.children)
  let edges = ref(graph_data.value.edges)

  function _deleteSections(obj, parentObj=null, index=null) {
    // avoid the refreshed edges path not right
    if ('sections' in obj) {
      delete obj['sections']
    }

    const keys = Object.keys(obj); // add this line to iterate over the keys
    for (let i = 0, len = keys.length; i < len; i++) {
      const k = keys[i]; // use this key for iteration, instead of index "i"

      // add "obj[k] &&" to ignore null values
      if (obj[k] && typeof obj[k] == 'object') {
        var found = _deleteSections(obj[k], obj, k)
      }
    }
  }

  async function applyElkLayout(graph) {
    await elk.layout(graph)
  }

  async function loopGraph(graph) {
    if ('children' in graph) {
      for (let index = 0; index < graph.children.length; index++) {
        const node = graph.children[index]
        // 取得 該 node size
        const size = await loopGraph(node)
        // 更新 node size( width: 0, height: 0 )，另外會區分 nodeContentSize
        node.width = size.width
        node.height = size.height
      }
      // 更新後，applyLayout 這一層的 graph
      // 有 children 才有辦法 applyLayout
      graph['layoutOptions'] = { 'elk.algorithm': 'layered', 'nodePlacement.strategy': 'SIMPLE', 'elk.direction': 'DOWN', 'hierarchyHandling': 'INCLUDE_CHILDREN' }
      // const graph_layouted = applyElkLayout(graph)
      await applyElkLayout(graph)
      // console.log(graph)
      // for (const key in graph) {
      //   // graph[key] = graph[key]
      //   if (key == 'layoutOptions') {
      //     delete graph[key]
      //   }
      // }
      const node_width = graph.nodeContent_width > graph.width ? graph.nodeContent_width : graph.width
      const node_height = graph.nodeContent_height + graph.height
      return { width: node_width, height: node_height }
    } else {
      // 表示 該 node(graph) 已是最底層
      // 直接 已 nodeContentSize 作為 size( width: 0, height: 0 )
      graph.width = graph.nodeContent_width
      graph.height = graph.nodeContent_height
      return { width: graph.width, height: graph.height }
    }
  }

  async function applyLayout() {
    _deleteSections(graph_data.value)
    await loopGraph(graph_data.value)
    nodes.value = graph_data.value.children
    edges.value = graph_data.value.edges
  }

  onMounted(() => {
    // applyLayout()
    setTimeout(() => applyLayout(), 200)
  })

  return { applyLayout, nodes, edges }
}

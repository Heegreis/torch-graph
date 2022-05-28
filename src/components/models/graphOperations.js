import { defineComponent, ref, onMounted } from 'vue'


export default function setGraphOperations(graph_data, applyLayout, status, qDialog_seamless, qDialog_confirm ) {
  const selectedElement = ref('')
  const connectSource = ref('')

  function nodeSelected(node_id) {
    selectedElement.value = node_id
    if (status.value === 'connect node') {
      _addEdge(connectSource.value, selectedElement.value)
      selectedElement.value = ''
      qDialog_seamless.value = false
      status.value = 'normal'
    }
    console.log(selectedElement.value)
  }
  function edgeSelected(edge_id) {
    selectedElement.value = edge_id
    console.log(selectedElement.value)
  }
  function updateNodeSize(id, size) {
    // let { node, key, children } = _searchGraph(graph_data.value, 'id', id)
    let result = _searchGraph(graph_data.value, 'id', id)
    // let node = _searchGraph(graph_data.value, 'id', id)
    result[0].nodeContent_width = size.width
    result[0].nodeContent_height = size.height
    applyLayout()
  }
  function updateNodeContent(id, content) {
    // let { node, key, children } = _searchGraph(graph_data.value, 'id', id)
    // let node = _searchGraph(graph_data.value, 'id', id)
    let result = _searchGraph(graph_data.value, 'id', id)
    result[0].content = content
  }
  function addNode() {
    const new_node = { id: "na", width: 0, height: 0, content: "NA" }
    graph_data.value.children.push(new_node)
    applyLayout()
  }
  function deleteNode() {
    console.log("deleteNode")
    const node_id = selectedElement.value
    console.log(node_id)
    console.log(_searchEdgeByNode(graph_data.value, node_id))
    if (_searchEdgeByNode(graph_data.value, node_id)) {
      // 要轉去刪除node和edge
      qDialog_confirm.value = true
    } else {
      // const child_index = graph_data.value.children.findIndex((obj) => obj.id == node_id)
      // graph_data.value.children.splice(child_index, 1)
      let result = _searchGraph(graph_data.value, 'id', node_id)
      result[2].splice(result[3], 1)
      applyLayout()
    }
  }
  function deleteNodeAndEdges() {
    const node_id = selectedElement.value
    console.log(node_id)
    let result = _searchGraph(graph_data.value, 'id', node_id)
    result[2].splice(result[3], 1)

    _deleteEdgesByNode(node_id)

    applyLayout()
    qDialog_confirm.value = false
  }
  function deleteEdge() {
    const edge_id = selectedElement.value
    const child_index = graph_data.value.edges.findIndex((obj) => obj.id == edge_id)
    graph_data.value.edges.splice(child_index, 1)
    applyLayout()
  }

  function _addEdge (connectSource, connectTarget) {
    const new_edge = { id: "ea", sources: [ connectSource ], targets: [ connectTarget ] }
    graph_data.value.edges.push(new_edge)
    applyLayout()
  }

  function _searchEdgeByNode(obj, node_id, parentObj=null, index=null) {
    const keys = Object.keys(obj); // add this line to iterate over the keys

    for (let i = 0, len = keys.length; i < len; i++) {
      const k = keys[i]; // use this key for iteration, instead of index "i"
      if (k == 'edges') {
        const edges = obj[k]
        for (let j = 0, edges_len = edges.length; j < edges_len; j++) {
          if (edges[j].sources.includes(node_id) || edges[j].targets.includes(node_id)) {
            return [ edges[j], edges, j ]
          }
        }
      }

      // add "obj[k] &&" to ignore null values
      if (obj[k] && typeof obj[k] == 'object') {
        var found = _searchEdgeByNode(obj[k], node_id, obj, k)
        if (found) {
          // If the object was found in the recursive call, bubble it up.
          return found
        }
      }

    }
  }
  function _deleteEdgesByNode(node_id) {
    while (_searchEdgeByNode(graph_data.value, node_id)) {
      let result = _searchEdgeByNode(graph_data.value, node_id)
      result[1].splice(result[2], 1)
    }
  }

  function _searchGraph(obj, key, value, parentObj=null, index=null) {
    if (obj[key] === value) {
      // return obj
      // return { obj, key, parentObj }
      return [ obj, key, parentObj, index ]
      // DOING: 測試該Function
    } else {
      const keys = Object.keys(obj); // add this line to iterate over the keys

      for (let i = 0, len = keys.length; i < len; i++) {
        const k = keys[i]; // use this key for iteration, instead of index "i"

        // add "obj[k] &&" to ignore null values
        if (obj[k] && typeof obj[k] == 'object') {
          var found = _searchGraph(obj[k], key, value, obj, k)
          // var found = _searchGraph(obj[k], key, value)
          if (found) {
            // If the object was found in the recursive call, bubble it up.
            return found
          }
        }
      }
    }
  }

  return {
    selectedElement, connectSource,
    nodeSelected, edgeSelected, updateNodeSize, updateNodeContent, addNode, deleteNode, deleteNodeAndEdges, deleteEdge }
}

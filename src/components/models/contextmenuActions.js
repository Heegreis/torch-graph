

export default function setContextmenuActions(status, qDialog_seamless, graphOperations) {
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
      'deleteEdge': graphOperations.deleteEdge,
      connect,
    }
    function contextmenuActions(action) {
      actions[action]()
    }
  
    return { contextmenuActions }
  }
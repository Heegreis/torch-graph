import { defineComponent, ref, onMounted } from 'vue'
import * as d3 from 'd3'


export default function setD3() {
  const canvasTransform = ref({ x: 0, y: 0, scale: 1 })
  const selectedElement = ref('')
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
    transform.x = mouse[0]
    transform.y = mouse[1]
    contextmenuTransform.value.x = transform.x
    contextmenuTransform.value.y = transform.y

    const eleTypes = {
      background: { tag: ['svg'] },
      node: { class: ['nodeContent'] },
      edge: { tag: ['path'] }
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

    function getID(ele) {
      if (ele.getAttribute('id')) {
        return ele.getAttribute('id')
      } else if (ele.tagName === 'svg') {
        return null
      } else {
        return getID(ele.parentElement)
      }
    }

    const mouseDoc = d3.pointer(event, document)
    const elementMouseIsOver = document.elementFromPoint(mouseDoc[0], mouseDoc[1])
    contextmenuType.value = getType(elementMouseIsOver)
    selectedElement.value = getID(elementMouseIsOver)
  }
  return {
    canvasTransform,
    selectedElement,
    showContextmenu,
    contextmenuType,
    contextmenuTransform
  }
}

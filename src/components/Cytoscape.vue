<template>
  <q-layout view="hHh Lpr lff" container class="shadow-2 rounded-borders max_size">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-toolbar-title>Header</q-toolbar-title>
        <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div id="cy" class="max_size"></div>
      </q-page>
    </q-page-container>

    <q-drawer
      side="right"
      v-model="drawerRight"
      bordered
      :width="200"
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <q-input
            v-model="text"
            filled
            autogrow
          ></q-input>
        </div>
      </q-scroll-area>
    </q-drawer>
    
  </q-layout>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  onMounted,
} from 'vue'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import dagre from 'cytoscape-dagre'

cytoscape.use(cxtmenu)
cytoscape.use(dagre)

function setCytoscape() {
  const cy = ref()
  const focusedNodeID = ref('')
  
  onMounted(() => {
    const cyInstance = cytoscape({
      container: document.getElementById('cy'), // container to render in

      elements: [ // list of graph elements to start with
        { // node a
          data: { id: 'a', label: 'aaaaaaaaaaaaaaaaaaaa' }
        },
        { // node b
          data: { id: 'b', label: 'bbbbbbbbbbb\nbbbbbbbbb' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: fetch('cy-style.json').then(function(res){
        return res.json()
      }),

      layout: {
        name: 'dagre',
      }

    })

    cyInstance.on('tap', function(event){
      const evtTarget = event.target;
      
      let isNode = false
      if(evtTarget === cyInstance){
        isNode = false
      } else {
        if (evtTarget.isNode()) {
          isNode = true
        } else {
          isNode = false
        }
      }
      if (isNode) {
        focusedNodeID.value = evtTarget.id()
      } else {
        focusedNodeID.value = ''
      }
    })

    cyInstance.cxtmenu({
      selector: 'node, edge',

      commands: [
        {
          content: '<span class="fa fa-flash fa-2x"></span>',
          select: function(ele){
            console.log( ele.id() )
          }
        },

        {
          content: 'Add dom',
          select: function(ele){
            // console.log( ele.data('name') )
          },
          // enabled: false
        },

        {
          content: 'Text',
          select: function(ele){
            console.log( ele.position() )
            ele.data('id', 'new')
          }
        }
      ]
    })

    cyInstance.cxtmenu({

      selector: 'core',

      commands: [
        {
          content: 'bg1',
          select: function(){
            console.log( 'bg1' )
          }
        },

        {
          content: 'bg2',
          select: function(){
            console.log( 'bg2' )
          }
        }
      ]
    })

    cy.value = cyInstance
  })

  return{cy, focusedNodeID}
}

export default defineComponent({
  name: 'Cytoscape',
  setup () {
    const {cy, focusedNodeID} = setCytoscape()

    let drawerRight = ref(false)

    watch(focusedNodeID, () => {
      if (focusedNodeID.value === '') {
        drawerRight.value = false
      } else {
        drawerRight.value = true
      }
    })

    return {
      drawerRight,
      text: ref(''),
      cy, focusedNodeID
    }
  },
})
</script>

<style lang="scss">
#cy {
  // width: 100%;
  // min-height: inherit;
  // display: flex;
  // flex-direction: column;
  // margin: 5px
  // border: 1px solid
}
.max_size {
  // width: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
}
</style>
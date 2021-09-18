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
} from 'vue'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import dagre from 'cytoscape-dagre'

cytoscape.use(cxtmenu)
cytoscape.use(dagre)

export default defineComponent({
  name: 'Cytoscape',
  setup () {
    return {
      drawerRight: ref(false),
      text: ref(''),
    }
  },
  data() {
    return {
      focusedNodeID: ''
    }
  },
  mounted() {
    const cy = cytoscape({
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

    const vm = this

    cy.on('tap', function(event){
      const evtTarget = event.target;
      
      let isNode = false
      if(evtTarget === cy){
        isNode = false
      } else {
        if (evtTarget.isNode()) {
          isNode = true
        } else {
          isNode = false
        }
      }
      if (isNode) {
        vm.$data.focusedNodeID = evtTarget.id()
        vm.drawerRight = true
      } else {
        vm.$data.focusedNodeID = ''
        vm.drawerRight = false
      }
    })

    cy.cxtmenu({
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

    cy.cxtmenu({
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
<template>
  <div id="cy">
    
  </div>
</template>

<script>
import {
  defineComponent,
} from 'vue'
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import dagre from 'cytoscape-dagre'

cytoscape.use( cxtmenu )
cytoscape.use( dagre )

export default defineComponent({
  name: 'Cytoscape',
  // data() {
  //   return {
  //     eles: [ // list of graph elements to start with
  //       { // node a
  //         data: { id: 'a' }
  //       },
  //       { // node b
  //         data: { id: 'b' }
  //       },
  //       { // edge ab
  //         data: { id: 'ab', source: 'a', target: 'b' }
  //       }
  //     ]
  //   }
  // },
  mounted() {
    const cy = cytoscape({

      container: document.getElementById('cy'), // container to render in

      // elements: [ // list of graph elements to start with
      //   { // node a
      //     data: { id: 'a' }
      //   },
      //   { // node b
      //     data: { id: 'b' }
      //   },
      //   { // edge ab
      //     data: { id: 'ab', source: 'a', target: 'b' }
      //   }
      // ],
      // elements: fetch('klay.json').then(function( res ){ return res.json() }),
      // elements: this.eles,
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
          content: '<span class="fa fa-star fa-2x"></span>',
          select: function(ele){
            console.log( ele.data('name') )
          },
          enabled: false
        },

        {
          content: 'Text',
          select: function(ele){
            console.log( ele.position() )
            // cy.add({
            //   group: 'nodes',
            //   data: { weight: 75 },
            //   position: { x: 200, y: 200 }
            // })
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
  width: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  // margin: 5px
  // border: 1px solid
}
</style>
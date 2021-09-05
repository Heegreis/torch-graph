<template>
  <div id="cy">
    
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';

cytoscape.use( cxtmenu );

export default defineComponent({
  name: 'Cytoscape',
  mounted() {
    const cy = cytoscape({

      container: document.getElementById('cy'), // container to render in

      elements: [ // list of graph elements to start with
        { // node a
          data: { id: 'a' }
        },
        { // node b
          data: { id: 'b' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }

    });

    cy.cxtmenu({
      selector: 'node, edge',

      commands: [
        {
          content: '<span class="fa fa-flash fa-2x"></span>',
          select: function(ele: cytoscape.Singular){
            console.log( ele.id() );
          }
        },

        {
          content: '<span class="fa fa-star fa-2x"></span>',
          select: function(ele: cytoscape.Singular){
            console.log( ele.data('name') );
          },
          enabled: false
        },

        {
          content: 'Text',
          select: function(ele: cytoscape.NodeSingularPosition){
            console.log( ele.position() );
          }
        }
      ]
    });

    cy.cxtmenu({
      selector: 'core',

      commands: [
        {
          content: 'bg1',
          select: function(){
            console.log( 'bg1' );
          }
        },

        {
          content: 'bg2',
          select: function(){
            console.log( 'bg2' );
          }
        }
      ]
    });
  },

});
</script>

<style lang="scss">
#cy {
  width: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  // margin: 5px;
  // border: 1px solid;
}
</style>
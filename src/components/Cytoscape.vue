<template>
  <div id="cy">
    
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import cytoscape from 'cytoscape';

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
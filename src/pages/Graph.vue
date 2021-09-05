<template>
  <q-page>
    <cytoscape-component
      
    ></cytoscape-component>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import CytoscapeComponent from 'components/Cytoscape.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TorchGraph',
  components: { CytoscapeComponent },
  
});
</script>

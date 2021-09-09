<template>
  <q-page>
    <cytoscape-component
      
    ></cytoscape-component>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import CytoscapeComponent from 'components/Cytoscape.vue';

export default defineComponent({
  name: 'TorchGraph',
  components: { CytoscapeComponent },
})
</script>

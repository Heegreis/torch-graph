<template>
  <foreignObject width="1" height="1"
    v-if="showContextmenu"
    v-bind:transform="`translate(${contextmenuTransform.x},${contextmenuTransform.y})`"
  >
    <q-list bordered separator class="contextMenu">
      <q-item clickable v-ripple>
      <q-item-section>Single line item</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
      <q-item-section>
          <q-item-label>Item with caption</q-item-label>
          <q-item-label caption>Caption</q-item-label>
      </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
      <q-item-section>
          <q-item-label overline>OVERLINE</q-item-label>
          <q-item-label>Item with caption</q-item-label>
      </q-item-section>
      </q-item>
    </q-list>
  </foreignObject>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ContextMenu',
  props: {
    showContextmenu: {
      type: Boolean,
      required: true
    },
    contextmenuTransform: {
      type: Object,
      required: true
    }
  },
})
</script>

<style lang="scss" scoped>
foreignObject {
  overflow: visible;
}
.contextMenu {
  white-space: nowrap;
  width: fit-content;
}
</style>

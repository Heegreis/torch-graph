<template>
  <foreignObject width="1" height="1"
    v-if="showContextmenu"
    v-bind:transform="`translate(${contextmenuTransform.x},${contextmenuTransform.y})`"
    v-click-outside="hideContextmenu"
  >
    <q-list bordered separator class="contextMenu">
      <!-- for background -->
      <q-item
        v-if="contextmenuType == 'background'"
        clickable v-ripple
        @click="$emit('action', 'addNode'), hideContextmenu()"
      >
        <q-item-section>Add node</q-item-section>
      </q-item>

      <!-- for node -->
      <q-item
        v-if="contextmenuType == 'node'"
        clickable v-ripple
        @click="$emit('action', 'connect'), hideContextmenu()"
      >
        <q-item-section>Connect</q-item-section>
      </q-item>
      <q-item
        v-if="contextmenuType == 'node'"
        clickable v-ripple
        @click="$emit('action', 'deleteNode'), hideContextmenu()"
      >
        <q-item-section>Delete node</q-item-section>
      </q-item>

      <!-- for edge -->
      <q-item
        v-if="contextmenuType == 'edge'"
        clickable v-ripple
        @click="$emit('action', 'deleteEdge'), hideContextmenu()"
      >
        <q-item-section>Delete edge</q-item-section>
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
    },
    contextmenuType: {
      type: String,
      required: true
    }
  },
  emits: [
    'update:showContextmenu',
    'action'
  ],
  setup(props, context) {
    const hideContextmenu = () => {
      context.emit('update:showContextmenu', false)
    }
    return { hideContextmenu }
  },
  directives: {
    clickOutside: {
      mounted(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          // here I check that click was outside the el and his children
          if (!(el == event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            binding.value()
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
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

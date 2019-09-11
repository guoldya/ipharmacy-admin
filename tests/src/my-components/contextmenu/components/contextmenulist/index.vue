<template>
  <div  @click="rowClick">
    <ul role="menu" tabindex="0" class="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-root ant-dropdown-menu-light ant-dropdown-content">
      <li role="menuitem"
          class="ant-dropdown-menu-item"
          v-for="item in menulist"
          :key="item.value"
          :data-value="item.value"
          flex="cross:center main:center">
        <a-icon v-if="item.icon"
                :type="item.icon"/>
        {{item.title}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'dw-contextmenu-list',
    props: {
      menulist: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      rowClick (event) {
        let target = event.target
        while (!target.dataset.value) {
          target = target.parentNode
        }
        this.$emit('rowClick', target.dataset.value)
      }
    }
  }
</script>
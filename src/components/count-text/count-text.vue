<template>
  <a-row :gutter="20">
    <a-col :span="3"></a-col>
    <div v-for="op in countList">
      <a-col class="countFor" :style="{color:op.colors}" :span="6">
        <countTo class="countStyle" :end="op.count"></countTo>
        <span>{{op.text}}</span>
      </a-col>
    </div>
    <a-col :span="3"></a-col>
  </a-row>
</template>

<script>
  import countTo from '@/components/count-to'
  export default {
    components: {
      countTo,
    },
    name: 'count-text',
    props: {
      countList: {
        type: Array,
        required: true
      }
    },
  }
</script>

<style scoped>
  .divInfo span {
    margin-left: 10px;
  }

  .countFor {
    text-align: center;
    margin-bottom: 4px;
  }

  .countStyle {
    font-size: 24px;
    margin-top: -12px;
    margin-bottom: -6px;
  }
</style>
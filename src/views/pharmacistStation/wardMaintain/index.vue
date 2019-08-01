<template>
    <div>
      <a-card>
        <patientsStatistics :countList="countText"></patientsStatistics>
      </a-card>
    </div>
</template>

<script>
  import patientsStatistics from './patients-statistics'
  export default {
    name: 'index',
    components: {
      patientsStatistics
    },
    data(){
      return{
        countText: [
          { itemCount: 0, item: '在院', itemColors: '#4586ff' },
          { itemCount: 0, item: '特级监护', itemColors: '#2dc89f' },
          { itemCount: 0, item: 'Ⅲ级监护', itemColors: '#ff6781' },
          { itemCount: 0, item: 'Ⅱ级监护', itemColors: '#ff6781' },
          { itemCount: 0, item: 'Ⅰ级监护', itemColors: '#ff6781' }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
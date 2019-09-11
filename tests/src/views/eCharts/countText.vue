<template>
  <div>
    <a-row>
      <a-col class="countFor marginBottom" :span="12">
        <div class="countItem opacity6">{{countList[0].item}}</div>
        <div class="countStyle " >{{countList[0].itemCount}}</div>
      </a-col>
      <a-col class="countFor marginBottom" :span="12">
        <div class="countItem opacity6">{{countList[1].item}}</div>
        <div class="countStyle " >{{countList[1].itemCount}}</div>
      </a-col>
    </a-row>
    <a-row  :gutter="6">
      <a-col class="countFor" :span="12">
        <div class="countItem opacity6">{{countList[2].item}}</div>
        <div class="countStyle">{{countList[2].itemCount}}</div>
      </a-col>
      <a-col class="countFor" :span="12">
        <div class="countItem opacity6">{{countList[3].item}}</div>
        <div class="countStyle">{{countList[3].itemCount}}</div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import countTo from '@/components/count-to'

  export default {
    components: {
      countTo
    },
    name: 'count-text',
    props: {
      countList: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>

  .countFor {
    /*width: 48%;*/
    color: #ffffff;
    background: #404a59;
    /*margin-left: 8px;*/
    height: 146px;
  }
  .marginBottom{
    margin-bottom: 8px;
  }

  .countStyle {
    font-size: 24px;
    margin: 0 auto;
    text-align: center;
    color: #ffffff;
  }

  .countFor .countItem {
    font-size: 18px;
    margin-left: 10px;
    margin-top: 10px;
  }
</style>
<template>
  <a-modal
    title="复制"
    :width="550"
    @cancel="cancel"
    :visible="visibled"
    :footer="null"
  >
    <a-input v-for="(item,index) in copyArray" read-only  :defaultValue="item.data" id="copy" :key="index">
    </a-input>
    <template slot="footer">
      <a-button key="一键复制" type="primary"@click="copyLink">
        Submit
      </a-button>
    </template>
  </a-modal>
</template>

<script>
  export default {
    props: {
      visibled: Boolean,
      copyText:String,
      copyArray:Array,
      cancel:Function,
    },
    name: 'copyModal',
    data(){
      return{

      }
    },
    methods:{
      copyLink(){
        var e = document.getElementById("copy");
        e.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
      },
    }
  }
</script>

<style scoped>

</style>
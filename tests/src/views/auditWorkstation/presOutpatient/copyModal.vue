<template>
  <a-modal
    title="复制"
    :width="550"
    :maskClosable="false"
    @cancel="cancel"
    :visible="visibled"
    :footer="null"
  >
    <a-input v-for="(item,index) in copyArray" read-only  :defaultValue="item.data" id="copy" :key="index">
    </a-input>
     <br />
    <br />
      <a-button key="一键复制" type="primary"@click="copyLink">
        一键复制
      </a-button>
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
         this.warn('复制成功')
      },
    }
  }
</script>

<style scoped>

</style>
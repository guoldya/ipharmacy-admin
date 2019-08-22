<template>
  <a-modal
    title="复制"
    :width="550"
    @cancel="cancel"
    :visible="visibled"
  >
    <a-input read-only  :defaultValue="copyArray[0].data" id="copy" :key="0">
    </a-input>
    <a-input v-for="(item,index) in copyArray" v-if="index>0" read-only  :defaultValue="item.data"  :key="index">
    </a-input>

    <template slot="footer">
      <a-button key="一键复制" type="primary"@click="copyLink">
        一键复制
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
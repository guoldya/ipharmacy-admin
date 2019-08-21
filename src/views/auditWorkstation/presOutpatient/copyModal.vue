<template>
  <a-modal
    title="复制"
    @ok="ok"
    :confirmLoading="loading"
    @cancel="cancel"
    :width="550"
    :visible="visibled"
  >
    <a-input v-for="(item,index) in copyArray" read-only :defaultValue="item.data" id="copy" :key="index">
      1234
      <a-icon slot="addonAfter" type="copy" @click="copyLink"/>
    </a-input>
  </a-modal>
</template>

<script>
  export default {
    props: {
      visibled: Boolean,
      copyText:String,
      copyArray:Array,
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
      ok(){
        this.visibled = false;
      },
      cancel(){
        this.visibled = false;
      }
    }
  }
</script>

<style scoped>

</style>
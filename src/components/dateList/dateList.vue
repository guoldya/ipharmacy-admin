<template>
    <div>
        <a-card>
            <a-input-search class="txtCenter" placeholder="输入要查询日期"  @change="onSearch"/>
            <a-list size="large" class="margin-top-10" bordered :dataSource="dateList">
                <a-list-item :style="{ 'padding-left': '34%'}"  slot="renderItem" slot-scope="item">{{item}}</a-list-item>
            </a-list>
        </a-card>
    </div>
</template>

<script>
  export default {
    name: 'dateList',
    data(){
      return{
          dateList:[],
      }
    },
    props:{
        date:{
            type:Array,
            default: []
        },
    },
    mounted(){
        this.dateList=this.date;
       if(localStorage.childPage===JSON.stringify('look')){
         document.title=document.title+'用药指导详情';
        }else if(localStorage.childPage===JSON.stringify('add')){
          document.title=document.title.split('用')[0]+'用药指导新增';
        }
    },
    computed:{
      page(){
        return localStorage.childPage
      }
    },
    methods:{
      onSearch (e) {
        const value = e.target.value
        let newArr=[];
        this.date.map((item) => {
          if (item.indexOf(value) > -1) {
            newArr.push(item);
          }
        })
        this.dateList=newArr
      },
    }
  }
</script>

<style scoped lang="less">
 
</style>
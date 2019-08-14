<template>
    <div class="detailHeader">
        <a-card>
            <a-icon type="star" class="star" theme="filled" :style="{ color: '#1890ff' }" />
            <a-row>
                <span class="titleText font-bold userName">{{userName}}</span>
                <span class="titleText margin-left-20">
                  <a-tag v-for="(item,i) in tagList" :key="i"
                    class="tagStyle"
                    :color="item.color"
                  >{{item.tag}}</a-tag>
                </span>
            </a-row>
            <a-row class="fontSize16 margin-top-10">
                <span v-for="(item,i) in userInfo" :key="i">
                    <span v-if="i==='docNurse'">医护：{{item}} </span>
                    <!-- 病区 -->
                    <span v-else-if="i==='stage'">{{userInfo.dept}}{{item}} </span>
                    <span v-else-if="i==='dept'"></span>
                    <span v-else-if="i==='date'">出院日期：{{item}}</span>
                    <span v-else>{{item}} </span>
                    <a-divider v-if="i!=='date'&&i!=='dept'" type="vertical"/>
                </span>
            </a-row>
            <p class="margin-top-10" v-if="diag">诊断：{{diag}}</p>
        </a-card>
    </div>
</template>

<script>
  export default {
    name: 'detailHeader',
    data(){
      return{
            
      }
    },
    components:{
    },
    props:{
        userName:{
            type:String,
            default: ''
        },
        tagList:{
            type:Array,
            default: []
        },
        userInfo:{
            type:Object,
            default: {}
        },
        diag:{
            type:String,
            default: ''
        },
    },
    mounted(){
    },
    computed:{
      
    },
    methods:{
       
    }
  }
</script>

<style scoped lang="less">
    .detailHeader {
        .star{
            float: right;
            font-size: 20px;
            background-color: #DCE5FD;
            padding:6px;
            position: relative;
            top: -25px;
        }
    }
</style>
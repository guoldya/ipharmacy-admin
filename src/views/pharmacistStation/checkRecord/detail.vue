<template>
  <div class="detailCont">
    <a-row>
      <a-col :xl="8" :xxl="5" v-if="!addStatus">
          <dateList :date="date"></dateList>
      </a-col>
      <a-col  :xxl="page===JSON.stringify('look')&&!addStatus?19:24" :xl="page===JSON.stringify('look')&&!addStatus?16:24" class="padding-left-5">
          
          <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>   
        <a-card class="margin-top-10">
          <div class="disFlex">
            <span class="font-bold fontSize20"><a-icon type="book"/> 查房记录</span>
            <span>
              <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
              <a-button type="primary" class="margin-left-5" @click="adds" v-if="!addStatus">新增</a-button>
              <a-button type="primary" @click="handleSubmit" class="margin-left-5">提交</a-button>
            </span>
          </div>
          <a-divider />
          
          <a-form  class="ant-advanced-search-form" :form="form">
            <a-form-item   v-for="(list,i) in formItem" :key="i" :label="list.label" class="unit" >
                <a-textarea :autosize="{ minRows: 4}" v-decorator="[list.val]" :placeholder="'请输入'+list.label"/>
            </a-form-item>
          </a-form>
          <!-- <h3 class="record">患者主诉：</h3>
          <a-textarea placeholder="说明情况" :rows="4" />
          <h3 class="record drugfenxi">医学问题：</h3>
          <a-textarea placeholder="所犯医学问题" :rows="4" />
          <h3 class="record drugfenxi">医学评估：</h3>
          <a-textarea placeholder="医学评估" :rows="4" />
          <h3 class="record drugfenxi">监护计划：</h3>
          <a-textarea placeholder="监护计划" :rows="4" />
          <h3 class="record drugfenxi">结果：</h3>
          <a-textarea placeholder="结果" :rows="4" /> -->
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'index',
  data() {
    return {
      addStatus:false,
      userName:'梁汉文',
      tagList:[
          {tag:'91084654',color:'#40a9ff'},
          {tag:'肝',color:'#40a9ff'},
          {tag:'肾',color:'#58C7CF'},
          {tag:'心',color:'#B497EE'},

      ],
      userInfo:{
          sex:'男',
          age:'35岁'  ,
          dept:'皮肤科',
          stage:' 5病区/2床',
          docNurse:'胡清/黄晶锐',
          date:'2019-08-05'
      },
      diag:'过敏性皮炎',
      dateList:[],
      form: this.$form.createForm(this),
      formItem:[
        {label:'患者主诉',type:'date',val:'date'},
        {label:'医学问题',type:'input',val:'iphoneNumber'},
        {label:'药学评估',type:'input',val:'job'},
        {label:'监护计划',type:'input',val:'height'},
        {label:'结果',type:'input',val:'weight'},
      ],
    }
  },
  computed:{
      page(){
        return sessionStorage.getItem('childPage')
      },
      date(){
        return this.getDateList()
      },
  },

  created() {},

  mounted() {
    if(this.page===JSON.stringify('add')){
        document.title=document.title.split('查')[0]+'查房记录新增';
        this.addStatus=true;
    }else if(this.page===JSON.stringify('look')){
        document.title=document.title.split('查')[0]+'查房记录详情';
        this.addStatus=false;
    }
  },
  destroyed() {},
  methods: {
      getDateList() {
        return this.dateList=['2000-11-11','2000-12-12'];
      },
      // 搜索
      onSearch() {},
      // 查询
      search() {},
      // 重置
      resetForm() {},
      //新增
      adds() {
        if(this.page===JSON.stringify('look')){
          this.addStatus=true;
        }
      },
      backTo() {
        if(this.page===JSON.stringify('look')&&this.addStatus){
          this.addStatus=false;
        }else{
          this.$router.push({
            name: 'checkRecordIndex',
          })
        }
      },
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log(values);
          }
        })
      },
    // 查看
    rowClick() {},
    // 改变页码数
    sizeChange() {},
    // 分页条数
    pageChange() {}
  }
}
</script>

<style  lang='less'>
.detailCont {
  margin-top: 10px;
  .ant-list {
    margin-top: 10px;
  }
  .ant-list-item {
    padding-left: 25%;
    padding-top: 9px;
    padding-bottom: 9px;
    font-size: 20px;
    cursor: pointer;
  }
  header {
    span:nth-child(1) {
      font-size: 20px;
      padding-right: 20px;
      color: #1890ff;
      font-weight: bold;
    }
  }
  .people {
    margin-top: 15px;
    font-size: 18px;
  }
  .record {
    font-size: 22px;
  }
  .drugfenxi {
    margin-top: 15px;
  }
}
</style>
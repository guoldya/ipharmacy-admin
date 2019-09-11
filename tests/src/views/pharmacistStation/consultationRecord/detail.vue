<template>
  <div class="consultation">
    <a-row>
      <a-col  v-if="!addStatus" :xl="8" :xxl="5">
          <dateList :date="date"></dateList>
      </a-col>
      <a-col :xxl="page===JSON.stringify('look')&&!addStatus?19:24" :xl="page===JSON.stringify('look')&&!addStatus?16:24"  class="padding-left-5">
        <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo" :diag="diag"></detailHeader>
        
        <a-card class="margin-top-5">
          <div class="disFlex">
            <span class="font-bold fontSize16"><a-icon type="book"/> 会诊记录</span>
            <span>
              <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
              <a-button type="primary" class="margin-left-5" @click="adds" v-if="!addStatus">新增</a-button>
              <a-button type="primary" @click="handleSubmit" class="margin-left-5">提交</a-button>
            </span>
          </div>

          <a-form :form='form'>
            <a-row>
              <a-form-item
                class="margin-top-10"
                style="width: 350px;"
                v-bind="consultationItemLayout"
                label="会诊时间"
              >
                <a-date-picker  v-decorator="['date']" format="YYYY-MM-DD HH:mm"/>
              </a-form-item>
            </a-row>
            <a-row>
              <a-col :span="12" class="font-bold  fontSize16 lineHeight">会诊信息</a-col>
              <a-col :span="12" style="text-align: right">
                <a-button class="adviceButton"  icon="file-text">药物医嘱</a-button>
                <a-button class="laboratoryButton margin-left-5"  icon="experiment" >化验信息</a-button>
              </a-col>
            </a-row>
            <a-divider/>
            <a-row>
              <a-col>
                <a-form-item v-for="(list,i) in formItem" :key="i" :label="list.label">
                    <a-textarea :autosize="{ minRows: 4}" v-decorator="[list.val]"/>
                  </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <!-- <FooterToolBar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button
        @click="backTo"
        class="margin-left-5"
        :loading="loading"
      >返回
      </a-button>
      <a-button
        @click="adds"
        type="primary"
        style="margin-left: 5px"
        :loading="loading"
        v-if="!addStatus"
      >新增
      </a-button>
      <a-button
        type="primary"
        class="margin-left-5"
        @click="submit"
        :loading="loading"
      >保存
      </a-button>
    </FooterToolBar> -->
  </div>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import { mixin, mixinDevice } from '@/utils/mixin'
  import moment from 'moment'
  import 'moment/locale/zh-cn'
  moment.locale('zh-cn')
  export default {
    components: {
      FooterToolBar,
    },
    mixins: [mixin, mixinDevice],
    name: 'index',
    data() {
      return {
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
        date: ['2014-5-6', '2014-5-7', '2014-5-7', '2014-5-7', '2014-5-7'],

        api:{
          updateUrl:'sys/update',
        },
        consultationItemLayout: {
          labelCol: {
            xs: { span: 6 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 18 },
            sm: { span: 19 },
          },
        },
        form: this.$form.createForm(this),
        data: ['2014-5-6', '2014-5-7', '2014-5-7', '2014-5-7', '2014-5-7'],
        loading: false,
        addStatus:false,
        formItem:[
          {label:'病史、用药史概要及病程记录',val:'defcode2'},
          {label:'主要医疗或药学问题',val:'defcode3'},
          {label:'药学会诊(讨论)意见和建议',val:'defcode4'},
          {label:'遗留问题、解决方式及随访情况',val:'defcode5'},
        ],
      }
    },
    computed:{
      page(){
        return sessionStorage.getItem('childPage')
      }
    },

    created() {},

    mounted() {
      if(this.page===JSON.stringify('add')){
        document.title=document.title.split('会')[0]+'会诊记录新增';
        this.addStatus=true;
    }else if(this.page===JSON.stringify('look')){
        document.title=document.title.split('会')[0]+'会诊记录详情';
        this.addStatus=false;
    }
    },
    methods: {
      moment,
      onSearch() {

      },
      clickList(data){
        console.log(data,'data')
      },
      //新增
      adds() {
        this.addStatus = true;

      },
      backTo() {
        if(this.page===JSON.stringify('look')&&this.addStatus){
          this.addStatus=false;
        }else{
          this.$router.push({
            name: 'consultationRecordIndex',
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
    }
  }
</script>

<style lang='less'>
  .consultation {
    .ant-list {
      margin-top: 10px;
    }

    .ant-list-item {
      padding-left: 25%;
      padding-top: 9px;
      padding-bottom: 9px;
      font-size: 16px;
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
      font-size: 14px;
    }

    .record {
      font-size: 16px;
    }

    .drugfenxi {
      margin-top: 15px;
    }

    .fontSize16 {
      font-size: 16px;
    }
    .adviceButton{
      color: #fff;
      background-color:#C49F47
    }
    .adviceButton:hover{
      border: 1px #C49F47 solid;
      color: #fff;
    }
    .laboratoryButton{
      color: #fff;
      background-color:#32C5D2;
    }
    laboratoryButton:hover{
      border: 1px #32C5D2 solid;
      color: #fff;
    }
    .ant-form label{
      font-size: 16px;
    }
  }
</style>
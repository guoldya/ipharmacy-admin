<template>
  <div class="consultation">
    <a-row>
      <a-col v-if="!isNew" :span="5" class="timeListCard">
        <a-card>
          <a-input-search placeholder="输入要查询日期" @search="onSearch"/>
          <a-list size="large" bordered :dataSource="data">
            <a-list-item slot="renderItem" slot-scope="item, index" @click="clickList(item)">{{item}}</a-list-item>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="isNew ? 24:19" class="padding-left-5">
        <a-card>
          <header>
            <span>梁汉文</span>
            <a-tag color="#2db7f5">95279527</a-tag>
            <a-tag color="blue">心</a-tag>
            <a-tag color="#108ee9">肝</a-tag>
            <a-tag color="#87d068">肺</a-tag>
          </header>
          <aside class="people">
            <span>男</span>
            <a-divider type="vertical"/>
            <span>35岁</span>
            <a-divider type="vertical"/>
            <span>皮肤科&nbsp;五病区/2床</span>
            <a-divider type="vertical"/>
            <span>医护：唐伯虎/秋香</span>
            <a-divider type="vertical"/>
            <span>入院日期：2017-4-8</span>
          </aside>
        </a-card>
        <a-card class="margin-top-5">
          <header class="record">
            <a-icon type="book"/>
            <span class="font-bold fontSize16">会诊记录</span>
          </header>
          <a-form>
            <a-row>
            <a-form-item
              class="margin-top-10"
              style="width: 350px;"
              v-bind="consultationItemLayout"
              label="会诊时间"
            >
              <a-date-picker/>
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
              <a-form-item label="病史、用药史概要及病程记录" class="record">
                <a-textarea v-decorator="['defcode1']" placeholder="病史、用药史概要及病程记录" :rows="4"/>
              </a-form-item>
              <a-form-item label="主要医疗或药学问题"  class="record">
                <a-textarea v-decorator="['defcode2']" placeholder="主要医疗或药学问题" :rows="4"/>
              </a-form-item>
              <a-form-item label="药学会诊(讨论)意见和建议"  class="record">
                <a-textarea v-decorator="['defcode3']" placeholder="药学会诊(讨论)意见和建议" :rows="4"/>
              </a-form-item>
              <a-form-item label="遗留问题、解决方式及随访情况"  class="record">
                <a-textarea v-decorator="['defcode4']" placeholder="遗留问题、解决方式及随访情况" :rows="4"/>
              </a-form-item>
            </a-row>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <FooterToolBar
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
      >新增
      </a-button>
      <a-button
        type="primary"
        class="margin-left-5"
        @click="submit"
        :loading="loading"
      >保存
      </a-button>
    </FooterToolBar>
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
        isNew:false,
      }
    },
    computed: {},

    mounted() {
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
        this.isNew = true;

      },
      submit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
              this.$axios({
                url: this.api.updateUrl,
                method: 'post',
                data: values
              }).then(res => {
                if (res.code == '200') {
                  this.success(res.msg)
                  this.backTo()
                } else {
                  this.warn(res.msg)
                }
              })
                .catch(err => {
                  this.error(err)
                })
          }
        })
      },
      backTo() {
        this.$router.push({
          name: 'consultationRecordIndex'
        })
      }
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
    .timeListCard{
      .ant-card-body {
        padding: 5px;
        zoom: 1;
      }
    }

  }
</style>
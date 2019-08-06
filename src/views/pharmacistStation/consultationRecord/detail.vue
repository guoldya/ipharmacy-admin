<template>
  <div class="detailCont">
    <a-row>
      <a-col :span="5">
        <a-card>
          <a-input-search placeholder="输入要查询日期" @search="onSearch"/>
          <a-list size="large" bordered :dataSource="data">
            <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="19" class="padding-left-5">
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
        <a-card class="margin-top-10">
          <header class="record">
            <a-icon type="book"/>
            <span class="font-bold fontSize16">会诊记录</span>
          </header>
          <a-form>
            <a-form-item
              class="margin-top-10"
              style="width: 350px;"
              v-bind="formItemLayout"
              label="会诊时间"
            >
              <a-date-picker/>
            </a-form-item>
            <a-row>
              <a-col :span="12" class="font-bold">会诊信息</a-col>
              <a-col :span="12" style="text-align: right">
                <a-button style="background-color:#C49F47 "  icon="file-text">药物医嘱</a-button>
                <a-button style="background-color:#32C5D2 " class="margin-left-5"  icon="experiment" >化验信息</a-button>
              </a-col>
            </a-row>

            <a-divider/>
            <h3 class="record">患者主诉：</h3>
            <a-textarea placeholder="说明情况" :rows="4"/>
            <h3 class="record drugfenxi">医学问题：</h3>
            <a-textarea placeholder="所犯医学问题" :rows="4"/>
            <h3 class="record drugfenxi">医学评估：</h3>
            <a-textarea placeholder="医学评估" :rows="4"/>
            <h3 class="record drugfenxi">监护计划：</h3>
            <a-textarea placeholder="监护计划" :rows="4"/>
            <h3 class="record drugfenxi">结果：</h3>
            <a-textarea placeholder="结果" :rows="4"/>
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
        formItemLayout: {
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
      }
    },
    computed: {},

    created() {
    },

    mounted() {
    },
    destroyed() {
    },
    methods: {
      moment,
      onSearch() {

      },
      //新增
      adds() {
        this.$router.push({
          name: 'checkRecordDetail'
        })
      },
      submit() {

      },
      backTo() {

      }
    }
  }
</script>

<style lang='less'>
  .detailCont {
    margin-top: 10px;

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
  }
</style>
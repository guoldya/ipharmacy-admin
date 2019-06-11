<template>
  <div>
    <a-card class="cardOne">
      <a-form :form="form">
        <a-col :span="5"/>
        <a-col :span="12">
          <h2>基本信息</h2>
          <!--<div style="border: 1px rgba(0,0,0,0.4) solid; margin-bottom: 30px"></div>-->
          <a-divider/>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="药品名称"
                           v-bind="formItemLayout">
                <a-input read-only v-decorator="[ 'drugNames']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="通用名"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'genericName']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="商品名"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'tradeName']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="英文名称"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'englishname']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="拼音码"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'spellCode']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="化学名称"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'chemicalName']"/>
              </a-form-item>
            </a-col>
          </a-row>

          <h2 class="margin-top-10">成分信息</h2>
          <a-divider/>
          <!--<div style="border: 1px rgba(0,0,0,0.4) solid; margin-bottom: 30px"></div>-->
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药物成分"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'composition']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="分子式"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'molecularformula']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="分子量"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'molecularweight']"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="7"/>
      </a-form>
    </a-card>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="submit" :loading="loading" class="margin-left-5">保存</a-button>
    </footer-tool-bar>
  </div>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import { mixin, mixinDevice } from '@/utils/mixin'
  import moment from 'moment'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    mixins: [mixin, mixinDevice],
    data() {
      return {
        api: {
          orgUrl: '/sys/sysOrgs/selectList',
          deptUrl: '/sys/sysOrgs/selectDeptsByOrgId'
        },
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: {
            lg: { span: 6 },
            sm: { span: 6 },
            xxl: { span: 6 }
          },
          wrapperCol: {
            lg: { span: 18 },
            sm: { span: 18 },
            xxl: { span: 18 }
          }
        },
        oneColLayout:{
          labelCol: {
            lg: { span: 3 },
            sm: { span: 3 },
            xxl: { span:3 }
          },
          wrapperCol: {
            lg: { span: 21 },
            sm: { span: 21 },
            xxl: { span: 21 }
          }
        },
        col: 6,
        orgData: [],
        deptData: [],
        titleData: [],
        posData: [],
        mentData: [],
        isNew: true,
        spinning: false,
        formData: {
          sex: '1',
          status: '1',
          prescRight: '0',
          outpAntibacterial: '1',
          hospAntibacterial: '1'
        },
        loading: false
      }
    },
    components: {
      ATextarea,
      FooterToolBar
    },
    mounted() {
      // this.getOrgData();
      // this.getTitleData();
      // this.getPosData();
      // this.getMentData();
      // this.init();]
    },
    methods:{
      submit(){

      },
      cancel(){

      }
    }
  }
</script>
<style>
  .cardOne .ant-divider-horizontal{
    margin-top: 0px;
  }
</style>
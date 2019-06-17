<template>
  <div>
    <a-card class="cardOne">
      <a-form :form="form">
        <a-col :span="5">
          <a-anchor style="text-align: justify;">
            <a-anchor-link href="#drugName" class="w4 font-bold" title="基本信息">
              <a-anchor-link href="#drugNames" class="w4 font-normal" title="药品名称"/>
              <a-anchor-link href="#genericname" class="w4 font-normal" title="通用名"/>
              <a-anchor-link href="#tradename" class="w4 font-normal" title="商品名"/>
              <a-anchor-link href="#englishname" class="w4 font-normal" title="英文名称"/>
              <a-anchor-link href="#spellCode" class="w4 font-normal" title="拼音码"/>
              <a-anchor-link href="#spec" class="w4 font-normal" title="规格"/>
              <a-anchor-link href="#drugType" class="w4 font-normal" title="药品类型"/>
            </a-anchor-link>
            <a-anchor-link href="#detailMsg" class="w4 font-bold" title="详细信息">
              <a-anchor-link href="#chemicalname" class="w4 font-normal" title="化学名称"/>
              <a-anchor-link href="#molecularweight" class="w4 font-normal" title="分子量"/>
              <a-anchor-link href="#composition" class="w4 font-normal" title="药品成分"/>
              <a-anchor-link href="#molecularformula" class="w4 font-normal" title="分子式"/>
              <a-anchor-link href="#description" class="w4 font-normal" title="性状"/>
              <a-anchor-link href="#indications" class="w4 font-normal" title="适应症"/>
              <a-anchor-link href="#dosage" class="w4 font-normal" title="用法用量"/>
              <a-anchor-link href="#adversereactions" class="w4 font-normal" title="不良反应"/>
              <a-anchor-link href="#contraindications" class="w4 font-normal" title="禁忌症"/>
              <a-anchor-link href="#precautions" class="w4 font-normal" title="注意事项"/>
              <a-anchor-link href="#pregnantuse" class="w4 font-normal" title="孕妇及哺乳期用药"/>
              <a-anchor-link href="#childrenuse" class="w4 font-normal" title="儿童用药"/>
              <a-anchor-link href="#elderlyuse" class="w4 font-normal" title="老年用药"/>
              <a-anchor-link href="#interactions" class="w4 font-normal" title="药物相互作用"/>
              <a-anchor-link href="#pharmacologicalactions" class="w4 font-normal" title="药理毒理"/>
              <a-anchor-link href="#overdosage" class="w4 font-normal" title="药物过量"/>
              <a-anchor-link href="#phamacokinetics" class="w4 font-normal" title="药代动力学"/>
              <a-anchor-link href="#storage" class="w4 font-normal" title="药品贮藏"/>
              <a-anchor-link href="#approvalnumber" class="w4 font-normal" title="批准文号"/>
              <a-anchor-link href="#producedby" class="w4 font-normal" title="生产企业"/>
            </a-anchor-link>
          </a-anchor>
        </a-col>
        <a-col :span="12">
          <h2 id="drugName">基本信息</h2>
          <!--<div style="border: 1px rgba(0,0,0,0.4) solid; margin-bottom: 30px"></div>-->
          <a-divider/>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="药品名称" id="drugNames"
                           v-bind="formItemLayout">
                <a-input read-only v-decorator="[ 'drugNames']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="通用名" id="genericname"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'genericname']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="商品名" id="tradename"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'tradename']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="英文名称" id="englishname"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'englishname']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="拼音码" id="spellCode"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'spellCode']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="规格" id="spec"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'spec']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="药品类型" id="drugType"
                           v-bind="formItemLayout">
                <a-select v-decorator="[ 'drugType']">
                  <a-select-option :value='op.id' v-for="(op,index) in drugType" :key="index">
                    {{op.text}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <h2 class="margin-top-10" id="detailMsg">详细信息</h2>
          <a-divider/>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="化学名称" id="chemicalname"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'chemicalname']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="分子量" id="molecularweight"
                           v-bind="formItemLayout">
                <a-input v-decorator="[ 'molecularweight']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <!--<div style="border: 1px rgba(0,0,0,0.4) solid; margin-bottom: 30px"></div>-->
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药物成分" id="composition"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'composition']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="分子式" id="molecularformula"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'molecularformula']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="性状" id="description"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'description']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="适应症" id="indications"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'indications']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="用法用量" id="dosage"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'dosage']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="不良反应" id="adversereactions"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'adversereactions']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="禁忌症" id="contraindications"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'contraindications']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="注意事项" id="precautions"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'precautions']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="孕妇及哺乳期用药" id="pregnantuse"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'pregnantuse']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="儿童用药" id="childrenuse"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'childrenuse']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="老年用药" id="elderlyuse"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'elderlyuse']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药物相互作用" id="interactions"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'interactions']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药理毒理" id="pharmacologicalactions"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'pharmacologicalactions']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药物过量" id="overdosage"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'overdosage']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药代动力学" id="phamacokinetics"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'phamacokinetics']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="药品贮藏" id="storage"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'storage']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="批准文号" id="approvalnumber"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'approvalnumber']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24" style="margin-left: -4px;">
              <a-form-item label="生产企业" id="producedby"
                           v-bind="oneColLayout">
                <a-textarea v-decorator="[ 'producedby']"/>
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
          dicPackageSelectOne: '/sys/dicPackageinsert/selectOne' ,
          dicPackageinsertUpdate:'/sys/dicPackageinsert/update'
        },
        drugDetail: {},
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: {
            lg: { span: 8 },
            sm: { span: 8 },
            xxl: { span: 8 }
          },
          wrapperCol: {
            lg: { span: 16 },
            sm: { span: 16 },
            xxl: { span: 16 }
          }
        },
        oneColLayout: {
          labelCol: {
            lg: { span: 4 },
            sm: { span: 4 },
            xxl: { span: 4 }
          },
          wrapperCol: {
            lg: { span: 20 },
            sm: { span: 20 },
            xxl: { span: 20 }
          }
        },
        loading: false,
        drugType: [
          { text: '西药', id: 1 },
          { text: '中成药', id: 2 },
          { text: '中药', id: 3 }
        ]
      }
    },
    components: {
      ATextarea,
      FooterToolBar
    },
    mounted() {
      this.init()

    },
    methods: {
      init() {
        let params = {}
        params.drugCode = this.$route.params.drugCode
        this.$axios({
          url: this.api.dicPackageSelectOne,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            if (res.data) {
              this.drugDetail = res.data
              this.getFormData()
            } else {
              console.log(1)
              this.form.setFieldsValue({ drugNames: this.$route.params.drugName })
            }
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      getFormData() {
        this.form.setFieldsValue(this.drugDetail)
      },
      submit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            values.drugCode = this.$route.params.drugCode
            this.$axios({
              url: this.api.dicPackageinsertUpdate,
              method: 'post',
              data: values
            }).then(res => {
              if (res.code == '200') {
                this.success('保存成功');
                setTimeout(()=>{
                  this.$router.push({
                    name: 'drugSpecIndex'
                  })
                },500)

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
      cancel() {
        this.$router.push({
          name: 'drugSpecIndex'
        })
      }
    }
  }
</script>
<style>
  .cardOne .ant-divider-horizontal {
    margin-top: 0px;
  }
  .textIndent {
    text-indent:2em
  }
</style>
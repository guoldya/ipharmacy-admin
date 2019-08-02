<template>
  <div class="yaoshi">
    <a-card>
      <header>
        <h3 class="returns" @click="backTo"><返回</h3>
        <div class="does">
          <a-button type="primary">保存</a-button>
          <a-button>取消</a-button>
        </div>
      </header>
      <a-divider />
      <h2>基础信息</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col v-for="item in formBase" :key="item.title" :span="6">
              <a-form-item :label="`${item.title}`">
                <a-input
                  v-decorator="[
                `${item.name}`,
                {
                  rules: [{
                    required: !item.require ,
                    message: 'Input something!',
                  }],
                }
              ]"
                  :placeholder="`请输入${item.title}`"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="备注" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:false},{ max:50,message:'最多50个字符' }]}]"
              placeholder="请输入备注"
            />
          </a-form-item>
          <a-form-item label="药店图标" class="texts unplod">
            <Upload :count="1" ref="uploadIcon" />
          </a-form-item>
        </a-form>
      </div>
      <h2>药店营业执照</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col v-for="item in practiceForms" :key="item.title" :span="6">
              <a-form-item :label="`${item.title}`">
                <a-input
                  v-decorator="[
                `${item.name}`,
                {
                  rules: [{
                    required: !item.require ,
                    message: 'Input something!',
                  }],
                }
              ]"
                  :placeholder="`请输入${item.title}`"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="经营范围" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="资质上传" class="texts unplod">
            <Upload :count="1" ref="uploadlicense" />
          </a-form-item>
        </a-form>
      </div>
      <h2>药品经营许可证</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col v-for="item in certificateForms" :key="item.title" :span="6">
              <a-form-item :label="`${item.title}`">
                <a-input
                  v-decorator="[
                `${item.name}`,
                {
                  rules: [{
                    required: !item.require ,
                    message: 'Input something!',
                  }],
                }
              ]"
                  :placeholder="`请输入${item.title}`"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="经营范围" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="资质上传" class="texts unplod">
            <Upload :count="1" ref="uploadAgree" />
          </a-form-item>
        </a-form>
      </div>
      <h2>药品经营质量管理规范认证证书（GSP）</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col v-for="item in druglist" :key="item.title" :span="6">
              <a-form-item :label="`${item.title}`">
                <a-input
                  v-decorator="[
                `${item.name}`,
                {
                  rules: [{
                    required: !item.require ,
                    message: 'Input something!',
                  }],
                }
              ]"
                  :placeholder="`请输入${item.title}`"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="资质上传" class="texts unplod">
            <Upload :count="1" ref="uploadGSP" />
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>
<script>
import { datas } from './json'
import Upload from '@/my-components/upload/upload'
export default {
  data() {
    return {
      expand: false,
      form: this.$form.createForm(this),
      loading: false
    }
  },
  components: {
    Upload
  },
  computed: {
    formBase() {
      return [
        {
          title: '药店编码',
          require: true,
          name: 'orgCode'
        },
        {
          title: '药店名称',
          name: 'orgName'
        },
        {
          title: '简码',
          name: 'simpleCode'
        },
        {
          title: '药店类型',
          require: true,
          name: ''
        },
        {
          title: '联系人',
          name: 'contacts'
        },
        {
          title: '联系电话',
          name: 'telephone'
        },
        {
          title: '区域',
          name: 'areaId'
        },
        {
          title: '地址',
          name: 'address'
        },
        {
          title: '药店性质',
          name: 'enable'
        },
        {
          title: '配送方式',
          name: 'authStatus'
        },
        {
          title: '开户银行',
          name: 'bank'
        },
        {
          title: '账号',
          name: 'account'
        },
        {
          title: '营业时间',
          name: 'blFundingTime'
        },
        {
          title: '特色服务',
          name: 'cook'
        }
      ]
    },
    practiceForms() {
      return [
        {
          title: '名称',
          name: 'blName'
        },
        {
          title: '类型',
          name: 'blType'
        },
        {
          title: '住所',
          name: 'blAddr'
        },
        {
          title: '注册资金',
          name: 'blRegistCapital'
        },
        {
          title: '成立日期',
          name: 'blFundingTime'
        },
        {
          title: '经营期限',
          name: 'type'
        },
        {
          title: '法定代表人',
          name: 'blPerson'
        },
        {
          title: '登记日期',
          name: 'blLicenseTime'
        },
        {
          title: '登记机关',
          name: 'blLicenseOrg'
        }
      ]
    },
    certificateForms() {
      return [
        {
          title: '企业名称',
          name: 'dblName'
        },
        {
          title: '注册地址',
          name: 'dblStoreAddr'
        },
        {
          title: '法定代表人',
          name: 'dblPerson'
        },
        {
          title: '企业负责人',
          name: 'dblPrincipal'
        },
        {
          title: '质量负责人',
          name: 'dblQuaPrincipal'
        },
        {
          title: '仓库地址',
          name: 'dblStoreAddr'
        },
        {
          title: '证号',
          name: 'dblNo'
        },
        {
          title: '经营方式',
          name: 'dblBizMode'
        }
      ]
    },
    druglist() {
      return [
        {
          title: '企业名称',
          name: 'gspName'
        },
        {
          title: '地址',
          name: 'gspAddr'
        },
        {
          title: '认证范围',
          name: 'gspScope'
        },
        {
          title: '证书编号',
          name: 'gspNo'
        },
        {
          title: '有效期至',
          name: 'gspValidTime'
        },
        {
          title: '发证机关',
          name: 'gspLicenseOrg'
        },
        {
          title: '发证日期:',
          name: 'gspLicenseTime'
        }
      ]
    }
  },
  created() {},
  mounted() {
    if (this.$route.params.id == 1) {
      console.log('ddd')
      this.giveFormData()
    }
  },
  methods: {
    // 表单赋值
    giveFormData() {
      let reqArr = datas[0]
      let {
          account,
          address,
          areaId,
          authStatus,
          bank,
          blAddr,
          blBizLimit,
          blBizScope,
          blFundingTime,
          blLicenseOrg,
          blLicenseTime,
          blName,
          blPerson,
          blPic,
          blRegistCapital,
          blType,
          blUrl,
          contacts,
          createBy,
          createTime,
          dblAddr,
          dblBizMode,
          dblBizScope,
          dblLicenseOrg,
          dblLicenseTime,
          dblName,
          dblNo,
          dblPerson,
          dblPic,
          dblPrincipal,
          dblQuaPrincipal,
          dblStoreAddr,
          dblUrl,
          dblValidTime,
          dispatchType,
          enable,
          gspAddr,
          gspLicenseOrg,
          gspLicenseTime,
          gspName,
          gspNo,
          gspPic,
          gspScope,
          gspUrl,
          gspValidTime,
          id,
          latitude,
          logoUrl,
          longitude,
          nature,
          orgCode,
          orgName,
          orgType,
          remark,
          simpleCode,
          status,
          telephone,
          type,
          updateTime
        } = reqArr,
        formData = {
          account,
          address,
          areaId,
          authStatus,
          bank,
          blAddr,
          blBizLimit,
          blBizScope,
          blFundingTime,
          blLicenseOrg,
          blLicenseTime,
          blName,
          blPerson,
          blPic,
          blRegistCapital,
          blType,
          blUrl,
          contacts,
          createBy,
          createTime,
          dblAddr,
          dblBizMode,
          dblBizScope,
          dblLicenseOrg,
          dblLicenseTime,
          dblName,
          dblNo,
          dblPerson,
          dblPic,
          dblPrincipal,
          dblQuaPrincipal,
          dblStoreAddr,
          dblUrl,
          dblValidTime,
          dispatchType,
          enable,
          gspAddr,
          gspLicenseOrg,
          gspLicenseTime,
          gspName,
          gspNo,
          gspPic,
          gspScope,
          gspUrl,
          gspValidTime,
          id,
          latitude,
          logoUrl,
          longitude,
          nature,
          orgCode,
          orgName,
          orgType,
          remark,
          simpleCode,
          status,
          telephone,
          type,
          updateTime
        }
      this.form.setFieldsValue(formData)
      let arrObj = [
        // { name: 'uploadIcon', url: '9a75716e-e260-40f9-b2a0-e17b8bd1c25c.jpg' },
         { name: 'uploadIcon', url: '42778a8b-5d60-4660-bff0-ff3a1d061310.jpeg' },
        { name: 'uploadGSP', url: '9a75716e-e260-40f9-b2a0-e17b8bd1c25c.jpg' },
        { name: 'uploadlicense', url: 'eccfdc23-eedc-4620-be7f-8cf6f350fd35.png' },
        { name: 'uploadAgree', url: '89bb44dd-3b4a-40cc-b144-4a095163f973.jpg' }
      ]
      arrObj.forEach((item, index) => {
        let obj = {
          fileName: item.url,
          name: item.url,
          status: 'done',
          uid: '-1',
          url: `http://192.168.0.150:40080/res/${item.url}`
        }
        this.$refs[item.name].fileList = [obj]
        this.$refs[item.name].imgArr = [obj]
      })
      // let obj = {
      //   fileName: '89bb44dd-3b4a-40cc-b144-4a095163f973.jpg',
      //   name: '89bb44dd-3b4a-40cc-b144-4a095163f973.jpg',
      //   status: 'done',
      //   uid: '-1',
      //   url: 'http://192.168.0.150:40080/res/89bb44dd-3b4a-40cc-b144-4a095163f973.jpg'
      // }
      // setTimeout(() => {
      //   this.$refs.upload.fileList = [obj]
      //   this.$refs.upload.imgArr = [obj]
      // })
    },
    // 查询数据
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios({
            url: this.api.updt,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.$message.info('保存成功!')
                this.backTo()
              } else {
                this.$message.error('保存失败!')
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
        name: 'drugShopIndex'
      })
    },
    confirm(e) {},
    // 表单操作
    handlesColor(data) {
      if (data) {
        this.listData.levelColor = data
      }
    },
    handleSearch(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        console.log('error', error)
        console.log('Received values of form: ', values)
      })
    }
  }
}
</script>
<style lang='less'>
.yaoshi {
  .ant-upload-list-picture-card .ant-upload-list-item{
        height:75px;
  }
  .texts {
    .ant-form-item-label {
      width: 7%;
    }
  }
  .unplod {
    .ant-form-item-label {
      width: 7%;
      margin-top: 24px;
    }
  }
  header {
    h3 {
      margin-top: 6px;
      font-size: 17px;
    }
    height: 25px;
    .returns {
      float: left;
    }
    .does {
      float: right;
      :nth-child(2) {
        margin-left: 20px;
      }
    }
  }
  // 表单样式
  .ant-advanced-search-form {
    padding: 24px;
    // background: #fbfbfb;
    // border: 1px solid #d9d9d9;
    border-radius: 6px;
  }

  .ant-advanced-search-form .ant-form-item {
    display: flex;
  }

  .ant-advanced-search-form .ant-form-item-control-wrapper {
    flex: 1;
  }

  #components-form-demo-advanced-search .ant-form {
    max-width: none;
  }

  .ant-form-item-label {
    width: 30%;
  }
}
</style>
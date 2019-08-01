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
                `${item.name}:`,
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
            <a-upload
              name="avatar"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
            >
              <div>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
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
                `${item.name}:`,
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
            <a-upload
              name="avatar"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
            >
              <div>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
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
                `${item.name}:`,
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
            <a-upload
              name="avatar"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
            >
              <div>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
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
                `${item.name}:`,
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
            <a-upload
              name="avatar"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
            >
              <div>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>
<script>
import {datas} from './json'
export default {
  data() {
    return {
      expand: false,
      form: this.$form.createForm(this),
      loading: false,
    }
  },
  computed: {
    formBase() {
      return [
        {
          title: '药店编码',
          require: true,
          name:'orgCode'
        },
        {
          title: '药店名称',
            name:'orgName'
        },
        {
          title: '简码',  
            name:'simpleCode'
        },
        {
          title: '药店类型',
          require: true,
            name:''
        },
        {
          title: '联系人',
            name:'contacts'
        },
        {
          title: '联系电话',
          name:'telephone'
        },
        {
          title: '区域',
          name:'areaId'
        },
        {
          title: '地址',
          name:'address'
        },
        {
          title: '药店性质',
          name:'enable'
        },
        {
          title: '配送方式',
          name:'authStatus'
        },
        {
          title: '开户银行',
          name:'bank'
        },
        {
          title: '账号',
          name:'account'
        },
        {
          title: '营业时间',
          name:'blFundingTime'
        },
        {
          title: '特色服务',
          name:'cook'
        }
      ]
    },
    practiceForms() {
      return [
        {
          title: '名称',
          name:'blName'
        },
        {
          title: '类型',
          name:'blType'
        },
        {
          title: '住所',
          name:'blAddr'
        },
        {
          title: '注册资金',
          name:'blRegistCapital'
        },
        {
          title: '成立日期',
          name:'blFundingTime'
        },
        {
          title: '经营期限',
          name:'type'
        },
        {
          title: '法定代表人',
          name:'blPerson'
        },
        {
          title: '登记日期',
          name:'blLicenseTime'
        },
        {
          title: '登记机关',
          name:'blLicenseOrg'
        }
      ]
    },
    certificateForms() {
      return [
        {
          title: '企业名称',
          name:'dblName'
        },
        {
          title: '注册地址',
          name:'dblStoreAddr'
        },
        {
          title: '法定代表人',
          name:'dblPerson'
        },
        {
          title: '企业负责人',
          name:'dblPrincipal'
        },
        {
          title: '质量负责人',
          name:'dblQuaPrincipal'
        },
        {
          title: '仓库地址',
          name:'dblStoreAddr'
        },
        {
          title: '证号',
          name:'dblNo'
        },
        {
          title: '经营方式',
          name:'dblBizMode'
        }
      ]
    },
    druglist(){
 return [
        {
          title: '企业名称',
          name:'gspName'
        },
        {
          title: '地址',
          name:'gspAddr'
        },
        {
          title: '认证范围',
          name:'gspScope'
        },
        {
          title: '证书编号',
          name:'gspNo'
        },
        {
          title: '有效期至',
          name:'gspValidTime'
        },
        {
          title: '发证机关',
          name:'gspLicenseOrg'
        },
        {
          title: '发证日期:',
          name:'gspLicenseTime'
        },
      ]
    }
  },
  created() {
     console.log(datas)
     let reqArr=datas[0]
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
    updateTime,
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
  },
  mounted() {},
  methods: {
    // 表单赋值
    giveFormData(){
        
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
    },
    
  }
}
</script>
<style lang='less'>
.yaoshi {
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
<template>
  <div class="yaoshi">
    <a-card>
      <header>
        <h3 class="returns" @click="backTo"><返回</h3>
        <div class="does">
          <a-button type="primary" @click="save">保存</a-button>
          <a-button @click="cancle">取消</a-button>
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
          <a-form-item label="个人介绍" class="texts">
            <a-textarea
              v-decorator="['profile',{rules:[{message:'请输入用户名称',required:false},{ max:50,message:'最多50个字符' }]}]"
              placeholder="请输入个人介绍"
            />
          </a-form-item>
          <a-form-item label="擅长领域" class="texts">
            <a-textarea
              v-decorator="['expertField',{rules:[{message:'请输入用户名称',required:false},{ max:50,message:'最多50个字符' }]}]"
              placeholder="请输入擅长领域"
            />
          </a-form-item>
          <a-form-item label="remark" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:false},{ max:50,message:'最多50个字符' }]}]"
              placeholder="请输入备注"
            />
          </a-form-item>
        </a-form>
      </div>
      <h2>执业药师注册证</h2>
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
          <a-form-item label="执业范围" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="资质上传" class="texts unplod">
            <Upload :count="1" ref="uploadIcon" />
          </a-form-item>
        </a-form>
      </div>
      <h2>执业药师资格证书</h2>
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
          <a-form-item label="执业范围" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="资质上传" class="texts unplod">
            <Upload :count="1" ref="uploadlicense" />
          </a-form-item>
        </a-form>
      </div>
      <h2>执业药师资格证书</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-form-item label="身份证正面" class="texts unplod">
            <Upload :count="1" ref="uploadGSP" />
          </a-form-item>
          <a-form-item label="身份证反面" class="texts unplod">
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
          title: '药师编码',
          require: true,
          name: 'code'
        },
        {
          title: '账号',
          name: 'account'
        },
        {
          title: '姓名',
          name: 'name'
        },
        {
          title: '简码',
          require: true,
          name: 'simpleCode'
        },
        {
          title: '性别',
          name: 'sex'
        },
        {
          title: '身份证号',
          name: 'idCard'
        },
        {
          title: '执业机构',
          name: 'jobOrg'
        },
        {
          title: '职称',
          name: 'profession'
        },
        {
          title: '执业地点',
          name: 'jobAddr'
        },
        {
          title: '联系电话',
          name: 'telephone'
        },
        {
          title: '毕业院校',
          name: 'gradInst'
        },
        {
          title: '学历',
          name: 'education'
        },
        {
          title: '专业',
          name: 'major'
        },
        {
          title: '参加工作时间',
          name: 'jobStartTime'
        }
      ]
    },
    practiceForms() {
      return [
        {
          title: '资格证书号',
          name: 'regArea'
        },
        {
          title: '注册证编号',
          name: 'regIssueOrg'
        },
        {
          title: '姓名',
          name: 'regName'
        },
        {
          title: '执业地区',
          name: 'regOrgName'
        },
        {
          title: '执业类别',
          name: 'regScope'
        },
        {
          title: '执业单位',
          name: 'regType'
        },
        {
          title: '有效期至',
          name: 'regIssueTime'
        },
        {
          title: '发证机关',
          name: 'regOrgName'
        },
        {
          title: '注册日期',
          name: 'regIssueOrg'
        }
      ]
    },
    certificateForms() {
      return [
        {
          title: '管理号',
          name: 'qcBirthday'
        },
        {
          title: '姓名',
          name: 'qcAuthTime'
        },
        {
          title: '性别',
          name: 'qcIssueOrg'
        },
        {
          title: '出生日期',
          name: 'qcIssueTime'
        },
        {
          title: '专业类别',
          name: 'qcName'
        },
        {
          title: '批准日期',
          name: 'qcMajor'
        },
        {
          title: '签发单位',
          name: 'qcNo'
        },
        {
          title: '签发日期',
          name: 'qcSex'
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.giveFormData()
  },
  methods: {
    giveFormData() {
      if (this.$route.params.id == 1) {
        let reqArr = datas[0]
        let {
            account,
            authStatus,
            code,
            education,
            expertField,
            gradInst,
            id,
            idCard,
            idCardBack,
            idCardBackUrl,
            idCardFront,
            idCardFrontUrl,
            jobAddr,
            jobOrg,
            jobStartTime,
            major,
            name,
            profession,
            profile,
            qcAuthTime,
            qcBirthday,
            qcIssueOrg,
            qcIssueTime,
            qcMajor,
            qcName,
            qcNo,
            qcPic,
            qcSex,
            qcUrl,
            regArea,
            regIssueOrg,
            regIssueTime,
            regName,
            regNo,
            regOrgName,
            regPic,
            regQuaNo,
            regScope,
            regType,
            regUrl,
            regValidTime,
            remark,
            sex,
            simpleCode,
            telephone
          } = reqArr,
          formData = {
            account,
            authStatus,
            code,
            education,
            expertField,
            gradInst,
            id,
            idCard,
            idCardBack,
            idCardBackUrl,
            idCardFront,
            idCardFrontUrl,
            jobAddr,
            jobOrg,
            jobStartTime,
            major,
            name,
            profession,
            profile,
            qcAuthTime,
            qcBirthday,
            qcIssueOrg,
            qcIssueTime,
            qcMajor,
            qcName,
            qcNo,
            qcPic,
            qcSex,
            qcUrl,
            regArea,
            regIssueOrg,
            regIssueTime,
            regName,
            regNo,
            regOrgName,
            regPic,
            regQuaNo,
            regScope,
            regType,
            regUrl,
            regValidTime,
            remark,
            sex,
            simpleCode,
            telephone
          }
        this.form.setFieldsValue(formData)
        let arrObj = [
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
      }
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
        name: 'apothecaryIndex'
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
    save() {
      this.$message.info('保存成功!')
      this.$router.push({
        name: 'apothecaryIndex'
      })
    },
    cancle() {
      this.$router.push({
        name: 'apothecaryIndex'
      })
    }
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
  .returns {
    cursor: pointer;
  }
}
</style>
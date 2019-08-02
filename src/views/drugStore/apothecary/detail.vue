<template>
  <div class="yaoshi">
    <a-card>
      <header>
        <h3 class="returns"><返回</h3>
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
                `${item.title}:`,
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
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:false},{ max:50,message:'最多50个字符' }]}]"
              placeholder="请输入个人介绍"
            />
          </a-form-item>
          <a-form-item label="擅长领域" class="texts">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入用户名称',required:false},{ max:50,message:'最多50个字符' }]}]"
              placeholder="请输入擅长领域"
            />
          </a-form-item>
          <a-form-item label="备注" class="texts">
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
                `${item.title}:`,
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
      <h2>执业药师资格证书</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col v-for="item in certificateForms" :key="item.title" :span="6">
              <a-form-item :label="`${item.title}`">
                <a-input
                  v-decorator="[
                `${item.title}:`,
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
      <h2>执业药师资格证书</h2>
      <a-divider style="margin: 10px 0;" />
      <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-form-item label="身份证正面" class="texts unplod">
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
          <a-form-item label="身份证反面" class="texts unplod">
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
export default {
  data() {
    return {
      expand: false,
      form: this.$form.createForm(this),
      loading: false
    }
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
          name: 'orgCode'
        },
        {
          title: '注册证编号',
          name: 'orgCode'
        },
        {
          title: '姓名',
          name: 'orgCode'
        },
        {
          title: '执业地区',
          name: 'orgCode'
        },
        {
          title: '执业类别',
          name: 'orgCode'
        },
        {
          title: '执业单位',
          name: 'orgCode'
        },
        {
          title: '有效期至',
          name: 'orgCode'
        },
        {
          title: '发证机关',
          name: 'orgCode'
        },
        {
          title: '注册日期',
          name: 'orgCode'
        }
      ]
    },
    certificateForms() {
      return [
        {
          title: '管理号',
          name: 'orgCode'
        },
        {
          title: '姓名',
          name: 'orgCode'
        },
        {
          title: '性别',
          name: 'orgCode'
        },
        {
          title: '出生日期',
          name: 'orgCode'
        },
        {
          title: '专业类别',
          name: 'orgCode'
        },
        {
          title: '批准日期',
          name: 'orgCode'
        },
        {
          title: '签发单位',
          name: 'orgCode'
        },
        {
          title: '签发日期',
          name: 'orgCode'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
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
        name: 'dataEngindex'
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
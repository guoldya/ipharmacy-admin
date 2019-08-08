<template>
  <div class="detailCont">
    <a-row>
      <a-col :span="24" class="padding-left-5">
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
            <a-divider type="vertical" />
            <span>35岁</span>
            <a-divider type="vertical" />
            <span>皮肤科&nbsp;五病区/2床</span>
            <a-divider type="vertical" />
            <span>医护：唐伯虎/秋香</span>
            <a-divider type="vertical" />
            <span>入院日期：2017-4-8</span>
          </aside>
          <footer class="people">诊断：过敏性鼻炎</footer>
        </a-card>
        <a-card class="margin-top-10">
          <header class="record">
            <a-icon type="export" />患者入院药学评估
          </header>
          <a-divider />
          <h3 class="record">基本信息</h3>
          <a-divider />
          <div id="components-form-demo-advanced-search">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
              <a-form-item label="信息来源" class="texts">
                <a-radio-group v-decorator="[ 'resource']">
                  <a-radio
                    v-for="(op,index) in this.enum.dataSourec"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-row :gutter="24">
                <a-col v-for="item in formBase" :key="item.title" :span="12">
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
              <a-form-item label="婚姻状况" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']">
                  <a-radio
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="医保情况" class="texts">
                <a-radio-group v-decorator="[ 'insurance']">
                  <a-radio
                    v-for="(op,index) in this.enum.insurance"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="特殊人群" class="texts">
                <a-radio-group v-decorator="[ 'normalPeople']">
                  <a-radio
                    v-for="(op,index) in this.enum.normalPeople"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="职业" class="texts">
                <a-radio-group v-decorator="[ 'jobs']">
                  <a-radio
                    v-for="(op,index) in this.enum.jobs"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="教育程度" class="texts">
                <a-radio-group v-decorator="[ 'education']">
                  <a-radio
                    v-for="(op,index) in this.enum.education"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="基础疾病" class="texts">
                <a-checkbox-group v-decorator="['baseDisease']">
                  <a-checkbox
                    v-for="(op,index) in this.enum.baseDisease"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
               <a-form-item label="入院诊断" class="texts range">
            <a-input
              v-decorator="['username',{rules:[{message:'请输入入院诊断',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="主诉" class="texts range">
            <a-input
              v-decorator="['username',{rules:[{message:'请输入主诉',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="既往病史" class="texts range">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入既往病史',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
          <a-form-item label="家族史" class="texts range">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入家族史',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
           <a-form-item label="过敏史" class="texts">
                <a-radio-group v-decorator="[ 'allergyHistory']">
                  <a-radio
                    v-for="(op,index) in this.enum.allergyHistory"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary">新增过敏情况</a-button>
              </a-form-item>
               <a-form-item label=" " class="texts range">
            <a-textarea
              v-decorator="['username',{rules:[{message:'请输入家族史',required:true},{ max:50,message:'最多50个字符' }]}]"
            />
          </a-form-item>
            </a-form>
          </div>
          <!-- 第二个表单 -->
          <h3 class="record">入院状况评估</h3>
         <a-divider />
          <div id="components-form-demo-advanced-search">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
             
              <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
               <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
               <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
               <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
               <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
               <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'marriageAct']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.marriageAct"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
          </a-form-item>
            </a-form>
          </div>
          <!-- 第三个表单 -->
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
      form: this.$form.createForm(this)
    }
  },
  computed: {
    formBase() {
      return [
        {
          title: '名族',
          require: true,
          name: 'orgCode'
        },
        {
          title: '身高',
          name: 'orgName'
        },
        {
          title: '体重',
          name: 'simpleCode'
        },
        {
          title: '体重指数',
          require: true,
          name: ''
        },
        {
          title: '体表面积',
          name: 'contacts'
        }
      ]
    }
  },

  created() {},

  mounted() {},
  destroyed() {},
  methods: {
    // 提价
    handleSearch() {}
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
    margin-bottom: 10px;
  }
  .record {
    font-size: 22px;
    .anticon {
      margin-right: 10px;
    }
  }
  .drugfenxi {
    margin-top: 15px;
  }
  // 表单样式
  .ant-advanced-search-form {
    padding: 0px 24px 22px 22px;
    // background: #fbfbfb;
    // border: 1px solid #d9d9d9;
    border-radius: 6px;
  }

  .ant-advanced-search-form .ant-form-item {
    display: flex;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }

  .ant-advanced-search-form .ant-form-item-control-wrapper {
    flex: 1;
  }

  #components-form-demo-advanced-search {
    width: 90%;
    margin: 0 auto;
    .ant-form {
      max-width: none;
    }
  }
  .ant-form-item-label {
    width: 18%;
  }
  .texts {
    .ant-form-item-label {
      width: 9%;
    }
  }
  
}
</style>
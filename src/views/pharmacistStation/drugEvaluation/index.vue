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
                <a-radio-group v-decorator="['resource']">
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
          <div id="components-form-demo-advanced-search" class="enterhosptial">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
              <a-form-item label="入院方式" class="texts">
                <a-radio-group v-decorator="[ 'enterHospital']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.enterHospital"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="自理能力" class="texts">
                <a-radio-group v-decorator="[ 'ProvideLevel']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.ProvideLevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="听力" class="texts">
                <a-radio-group v-decorator="[ 'listenLevel']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.listenLevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="语言" class="texts">
                <a-radio-group v-decorator="[ 'language']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.language"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="基本膳食" class="texts">
                <a-radio-group v-decorator="[ 'foodDay']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.foodDay"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="意识" class="texts">
                <a-radio-group v-decorator="[ 'consciousness']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.consciousness"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="嗜好" class="texts">
                <a-radio-group v-decorator="[ 'badLike']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.badLike"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="中心静脉置管" class="texts">
                <a-radio-group v-decorator="[ 'injection']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.injection"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="鼻饲" class="texts">
                <a-radio-group v-decorator="[ 'NasalFeeding']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.NasalFeeding"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="特殊体质" class="texts">
                <a-radio-group v-decorator="[ 'specialPhyscial']" buttonStyle="solid">
                  <a-radio-button
                    v-for="(op,index) in this.enum.specialPhyscial"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-form>
          </div>
          <h3 class="record">Morisky用药依从性评价</h3>
          <a-divider />
          <!-- 第三个表单 -->
          <div id="components-form-demo-advanced-search" class="enterhosptial">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
              <a-form-item label="服药依从性" class="texts">
                <a-radio-group v-decorator="[ 'require']">
                  <a-radio
                    v-for="(op,index) in this.enum.require"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="药师干预" class="texts">
                <a-radio-group v-decorator="[ 'delay']">
                  <a-radio
                    v-for="(op,index) in this.enum.delay"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="重视药物治疗" class="texts">
                <a-radio-group v-decorator="[ 'treatment']">
                  <a-radio
                    v-for="(op,index) in this.enum.treatment"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-form>
          </div>
          <div>
            <span class="record">疾病因素评估</span>
            <a-button type="primary" style="float:right">增加评分项</a-button>
          </div>
          <a-divider />
          <!-- 第四个表单 -->
          <div id="components-form-demo-advanced-search" class="enterhosptial">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
              <a-form-item label="肝功能" class="texts">
                <a-radio-group v-decorator="[ 'liver']">
                  <a-radio
                    v-for="(op,index) in this.enum.liver"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
              <a-form-item label="肾功能" class="texts">
                <a-radio-group v-decorator="[ 'renal']">
                  <a-radio
                    v-for="(op,index) in this.enum.renal"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
              <a-form-item label="心功能" class="texts">
                <a-radio-group v-decorator="[ 'heart']">
                  <a-radio
                    v-for="(op,index) in this.enum.heart"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
              <a-form-item label="DVT" class="texts">
                <a-radio-group v-decorator="[ 'dvt']">
                  <a-radio
                    v-for="(op,index) in this.enum.dvt"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
                <a-button type="primary" style="float:right">评估标准</a-button>
              </a-form-item>
            </a-form>
          </div>
          <h3 class="record">既往用药评估水平</h3>
          <a-divider />
          <!-- 第五个表单 -->
          <div id="components-form-demo-advanced-search" class="enterhosptial">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
              <a-form-item label="适应症" class="texts">
                <a-radio-group v-decorator="[ 'liver']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="用法用量" class="texts">
                <a-radio-group v-decorator="[ 'spec']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="注意事项" class="texts">
                <a-radio-group v-decorator="[ 'warn']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="不良反应" class="texts">
                <a-radio-group v-decorator="[ 'act']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="自我药疗效果" class="texts">
                <a-radio-group v-decorator="[ 'grade']">
                  <a-radio
                    v-for="(op,index) in this.enum.druglevel"
                    :value="op.id"
                    :key="index"
                  >{{op.text}}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-row :gutter="24">
                <a-col v-for="item in enddata" :key="item.title" :span="12">
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
            </a-form>
          </div>
          <a-divider />
        </a-card>
      </a-col>
    </a-row>
    <FooterToolBar>
      <a-button @click="backTo" class="margin-left-5">返回</a-button>
      <a-button @click="adds" type="primary" style="margin-left: 5px">新增</a-button>
      <a-button type="primary" class="margin-left-5" @click="submit">保存</a-button>
    </FooterToolBar>
  </div>
</template>
<script>
import FooterToolBar from '@/components/FooterToolbar'
export default {
  components: {
    FooterToolBar
  },
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
    },
    enddata() {
      return [
        {
          title: '评估药师',
          require: true,
          name: 'assessment'
        },
        {
          title: '评估时间',
          name: 'assessmentTime'
        }
      ]
    }
  },

  created() {},

  mounted() {},
  destroyed() {},
  methods: {
    // 提价
    handleSearch() {},
    backTo(){

    },
    adds(){
      
    }
  }
}
</script>

<style  lang='less'>
.detailCont {
  .enterhosptial {
    .ant-form-item label {
      margin-left: 15px;
    }
    .ant-radio-button-wrapper:first-child {
      border-radius: 0;
      border-left: 1px solid #d9d9d9;
    }
    .ant-radio-button-wrapper:last-child {
      border-radius: 0;
      // border-left: 1px solid #d9d9d9;
    }
  }
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
    width: 20%;
  }
  .texts {
    .ant-form-item-label {
      width: 10%;
    }
  }
}
</style>
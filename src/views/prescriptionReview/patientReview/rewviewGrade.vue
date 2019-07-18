<template>
  <a-card>
    <div class="dealRight">
      <a-tabs defaultActiveKey="1" size="small" class="width-100">
        <a-tab-pane tab="点评结果" key="1">
          <a-card>
            <div class="content">
              <header>是否为合理处方:</header>
              <div class="check">
                <a-icon type="warning" theme="filled" style="color:#FFAD0E;font-size:20px" />
                <a-radio-group name="radioGroup" :defaultValue="1">
                  <a-radio :value="1">合理</a-radio>
                  <a-radio :value="2">不合理</a-radio>
                </a-radio-group>
              </div>
            </div>
            <footer class="addquestion">
              <a-icon type="plus" style="color:#1890ff" />
              <span class="add" @click="addqus('visibles',true)">新增问题</span>
              <a-icon type="sync" style="color:#1890ff" />
              <span class="updrw">重新点评</span>
            </footer>
          </a-card>
          <aside v-if="true">
            <div class="wenti">问题</div>
            <a-card>
              <p>此次用药不符合,国家安全标准。六味地黄丸，治肾亏不含糖此次用药不符合,国家安全标准。六味地黄丸，治肾亏不含糖</p>
              <h4>说明：{{this.$store.state.druglist}}</h4>
              <p>阿莫西林/卡西莫多</p>
              <footer>
                <p class="foot">
                  <a>删除</a>
                  <a-divider type="vertical" />
                  <a>修改</a>
                </p>
              </footer>
            </a-card>
             
          </aside>
        </a-tab-pane>
        <a-tab-pane tab="问题描述" key="2"></a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      title="另存为模板"
      :visible="visibles"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form :form="form">
        <a-form-item label="分类" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'tabooClass',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
            placeholder="请选择分类"
          >
            <a-select-option
              :value="op.tabooId"
              v-for="(op,index) in drugList"
              :key="index"
            >{{op.tabooTitle}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'templetType',  {rules: [{ required: true,message: '请选择类型'  }]}  ]"
            placeholder="请选择类型"
          >
            <a-select-option
              :value="op.id"
              v-for="(op,index) in this.enum.templateType"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="[ 'titles',  {rules: [{ required: true,message: '请输入标题'  }]}  ]"></a-input>
        </a-form-item>
        <a-form-item label="内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-textarea
            v-decorator="[ 'reviewTemplate',  {rules: [{ required: true,message: '请输入内容'  }]}  ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
         visibles: false,
         drugList:[],
           form: this.$form.createForm(this),
    }
  },
  computed: {},
  mounted() {},
  methods: {
    addqus(val,bool) {
        this[val]=bool
    },
     handleOk(){

     },
     handleCancel(){
         this.visibles = false 
     }
  }
}
</script>

<style  lang='less'>
.dealRight {
  .ant-card-body {
    padding: 24px 24px 16px 24px;
  }
  .ant-card-wider-padding .ant-card-body {
    padding: 20px 20px;
  }
  .ant-radio-group {
    margin-left: 90px;
    margin-top: 10px;
  }
  .content {
    padding-bottom: 10px;
    background: #fffbf1;
    padding-left: 15px;
    padding-top: 20px;
    font-size: 16px;
    border: 1px solid #ffad0e;
    .dianping {
      height: 30px;
      width: 85%;
      margin-top: 20px;
    }
    .reviews {
      float: left;
    }
    .reviewsper {
      float: right;
      color: #ffad0e;
      // margin-right: 20px;
    }
  }
  .check {
    display: inline-block;
    //margin-top: 20px;
  }
  .addquestion {
    margin-top: 15px;
    .add {
      padding: 0 9px 0 3px;
      color: #1890ff;
      cursor: pointer;
    }
    .updrw {
      cursor: pointer;
      padding: 0 9px 0 3px;
      color: #1890ff;
    }
  }
  .wenti {
    margin-top: 10px;
    padding: 5px 10px;
    color: whitesmoke;
    background: #1890ff;
    width: 55px;
  }
  .foot {
    float: right;
  }
}
</style>
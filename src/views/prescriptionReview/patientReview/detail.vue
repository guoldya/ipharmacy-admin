<template>
  <div class="detailPatient">
    <a-row>
      <a-col :span="14">
        <a-card>
          <p>wwjfldsjf</p>
        </a-card>
      </a-col>
      <a-col :span="10" class="padding-left-5">
        <a-card>
          <div class="dealRight">
            <a-tabs defaultActiveKey="1" size="small" class="width-100">
              <a-tab-pane tab="预判情况" key="1">
                <a-card>
                  <div class="content">
                    <header>是否为合理处方</header>
                    <div class="check">
                      <a-icon type="warning" theme="filled" style="color:#FFAD0E;font-size:20px" />
                      <a-radio-group name="radioGroup" :defaultValue="1">
                        <a-radio :value="1">合理</a-radio>
                        <a-radio :value="2">不合理</a-radio>
                      </a-radio-group>
                    </div>
                    <div class="detailconent">
                      <p class="dianping">
                        <span class="reviews">点评人：</span>
                        <span class="reviewsper">系统管理员</span>
                      </p>
                      <p class="dianping">
                        <span class="reviews">点评时间：</span>
                        <span class="reviewsper">2014-3-4 12:23</span>
                      </p>
                    </div>
                  </div>
                  <footer class="addquestion">
                    <a-icon type="plus" style="color:#1890ff" />
                    <span class="add">新增问题</span>
                    <a-icon type="sync" style="color:#1890ff" />
                    <span class="updrw">重新点评</span>
                  </footer>
                </a-card>
                <div class="wenti">问题</div>
                <a-card>
                  <p>此次用药不符合,国家安全标准。六味地黄丸，治肾亏不含糖此次用药不符合,国家安全标准。六味地黄丸，治肾亏不含糖</p>
                  <h4>说明：</h4>
                  <p>阿莫西林/卡西莫多</p>
                  <footer>
                  <p class="foot">
                    <a>删除</a>
                    <a-divider type="vertical" />
                    <a>修改</a>
                  </p>
                  </footer>
                </a-card>
              </a-tab-pane>
              <a-tab-pane tab="干预记录" key="2"></a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import jodgeStation from '../../auditWorkstation/presHospitalized/jodgeStation'

export default {
  components: {
    jodgeStation
  },
  name: 'detail',
  data() {
    return {}
  },
  mounted() {
    this.routerData = this.$route.params
    this.getRecordDelData({ visid: this.$route.params.visId, submitNo: this.$route.params.maxSubmitNo })
    if (this.routerData.isNew == 1) {
      this.turnpage({ visId: this.$route.params.visId, maxSubmitNo: this.$route.params.maxSubmitNo })
    }
  },
  methods: {
    // 时间格式处理
    timeFormat(data) {
      let times = data.slice(5, 20)
      return times
    },
    // 左右互动
    listStatul(data) {
      this.prescOrderId = data
    },
    saveStatu(data) {
      this.auditStatus = data
    }
  }
}
</script>

<style  lang="less">
.detailPatient {
  .ant-card-body {
    padding: 24px 24px 16px 24px;
  }
  .ant-card-wider-padding .ant-card-body {
    padding: 20px 20px;
  }
  .ant-radio-group {
    margin-left: 20px;
    margin-top: -5px;
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
    margin-top: 20px;
  }
  .addquestion {
    margin-top: 15px;
    .add {
      padding: 0 9px 0 3px;
      color: #1890ff;
    }
    .updrw {
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
  .foot{
    float:right;
  }
}
</style>
<template>
  <div class="detailCont">
    <a-row>
      <a-col :span="5">
        <a-card>
          <a-input-search placeholder="输入要查询日期" @search="onSearch" />
          <a-list size="large" bordered :dataSource="data">
            <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="19" class="padding-left-5">
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
        </a-card>
        <a-card class="margin-top-10">
          <header class="record">
            <a-icon type="book" />查房记录
          </header>
          <a-divider />
          <h3 class="record">患者主诉：</h3>
          <a-textarea placeholder="说明情况" :rows="4" />
          <h3 class="record drugfenxi">医学问题：</h3>
          <a-textarea placeholder="所犯医学问题" :rows="4" />
          <h3 class="record drugfenxi">医学评估：</h3>
          <a-textarea placeholder="医学评估" :rows="4" />
          <h3 class="record drugfenxi">监护计划：</h3>
          <a-textarea placeholder="监护计划" :rows="4" />
          <h3 class="record drugfenxi">结果：</h3>
          <a-textarea placeholder="结果" :rows="4" />
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
      data: ['2014-5-6', '2014-5-7', '2014-5-7', '2014-5-7', '2014-5-7']
    }
  },
  computed: {},

  created() {},

  mounted() {},
  destroyed() {},
  methods: {
    // 搜索
    onSearch() {},
    // 查询
    search() {},
    // 重置
    resetForm() {},
    //新增
    adds() {
      this.$router.push({
        name: 'checkRecordDetail'
      })
    },
    // 查看
    rowClick() {},
    // 改变页码数
    sizeChange() {},
    // 分页条数
    pageChange() {}
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
  }
  .record {
    font-size: 22px;
  }
  .drugfenxi {
    margin-top: 15px;
  }
}
</style>
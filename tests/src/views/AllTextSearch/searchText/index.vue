<template>
  <div class="allSearch">
    <a-card>
      <header>
        <a-icon type="search" style="color:#1890ff;font-size:20px;" />
        <span class="jiansuo">全文检索</span>
      </header>
      <a-divider />
     <a-col class="seach-body">
          <a-input-search placeholder="请输入药品名称" @search="onSearch" enterButton="搜索" size="large" />
       <a-spin size="large" :spinning="spinning"  tip="加载中  ...">
          <header v-if="status" class="warn">暂无数据</header>
          <div class="content" v-for="item in dataList">
            <!-- <a
              class="drugname"
              v-if="item.genericname"
              v-html="item.genericname"
              @click="goTo(item)"
            ></a> -->
            <a class="drugname" v-if="item.tradename" v-html="item.tradename" @click="goTo(item)"></a>
            <a
              class="drugname"
              v-if="item.englishname"
              v-html="item.englishname"
              @click="goTo(item)"
            ></a>
            <a class="drugname" v-else v-html="item.drugnames" @click="goTo(item)"></a>

            <p class="search-detail">

              <template v-for="(value, key) in item">
                <span v-if="key!='drugnames'&&key!='drugcode'">
                  <span class="detail-title">&nbsp;{{keysName[key]}}：</span>
                  <span v-html="value"></span>
                </span>
              </template>

            </p>

          </div>
       </a-spin>
          <footer class="jiewei">
            <a-pagination
              :hideOnSinglePage='ishow'
              showSizeChanger
              showQuickJumper
              :total="total"
              class="pnstyle"
              :defaultPageSize="pageSize"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="pageChangeSize"
              @change="pageChange"
              size="small"
              v-model="current"
            ></a-pagination>
          </footer>
     </a-col>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      api: {
        selectDrug: 'sys/dicPackageinsert/selectPackageinsertByEsPage'
      },
      spinning:false,
      dataList: [],
      keysName: {
        drugcode: '药品编码',
        drugnames: '药品名称',
        genericname: '通用名',
        tradename: '商品名',
        englishname: '英文名称',
        spellcode: '拼音',
        composition: '药物成分',
        chemicalname: '化学名称',
        molecularformula: '分子式',
        molecularweight: '分子量',
        description: '性状',
        indications: '适应症',
        spec: '规格',
        dosage: '用法用量',
        adversereactions: '不良反应',
        contraindications: '禁忌症',
        precautions: '注意事项',
        pregnantuse: '孕妇及哺乳期用药',
        childrenuse: '儿童用药',
        elderlyuse: '老年用药',
        interactions: '药物相互作用',
        pharmacologicalactions: '药理毒理',
        overdosage: '药物过量',
        phamacokinetics: '药代动力学',
        storage: '贮藏',
        approvalnumber: '批准文号',
        producedby: '生产厂商',
        drugtype: '药品类型'
      },
      total: null,
      pageSize: 10,
      current: 1,
      value: null,
      status: false,
      ishow:true,
    }
  },
  computed: {},
  mounted() {},
  methods: {
    pressEnter(value){
     this.onSearch(value)
    },
    onSearch(value) {
      this.spinning = true;
      this.value = value
      this.current=1
      let param = { keyword: value, pageNo: 1, pageSize: 10 }
      this.$axios({
        url: this.api.selectDrug,
        method: 'put',
        data: param
      })
        .then(res => {
          if (res.code == '200') {
            this.spinning = false;
            res.rows&&(this.ishow=true)
            this.dataList = res.rows
            this.total = res.total
            if ((res.rows = null || res.rows.length <= 0)) {
              this.status = true
            }
            else{
                this.status = false
            }
          } else {
            this.spinning = false;
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.spinning = false;
          this.error(err)
        })
    },
    //分页的，目前search传参有问题，下来看看
    getdata(param = {}) {
      this.$axios({
        url: this.api.selectDrug,
        method: 'put',
        data: param
      })
        .then(res => {
          if (res.code == '200') {
            this.dataList = res.rows
            this.total = res.total
             if ((res.rows = null || res.rows.length <= 0)) {
              this.status = true
            }else{
                this.status = false
            }
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    pageChange(page, pageSize) {
      this.current = page
      let params = {}
      params.pageNo = page
      params.pageSize = pageSize
      this.getdata({ keyword: this.value, pageNo: page, pageSize: pageSize })
    },
    pageChangeSize(page, pageSize) {
      this.pageSize = pageSize
      let params = {}
      params.pageNo = page
      params.pageSize = pageSize
      this.getdata({ keyword: this.value, pageNo: page, pageSize: pageSize })
    },
    // 查询药品
    goTo(data) {
      console.log(data)
      this.$router.push({
        name: 'drugSpecDetail',
        params: { drugCode: data.drugcode }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.seach-body
{
  margin: 0 auto;
  width: 760px;
}
.allSearch {
  .warn {
    text-align: center;
    margin-top: 30px;
    font-size: 18px;
  }
  .tishi {
    height: 20px;
    font-size: 20px;
    padding-top: 3px;
  }
  .content {
    margin-top: 15px;
    .drugname {
      font-size: 18px;
    }
  }
  .search-detail {
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3; /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-indent: 2em;
    margin-top: 2px;
    margin-bottom: 2px;
    .detail-title {
      font-weight: bold;
    }
  }
}
.jiansuo {
  padding-left: 5px;
  font-size: 20px;
}
.jiewei {
  margin-top: 30px;
}
</style>
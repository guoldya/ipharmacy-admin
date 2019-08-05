<template>
  <div>
    <a-card>
      <patientsStatistics :countList="countText"></patientsStatistics>
    </a-card>
    <a-card class="margin-top-5">
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button class="margin-left-5" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <div class="wardMain">
        <el-collapse :value="activeKey">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="iconfont action action-huanzhe1 fontSize24"/> <span class="font-bold fontSize16">新入院患者人</span>
            </template>
            <a-row :gutter="6">
              <a-col :span="6" v-for="item in newHospital" :key="item">
                <a-card class="margin-top-5">
                  <a-row>
                    <a-col span="12" class="aRow"><span class="fontSize32 font-bold">35</span> <span class="fontSize24 margin-left-5">床</span></a-col>
                    <a-col span="12" style="text-align: right">
                      <a-icon class="icon" type="question"/>
                      <a-icon class="icon" type="question-circle"/>
                      <a-icon class="icon" type="plus"/>
                      <a-icon class="icon" type="question"/>
                      <a-icon class="icon" type="question-circle"/>
                      <a-icon class="icon" type="plus"/>
                    </a-col>
                  </a-row>
                  <div class="aRow  fontSize14">
                    <span>刘港</span>
                    <a-tag class="margin-left-20" color="#4893E7">肝</a-tag>
                    <a-tag color="#58C7CF">肾</a-tag>
                    <a-tag color="#B497EE">心</a-tag>
                    <a-tag color="#F6C268">脾</a-tag>
                  </div>
                  <div class="aRow fontSize14">
                    <span>男</span>
                    <span class="margin-left-20 ">50岁</span>
                  </div>
                  <div class="aRow fontSize14">右侧脑桥小脑角膜瘤</div>
                  <div class="aRow fontSize14">
                    <span>医生: 曾金城/陈闯</span>
                    <span class="margin-left-20">药师: 黄晶锐</span>
                  </div>
                  <div class="aRow fontSize14">入院3天</div>
                </a-card>
              </a-col>
            </a-row>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i class="iconfont action action-huanzhe1 fontSize24"/> <span class="font-bold fontSize16">术前准备患者人</span>
            </template>
            <a-row :gutter="6">
              <a-col :span="6" v-for="item in newHospital" :key="item">
                <a-card class="margin-top-5 pageCard">
                  <div class="aRow"><span class="fontSize32 font-bold">35</span> <span class="fontSize24 margin-left-5">床</span></div>
                  <div class="aRow  fontSize14">
                    <span>刘港</span>
                    <a-tag class="margin-left-20" color="#4893E7">肝</a-tag>
                    <a-tag color="#58C7CF">肾</a-tag>
                    <a-tag color="#B497EE">心</a-tag>
                    <a-tag color="#F6C268">脾</a-tag>
                  </div>
                  <div class="aRow fontSize14">
                    <span>男</span>
                    <span class="margin-left-20 ">50岁</span>
                  </div>
                  <div class="aRow fontSize14">右侧脑桥小脑角膜瘤</div>
                  <div class="aRow fontSize14">
                    <span>医生: 曾金城/陈闯</span>
                    <span class="margin-left-20">药师: 黄晶锐</span>
                  </div>
                  <div class="aRow fontSize14">入院3天</div>
                </a-card>
              </a-col>
            </a-row>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <i class="iconfont action action-huanzhe1 fontSize24"/> <span class="font-bold fontSize16">术后患者人</span>
            </template>
            <a-row :gutter="6">
              <a-col :span="6" v-for="item in newHospital" :key="item">
                <a-card class="margin-top-5">
                  <div class="aRow"><span class="fontSize32 font-bold">35</span> <span class="fontSize24 margin-left-5">床</span></div>
                  <div class="aRow  fontSize14">
                    <span>刘港</span>
                    <a-tag class="margin-left-20" color="#4893E7">肝</a-tag>
                    <a-tag color="#58C7CF">肾</a-tag>
                    <a-tag color="#B497EE">心</a-tag>
                    <a-tag color="#F6C268">脾</a-tag>
                  </div>
                  <div class="aRow fontSize14">
                    <span>男</span>
                    <span class="margin-left-20 ">50岁</span>
                  </div>
                  <div class="aRow fontSize14">右侧脑桥小脑角膜瘤</div>
                  <div class="aRow fontSize14">
                    <span>医生: 曾金城/陈闯</span>
                    <span class="margin-left-20">药师: 黄晶锐</span>
                  </div>
                  <div class="aRow fontSize14">入院3天</div>
                </a-card>
              </a-col>
            </a-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </a-card>
  </div>
</template>

<script>
  import patientsStatistics from './patients-statistics'
  import Radar from '@/components/chart/Radar'

  export default {
    name: 'index',
    components: {
      patientsStatistics,
      Radar
    },
    data() {
      return {
        countText: [
          { itemCount: 0, item: '在院', itemColors: '#4586ff' },
          { itemCount: 0, item: '特级监护', itemColors: '#2dc89f' },
          { itemCount: 0, item: 'Ⅲ级监护', itemColors: '#ff6781' },
          { itemCount: 0, item: 'Ⅱ级监护', itemColors: '#ff6781' },
          { itemCount: 0, item: 'Ⅰ级监护', itemColors: '#ff6781' }
        ],
        activeKey: ['1', '2', '3', '4'],
        newHospital: [1, 2, 3, 4, 5, 6, 7, 8],
        projects: []
      }
    },
    computed: {
      list() {
        return [
          { name: '科室', dataField: 'paramName', type: 'text' },
          { name: '状态', dataField: 'orgTitle', type: 'select' },
          { name: '患者', dataField: 'orgId', type: 'text' }
        ]
      }
    },
    methods: {
      search() {

      },
      resetForm() {

      },
      activeKeyChange(value) {
        console.log(this.activeKey, '222')
        console.log(value, 'value')
      }
    }
  }
</script>

<style lang="less">
  .fontSize24 {
    font-size: 24px;
  }

  .fontSize16 {
    font-size: 16px;
  }
  .fontSize14 {
    font-size: 14px;
  }

  .fontSize32 {
    font-size: 36px;
  }

  .aRow {
    padding-left: 16px;
    line-height: 28px;
  }

 .wardMain .ant-card-body {
    padding: 8px 16px !important;
  }
  .pageCard :hover {
  .icon {
    display: inline-block;
  }
  }
  .icon {
    display: none;
    font-size: 14px;
    margin-right: 5px;

  }
</style>
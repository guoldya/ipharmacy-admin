<template>
  <div>
    <a-card>
      <patientsStatistics :countList="countText"></patientsStatistics>
    </a-card>
    <a-card class="margin-top-5">
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search(showModal)">查询</a-button>
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
              <a-col :xs="24" :sm="12" :lg="8" :xl="6" v-for="item in newHospital" :key="item">
                <a-card class="margin-top-5 pageCard">
                  <a-row>
                    <a-col style="text-align: right">
                      <i class="iconfont action action-biaoshi fontSize24"/>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col span="12" class="aRow"><span class="fontSize32 font-bold">35</span> <span class="fontSize24 margin-left-5">床</span></a-col>
                    <a-col span="12" style="text-align: right;padding-right: 20px;">
                      <i class="iconfont action action-guanzhu  icon"/>
                      <i class="iconfont action action-add  icon"/>
                      <i class="iconfont action action-chakan  icon"/>
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
                    <span class="margin-left-20">药师: 黄晶锐/胡清</span>
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
              <a-col :xs="24" :sm="12" :lg="8" :xl="6"  v-for="item in newHospital" :key="item">
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
                    <span class="margin-left-20">药师: 黄晶锐/胡清</span>
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
              <a-col :xs="24" :sm="12" :lg="8" :xl="6" v-for="item in newHospital" :key="item">
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
                    <span class="margin-left-20">药师: 黄晶锐/胡清</span>
                  </div>
                  <div class="aRow fontSize14">入院3天</div>
                </a-card>
              </a-col>
            </a-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </a-card>
    <chatModal @search="search" v-if="showModal" ref="chatModal" ></chatModal> 
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
        showModal:false,
        countText: [
          { itemCount: 0, item: '在院', itemColors: '#4586ff' },
          { itemCount: 0, item: '特级监护', itemColors: '#2dc89f' },
          { itemCount: 0, item: 'Ⅲ级监护', itemColors: '#ff6781' },
          { itemCount: 0, item: 'Ⅱ级监护', itemColors: '#ff6781' },
          { itemCount: 0, item: 'Ⅰ级监护', itemColors: '#ff6781' }
        ],
        activeKey: ['1', '2', '3', '4'],
        newHospital: [1, 2, 3, 4, 5, 6, 7, 8],
        projects: [],
        labelCol: {
          xs: { span: 12 },
          sm: { span: 8 },
          md:{span:6},
          xl:{span:6},
        },
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
      search(val) {
        console.log(val)
        this.showModal=!val;

        // this.$refs.chatModal.showModal();
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
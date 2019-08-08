<template>
    <div class="medicalEducationAdd">
      <a-card>
        <header>
          <a-icon type="star" class="star" theme="filled" :style="{ color: '#1890ff' }" />
          <span class="userName">梁汉文</span>
          <a-tag color="#2db7f5">95279527</a-tag>
          <a-tag class="tagStyle" :color="'#40a9ff'" :key="2">肝</a-tag>
          <a-tag class="tagStyle" :color="'#58C7CF'" :key="3">肾</a-tag>
          <a-tag class="tagStyle" :color="'#B497EE'" :key="4">心</a-tag>

        </header>
        <aside class="people margin-top-5">
          <span>男</span>
          <a-divider type="vertical"/>
          <span>35岁</span>
          <a-divider type="vertical"/>
          <span>皮肤科 五病区/2床</span>
          <a-divider type="vertical"/>
          <span>医护：唐伯虎/秋香</span>
          <a-divider type="vertical"/>
          <span>入院日期：2017-4-8</span>
        </aside>
      </a-card>
      <a-card class="margin-top-5 borderNone">
        <div class="disFlex">
          <span class="font-bold fontSize16">用药教育</span>
          <span>
            <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
            <a-button type="primary" class="margin-left-5">保存</a-button>
            <a-button type="danger" class="margin-left-5">删除</a-button>
            <a-button class="margin-left-5 greenBg">打印</a-button>
          </span>
        </div>
      </a-card>
      <a-card>
        <!--药品列表-->
        <div class="disFlex">
          <span>
            <span class="font-bold fontSize16">
              <span>药品列表</span>
              <!--<a-button size="small" type="primary" class="margin-left-20">在院</a-button>-->
            </span>
            <a-select defaultValue="在院" class="margin-left-20" :style="{width: '120px'}" @change="handleChange">
              <a-select-option v-for="(item,i) in selectText" :key="i" :value="item.value">
                {{item.item}}
              </a-select-option>
            </a-select>
          </span>
          <span>
            <a-button type="primary"><a-icon type="plus" />选择医嘱</a-button>
            <a-button type="primary" class="margin-left-5"><a-icon type="plus"/>选择药品</a-button>
            <a-button type="primary" class="margin-left-5"><a-icon type="plus" />选择既往住院教育药品</a-button>
          </span>
        </div>
        <el-table
          class="margin-top-10"
          :data="dataSource"
          border
          :highlight-current-row="true"
          style="width: 100%"
        >
          <el-table-column
            v-for="item in columns"
            :show-overflow-tooltip="true"
            :key="item.dataIndex"
            :label="item.title"
            :prop="item.dataIndex"
            :width="item.width"
            :align="item.align"
          >
            <template  slot-scope="scope">
              <a-tag  v-if="item.dataIndex==='name'">{{scope.row[item.dataIndex]}}</a-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            :width="180"
            align="center"
            v-if="true"
          >
            <template  slot-scope="scope">
              <a-icon type="close" class=" danger cursor"/>
              <a-icon type="arrow-up" class="margin-left-20 primary cursor"/>
              <a-icon type="arrow-down" class="margin-left-20 primary cursor"/>
            </template>
          </el-table-column>
        </el-table>
        <!--用药教育内容-->
        <div class="disFlex margin-top-10">
          <span class="font-bold fontSize16">用药教育内容</span>
          <span>
            <a-button type="primary"><a-icon type="plus" />另存为模板</a-button>
            <a-button type="primary" class="margin-left-5"><a-icon type="plus"/>模板引用</a-button>
          </span>
        </div>

        <a-textarea class="margin-top-10" :autosize="{minRows: 4 }" />
      </a-card>
    </div>
</template>

<script>
  export default {
    name: 'medicalEducationAdd',
    data(){
      return{
        selectText: [
          { value: 1, item: '在院'},
          { value: 2, item: '特级监护'},
          { value: 3, item: 'Ⅲ级监护'},
          { value: 4, item: 'Ⅱ级监护'},
          { value: 5, item: 'Ⅰ级监护'}
        ],
        columns: [
          { title: '药品名称及规格', dataIndex: 'name', align: 'left' , width: 200},
          { title: '药品用法用量', dataIndex: 'name1', align: 'left', width: 120 },
          { title: '主要用途', dataIndex: 'testItemName', align: 'left', width: 120 },
          { title: '不良反应', dataIndex: 'englishName', align: 'left' , width: 120},
          { title: '备注', dataIndex: 'testItemClass', align: 'left' },
          { title: '药品厂家', dataIndex: 'testItemType', width: 180, align: 'left' },
        ],
        dataSource: [{name:'纳屈肝素钙注射液 4100iu支/支',status:'1',audit:'0'}],
      }
    },
    methods:{
      handleChange(value) {
        console.log(`selected ${value}`);
      },
      backTo(){
        this.$router.push({
          name: 'medicalEducationIndex',
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .medicalEducationAdd{
    .cursor{
      cursor: pointer;
    }
    
    .star{
      float: right;
      font-size: 20px;
      background-color: #DCE5FD;
      padding:6px;
      position: relative;
      top: -25px;
    }
      .userName {
        font-size: 22px;
        padding-right: 20px;
        color: #1890ff;
        font-weight: bold;
      }
    }
</style>
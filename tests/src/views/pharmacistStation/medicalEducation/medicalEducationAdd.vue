<template>
    <div class="medicalEducationAdd">
      <a-row :gutter="10">
          <a-col :xl="8" :xxl="5" v-if="page===JSON.stringify('look')">
            <dateList :date="date"></dateList>
          </a-col>
          <a-col  :xxl="page===JSON.stringify('look')?19:24" :xl="page===JSON.stringify('look')?16:24">
            <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo"  :diag="diag"></detailHeader>

            <a-card class="margin-top-5 borderNone">
              <div class="disFlex">
                <span class="font-bold fontSize16">用药教育
                </span>
                <span>
                  <a-button @click="backTo"><a-icon type="arrow-left" />返回</a-button>
                  <a-button type="primary" @click="save" class="margin-left-5">保存</a-button>
                  <a-button type="danger" class="margin-left-5"  v-if="page===JSON.stringify('look')">删除</a-button>
                  <a-button class="margin-left-5 greenBg"  v-if="page===JSON.stringify('look')">打印</a-button>
                </span>
              </div>
            </a-card>
            <a-card>
              <!--药品列表-->
              <div class="disFlex">
                <span>
                  <span class="font-bold fontSize16">
                    <span>药品列表</span>
                    <a-tag  v-if="page===JSON.stringify('look')" class="marginLeft8" color="#1980FF">在院</a-tag>

                    <!--<a-button size="small" type="primary" class="margin-left-20">在院</a-button>-->
                  </span>
                  <a-select v-if="page===JSON.stringify('add')"  defaultValue="在院" class="margin-left-20" :style="{width: '120px'}" @change="handleChange">
                    <a-select-option v-for="(item,i) in selectText" :key="i" :value="item.value">
                      {{item.item}}
                    </a-select-option>
                  </a-select>
                </span>
                <span>
                  <a-button type="primary" @click="selectDoctorAdvice"><a-icon type="plus" />选择医嘱</a-button>
                  <a-button type="primary" class="margin-left-5"><a-icon type="plus"/>选择药品</a-button>
                  <!-- <a-button type="primary" class="margin-left-5"  v-if="page===JSON.stringify('add')"><a-icon type="plus" />选择既往住院教育药品</a-button> -->
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
                    <!-- <a-tag>{{scope.row[item.dataIndex]}}</a-tag> -->
                    <span v-if="scope.row[item.dataIndex]" class="columnStyle">{{scope.row[item.dataIndex]}}</span>

                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  :width="180"
                  align="center"
                  v-if="true"
                >
                   <template slot-scope="scope">
                    <opcol :items="items" :more="false" :data="scope.row"></opcol>
                  </template>
                </el-table-column>
              </el-table>
              <!--用药教育内容-->
              <div class="disFlex margin-top-10">
                <span class="font-bold fontSize16">用药教育内容</span>
                <span>
                  <a-button type="primary"  v-if="page===JSON.stringify('add')">另存为模板</a-button>
                  <a-button type="primary" class="margin-left-5">模板引用</a-button>
                </span>
              </div>

              <a-textarea v-model="eduContent" class="margin-top-10" placeholder="请输入用药教育内容" :autosize="{minRows: 4 }" />
            </a-card>
          </a-col>
      </a-row>
      <selectDoctorAdvice ref="selectDoctorAdvice" ></selectDoctorAdvice>
    </div>
</template>

<script>
  import selectDoctorAdvice from './selectDoctorAdvice'
  export default {
    name: 'medicalEducationAdd',
    data(){
      return{
        date:['2019-08-11','2019-08-02','2019-08-03',
          '2019-08-04','2019-08-05','2019-08-06',
          '2019-08-07'
        ],
        userName:'梁汉文',
            tagList:[
                {tag:'91084654',color:'#40a9ff'},
                {tag:'肝',color:'#40a9ff'},
                {tag:'肾',color:'#58C7CF'},
                {tag:'心',color:'#B497EE'},

            ],
            userInfo:{
                sex:'男',
                age:'35岁'  ,
                dept:'皮肤科',
                stage:' 5病区/2床',
                docNurse:'胡清/黄晶锐',
                date:'2019-08-05'
            },
        selectText: [
          { value: 1, item: '在院'},
          { value: 2, item: '特级监护'},
          { value: 3, item: 'Ⅲ级监护'},
          { value: 4, item: 'Ⅱ级监护'},
          { value: 5, item: 'Ⅰ级监护'}
        ],
        diag:'过敏性皮炎',
        columns: [
          { title: '用药名称/规格', dataIndex: 'name', align: 'left' , width: 200},
          { title: '用量', dataIndex: 'name1', align: 'left', width: 80 },
          { title: '用法', dataIndex: 'testItemName', align: 'left', width: 80 },
          { title: '用药次数', dataIndex: 'testItemClass', align: 'left', width: 80 },
          { title: '主要用途', dataIndex: 'testItemType', width: 180, align: 'left' },
          { title: '不良反应', dataIndex: 'englishName', align: 'left' },
          { title: '注意事项', dataIndex: 'englishNa2me', align: 'left' , width: 120},

        ],
        dataSource: [
          {name:'纳屈肝素钙注射液 4100iu支/支',
           name1:'1/支',
           testItemName:'皮下注射',
           englishName:'纳屈肝素钙注射液 4100iu支/支',
           testItemType:'纳屈肝素钙注射液 4100iu支/支',
        }],
        items: [
          { text: '删除', color: '#E6A23C', showtip: true, tip: '确认删除吗？', click: this.delete, status: '1' },
          { text: '上移',  showtip: false, click: this.medicalEducationAdd, status: '1' },
          { text: '下移',  showtip: false, click: this.edits, status: '' },

        ],
        eduContent:""
      }
    },
    components:{
      selectDoctorAdvice
    },
    computed:{
      page(){
        return sessionStorage.getItem('childPage')
      }
    },
    mounted(){
        if(this.page===JSON.stringify('add')){
         document.title=document.title.split('用')[0]+'用药教育新增';
        }else if(this.page===JSON.stringify('look')){
          document.title=document.title.split('用')[0]+'用药教育编辑';
        }
       this.getDetailData();
    },
    
    methods:{
      selectDoctorAdvice(){
        this.$refs.selectDoctorAdvice.showModal()
      },
      save(){
        console.log(this.eduContent)
      },
      delete(data) {},

      getDetailData(){
        if(this.page===JSON.stringify('look')){
          console.log(sessionStorage.getItem('medicalEducationData'))
        }
      },
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
    .columnStyle{
      border: 1px solid #D9D9D9;
      border-radius: 2px;
      padding: 0 8px;
      display: inline-block;
      width: 100%;
      white-space: normal;
      word-break: break-all;
      overflow: hidden;
    }
  }
</style>
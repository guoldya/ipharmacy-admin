<template>
    <div class="pharmacyMonitorIndex">
        <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo"></detailHeader>

      <a-card class="margin-top-5 ">
        <div class="disFlex">
          <span class="font-bold fontSize16">监护计划</span>
          <span>
            <a-button  type="primary" @click="handleSubmit">提交</a-button>
            <a-button type="primary" class="margin-left-5"><a-icon type="plus" />另存为模板</a-button>
          </span>
        </div>
      </a-card>

      <a-card class="margin-top-5 borderNone">
        <a-form  class="ant-advanced-search-form" :form="form">
            <div v-for="(list,i) in content" :key="i">
            <div class="disFlex">
              <span class="font-bold fontSize16">{{list.title}}</span>
              <span>
                <a-button type="primary" v-if="list.btn"><a-icon type="plus" />{{list.btn}}</a-button>
              </span>
            </div>

            <a-row class="margin-top-5">
              <a-col>
                <a-input  v-decorator="[list.dataField]" type="textarea" :autosize="{ minRows: 4}"/>
              </a-col>
            </a-row>
            <a-spin v-if="list.columns" class="margin-top-5" :spinning="loading" tip="加载中...">
                <el-table
                      class="margin-top-10"
                      :data="list.dataSource"
                      border
                      :highlight-current-row="true"
                      style="width: 100%"
                    >
                      <el-table-column
                        v-for="item in list.columns"
                        :show-overflow-tooltip="true"
                        :key="item.value"
                        :label="item.title"
                        :prop="item.value"
                        :width="item.width"
                        :align="item.align"
                      >
                        <template  slot-scope="scope">
                          <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
                          <span v-else>{{scope.row[item.value]}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" :width="150" align="center" v-if="true">
                        <template slot-scope="scope">
                            <opcol :items="items" :more="false" :data="scope.row"></opcol>
                        </template>
                      </el-table-column>
                </el-table>
            </a-spin>

            <a-row  class="margin-top-5" :gutter="24">
                  <a-col
                    v-for="(item,i) in list.checkItem" :key="i"
                    :span="14"
                    >
                      <a-form-item :label="item.label"
                        :label-col="{ span: 2 }"
                        :wrapper-col="{ span: 22 }">
                          <a-checkbox-group :options="item.options"   v-decorator="[item.dataField]" @change="onChange" />
                      </a-form-item>
                  </a-col>
            </a-row>

            <a-row  class="margin-top-5" :gutter="24">
                  <a-col
                    v-for="(item,i) in list.formItem" :key="i"
                    :span="6"
                    >
                      <a-form-item :label="item.label" class="unit"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 19 }">
                          <a-date-picker v-decorator="[item.val]" v-if="item.type==='date'"/>
                          <a-select placeholder="请选择..." :style="{width:'180px'}" v-decorator="[item.dataField]" v-if="item.type=='select'">
                              <a-select-option :value="op.value" v-for="(op,index) in selectItem" :key="index">
                                {{op.value}}
                              </a-select-option>
                          </a-select>
                      </a-form-item>
                  </a-col>
            </a-row>
          </div>
        </a-form>
        
        
      </a-card>
    </div>
</template>

<script>
  export default {
    name: 'pharmacyMonitorIndex',
    data(){
      return{
        form: this.$form.createForm(this),
        content:[
          {title:'疗效监测',btn:'添加监测指标',dataField:'curativeEffect',
            columns: [
                { title: '类别', value: 'name', align: 'left' , width: 200},
                { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                { title: '干预', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝'}],
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
          },
          {title:'安全性监测',btn:'添加监测指标',dataField:'safety',
            columns: [
                { title: '类别123', value: 'name', align: 'left' , width: 200},
                { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                { title: '干预', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝123'}],
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
          },
          {title:'从依性监测',dataField:'rely',
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
            checkItem:[
                {label:'监护指标',type:'checked',val:'time',dataField:'target',
                  options:[
                    {label:'适应症',value:'1',dataField:'disease'},
                    {label:'用法用量',value:'2',dataField:'usage'}
                  ]
                },
                {label:'干预方案',type:'checked',val:'date',dataField:'plan',
                options:[
                  {label:'用药教育',value:'1',dataField:'medicalEdu'},
                  {label:'其他',value:'2',dataField:'other'}
                ]},
            ],
          },
        ],
        selectItem:[
          {value:'1次'},
          {value:'2次'},
        ],
        
        loading:false,
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
       
        
        items:[],
      }
    },
    methods:{
      handleSubmit(e){
        e.preventDefault();
         this.form.validateFields((err, values) => {
                if (!err) {
                   console.log(values)
                }
            })
      },
      onChange (checkedValues) {
        console.log('checked = ', checkedValues)
        console.log('value = ', this.value)
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
  .pharmacyMonitorIndex{
    .cursor{
      cursor: pointer;
    }
    
      .userName {
        font-size: 22px;
        padding-right: 20px;
        color: #1890ff;
        font-weight: bold;
      }
    }
</style>
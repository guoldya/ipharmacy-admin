

<template>
  <div>
    <a-card>
      <div id="gante-test">  </div>
    </a-card>
  </div>
</template>

<script>
  export default {
    name: 'Test',

    data () {
      return {
        text: '测试BUG信息',
         data:[
          {
            gunter_id:4,
            params:{title:'藿香正气液',startTime:'2018-12-19',endTime:'2019-1-4',biaoti:'[口服]  每天异常  每次2毫克'},
            start_time:new Date(2018,11,19).getTime(),
            end_time:new Date(2019,0,3).getTime(),
            bg_color:'#00B1F1',
            level:1,
            items:[
              {
                gunter_id:5,
                params:{orderClass:1,title:'藿香正气液',startTime:'2018-12-19',endTime:'2019-1-1',biaoti:'[口服]  每天异常  每次3吨'},
                start_time:new Date(2018,11,19).getTime(),
                end_time:new Date(2019,0,2).getTime(),
                bg_color:'#FFC100',
                level:2
              },
              {
                gunter_id:6,
                params:{orderClass:1,title:'藿香正气液',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次4g'},
                start_time:new Date(2019,0,3).getTime(),
                end_time:new Date(2019,0,4).getTime(),
                bg_color:'#FFC100',
                level:2
              }
            ]
          },
          {
            gunter_id:1,
            params:{title:'阿莫西林',startTime:'2018-12-19',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
            start_time:new Date(2018,11,19).getTime(),
            end_time:new Date(2019,0,3).getTime(),
            bg_color:'#00B1F1',
            level:1,
            children:[
              {
                gunter_id:2,
                params:{orderClass:2,title:'2019-01-01 11:11',startTime:'2018-12-19',endTime:'2019-1-1',biaoti:'[口服]  每天异常  每次2毫克'},
                start_time:new Date(2018,11,19).getTime(),
                end_time:new Date(2019,0,1).getTime(),
                bg_color:'#00B1F1',
                level:2
              },
              {
                gunter_id:3,
                params:{orderClass:2,title:'2019-01-01 11:11',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
                start_time:new Date(2019,0,2).getTime(),
                end_time:new Date(2019,0,2).getTime(),
                bg_color:'#00B1F1',
                level:2
              }
            ]
          },
          {
            gunter_id:2,
            params:{orderClass:2,title:'阿里巴巴',startTime:'2018-12-19',endTime:'2019-1-1',biaoti:'[口服]  每天异常  每次2毫克'},
            start_time:new Date(2018,11,19).getTime(),
            end_time:new Date(2019,0,1).getTime(),
            bg_color:'#00B1F1',
            level:2
          },
          {
            gunter_id:3,
            params:{orderClass:2,title:'莫夕夕',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
            start_time:new Date(2019,0,2).getTime(),
            end_time:new Date(2019,0,2).getTime(),
            bg_color:'#00B1F1',
            level:2
          },
          {
            gunter_id:3,
            params:{orderClass:2,title:'丙烯醯',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
            start_time:new Date(2019,0,2).getTime(),
            end_time:new Date(2019,0,2).getTime(),
            bg_color:'#00B1F1',
            level:2
          },
          {
            gunter_id:3,
            params:{orderClass:2,title:'饿极了',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
            start_time:new Date(2019,0,2).getTime(),
            end_time:new Date(2019,0,2).getTime(),
            bg_color:'#00B1F1',
            level:2
          }
        ],
        th_data: {
          title:{value:'药品名称',width:225,showToast:true,listen_click:true,isTableShow:true},
          startTime:{value:'开始时间',width:150,showToast:true,chooseTime:true,time_mode:1},
          endTime:{value:'结束时间',width:150,showToast:true,chooseTime:true,time_mode:2},
          biaoti:{value:'用法',width:450,showToast:true,edit:false}
        }
      }
    },
    mounted(){
      this.$ganteGraph({
        container:'#gante-test',
        ganteData:this.data,
        start_time:new Date('2018/12/18').getTime(),
        end_time:new Date('2018/12/30').getTime(),
        open:true,
        tabe_width:310,
        time_mode:1,
        th_data:this.th_data,
        onEdit(data){
          console.log(data)
        },
        onClick(data){
          console.log(data)
        },
      })

      console.log(12)
    },
    methods: {
      onClick({ key }) {
        console.log(`Click on item ${key}`);
      },
      handleAdd()
      {
        this.$logAdd(this.text)
      },
      handleNewError()
      {
        console.log(a)
      }
    }
  }
</script>

<style>
  .select > .ant-select-selection{
    background-color: grey;
  }
</style>
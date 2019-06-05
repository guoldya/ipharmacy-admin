const Enum={
    yesNo: [
        {id: 0, text: '否'},
        {id: 1, text: '是'}
    ],
  sex:[
    {id:'1',text:'男'},
    {id:'2',text:'女'},
    {id:'0',text:'未知'},
  ],
  status:[
    {id: '0', text: '停用'},
      {id: '1', text: '启用'}
    ],
  clientClass:[
    {id:'0',text:'等于'},
    {id:'1',text:'存在'},
    {id:'2',text:'包含'},
    {id:'3',text:'大于'},
    {id:'4',text:'大于等于'},
    {id:'5',text:'小于'},
    {id:'6',text:'小于等于'},
    {id:'7',text:'区间'},
  ],
  clientLevel:[
    {id:'1',text:'文本'},
    {id:'2',text:'枚举'},
    {id:'3',text:'日期'},
    {id:'4',text:'范围'},
    {id:'5',text:'存在'},
    {id:'6',text:'日期范围'},
  ],

  patientStatus:[
    { text: '待审核', value: '0' },
    { text: '已修改', value: '1' },
    { text: '坚持使用', value: '2' },
    { text: '已通过', value: '3' },
    { text: '已驳回', value: '4' },
  ],
  patientProblem:[
    { text: '1级', value: '1' },
    { text: '2级', value: '2' },
    { text: '3级', value: '3' },
    { text: '4级', value: '4' },
    { text: '5级', value: '5' },
    { text: '6级', value: '6' },
    { text: '7级', value: '7' },

  ],
  dealType:[
    { text: '无', value: '1' },
    { text: '提示', value: '2' },
    { text: '本人确认', value: '3' },
    { text: '上级确认', value: '4' },
    { text: '禁止', value: '5' },
  ],
  levelType:[
    { text: '系统固定', id: 1 },
    { text: '自定义', id: 0 },
  ],
  handleType:[
    { text: '记录', id:'1'},
    { text: '提示', id: '2' },
    { text: '医师确认', id: '3' },
    { text: '双签确认', id: '4' },
    { text: '药师确认', id: '5' },
    { text: '驳回', id: '9' },
  ],
  packageType:[
    { text: '药师审方', id: '1' },
    { text: '处方点评', id: '2' },
  ],
  planScope:[
    { text: '住院', id: '1' },
    { text: '门诊', id: '2' },
  ],
  refreshRate:[
    { text: '5秒', id: 5000 },
    { text: '10秒', id: 10000 },
    { text: '20秒', id: 20000 },
    { text: '30秒', id: 30000 },
    { text: '60秒', id: 60000 },
  ],
  ruleClassification:[
    { text: '药品', id: 1 },
    { text: '药品分类', id: 2 },
    { text: '药品组', id: 3 },
    { text: '全局', id: 4 },
  ],
  orgType:[
    { text: '医联体', id: '1' },
    { text: '医共体', id: '2' },
    { text: '医院', id: '3' },
    { text: '药店', id: '4' },
    { text: '互联网医院', id: '5' },
  ],
  templateType:[
    { text: '通用', id: '0' },
    { text: '个人', id: '1' },
  ],
  drugGrade:[
    { TITLE: '非限制使用级', ID: '1' },
    { TITLE: '限制使用级', ID: '2' },
    { TITLE: '特殊使用级', ID: '3' },
  ],
  purposeDrug:[
    { TITLE: '预防', ID: '1' },
    { TITLE: '治疗', ID: '2' },
    { TITLE: '预防和治疗', ID: '3' },
  ],
  drugType:[
    { TITLE: '西药', ID: '1' },
    { TITLE: '中成药', ID: '2' },
    { TITLE: '中药', ID: '3' },
  ],
  patientType:[
    { TITLE: '门诊', ID: '1' },
    { TITLE: '急诊', ID: '2' },
    { TITLE: '住院', ID: '3' },
    { TITLE: '体检', ID: '4' },
    { TITLE: '转院', ID: '5' },
  ],
  ageType:[
    { text: '天', id: '1' },
    { text: '月', id: '2' },
    { text: '岁', id: '3' },
  ],
  classType:[
    { text: '系统分类', id: 1 },
    { text: '自定义', id: 2 },
  ]

};
export default Enum;
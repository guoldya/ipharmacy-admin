const Enum={
    yesNo: [
        {id: 0, text: '否'},
        {id: 1, text: '是'}
    ],
  clientClass:[
    {id:'1',text:'大于'},
    {id:'2',text:'小于'},
    {id:'3',text:'包含'},
    {id:'4',text:'区间'},
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
    { text: '打回修改', value: '1' },
    { text: '拒绝建议', value: '2' },
    { text: '通过审核', value: '3' },
  ],
  patientProblem:[
    { text: '1级', value: '1' },
    { text: '2级', value: '2' },
    { text: '3级', value: '3' },
    { text: '4级', value: '4' },
    { text: '5级', value: '5' },
  ],
};
export default Enum;
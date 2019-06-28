const Enum = {
    yesNo: [
        { id: '0', text: '否' },
        { id: '1', text: '是' }
    ],
    sex: [
        { id: '1', text: '男' },
        { id: '2', text: '女' },
        { id: '0', text: '未知' }
    ],
    status: [
        { id: '0', text: '停用' },
        { id: '1', text: '启用' }
    ],
    statu: [
        { id: 0, text: '停用' },
        { id: 1, text: '启用' }
    ],

    clientClass: [
        { id: '0', text: '等于' },
        { id: '1', text: '存在' },
        { id: '2', text: '包含' },
        { id: '3', text: '大于' },
        { id: '4', text: '大于等于' },
        { id: '5', text: '小于' },
        { id: '6', text: '小于等于' },
        { id: '7', text: '区间' },
    ],
    clientLevel: [
        { id: '1', text: '文本' },
        { id: '2', text: '枚举' },
        { id: '3', text: '日期' },
        { id: '4', text: '范围' },
        { id: '5', text: '存在' },
        { id: '6', text: '日期范围' },
    ],

    patientStatus: [
        { text: '待审核', value: '0' },
        { text: '已修改', value: '1' },
        { text: '坚持使用', value: '2' },
        { text: '已通过', value: '3' },
        { text: '已驳回', value: '4' }
    ],
    patientProblem: [
        { text: '1级', value: '1' },
        { text: '2级', value: '2' },
        { text: '3级', value: '3' },
        { text: '4级', value: '4' },
        { text: '5级', value: '5' },
        { text: '6级', value: '6' },
        { text: '7级', value: '7' }

    ],
    dealType: [
        { text: '无', value: '1' },
        { text: '提示', value: '2' },
        { text: '本人确认', value: '3' },
        { text: '上级确认', value: '4' },
        { text: '禁止', value: '5' }
    ],
    levelType: [
        { text: '系统固定', id: 1 },
        { text: '自定义', id: 0 }
    ],
    handleType: [
        { text: '记录', id: 1 },
        { text: '提示', id: 2 },
        { text: '医师确认', id: 3 },
        { text: '双签确认', id: 4 },
        { text: '药师确认', id: 5 },
        { text: '驳回', id: 9 }
    ],
    packageType: [
        { text: '药师审方', id: '1' },
        { text: '处方点评', id: '2' }
    ],
    planScope: [
        { text: '住院', id: '1' },
        { text: '门诊', id: '2' }
    ],
    refreshRate: [
        { text: '10秒', id: 10000,},
        { text: '20秒', id: 20000, },
        { text: '30秒', id: 30000, },
        { text: '60秒', id: 60000,},
        { text: '手动刷新', id: 0,title:'手动刷新' },
    ],
    ruleClassification: [
        { text: '药品', id: 1 },
        { text: '药品分类', id: 2 },
        { text: '药品组', id: 3 },
        { text: '全局', id: 4 }
    ],
    orgType: [
        { text: '医联体', id: '1' },
        { text: '医共体', id: '2' },
        { text: '医院', id: '3' },
        { text: '药店', id: '4' },
        { text: '互联网医院', id: '5' }
    ],
    templateType: [
        { text: '通用', id: '0' },
        { text: '个人', id: '1' }
    ],
    drugGrade: [
        { TITLE: '非限制使用级', ID: '1' },
        { TITLE: '限制使用级', ID: '2' },
        { TITLE: '特殊使用级', ID: '3' },
    ],
    purposeDrug: [
        { TITLE: '预防', ID: '1' },
        { TITLE: '治疗', ID: '2' },
        { TITLE: '预防和治疗', ID: '3' },
    ],
    drugType: [
        { TITLE: '西药', ID: '1' },
        { TITLE: '中成药', ID: '2' },
        { TITLE: '中药', ID: '3' },
    ],
    patientType: [
        { TITLE: '门诊', ID: '1' },
        { TITLE: '急诊', ID: '2' },
        { TITLE: '住院', ID: '3' },
        { TITLE: '体检', ID: '4' },
        { TITLE: '转院', ID: '5' },
    ],
    ageType: [
        { text: '天', id: '1' },
        { text: '月', id: '2' },
        { text: '岁', id: '3' },
    ],
    classType: [
        { text: '系统分类', id: 1 },
        { text: '自定义', id: 2 },
    ],
    paramClass: [
        { id: '0', text: '系统参数' },
        { id: '1', text: '库房参数' },
        { id: '2', text: '发药参数' },
        { id: '3', text: '价格参数' },
        { id: '9', text: '其他' },
    ],
    paramDataType: [
        { id: '1', text: 'TEXT文本' },
        { id: '2', text: 'NUM数值' },
        { id: '3', text: 'INT整型' },
        { id: '4', text: 'Date日期' },
        { id: '5', text: 'DateTime日期时间' },
        { id: '6', text: 'ComboBox选项' },
        { id: '7', text: 'Boolean布尔值' },
    ],
    icdType: [
        { text: 'icd10', id: '1' },
        { text: 'icd9', id: '0' },
        { text: 'icd11', id: '2' },
    ],
    testItemType: [
        { text: '普通项目', id: '1' },
        { text: '计算项目', id: '3' },
        { text: '酶标项目', id: '4' },
    ],
    resultType: [
        { text: '定量', id: '1' },
        { text: '定性', id: '2' },
        { text: '半定量', id: '3' },
    ],
    isCalc: [
        { text: '否', id: '0' },
        { text: '是', id: '1' },

    ],
    isPrivacy: [{ text: '否', id: '0' },
    { text: '是', id: '1' },],
    // 
    resultStatus: [
        { text: '阴性', id: '1' },
        { text: '样行', id: '2' },
    ],
    surgerystatus: [
        { id: '1', text: '待手术' },
        { id: '2', text: '手术中' },
        { id: '3', text: '待复苏' },
        { id: '4', text: '复苏中' },
        { id: '5', text: '已手术' },
        { id: '6', text: '已拒绝' },
        { id: '7', text: '已执行' },
    ],
    surgerysKinds: [
        { id: '1', text: '有菌手术' },
        { id: '2', text: '无菌手术' },
        { id: '3', text: '凝菌手术' },
    ],
    infection: [
        { id: '1', text: '是' },
        { id: '0', text: '否' },
    ],
    isEnergery: [
        { id: '1', text: '是' },
        { id: '0', text: '否' },
    ],
    problemLeve: [
        { id: '1', text: '一级' },
        { id: '2', text: '二级' },
        { id: '3', text: '三级' },
        { id: '4', text: '四级' },
        { id: '5', text: '五级' },
        { id: '6', text: '六级' },
        { id: '7', text: '七级' },
       ],
       auditType:[
        {id:'1',text:'自动审核'},
        {id:'2',text:'人工审核'},
      ],
      reviewVerdict:[
        {id:'1',text:'通过'},
        {id:'2',text:'驳回'},
      ],
      passType:[
        {id:1,text:'记录通过'},
        {id:2,text:'医生坚持'},
        {id:3,text:'双签通过'},
      ],
      reviewResouce:[
        {id:'1',text:'处方'},
        {id:'2',text:'医嘱'},
      ],
      patientScope:[
        {id:'1',text:'门诊'},
        {id:'2',text:'住院'},
      ]
    
}
export default Enum
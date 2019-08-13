const Enum = {
  yesNo: [{ id: '0', text: '否' }, { id: '1', text: '是' }],
  sex: [{ id: '1', text: '男' }, { id: '2', text: '女' }, { id: '0', text: '未知' }],
  status: [{ id: '0', text: '停用' }, { id: '1', text: '启用' }],
  statu: [{ id: 0, text: '停用' }, { id: 1, text: '启用' }],

  clientClass: [
    { id: '0', text: '等于' },
    { id: '1', text: '存在' },
    { id: '2', text: '包含' },
    { id: '3', text: '大于' },
    { id: '4', text: '大于等于' },
    { id: '5', text: '小于' },
    { id: '6', text: '小于等于' },
    { id: '7', text: '区间' }
  ],
  clientLevel: [
    { id: '1', text: '文本' },
    { id: '2', text: '枚举' },
    { id: '3', text: '日期' },
    { id: '4', text: '范围' },
    { id: '5', text: '存在' },
    { id: '6', text: '日期范围' }
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
  levelType: [{ text: '系统固定', id: 1 }, { text: '自定义', id: 0 }],
  rulesType: [{ text: '系统', id: 1 }, { text: '自定义', id: 2 }],
  handleType: [
    { text: '记录', id: 1 },
    { text: '提示', id: 2 },
    { text: '医师确认', id: 3 },
    { text: '双签确认', id: 4 },
    { text: '驳回', id: 9 }
  ],
  packageType: [{ text: '药师审方', id: '1' }, { text: '处方点评', id: '2' }],
  planScope: [{ text: '住院', id: '1' }, { text: '门诊', id: '2' }],
  refreshRate: [
    { text: '5秒', id: 5000 },
    { text: '10秒', id: 10000 },
    { text: '20秒', id: 20000 },
    { text: '30秒', id: 30000 },
    { text: '60秒', id: 60000 },
    { text: '手动刷新', id: 0, title: '手动刷新' }
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
  templateType: [{ text: '通用', id: '0' }, { text: '个人', id: '1' }],
  drugGrade: [{ TITLE: '非限制使用级', ID: '1' }, { TITLE: '限制使用级', ID: '2' }, { TITLE: '特殊使用级', ID: '3' }],
  purposeDrug: [{ TITLE: '预防', ID: '1' }, { TITLE: '治疗', ID: '2' }, { TITLE: '预防和治疗', ID: '3' }],
  drugType: [{ TITLE: '西药', ID: '1' }, { TITLE: '中成药', ID: '2' }, { TITLE: '中药', ID: '3' }],
  patientType: [
    { TITLE: '门诊', ID: '1' },
    { TITLE: '急诊', ID: '2' },
    { TITLE: '住院', ID: '3' },
    { TITLE: '体检', ID: '4' },
    { TITLE: '转院', ID: '5' }
  ],
  ageType: [{ text: '天', id: '1' }, { text: '月', id: '2' }, { text: '岁', id: '3' }],
  classType: [{ text: '系统分类', id: 1 }, { text: '自定义', id: 2 }],
  paramClass: [
    { id: '0', text: '系统参数' },
    { id: '1', text: '库房参数' },
    { id: '2', text: '发药参数' },
    { id: '3', text: '价格参数' },
    { id: '9', text: '其他' }
  ],
  paramDataType: [
    { id: '1', text: 'TEXT文本' },
    { id: '2', text: 'NUM数值' },
    { id: '3', text: 'INT整型' },
    { id: '4', text: 'Date日期' },
    { id: '5', text: 'DateTime日期时间' },
    { id: '6', text: 'ComboBox选项' },
    { id: '7', text: 'Boolean布尔值' }
  ],
  icdType: [{ text: 'icd10', id: '1' }, { text: 'icd9', id: '0' }, { text: 'icd11', id: '2' }],
  testItemType: [{ text: '普通项目', id: '1' }, { text: '计算项目', id: '3' }, { text: '酶标项目', id: '4' }],
  resultType: [{ text: '定量', id: '1' }, { text: '定性', id: '2' }, { text: '半定量', id: '3' }],
  isCalc: [{ text: '否', id: '0' }, { text: '是', id: '1' }],
  isPrivacy: [{ text: '否', id: '0' }, { text: '是', id: '1' }],
  //
  resultStatus: [{ text: '阴性', id: '1' }, { text: '样行', id: '2' }],
  surgerystatus: [
    { id: '1', text: '待手术' },
    { id: '2', text: '手术中' },
    { id: '3', text: '待复苏' },
    { id: '4', text: '复苏中' },
    { id: '5', text: '已手术' },
    { id: '6', text: '已拒绝' },
    { id: '7', text: '已执行' }
  ],
  surgerysKinds: [{ id: '1', text: '有菌手术' }, { id: '2', text: '无菌手术' }, { id: '3', text: '凝菌手术' }],
  infection: [{ id: '1', text: '是' }, { id: '0', text: '否' }],
  isEnergery: [{ id: '1', text: '是' }, { id: '0', text: '否' }],
  problemLeve: [
    { id: '1', text: '一级' },
    { id: '2', text: '二级' },
    { id: '3', text: '三级' },
    { id: '4', text: '四级' },
    { id: '5', text: '五级' },
    { id: '6', text: '六级' },
    { id: '7', text: '七级' }
  ],
  auditType: [{ id: '1', text: '自动审核' }, { id: '2', text: '人工审核' }],
  reviewVerdict: [{ id: '1', text: '通过' }, { id: '2', text: '驳回' }],
  passType: [{ id: 1, text: '记录通过' }, { id: 2, text: '医生坚持' }, { id: 3, text: '双签通过' }],
  reviewResouce: [{ id: '1', text: '处方' }, { id: '2', text: '医嘱' }],
  patientScope: [{ id: '1', text: '门诊' }, { id: '2', text: '住院' }],
  paintState: [
    { id: '0', text: '未确认医嘱', color: '#f5222d', texts: '未', size: 'bold', border: '1px solid #f5222d' },
    { id: '1', text: '新医嘱', color: '#1aa0ca', texts: '新', size: 'bold', border: '1px solid #1aa0ca' },
    { id: '2', text: '已校对', color: '#7227a9', texts: '校', size: 'bold', border: '1px solid #7227a9' },

    { id: '6', text: '已停止', color: 'orange', texts: '停', size: 'bold', border: '1px solid orange' },
    { id: '7', text: '已确认停止', color: '#909499', texts: '确', size: 'bold', border: '1px solid #909499' }
    // { id: '8', text: '全部', color: 'green', texts: '全' },
  ],
  paintColor: [
    { id: '0', text: '#f5222d' },
    { id: '1', text: '#1aa0ca;' },
    { id: '2', text: '#7227a9' },
    { id: '3', text: '#909499' },
    { id: '4', text: '#fbff40' },
    { id: '5', text: 'orange' },
    { id: '6', text: '已停止' },
    { id: '7', text: '已确认停止' }
  ],
  drugstatus: [{ id: '0', text: '未对码' }, { id: '1', text: '已对码' }],
  coltype: [{ id: 1, text: '系统' }, { id: 2, text: '自定义' }],
  attributeType: [{ id: 1, text: '数字' }, { id: 2, text: '时间' }, { id: 3, text: '字符串' }, { id: 4, text: '数组' }, { id: 5, text: '对象' }],
  logical: [{ id: 1, text: '常量判断' }, { id: 2, text: '数值区间判断' }, { id: 3, text: '外部数据判断' }],
  completeStatus: ['新建', '合理', '不合理'],
  sexLIST: ['未知', '男', '女'],
  Statuslist: [{ id: 1, text: '新建' }, { id: 2, text: '合理' }, { id: 3, text: '不合理' }],
  // 药学评估部分
  dataSourec: [{ id: 1, text: '患者' }, { id: 2, text: '家属' }, { id: 3, text: '其他' }],
  marriageAct: [{ id: 1, text: '未婚' }, { id: 2, text: '已婚' }, { id: 3, text: '离异' }],
  insurance: [{ id: 1, text: '自费' }, { id: 2, text: '医保' }, { id: 3, text: '公费' }, { id: 4, text: '其他' }],
  normalPeople: [
    { id: 1, text: '儿童' },
    { id: 2, text: '老年人' },
    { id: 3, text: '妊娠' },
    { id: 4, text: '哺乳期' },
    { id: 4, text: '育龄妇女' },
    { id: 5, text: '其他' },
    { id: 6, text: '无' }
  ],
  jobs: [
    { id: 1, text: '学生' },
    { id: 2, text: '全职' },
    { id: 3, text: '兼职' },
    { id: 4, text: '失业' },
    { id: 4, text: '家庭主妇' },
    { id: 5, text: '其他' }
  ],
  education: [
    { id: 1, text: '小学' },
    { id: 2, text: '初中' },
    { id: 3, text: '高中' },
    { id: 4, text: '本科(大专)' },
    { id: 5, text: '硕士及以上' },
    { id: 6, text: '未受教育' }
  ],
  baseDisease: [
    { id: 1, text: '高血压' },
    { id: 2, text: '冠心病' },
    { id: 3, text: '心率失常' },
    { id: 4, text: '心功能不全' },
    { id: 5, text: '糖尿病' },
    { id: 6, text: '甲状腺疾病' },
    { id: 7, text: 'CKD' },
    { id: 8, text: '其他' }
  ],
  allergyHistory: [
    { id: 1, text: '无' },
    { id: 2, text: '皮试过敏' },
    { id: 3, text: '一种药物/食物过敏一般过敏' },
    { id: 4, text: '两种或两种以上药品/食物过敏或严重过敏' }
  ],
  enterHospital: [
    { id: 1, text: '步行' },
    { id: 2, text: '扶行' },
    { id: 3, text: '轮椅' },
    { id: 4, text: '平车' },
    { id: 5, text: '其他' }
  ],
  ProvideLevel: [{ id: 1, text: '完全自理' }, { id: 2, text: '部分自理' }, { id: 3, text: '完全依赖' }],
  listenLevel: [
    { id: 1, text: '清晰' },
    { id: 2, text: '重听' },
    { id: 3, text: '失聪' },
    { id: 4, text: '助听器' },
    { id: 5, text: '其他' }
  ],
  language: [{ id: 1, text: '正常' }, { id: 2, text: '失语' }, { id: 3, text: '含糊不清' }, { id: 4, text: '手势语' }],
  foodDay: [
    { id: 1, text: '普食' },
    { id: 2, text: '半流' },
    { id: 3, text: '留质' },
    { id: 4, text: '禁食' },
    { id: 5, text: '其他' }
  ],
  consciousness: [
    { id: 1, text: '清醒' },
    { id: 2, text: '嗜睡' },
    { id: 3, text: '恍惚' },
    { id: 4, text: '昏迷' },
    { id: 5, text: '其他' }
  ],
  badLike: [{ id: 1, text: '无' }, { id: 2, text: '酒' }, { id: 3, text: '烟' }, { id: 4, text: '烟与酒' }],
  injection: [{ id: 1, text: '有' }, { id: 2, text: '无' }],
  NasalFeeding: [{ id: 1, text: '有' }, { id: 2, text: '无' }],
  specialPhyscial: [
    { id: 1, text: '过敏体质' },
    { id: 2, text: '药物代谢类型' },
    { id: 3, text: '其他' },
    { id: 4, text: '无' }
  ],
  require: [{ id: 1, text: '好 8分' }, { id: 2, text: '皮试过敏' }, { id: 3, text: '较差六分一下' }],
  delay: [{ id: 1, text: '无' }, { id: 2, text: '酒' }, { id: 3, text: '较差六分一下' }],
  treatment:[{ id: 1, text: '好' }, { id: 2, text: '一般' }, { id: 3, text: '较差' }],
  liver:[{ id: 1, text: '正常' }, { id: 2, text: 'child-pugh A级' }, { id: 3, text: 'child-pugh B级' }, { id: 4, text: 'child-pugh C级' }],
  renal:[{ id: 1, text: '正常' }, { id: 2, text: '轻度不全' }, { id: 3, text: '中度不全' }, { id: 4, text: '重度不全' },{ id: 5, text: '肾衰竭' }],
  heart:[{ id: 1, text: 'Ⅰ级' }, { id: 2, text: 'Ⅱ级(轻度心衰)' }, { id: 3, text: 'Ⅲ级(中度心衰)' }, { id: 4, text: 'Ⅳ级(重度心衰)' }],
  dvt:[{ id: 1, text: '无危险' }, { id: 2, text: '低危(<10%)' }, { id: 3, text: '中危(11-40%)' }, { id: 4, text: '高危(>41%)' }],
  druglevel:[{ id: 1, text: '好' }, { id: 2, text: '较好' }, { id: 3, text: '一般' }, { id: 4, text: '较差' }, { id: 4, text: '不理解' }]
}
export default Enum

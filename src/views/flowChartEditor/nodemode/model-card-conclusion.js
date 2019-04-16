import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;

// 结论节点
Flow.registerNode(
    'model-card-conclusion',
    {
      basisLabel: '医院规定',
      messageLabel:
        '本药仅门诊科室使用！本药仅。',
      suggestLabel: '请更换其他药品。',
      colorLevel: 'rgb(255, 191, 0)',
      // 设置锚点
      anchor: [[0.5, 0, { type: 'input' }],[0, 0.5, { type: 'input' }]]
    },
    'model-card'
  )
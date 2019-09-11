import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;

// 结论节点
Flow.registerNode(
    'model-card-conclusion',
    {
      label:'结束',
      levels:'',
      itemId:null,
      inAccordanceWith: null,
      sourcename:'',
      message: '',
      suggest: '',
      levelColor: '',
      verdictType:null,
      restrictionType:null,
      // 设置锚点
      anchor: [
        //[0.5, 0, { type: 'input' }],
        [0, 0.5, { type: 'input' }]
      ]

      // anchor: [
      //   [0.5, 0, { type: 'input' }],
      //   [0, 0.5, { type: 'input' }],
      //   [1, 0.5, { type: 'output' }],
      //   [0.5, 1, { type: 'output' }]
      // ]
    },
    'model-card'
  )
import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;


//开始节点
Flow.registerNode(
    'flow-circle-start',
    {
      // 设置锚点
      anchor: [
        [1, 0.5, { type: 'output' }], 
       // [0.5, 1, { type: 'output' }]
      ]
    },
    'flow-circle'
  )
  
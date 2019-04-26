import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;


//开始节点
Flow.registerNode(
    'flow-rhombus-if',
    {
      // 设置锚点
      anchor: [
        // [0.5, 0, { type: 'input' }],
         [0, 0.5, { type: 'input' }],
         [1, 0.5, { type: 'output' }], 
         //[0.5, 1, { type: 'output' }]
       ]
    },
    'model-rhombus'
  )
  
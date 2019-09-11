import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;

//分支节点
Flow.registerNode(
    'model-image-branch',
    {
      // iconImg: "http://192.168.0.22:6823/branch.png",
      iconImg:window.location.origin  +'/loading/option2/branchOne.png',
      // 设置锚点
      anchor: [
       // [0.5, 0, { type: 'input' }],
        [0, 0.5, { type: 'input' }],
        [1, 0.5, { type: 'output' }],
        //[0.5, 1, { type: 'output' }]
      ]


      // anchor: [
      //   [0.5, 0, { type: 'input' }],
      //   [0, 0.5, { type: 'input' }],
      //   [1, 0.5, { type: 'output' }],
      //   [0.5, 1, { type: 'output' }]
      // ]
    },
    'model-image'
  );
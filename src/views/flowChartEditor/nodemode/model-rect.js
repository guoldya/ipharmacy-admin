import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;


//属性节点图形绘制
Flow.registerNode('model-rect', {
    draw(item) {
     
      let group = item.getGraphicGroup();
      let model = item.getModel();
      let shapeObj = item.getShapeObj();
  
      let label = model.label != null ? model.label : shapeObj.label;
      let color = model.color != null ? model.color : shapeObj.color;
      let prototypes = model.prototypes != null ? model.prototypes : shapeObj.prototypes;
      let field = model.field != null ? model.field : shapeObj.field;
      if (label == null || label == '') {
        label = '【' + prototypes + '】.【' + field + '】';
      }
  
      let width = 180;
      let height = 80;
      let x = -width / 2;
      let y = -height / 2;
      let borderRadius = 4;
  
      const keyShape = group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          radius: borderRadius,
          fill: 'white',
          stroke: color
        }
      });
  
      let index = 5
      function addShapeP(xx, yy, text) {
        const fontPStyle = {
          attrs: {
            text: text,
            x: xx,
            y: yy,
            textAlign: 'start',
            fontFamily: '微软雅黑',
            fontSize: 12,
            textBaseline: 'top',
            fill: 'rgba(0,0,0,0.65)'
          }
        }
        group.addShape('text', fontPStyle)
      }
      function addShapePnewline(xx, yy, text) {
        text = text
          .replace(/[^\x00-\xff]/g, '$&\x01')
          .replace(/.{24}\x01?/g, '$&\n')
          .replace(/\x01/g, '')
        let arrayText = text.split('\n')
        for (let i = 0; i < arrayText.length; i++) {
          addShapeP(xx + 10, y + index, arrayText[i])
          index += 20
        }
      }
     addShapePnewline(x, y, label)
      return keyShape
    }
  })
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
        label =  prototypes + field;
      }
  
      let width = 180;
      let height = 70;
      let x = -width / 2;
      let y = -height / 2;
      let borderRadius = 35;
      let arrayText=addShapePnewline(label);
      let arrayTextlength = arrayText.length >3 ? 3 : arrayText.length;
      let yy=-(((arrayTextlength-1)*20))/2-5;
      console.log(yy);
      const keyShape = group.addShape('rect', {
        attrs: {
          x,
          y,
          width,
          height,
          radius: borderRadius,
          fill: color,
          stroke: color
        }
      });
  
      function addShapeP(xx, yy, text) {
        const fontPStyle = {
          attrs: {
            text: text,
            x: 0,
            y: yy,
            textAlign: 'center',
            fontFamily: '微软雅黑',
            fontSize: 12,
            textBaseline: 'top',
            fill: 'rgba(0,0,0,0.65)'
          }
        }
        group.addShape('text', fontPStyle)
      }
      function addShapePnewline(text) {
        text = text
          .replace(/[^\x00-\xff]/g, '$&\x01')
          .replace(/.{24}\x01?/g, '$&\n')
          .replace(/\x01/g, '')
        return text.split('\n')
       
      }
      let index = 0
     for (let i = 0; i < arrayText.length&&i<3; i++) {
      addShapeP(x + 20, yy + index, arrayText[i])
      index += 20
    }
      return keyShape
    }
  })
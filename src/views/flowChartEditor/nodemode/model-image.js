import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;

Flow.registerNode('model-image', {
    draw(item) {
      const group = item.getGraphicGroup()
      const model = item.getModel()
      const shapeObj = item.getShapeObj()
  
      const iconImg = model.iconImg != null ? model.iconImg : shapeObj.iconImg;
      const color = model.color != null ? model.color : shapeObj.color;
      const width = 72 ;
      const height = 72;
      const x = -width / 2;
      const y = -height / 2;
      const borderRadius = 4;
  
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
      // 状态 图片绘制
      group.addShape('image', {
        attrs: {
          img: iconImg,
          x: x+4,
          y: y+4,
          width: 64,
          height: 64
        }
      })
      return keyShape
    }
  });
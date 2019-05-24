import G6Editor from '@antv/g6-editor'

const { Flow } = G6Editor


// 结论节点原型绘图
Flow.registerNode('model-card', {
  draw(item) {
    // console.log(item, '执行重绘事件')
    const group = item.getGraphicGroup()
    const model = item.getModel()
    const shapeObj = item.getShapeObj()

    const str1 = model.sourcename != null ? model.sourcename : shapeObj.sourcename
    const str2 = model.message != null ? model.message : shapeObj.message
    const str3 = model.suggest != null ? model.suggest : shapeObj.suggest
    // const verdictType = model.verdictType != null ? model.verdictType : shapeObj.verdictType
    const levelColor = model.levelColor != null ? model.levelColor : shapeObj.levelColor
    const levels = model.levels != null ? model.levels : shapeObj.levels
    const width = 290
    const height = textOrheight(str1, str2, str3)
    const x = -width / 2
    const y = -height / 2
    const borderRadius = 4
    const levelborderwidth = 30
    const fontx = x + borderRadius + levelborderwidth + 5

    const keyShape = group.addShape('rect', {
      attrs: {
        x,
        y,
        width,
        height,
        radius: borderRadius,
        fill: 'white',
        stroke: '#CED4D9'
      }
    })

    // 左侧色条 几何图形
    group.addShape('path', {
      attrs: {
        path: [
          ['M', x, y + borderRadius],
          ['L', x, y + height - borderRadius],
          ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
          ['L', x + borderRadius, y],
          ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius]
        ],
        fill: levelColor
      }
    })
    //左侧填充颜色 方块
    const temp = group.addShape('path', {
      attrs: {
        path: [
          ['M', x + borderRadius - 1, y],
          ['H', x + borderRadius + levelborderwidth - 1],
          ['V', height / 2],
          ['H', x + borderRadius - 1],
          ['L', x + borderRadius - 1, y]
        ],
        fill: levelColor
      }
    })
    //console.log(temp);
    const leveltext = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    //图标提示
    group.addShape('text', {
      attrs: {
        text: levels,
        x: levels < 10 ? x + 5 : x - 5,
        y: y + (height / 2 - (borderRadius + levelborderwidth) / 2),
        textAlign: 'start',
        textBaseline: 'top',
        fontFamily: '微软雅黑',
        fontSize: borderRadius + levelborderwidth,
        fill: '#ffffff'
      }
    })

    function textOrheight(t1, t2, t3) {
      t1 = t1
        .replace(/[^\x00-\xff]/g, '$&\x01')
        .replace(/.{34}\x01?/g, '$&\n')
        .replace(/\x01/g, '')
      t2 = t2
        .replace(/[^\x00-\xff]/g, '$&\x01')
        .replace(/.{34}\x01?/g, '$&\n')
        .replace(/\x01/g, '')
      t3 = t3
        .replace(/[^\x00-\xff]/g, '$&\x01')
        .replace(/.{34}\x01?/g, '$&\n')
        .replace(/\x01/g, '')
      let hh = 10
      hh = hh + t1.split('\n').length * 20
      hh = hh + t2.split('\n').length * 20
      hh = hh + t3.split('\n').length * 20
      return hh
    }

    function addShapeTitel(xx, yy, text) {
      const fontTitelStyle = {
        attrs: {
          text: text,
          x: xx,
          y: yy,
          textAlign: 'start',
          fontFamily: '微软雅黑',
          fontWeight: '700',
          fontSize: 12,
          textBaseline: 'top',
          fill: 'rgba(0,0,0,0.65)'
        }
      }
      group.addShape('text', fontTitelStyle)
    }

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

    let index = 10

    function addShapePnewline(xx, yy, text) {
      text = text
        .replace(/[^\x00-\xff]/g, '$&\x01')
        .replace(/.{34}\x01?/g, '$&\n')
        .replace(/\x01/g, '')
      let arrayText = text.split('\n')
      for (let i = 0; i < arrayText.length; i++) {
        addShapeP(fontx + 40, y + index, arrayText[i])
        index += 20
      }
    }

    // //提示类型
    addShapeTitel(fontx, y + index, '依据:')
    addShapePnewline(fontx + 100, y, str1)
    // //消息提示
    addShapeTitel(fontx, y + index, '消息:')
    addShapePnewline(fontx + 100, y, str2)
    //消息建议
    addShapeTitel(fontx, y + index, '建议:')
    addShapePnewline(fontx + 100, y, str3)
    return keyShape
  },
  // 设置锚点
  anchor: [
    [0.5, 0], // 上面边的中点
    [0.5, 1] // 下边边的中点
  ]
})
  
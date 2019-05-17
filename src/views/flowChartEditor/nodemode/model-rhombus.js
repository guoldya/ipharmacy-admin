import G6Editor from '@antv/g6-editor';
const { Flow } = G6Editor;
//画图 菱形
Flow.registerNode("model-rhombus", {
    draw: function (item) {
        let group = item.getGraphicGroup();
        let model = item.getModel();
        let shapeObj = item.getShapeObj();

        let label = model.label != null ? model.label : shapeObj.label;
        let size = model.size != null ? model.size : shapeObj.size;

        var i = size.split('*');

        const x = -i[0] / 2
        const keyShape = group.addShape('path', {
            attrs: {
                path: this.getPath(i),
                fill: this.getColor(item)
            }
        })

        let index = 0
        let arrayText = this.addShapePnewline(label);
        let labely = this.getlabelY(label, arrayText);
        for (let i = 0; i < arrayText.length && i < 2; i++) {
            this.addShapeP(group, x + 20, labely + index, arrayText[i])
            index += 20
        }
        return keyShape;
    },
    getlabelY: function (label, arrayText) {
        let arrayTextlength = arrayText.length > 2 ? 2 : arrayText.length;
        let yy = -(((arrayTextlength - 1) * 20)) / 2 - 5;
        console.log(yy);
        return yy;
    },
    addShapeP: function (group, xx, yy, text) {
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
    },
    addShapePnewline: function (text) {
        text = text
            .replace(/[^\x00-\xff]/g, '$&\x01')
            .replace(/.{20}\x01?/g, '$&\n')
            .replace(/\x01/g, '')
        return text.split('\n')

    },
    getColor: function (t) {
        var e = t.getModel();
        return e.color ? e.color : this.color
    },
    //获取绘制路线 塞贝尔曲线
    getPath: function (t) {
        var e = t[0],
            n = t[1];
        var p = [
            ["M", 0, 0 - n / 2],
            ["L", 0 + e / 2, 0],
            ["L", 0, 0 + n / 2],
            ["L", 0 - e / 2, 0],
            ["L", 0, 0 - n / 2],
        ]
        return p
    }
});
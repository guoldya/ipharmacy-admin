import G6Editor from '@antv/g6-editor';

const { Flow } = G6Editor;

Flow.registerNode("model-node", {
    draw: function(t) {
        var e = t.getModel(),
        n = t.getGraphicGroup(),
        i = this.getNodeSize(e),
        o = this.getStyle(t),
        u = function(t, e, n, i) {
            return e.addShape("path", {
                attrs: r({},
                i, {
                    path: n
                })
            })
        } (0, n, this.getPath(i, o), o);
        return e.label &&
        function(t, e) {
            var n = a.mix(!0, {},
            s.nodeLabelStyle, {
                x: 0,
                y: 0
            });
            a.isString(t) ? n.text = t: a.mix(n, t),
            e.addShape("text", {
                attrs: n
            })
        } (e.label, n),
        u
    },
    getNodeSize:function(e)
    {
        let t = e.size;
        return t.split('*');
    },
    getStyle: function(t) {
        var e, n, r = t.getModel(),
        i = this.getColor(t);
        // if (i) {
        //     var o = G6.Util.Palettes.generate(i);
        //     e = o[0],
        //     n = o[3]
        // }
        return  {
            fill: i,
            stroke: i
        };
    },
    color: null,
    getColor: function(t) {
        var e = t.getModel();
        return e.color ? e.color: this.color
    },
    getPath: function(t, e) {
        return a.getRectPath( - t[0] / 2, -t[1] / 2, t[0], t[1], e.radius)
    },
    getActivedOutterStyle: function() {
        return s.nodeActivedOutterStyle
    },
    getActivedStyle: function(t) {
        var e = this.getColor(t);
        if (e) {
            var n = a.Palettes.generate(e);
            return r({},
            s.nodeActivedStyle, {
                fill: n[0],
                stroke: n[5]
            })
        }
        return s.nodeActivedStyle
    },
    getSelectedStyle: function(t) {
        var e = this.getColor(t);
        if (e) {
            var n = a.Palettes.generate(e);
            return r({},
            s.nodeSelectedStyle, {
                fill: n[2],
                stroke: n[5]
            })
        }
        return s.nodeSelectedStyle
    },
    getSelectedOutterStyle: function(t) {
        var e = this.getColor(t);
        if (e) {
            var n = a.Palettes.generate(e);
            return r({},
            s.nodeSelectedOutterStyle, {
                stroke: n[1],
                fill: n[1]
            })
        }
        return s.nodeSelectedOutterStyle
    },
    anchor: [[.5, 0], [1, .5], [.5, 1], [0, .5]]
})
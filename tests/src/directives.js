import Vue from 'vue';

/**
 *  定义公共js里，在入口文件main.js中import；
 *   v-dialogDrag: 弹窗拖拽+铺满工作区域
 */
Vue.directive('modalDrag', {
  update(el, binding, vnode, oldVnode) {
    // console.log(el);

    /**获取modal头部*/
    const dialogHeaderEl = el.querySelector('.ant-modal-header');
    const chatContent = el.querySelector('.chatContent');
    const rightCol = el.querySelector('.rightCol');


    // console.log(dialogHeaderEl,'header')
    /**modal对象*/
    const dragDom = el.querySelector('.ant-modal');
    // console.log(dragDom,'dragDom')


    /**头部加上可拖动cursor*/
    if(dialogHeaderEl){
        // dialogHeaderEl.style.cursor = 'move';
    }

    /**获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null)*/
    const style = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    /**鼠标按下事件*/
    const moveDown = (e) => {

      /**不允许拖动*/
    //   if(!enableDragDialog) return;
      /**鼠标按下，计算当前元素距离可视区的距离*/
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      /**获取到的值带px 正则匹配替换*/
      let styleLeft = 0, styleTop = 0;

      /**注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px*/
     
      if (style.left.includes('%')) {
        styleLeft = +document.body.clientWidth * (+style.left.replace(/\%/g, '') / 100);
        styleLeft = +document.body.clientHeight * (+style.top.replace(/\%/g, '') / 100);
      } else {
        styleTop = +style.left.replace(/\px/g, '');
        styleTop = +style.top.replace(/\px/g, '');
      }
      document.onmousemove = function (e) {

        /**不允许拖动*/ 

        /**通过事件委托，计算移动的距离**/
        let left = e.clientX - disX;
        let top = e.clientY - disY;
       

        // var width = document.documentElement.clientWidth - dragDom.offsetWidth
        // var height = document.documentElement.clientHeight - dragDom.offsetHeight

         // min方法保证不会超过右边界，max保证不会超过左边界
        //  left = Math.min(Math.max(0, left), disX)
        //  top = Math.min(Math.max(0, top), disY)

        let finallyLeft = left + styleLeft;
        let finallyTop = top + styleTop;

        
        /**移动当前元素*/
        dragDom.style.left = `${finallyLeft}px`;
        dragDom.style.top = `${finallyTop}px`;
      };
       // 为了防止 火狐浏览器 拖拽阴影问题
      document.onmouseup = function (e) {
        document.onmousemove = null;
        dragDom.onmouseup = null;
      };
    };

    dialogHeaderEl.onmousedown = moveDown;
    
    // chatContent.onmousedown = moveDown;

    rightCol.onmousedown = moveDown;

   
  },
});

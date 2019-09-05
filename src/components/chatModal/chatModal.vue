<template>
  <div  ref="chatBox" v-modalDrag>
    <a-modal
      
      title="张三"
      :visible.sync="visible"
      :maskClosable="false"
      :width="900"
       class="chatModal"
       centered
       :mask='false'
       :footer="null"
       @cancel="handleCancel"
      :getContainer="() => $refs.chatBox"
    >
      <a-row  >
          <a-col :span="17" class="leftCol">
                <div class="chatContent"  ref="box">
                    <div v-for="(item,i) in chatContent" :class="item.sendContent||item.sendImg?'sendContent':'acceptContent'" :key="i">
                           <div class="send" :class="item.sendContent||item.sendImg?'':'margin-left-16'"> 
                               <span v-if="!item.sendImg" v-html="item.sendContent"> </span>
                                <span v-else class="img"  v-html="item.sendImg"></span>

                                <span>{{item.acceptContent}}</span>
                                <div :class="item.sendContent||item.sendImg?'sendArrow':'acceptArrow'" class="arrow"></div>
                           </div>
                           <div>
                                 <img class="userPhoto" src="@/assets/testImg.png" alt="">
                           </div>

                         <!-- <a-popover 
                         :getPopupContainer="getPopupContainer" 
                         :visible="true"
                         :destroyTooltipOnHide='true'
                         :arrowPointAtCenter='true'
                          overlayClassName="chatWrapper"
                          :placement="item.sendContent||item.sendImg?'left':'right'"
                          >
                             <template slot="content">
                                <span v-if="!item.sendImg" v-html="item.sendContent"> </span>
                                <span v-else class="img"  v-html="item.sendImg"></span>

                                <span>{{item.acceptContent}}</span>
                             </template>
                                <img class="userPhoto" src="@/assets/testImg.png" alt="">
                        </a-popover> -->
                        
                    </div>
                </div>
            <a-divider/>
            <!-- 表情 -->
            <a-popover placement="top" 
             @visibleChange="visibleChange" trigger="click" :visible="selectEmojiStatus"
            >
                <template slot="content">
                    <VEmojiPicker :pack="pack" @select="selectEmoji" />
                </template>
                <a-icon class="fontSize20" type="smile" />
            </a-popover>

             <a-upload  class="margin-left-5"
                    listType="picture"
                    :showUploadList="false"
                    :action="action"
            
                    @change="handleChange"
                >
                    <a-icon class="fontSize20" type="picture" />
                </a-upload>

              <div class="chatInputBorder">
                <!-- <a-textarea @click="aa" class="a_textarea" id="a_textarea" @keyup.enter="handleOk" v-model="emoji" autoFocus >
                  </a-textarea> -->
                <div class="textarea" id="textarea" @input="handleInput" 
                 @keyup.enter="handleOk" @click="getCursor" ref="divE1" contenteditable="true"
                > 
                  <!-- <span v-html="emoji"></span> -->
                  <!-- <img class="img"  v-for="(url,i) in previewImage" :key="i" :src="url" /> -->
                </div>
              </div>
              <div :style="{'text-align':'right'}">
                <a-button key="back" @click="handleCancel">关闭</a-button>
                <a-button key="submit" type="primary" class="margin-left-5" :loading="loading" @click="handleOk">
                发送
                </a-button>
              </div>
          </a-col>
          <a-col :span="7" class="rightCol">
              <div >
                <p>性别：男</p>
                <p>年龄：23</p>
                <p>专业：经济学</p>
              </div>
          </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
//表情插件
import VEmojiPicker from 'v-emoji-picker';
import packData from 'v-emoji-picker/data/emojis.json';
//拖拽插件
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
    name:"selectDoctorAdvice",
    props: {
       
    },
  data() {
    return {
      inputLock:true,
      loading:false,
      imageUrl: [],
      action:'https://www.mocky.io/v2/5cc8019d300000980a055e76',///api/sys/upload/image
      previewImage: [],
      fileList: [],
     acceptChat:['我不晓得','嗯要不得','ok','还钱','嗯不是不是不是不是不是不是不是不是不是不是不是不是不是不是很好很好'],
      modalData:[],
      visible:true,
      pack: [],
      emoji:'',
      chatContent:[],
      sendContent:[],
      acceptContent:[],
      //监听是否发送消息
      sendStatus:'',
      selectEmojiStatus:false,
      el:null,
      emoji:"",
      content: '',
      caretOffset:'',
      txtlength:'',
      startOffset:''
    }
  },
  computed: {
    
    },
  components: {
    VEmojiPicker,
  },
  mounted() {
      var _this = this;
      _this.pack=packData.splice(5,30);
      this.$refs.divE1.focus();
      
     this.$refs.divE1.addEventListener('paste', e=> {
       this.paste(e)
     })
      
  },
  watch: {
      //监听list,当有修改的时候进行div的屏幕滚动，确保能看到最新的聊天
      sendStatus() {
        let that = this;
        setTimeout(() => {
          that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
        }, 0);
        //加setTimeout的原因：由于vue采用虚拟dom，
        //每次生成新的消息时获取到的div的scrollHeight的值是生成新消息之前的值，所以造成每次都是最新的那条消息被隐藏掉了
      },
    },
  methods: {
    getBase641(img) {
      return new Promise(function(resolve,reject){
            const reader = new FileReader();
            reader.addEventListener('load', () =>{resolve(reader.result)});
            reader.readAsDataURL(img);
      })
    },
    //粘贴
    paste(e){
      e.preventDefault()
        
        var clp = (e.originalEvent || e).clipboardData;
        
         if(clp.files && clp.files.length > 0){//图片
            // this.mapFile(clp.files)
              return ;
        }  
        if (clp.items && clp.items.length > 0) {//文字
            var text
            if (clp === undefined || clp === null) {
              text = window.clipboardData.getData('text') || ''
              if (text !== '') {
                if (window.getSelection) {
                  var newNode = document.createElement('span')
                  newNode.innerHTML = text
                  window.getSelection().getRangeAt(0).insertNode(newNode)
                } else {
                  document.selection.createRange().pasteHTML(text)
                }
              }
            } else {
              text = clp.getData('text/plain') || ''
              if (text !== '') {
                document.execCommand('insertText', false, text)
              }
            }
            return ;
        }
    },
    mapFile(files){
      for(var i = 0; i < files.length; i++){
          var c = files[i];
          if(c.type && c.type.split("/")[0] == "image"){
              this.getBase641(files[i]).then(function(ret){
                  document.execCommand("insertImage",false,ret);
              }).catch(function(ret){});
          }
      }
    },
  
     handleInput($event){
      this.emoji = $event.target.innerHTML;
      // this.emoji= $event.target.innerHTML;
      this.$nextTick(()=>{
        // this.changeCursor($event.target,this.emoji)
      })
    },
    getCursor(element){
      var caretOffset = 0;
      var doc = element.target.ownerDocument || element.target.document;
      var win = doc.defaultView || doc.parentWindow;
      var sel;
      if (typeof win.getSelection != "undefined") {//谷歌、火狐
        sel = win.getSelection();
        if (sel.rangeCount > 0) {//选中的区域
          var range = win.getSelection().getRangeAt(0);
          var preCaretRange = range.cloneRange();//克隆一个选中区域
          preCaretRange.selectNodeContents(element.target);//设置选中区域的节点内容为当前节点
          preCaretRange.setEnd(range.endContainer, range.endOffset);  //重置选中区域的结束位置
          caretOffset = preCaretRange.toString().length;
          this.startOffset=range.startOffset;
          // console.log(preCaretRange,'preCaretRange');
          // console.log(range.endContainer,'range.endContainer');
          // console.log(range.endOffset,'range.endOffset');
          // console.log(range.startOffset)

        }
      } else if ((sel = doc.selection) && sel.type != "Control") {//IE
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element.target);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      this.caretOffset=caretOffset;
          console.log(this.caretOffset,'aa caretOffset') ;

    },
    changeCursor(tId,tag){
        var subst ;
        //IE  
        if(document.selection) {  
          var theSelection = document.selection.createRange().text;  
          if(!theSelection) { theSelection=tag}  
          tId.focus();  
          if(theSelection.charAt(theSelection.length - 1) == " "){  
          theSelection = theSelection.substring(0, theSelection.length - 1);  
          document.selection.createRange().text = theSelection+ " ";  
        } else {  
          document.selection.createRange().text = theSelection;  
        }  
  
        }  
        // Mozilla  
        else if(tId.selectionStart || tId.selectionStart == '0'){  
        console.log(tId,tId.selectionStart,tId.selectionEnd,'tId.selectionStart')

          var startPos = tId.selectionStart;  
          var endPos = tId.selectionEnd;  
          var myText = (tId.value).substring(startPos, endPos);  
          if(!myText) { myText=tag;}  
          if(myText.charAt(myText.length - 1) == " "){ // exclude ending space char, if any  
          subst = myText.substring(0, (myText.length - 1))+ " ";  
        } else {  
          subst = myText;  
        }  
          tId.value = tId.value.substring(0, startPos) + subst + tId.value.substring(endPos, tId.value.length);  
          tId.focus();  
          var cPos=startPos+(myText.length);  
          tId.selectionStart=cPos;  
          tId.selectionEnd=cPos;  
          console.log(tId.innerHTML,'有innerHTML') ;


        }  
        // All others  
        else if(this.caretOffset||this.caretOffset=='0'){  
          console.log(this.caretOffset,'aa caretOffset') ;
            console.log(this.$refs.img)

          var startPos =this.startOffset;  
          var endPos = this.caretOffset;

          var myText = (tId.innerHTML).substring(startPos, endPos);  
          if(!myText) { myText=tag;}  

          if(myText.charAt(myText.length - 1) == " "){ // exclude ending space char, if any  
            subst = myText.substring(0, (myText.length - 1))+ " "; 
          } else {  
            subst = myText;  
          }  
          this.txtlength= myText.length; 

          tId.innerHTML = tId.innerHTML.substring(0, startPos) + tag + tId.innerHTML.substring(endPos, tId.innerHTML.length);  
          console.log(tId.innerHTML,'无substring  innerHTML') ;

         tId.focus();  
          var cPos=startPos+(myText.length);  
          this.startOffset=cPos;  
          this.caretOffset=cPos;  
        }  else{
          tId.innerHTML+=tag;
           tId.focus(); 
          //  console.log(11111);
            // this.txtlength= tag.length;
            //   var selection= window.getSelection ? window.getSelection() : document.selection;
            // var range= selection.createRange ? selection.createRange() : selection.getRangeAt(0);
            // if (!window.getSelection){
            //     tId.focus();
            //     var selection= window.getSelection ? window.getSelection() : document.selection;
            //     var range= selection.createRange ? selection.createRange() : selection.getRangeAt(0);
            //     range.pasteHTML(tag);
            //     range.collapse(false);
            //     range.select();
            // }else{
            //   tId.focus();
            //   range.collapse(false);
            //   var hasR = range.createContextualFragment(tag);
            //   var hasR_lastChild = hasR.lastChild;
            //   while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
            //   var e = hasR_lastChild;
            //   hasR_lastChild = hasR_lastChild.previousSibling;
            //   hasR.removeChild(e)
            //   }
            //   range.insertNode(hasR);
            //   if (hasR_lastChild) {
            //   range.setEndAfter(hasR_lastChild);
            //   range.setStartAfter(hasR_lastChild)
            //   }
            //   selection.removeAllRanges();
            //   selection.addRange(range);
            // }
        }
        if (tId.createTextRange) tId.caretPos = document.selection.createRange().duplicate(); 
        // if (window.getSelection) { //ie11 10 9 ff safari
        //     tId.focus(); //解决ff不获取焦点无法定位问题
        //     var range = window.getSelection(); //创建range
        //     range.selectAllChildren(tId); //range 选择obj下所有子内容
        //     range.collapseToEnd(); //光标移至最后
        // } else if (document.selection) { //ie10 9 8 7 6 5
        //     var range = document.selection.createRange(); //创建选择对象
        //     //var range = document.body.createTextRange();
        //     range.moveToElementText(tId); //range定位到obj
        //     range.collapse(false); //光标移至最后
        //     range.select();
        // }

         if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(tId);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(tag);
        textRange.collapse(false);
        textRange.select();
    }
        this.emoji=tId.innerHTML;

//  var selection = getSelection()
//       var range = selection.getRangeAt(0)
//         var img = document.createElement('img')
//         img.src = 'aaaa';
//         range.insertNode(img)
//         selection.addRange(range)
        // this.$refs.divE1.innerHTML=val
        // this.emoji = tId.value
        // console.log(tId.innerHTML,'innerHTML') ;
        //   console.log(tId.value,'tId.value') ;

      },
    handleChange (info) {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl) => {
                this.previewImage.push(imageUrl);
                // this.emoji=this.emoji;
                // this.emoji += `<img src="${imageUrl}"  class="img"/>`;
                this.emoji = `<img src="${imageUrl}"  class="img"/>`;
                this.chatContent.push({sendContent:this.emoji});
                //在光标指定位置处插入图片
                let img=`<img src="${imageUrl}" ref="img" class="img"/>`;
                let el=document.getElementById('textarea')||document.getElementById('a_textarea');
                // this.changeCursor(el,img)
            })
        }
    },
    visibleChange(val){
        this.selectEmojiStatus=val;
      },
      //随机整数
    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    selectEmoji(emoji) {
        //选择表情之后关闭popover
       this.selectEmojiStatus=false;
        // this.emoji+=emoji.emoji; 
        this.emoji+=emoji.emoji;
        //在光标指定位置处插入表情
        let el=document.getElementById('textarea')||document.getElementById('a_textarea');
        this.changeCursor(el,emoji.emoji)
    },
   showModal() {
      this.visible = true;
       this.$nextTick(()=>{
      })
    },
    
    handleCancel(e) {
    //   this.visible = false;
    this.$emit('search',true)
    },
    handleOk(e) {
        this.selectEmojiStatus=false;
        if(this.emoji||this.emoji!==""){
          this.chatContent.push({sendContent:this.emoji});
          this.sendStatus=this.random(0, 5);
        }
        //有文字、表情、图片就发过来消息
        if(this.emoji || this.previewImage.length>0){
          this.chatContent.push({acceptContent:this.acceptChat[this.random(0, 5)]});
        }
        this.sendStatus=this.random(0, 5);
        this.emoji="";
        this.previewImage=[];
        this.emoji="";
        if(document.getElementsByClassName('textarea').length>0){
          document.getElementsByClassName('textarea')[0].innerText="";
        }
        console.log(this.chatContent,'chatContent')
    //   this.visible = false
    },
  }
}
</script>
<style scoped lang='less'>
    

     .chatModal{
         .margin-left-16{
             margin-left: 16px;
         }
         .send {
            position:relative;
            max-width: 400px;
            height:auto;
            background:#fff;
            border-radius:5px; /* 圆角 */
            box-shadow: 0 0 2px 1px #dddddd;
            padding: 5px 6px;
            margin-right: 16px;
            .arrow {
                position:absolute;
                font-size:0;
                top: 10px;
                right: -7px;
                width: 12px;
                height: 12px;
                border-top: 1px solid #dddddd;
                border-right: 1px solid #dddddd;
                background-color: #fff;
            }
            .sendArrow {
                right: -7px;
                transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
                -o-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
            }
            .acceptArrow{
                left: -7px;
                transform: rotate(-135deg);
                -moz-transform: rotate(-135deg);
                -webkit-transform: rotate(-135deg);
                -o-transform: rotate(-135deg);
                -ms-transform: rotate(-135deg);
            }
         }
         .a_textarea{
             height:113px
         }
         .textarea {
                box-sizing: border-box;
                height: 110px;
                margin-left: auto;
                margin-right: auto;
                padding: 12px;
                outline: 0;
                word-wrap: break-word;
                overflow: auto;
         }
        
         .userPhoto{
             width: 30px;
             height: 30px;
             border-radius: 50%;
             box-shadow: 0 0 2px 1px #dddddd;

         }
         .ant-divider-horizontal{
            margin: 10px 0 !important
        }
        .chatInputBorder textarea::-webkit-scrollbar ,
        .chatInputBorder .textarea::-webkit-scrollbar ,
        .chatContent::-webkit-scrollbar {
            /*滚动条整体样式*/
            height: 11px;
            width: 11px;
          }
          .chatInputBorder textarea::-webkit-scrollbar-thumb,
          .chatInputBorder .textarea::-webkit-scrollbar-thumb ,
          .chatContent::-webkit-scrollbar-thumb {
            /*滚动条里面轨道*/
            border-radius: 30px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
            background-color: #ddd;
            border-style: dashed;
            border-color: transparent;
            border-width: 1.5px;
            background-clip: padding-box;
          }
          .chatContent::-webkit-scrollbar-thumb:hover ,
          .chatInputBorder textarea::-webkit-scrollbar-thumb:hover ,
          .chatInputBorder .textarea::-webkit-scrollbar-thumb:hover {
            background: #ddd;
          }
         .chatContent{
                height: 275px;
                overflow: auto;
                overflow-x: hidden;
                .sendContent{
                    justify-content: flex-end;
                    display: flex;
                    margin: 10px 0;
                }
                .acceptContent{
                    justify-content: flex-end;
                    display: flex;
                    margin: 14px 0;
                    flex-direction: row-reverse;
                }
         }
         .leftCol{
             padding: 12px;
         }
         .rightCol{
            height: 487px;
            background-color: #e8e8e8;
            border-radius: 2px;
            padding: 12px;
         }
         .chatInputBorder{
            .ant-input{
                border:none !important;
                box-shadow: none;
                resize: none;
                font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            } 
        }
     }
     

     
    
    
</style>

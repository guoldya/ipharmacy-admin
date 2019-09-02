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
                <a-textarea class="a_textarea"  @keyup.enter="handleOk" v-if="previewImage.length===0" v-model="txtContent" autoFocus >
                  </a-textarea>
                <div class="textarea" v-if="previewImage.length>0"  
                 @input="inputChange" v-html="txtContent" contenteditable="true">
                 <!-- <span ></span> -->
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
      loading:false,
      imageUrl: [],
      newImgUrl:'',
      action:'https://www.mocky.io/v2/5cc8019d300000980a055e76',///api/sys/upload/image
      previewImage: [],
      fileList: [],
     acceptChat:['我不晓得','嗯要不得','ok','还钱','嗯不是不是不是不是不是不是不是不是不是不是不是不是不是不是很好很好'],
      modalData:[],
      visible:true,
      pack: [],
      txtContent:'',
      chatContent:[],
      sendContent:[],
      acceptContent:[],
      //监听是否发送消息
      sendStatus:'',
      selectEmojiStatus:false,
      el:null
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
      changeCursor(obj){
        if (window.getSelection) { //ie11 10 9 ff safari
            obj.focus(); //解决ff不获取焦点无法定位问题
            var range = window.getSelection(); //创建range
            range.selectAllChildren(obj); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
        } else if (document.selection) { //ie10 9 8 7 6 5
            var range = document.selection.createRange(); //创建选择对象
            //var range = document.body.createTextRange();
            range.moveToElementText(obj); //range定位到obj
            range.collapse(false); //光标移至最后
            range.select();
        }
      },
    handleChange (info) {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl) => {
                this.previewImage.push(imageUrl);
                this.txtContent += `<img src="${imageUrl}"  class="img"/>`
                this.newImgUrl += `<img src="${imageUrl}"  class="img"/>`;
            })
        }
    },
    visibleChange(val){
        this.selectEmojiStatus=val;
      },
    inputChange(e,i){
      console.log(e)
        this.txtContent=e.target.innerHTML;
        this.$nextTick(()=>{

          // this.changeCursor(e.target)
        })
       
    },
    //tooltip渲染到父元素
    getPopupContainer (trigger) {
        return trigger.parentElement    
    },
      //随机整数
    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    selectEmoji(emoji) {
        //选择表情之后关闭popover
       this.selectEmojiStatus=false;
        this.txtContent+=emoji.emoji;
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
        if(this.txtContent||this.txtContent!==""){
          this.chatContent.push({sendContent:this.txtContent});
          this.sendStatus=this.random(0, 5);
        }
        //有文字、表情、图片就发过来消息
        if(this.txtContent || this.previewImage.length>0){
          this.chatContent.push({acceptContent:this.acceptChat[this.random(0, 5)]});
        }
        this.sendStatus=this.random(0, 5);
        this.txtContent="";
        this.newImgUrl="";
        this.previewImage=[];
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

    


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
          <a-col :span="16" class="leftCol">
                <div class="chatContent"  ref="box">
                    <div v-for="(item,i) in chatContent" :class="item.sendContent||item.sendImg?'sendContent':'acceptContent'" :key="i">
                         <a-popover 
                         :getPopupContainer="getPopupContainer" 
                         :visible="true"
                         :destroyTooltipOnHide='true'
                         :arrowPointAtCenter='true'
                          :placement="item.sendContent||item.sendImg?'left':'right'"
                          >
                             <template slot="content">
                                <span v-if="!item.sendImg" v-html="item.sendContent"> </span>
                                <span v-else class="img"  v-html="item.sendImg">
                                 <!-- <img class="img" v-for="(url,i) in imageUrl"   :src="url" /> -->
                                </span>

                                <span>{{item.acceptContent}}</span>
                             </template>
                             <!-- <div> -->
                                <img class="userPhoto" src="@/assets/testImg.png" alt="">
                             <!-- </div> -->
                        </a-popover>
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
                  <!--  v-html="txtContent"  @input="txtContent=$event.target.innerHTML"-->
                <!-- <div class="textarea" ref="divE1" @keyup.enter="handleOk" 
                    @input="inputChange"  v-if="txtContent" v-html="txtContent" contenteditable="true">
                </div> -->

                <a-textarea class="a_textarea"  @keyup.enter="handleOk" v-if="previewImage.length===0" v-model="txtContent" autoFocus >
                  </a-textarea>

                <div class="textarea" @keyup.enter="handleOk" 
               @input="inputChange" v-if="previewImage.length>0" contenteditable="true">
                <span v-if="txtContent" v-html="txtContent"></span>
                <img class="img"  v-for="(url,i) in previewImage" :key="i" :src="url" />
                </div>

                  <!-- <a-textarea @keyup.enter="handleOk" v-model="txtContent" autoFocus >
                  </a-textarea> -->
              </div>
              <div :style="{'text-align':'right'}">
                <a-button key="back" @click="handleCancel">关闭</a-button>
                <a-button key="submit" type="primary" class="margin-left-5" :loading="loading" @click="handleOk">
                发送
                </a-button>
              </div>
          </a-col>
          <a-col :span="8" class="rightCol">
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
     acceptChat:['我不晓得','嗯要不得','ok','还钱','嗯很好很好'],
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
    handleChange (info) {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl) => {
                this.previewImage.push(imageUrl);
                this.newImgUrl += `<img src="${imageUrl}"  class="img" />`;
            })
        }
    },
    visibleChange(val){
        this.selectEmojiStatus=val;
      },
    inputChange(e,i){
        this.txtContent=e.target.innerHTML;
        console.log(this.txtContent,'txtContent')
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
        console.log(this.$refs.chatBox)
      })
    },
    
    handleCancel(e) {
    //   this.visible = false;
    this.$emit('search',true)
    },
    handleOk(e) {
      this.selectEmojiStatus=false;
      if(this.previewImage.length>0){
           this.imageUrl=this.previewImage;
          for(let k in this.previewImage){
        //       //push 为了imgUrl不覆盖之前所选图片
            // this.imageUrl.push(this.previewImage[k]);
          }
      }
      if(this.txtContent){
        this.chatContent.push({sendContent:this.txtContent});
        this.sendStatus=this.random(0, 5);
      }
      
      if(this.imageUrl.length>0&&this.previewImage.length>0){
        this.chatContent.push({sendImg:this.newImgUrl});
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
         .chatContent{
             height: 275px;
             overflow: auto;
             display: grid;
                grid-gap: 20px;
            // grid-template-rows :100px 100px;
             position: relative;
             overflow-x: hidden;
             .sendContent{
                text-align: right;
                position: relative;
                display: flex;
                align-items: center;
                flex-direction: row-reverse;
             }
             .acceptContent{
                text-align: left;
                position: relative;
                // display: flex;
                // align-items: center;

             }
         }
         .leftCol{
             padding: 12px;
         }
         .rightCol{
            height: 484px;
            background-color: #e8e8e8;
            border-radius: 2px;
            padding: 12px;
         }
         .chatInputBorder{
            .ant-input{
                border:none !important;
                box-shadow: none;
                resize: none
            } 
        }
     }
     

     
    
    
</style>

    


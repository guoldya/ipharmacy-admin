<template>
  <div>
    <a-modal 
    v-modalDrag
      title="张三"
      :visible="visible"
      :maskClosable="false"
      :width="900"
       class="chatModal"
       centered
       :mask='false'
       :footer="null"
       @cancel="handleCancel"
      :destroyOnClose='true'
    >
     <template slot="footer">
        
      </template>
      <a-row >
          <a-col :span="16" class="leftCol">
                <div class="chatContent"  ref="box">
                    <div v-for="(item,i) in chatContent" :class="item.sendContent?'sendContent':'acceptContent'" :key="i">
                         <a-popover 
                        :arrowPointAtCenter='true' 
                         :getPopupContainer="getPopupContainer" 
                         :visible="true"
                          :placement="item.sendContent?'left':'right'"
                          >
                             <template slot="content">
                                <span v-html="item.sendContent"> </span>
                                <span>{{item.acceptContent}}</span>
                             </template>
                            <img class="userPhoto" src="@/assets/testImg.png" alt="">
                        </a-popover>
                    </div>
                </div>
            <a-divider/>
            <!-- 表情 -->
            <a-popover placement="top" trigger="click">
                <template slot="content">
                    <VEmojiPicker  :pack="pack" @select="selectEmoji" />
                </template>
                <a-icon class="fontSize20" type="smile" />
            </a-popover>

                <a-upload class="margin-left-5"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                :fileList="fileList"
                
                @change="handleChange"
                >
                    <a-icon class="fontSize20" type="picture" />
                </a-upload>


              <div class="chatInputBorder">
                <div class="textarea" @keyup.enter="handleOk" 
                v-html="txtContent" @input="txtContent=$event.target.innerHTML"  contenteditable="true">
                <img class="img" v-for="(url,i) in previewImage" :key="i" :src="url" />

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
import VEmojiPicker from 'v-emoji-picker';
import packData from 'v-emoji-picker/data/emojis.json';

export default {
    name:"selectDoctorAdvice",
    props: {
       
    },
  data() {
    return {
        loading:false,
      previewImage: [],
      fileList: [],
     acceptChat:['我不晓得','嗯要不得','ok','还钱','嗯很好很好'],
      loading:false,
      modalData:[],
      visible:false,
      pack: [],
      txtContent:'',
      chatContent:[],
      sendContent:[],
      acceptContent:[],
      //监听是否发送消息
      sendStatus:''
    }
  },
  computed: {
    },
  components: {
    VEmojiPicker
  },
  mounted() {
      this.pack=packData.splice(5,30);
  },
  watch: {
      //监听list,当有修改的时候进行div的屏幕滚动，确保能看到最新的聊天
      sendStatus() {
        let that = this;
         setTimeout(() => {
             this.chatContent.push({acceptContent:this.acceptChat[this.random(0, 5)]});
        }, 1000);
        setTimeout(() => {
          that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
        }, 0);
        //加setTimeout的原因：由于vue采用虚拟dom，
        //每次生成新的消息时获取到的div的scrollHeight的值是生成新消息之前的值，所以造成每次都是最新的那条消息被隐藏掉了
      },
      
    },
  methods: {
      handleCancel () {
      this.previewVisible = false
    },
    
    handleChange ({ fileList }) {
      this.fileList = fileList;
      if(fileList[0].url || fileList[0].thumbUrl){
        this.previewImage.push(fileList[0].url || fileList[0].thumbUrl);
      }
      console.log(this.previewImage)
    },
      getPopupContainer (trigger) {
        return trigger.parentElement
        },
      //随机整数
    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    selectEmoji(emoji) {
      console.log(emoji);
      this.EmojVisible=false;  
      this.txtContent+=emoji.emoji;
    },
   showModal() {
      this.visible = true
    },
    handleCancel(e) {
      this.visible = false;
    },
    handleOk(e) {
      console.log(e);
      this.chatContent.push({sendContent:this.txtContent});
    //   this.txtContent="";
      this.sendStatus=this.random(0, 5);

    //   this.visible = false
    },
  }
}
</script>
<style scoped lang='less'>
     .chatModal{
         
         .textarea {
                box-sizing: border-box;
                height: 75px;
                margin-left: auto;
                margin-right: auto;
                padding: 12px;
                outline: 0;
                word-wrap: break-word;
                overflow: hidden;
         }
        .img{
            height: 80px;
            width: 80px;
            margin-right: 5px;
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
             height: 160px;
             overflow: auto;
             .sendContent{
                text-align: right;
                margin-bottom: 20px;
             }
             .acceptContent{
                text-align: left;
                margin-bottom: 20px;
             }
         }
         .leftCol{
             padding: 12px;
         }
         .rightCol{
            height: 333px;
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

    


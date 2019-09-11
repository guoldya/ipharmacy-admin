<template>
  <div  ref="chatBox" v-modalDrag>
    <a-modal
      
      :title="title"
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
                               <span class="sendImg" v-if="!item.sendImg" v-html="item.sendContent"> </span>
                                <span v-else class="img"  v-html="item.sendImg"></span>

                                <span>{{item.acceptContent}}</span>
                                <div :class="item.sendContent||item.sendImg?'sendArrow':'acceptArrow'" class="arrow"></div>
                           </div>
                           <div>
                                 <img class="userPhoto" src="@/assets/testImg.png" alt="">
                           </div>
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
                <a-icon class="fontSize20 selectNone" type="smile" />
            </a-popover>

             <a-upload  class="margin-left-5"
                    listType="picture"
                    :showUploadList="false"
                    :action="action"
            
                    @change="handleChange"
                >
                    <a-icon class="fontSize20 selectNone" type="picture" />
                </a-upload>
              <div class="chatInputBorder">
                <div class="textarea" id="textarea" @input="handleInput" 
                 @keyup.enter="handleOk"  ref="divE1" contenteditable="true"
                >  
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
//表情
import packData from 'v-emoji-picker/data/emojis.json';
//拖拽插件
export default {
    name:"selectDoctorAdvice",
    props: {
       
    },
  data() {
    return {
      title:'张三',
      loading:false,
      action:'/api/sys/upload/image', 
      acceptChat:['我不晓得','嗯要不得','ok','还钱','嗯不是不是不是不是不是不是不是不是不是不是不是不是不是不是很好很好'],
      visible:true,
      pack: [],
      emoji:'',
      chatContent:[],
      //监听是否发送消息
      sendStatus:'',
      selectEmojiStatus:false,
    }
  },
  computed: {
    
    },
  components: {
    VEmojiPicker,
  },
  mounted() {
      var _this = this;
      // this.title='<img src="../../assets/testImg.png"  class="img"/>'+'张三';
      this.pack=[
            {emoji: "😀", description: "grinning face", category: "Peoples"},
            {emoji: "😃", description: "smiling face with open mouth", category: "Peoples"},
            {emoji: "😄", description: "smiling face with open mouth & smiling eyes", category: "Peoples"}, 
            {emoji: "😁", description: "grinning face with smiling eyes", category: "Peoples"},
            {emoji: "😆", description: "smiling face with open mouth & closed eyes", category: "Peoples"},
            {emoji: "😅", description: "smiling face with open mouth & cold sweat", category: "Peoples",}, 
            {emoji: "😂", description: "face with tears of joy", category: "Peoples"},
            {emoji: "🤣", description: "rolling on the floor laughing", category: "Peoples"},
            {emoji: "😌", description: "smiling face", category: "Peoples"}, 
            {emoji: "😊", description: "smiling face with smiling eyes", category: "Peoples"}
            , {emoji: "😇", description: "smiling face with halo", category: "Peoples",}
            , {emoji: "🙂", description: "slightly smiling face", category: "Peoples"}
            , {emoji: "🙃", description: "upside-down face", category: "Peoples"}
            , {emoji: "😉", description: "winking face", category: "Peoples"}
            , {emoji: "😌", description: "relieved face", category: "Peoples"}
            , {emoji: "😍", description: "smiling face with heart-eyes", category: "Peoples"}
            , {emoji: "😘", description: "face blowing a kiss", category: "Peoples"}
            , {emoji: "😗", description: "kissing face", category: "Peoples"}
            , {emoji: "😙", description: "kissing face with smiling eyes", category: "Peoples"}
            , {emoji: "😚", description: "kissing face with closed eyes", category: "Peoples"}
            , {emoji: "😋", description: "face savouring delicious food", category: "Peoples"}
            , {emoji: "😜", description: "face with stuck-out tongue & winking eye", category: "Peoples"}
            , {emoji: "😝", description: "face with stuck-out tongue & closed eyes", category: "Peoples"}
            , {emoji: "😛", description: "face with stuck-out tongue", category: "Peoples"}
            , {emoji: "🤑", description: "money-mouth face", category: "Peoples"}
            , {emoji: "🤗", description: "hugging face", category: "Peoples"}
            , {emoji: "🤓", description: "nerd face", category: "Peoples"}
            , {emoji: "😎", description: "smiling face with sunglasses", category: "Peoples"}
            , {emoji: "🤡", description: "clown face", category: "Peoples"}
            , {emoji: "🤠", description: "cowboy hat face", category: "Peoples"}
            , {emoji: "😏", description: "smirking face", category: "Peoples"}
            , {emoji: "😒", description: "unamused face", category: "Peoples"}
            , {emoji: "😞", description: "disappointed face", category: "Peoples"}
            , {emoji: "😔", description: "pensive face", category: "Peoples"}
            ,{emoji: "😟", description: "worried face", category: "Peoples"}
            ,{emoji: "😕", dry: "Peoples"}
            ,{emoji: "🙁", description: "slightly frowning face", category: "Peoples"}
            ,{emoji: "☹️", description: "frowning face", category: "Peoples"}
            ,{emoji: "😣", description: "persevering face", category: "Peoples"}
            ,{emoji: "😖", description: "confounded face", category: "Peoples"}
            ,{emoji: "😫", description: "tired face", category: "Peoples"}
            ,{emoji: "😩", description: "weary face", category: "Peoples"}
            ,{emoji: "😤", description: "face with steam from nose", category: "Peoples"}
            ,{emoji: "😠", description: "angry face", category: "Peoples"}
            ,{emoji: "😡", description: "pouting face", category: "Peoples"}
            ,{emoji: "😶", description: "face without mouth", category: "Peoples"}
            ,{emoji: "😐", description: "neutral face", category: "Peoples"}
            ,{emoji: "😑", description: "expressionless face", category: "Peoples"}
            ,{emoji: "😯", description: "hushed face", category: "Peoples"}
            ,{emoji: "😦", description: "frowning face with open mouth", category: "Peoples"}
            ,{emoji: "😧", description: "anguished face", category: "Peoples"}
      ];
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
    //粘贴
    paste(e){
        e.preventDefault();
        console.log(e)
        var clp = (e.originalEvent || e).clipboardData;
        if(clp.files && clp.files.length > 0){//图片
            this.mapFile(clp.files)
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
    //粘贴的文件
    mapFile(files){
      let param = new FormData(); //创建form对象
      for(var i = 0; i < files.length; i++){
          var c = files[i];
          var index1 = c.name.lastIndexOf(".");
          var index2 = c.name.length;
          var suffix = c.name.substring(index1 + 1, index2);//后缀名
          param.append('photo0', c, "photo0." + suffix);//通过append向form对象添加数据
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          };
          if(c.type && c.type.split("/")[0] == "image"){
             this.$axios.post('/sys/upload/image',param, config).then(res => {
              if (res.code === '200') {
                let imgUrl=this.$config.img_base_url+res.fileInfo[0].fileName;
                document.execCommand("insertImage",false,imgUrl);              
              }else{
                  this.warn('图片上传失败')
              }
            })
          }
      }
    },
  
    handleInput($event){
      this.emoji = $event.target.innerHTML;
    },
    //图片upload
    handleChange (info) {
        if (info.file.status === 'done') {
            if (info.file.response && info.file.response.code === '200') {
              let imgUrl=this.$config.img_base_url+info.file.response.fileInfo[0].fileName;
              this.emoji = `<img src="${imgUrl}"  class="img"/>`;
              document.execCommand("insertImage",false,imgUrl);                
            }
            if(info.file.response &&info. file.response.code != '200'&& info.file.status == 'done'){
              this.warn('图片上传失败')
            }
        }else if (info.file.status === 'error') {
            this.warn('图片上传失败')
        }
    },
    //表情popover显示隐藏
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
        this.emoji+=emoji.emoji;
        document.execCommand("insertText",false,emoji.emoji);
    },
    //chatModal显示
    showModal() {
      this.visible = true;
    },
    
    handleCancel(e) {
      this.$emit('search',true)
    },
    handleOk(e) {
        if (!this.emoji) {
          this.warn('请输入消息')
          return;
        }
        this.selectEmojiStatus=false;
        if(this.emoji||this.emoji!==""){
          this.chatContent.push({sendContent:this.emoji});
        }
        //有文字、表情、图片就发过来消息
        if(this.emoji){
          this.chatContent.push({acceptContent:this.acceptChat[this.random(0, 5)]});
        }
        this.sendStatus=this.random(0, 5);
        this.emoji="";
        this.$refs.divE1.innerHTML="";
    },
  }
}
</script>
<style scoped lang='less'>
     .chatModal{
        .selectNone{
          user-select:none;
        }
         .margin-left-16{
             margin-left: 16px;
         }
         .sendImg{
           text-align: justify;
           display: contents;
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

/**
 * 
 *
 */
import protoRoot from '@/proto/proto'
const CommonHeader = protoRoot.lookup('RequestChatProtocol.CommonHeader')
const RequestChatProtocol = protoRoot.lookup('RequestChatProtocol')
const ackToken = protoRoot.lookup('RequestAuthenticationProtocol')
const RequestSubscribeProtocol = protoRoot.lookup("RequestSubscribeProtocol")
//1.4消息协议
const RequestMessageProtocol = protoRoot.lookup("RequestMessageProtocol")
//2返回协议
//2.1返回协议头
const ResponseChatProtocol = protoRoot.lookup("ResponseChatProtocol")
//2.2接收消息协议
const ResponseMessageProtocol = protoRoot.lookup("ResponseMessageProtocol");
// 请求websocket
var websocket = null

//心跳间隔时间
var HeartbeatInterval = 15000
var LastTime = null
var AckStatus = false
var wsStatus = false
var HeartBeatTimer = null
var uid = '10086'


/**
 * @description 转换UUID
 * @param {String} getUUID 
 */

export function getUUID(id) {
    const uuidv1 = require('uuid/v1')
    const uuid = uuidv1(id)
    // let data = uuid;
    // data = data.replaceAll("-", "");
    return uuid
}

/**
 * @description 鉴权
 * @param {String} getAuthentication 
 */
export function getAuthentication(userid) {
    var data = {
        Command: '1',
        SeqId: getUUID(12),
        Version: 'V1.0',
        FromUid: userid
    }
    let token = '测试令牌'
    let tkdata = ackToken.create(token)
    var requestChatProtocol = {
        Header: data,
        Body: ackToken.encode(tkdata).finish()
    }

    let wsdatas = RequestChatProtocol.create(requestChatProtocol)

    let encodeData = RequestChatProtocol.encode(wsdatas).finish()
    console.log(encodeData, 'encodeData')
    return encodeData
}
/**
 * @description 心跳
 * @param {String} getHeartBeat 
 */
export function getHeartBeat(userid) {
    var data = {
        Command: '2',
        SeqId: getUUID(2),
        Version: 'V1.0',
        FromUid: userid
    }
    var requestChatProtocol = {
        Header: data,
        Body: null
    }
    let wsdatas = RequestChatProtocol.create(requestChatProtocol)
    return RequestChatProtocol.encode(wsdatas).finish()
}

/**
 * @description 心跳
 * @param {String} HeartBeat 
 */
export function HeartBeat() {
    var tempWsStatus = false
    var LastTimeOut = HeartbeatInterval * 5
    var Last = new Date().getTime() - LastTime.getTime()
    if (Last >= LastTimeOut) {
        tempWsStatus = true
        console.log(LastTime, '服务器异常连接超时:' + Last)
    } else if (wsStatus == false) {
        var Last = new Date().getTime() - LastTime.getTime()
        if (Last >= HeartbeatInterval) {
            tempWsStatus = true
        }
    }
    if (tempWsStatus) {
        console.log('服务器重连:' + new Date())
        websocketInit(uid)
    } else if (AckStatus == false) {
        send(getAuthentication(uid))
    } else if (wsStatus) {
        send(getHeartBeat(uid))
    }
}



/**
 * @description 发送消息
 * @param {String} setMessage 
 */
export function setMessage(Content,ToUid) {
    let data = {
        From: uid,
        To: ToUid,
        Type: 1,
        BusinessType: 1,
        Content: Content
    }
    let header = {
        Command: '4',
        SeqId: getUUID(12),
        Version: 'V1.0',
        FromUid: uid
    }
    let msgCreate = RequestMessageProtocol.create(data)
    var requestChatProtocol = {
        Header: header,
        Body: RequestMessageProtocol.encode(msgCreate).finish()
    }
    let wsdatas = RequestChatProtocol.create(requestChatProtocol)
    send(RequestChatProtocol.encode(wsdatas).finish())

}

/**
 * @description 连接websocket
 * @param {String} websocketInit 
 */
export function websocketInit(userid) {
    let responseChat = null
    websocket = new WebSocket('ws://192.168.0.22:19999/chat')
    websocket.binaryType = 'arraybuffer'
    websocket.onopen = function () {
        console.log('连接成功');
        wsStatus = true
        //连接成功鉴权
        setProcessor();
    }
    // 接收到消息的回调方法
    websocket.onmessage = function (res) {
        var responseChat = decodeData(ResponseChatProtocol, res.data)
        console.log(responseChat, "返回:" + new Date());
        var header = responseChat.Header
        if (header.Status == 3) {
            AckStatus = false;
            console.log(AckStatus, "鉴权状态:" + header.Message);
        } else {
            switch (header.Command) {
                case 1:
                    if (header.Status == 1) {
                        AckStatus = true;
                    } else {
                        AckStatus = false;
                        console.log(AckStatus, "鉴权状态");
                    }
                    // document.getElementById("jq").innerHTML = "鉴权:" + AckStatus;
                    console.log(AckStatus, "鉴权状态");
                    break;
                case 2:
                    LastTime = new Date();
                    // document.getElementById("xt").innerHTML = "心跳时间:" + LastTime.Format("yyyy-MM-dd hh:mm:ss");
                    console.log(LastTime, "心跳时间");
                    break;
                case 4:
                    console.log(responseChat.Body)
                    var rmp = decodeData(ResponseMessageProtocol, responseChat.Body)
                    // document.getElementById("msg").innerHTML =
                    //     document.getElementById("msg").innerHTML + "<li>" +
                    //     rmp.Time + "  【" + rmp.From + "】发送给【" + rmp.To + "】消息： " + rmp.Content+ "</lo>";
                    break;
                case 5:
                    document.getElementById("msg").innerHTML =
                        document.getElementById("msg").innerHTML + "<li>" +
                        header.TerverTime + "  【" + header.Status + "】【" + header.SeqId + "】消息反馈 " + header.Message + "</lo>";
                    console.log(LastTime, "心跳时间");
                    break;
                default:
                    console.log(header.Command, "协议未知");
                    break;
            }
        }
    }

    // 连接关闭的回调方法
    websocket.onclose = function () {
        console.log("连接关闭");
        wsStatus = false;
    }
    LastTime = new Date();
}

// /**
//  * @description 关闭websocket
//  * @param {String} closeWebsocket 
//  */
// export function closeWebsocket(ackStatus, lastTime) {
//     AckStatus = ackStatus;
//     LastTime = lastTime;
//     websocket.onclose = function () {
//         wsStatus = false
//     }
// }

/**
 * @description 解码
 * @param {String} decodeData 
 */
export function decodeData(protocol, data) {
    let array = Array.prototype.slice.call(new Uint8Array(data));
    let protocolDecode = protocol.decode(array);
    return protocolDecode
}



/**
 * @description 发送消息
 * @param {String} decodeData 
 */
export function send(data) {
    console.log(data, '发送数据')
    if(websocket){
        websocket.send(data)
    }else{
        console.log('请链接服务！')
    }
   

}

function setProcessor() {
    send(getAuthentication(uid));
    if (HeartBeatTimer == null) {
        HeartBeatTimer = window.setInterval(function () {
            HeartBeat();
        }, HeartbeatInterval)
    }
}




import { message } from 'ant-design-vue';

//延迟0.5秒
// const duration=0.5;

function getmsg(e){
    var msg = '';
    if (e.hasOwnProperty("message"))
    {
        msg = e.message;
    }
    else if (e.hasOwnProperty('data'))
    {
        msg= e.data.msg;
    }
    else
        msg = e;
    return msg;
}



function install(Vue, options) {
    Vue.prototype.error = (err,func)=>{

       var msg =  getmsg(err);
        //错误控制台输出
        if (typeof(func) =='undefined')
        {
            message.error(msg);
        }
        else
            message.error(
                msg,
                0.5,
                func
            )
    };

    Vue.prototype.warn = (msg,func)=>{

        var msg =  getmsg(msg);
        console.warn(msg);
        if (typeof(func) =='undefined')
            message.warning(msg);
        else
            message.warning(
                msg,
                0.5,
                func
            )

    };
    Vue.prototype.success = (msg,func)=>{
        var msg =  getmsg(msg);
        if (typeof(func) =='undefined')
            message.success(msg);
        else
            message.success(
                msg,
                0.5,
                func
            )
    };
};
export default install;

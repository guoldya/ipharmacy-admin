<template>
    <div>
        <a-select
                dropdownMatchSelectWidth
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                optionLabelProp="title"
                style="width: 500px"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                :filterOption="false"
                @dropdownVisibleChange="dropdownChange"
                @search="fetchResult"
                @dropdownRender="dropdownRender"
                @select="select"
        >
            <a-select-option
                    v-for="item in demoData"
                    :key="item.value"
                    :title="item.label"
                    :value="item.value">
                <span style="float: left" v-html="item.text"></span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value}}</span>
            </a-select-option>
            <a-select-option disabled key="all" class="show-all">
                <a
                        href="https://www.google.com/search?q=antd"
                        target="_blank"
                        rel="noopener noreferrer"
                >
                    查看所有结果
                </a>
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
    const demoData= [{
        value: '选项1',
        label: '黄金糕黄',
        text:"黄金糕黄"
    }, {
        value: '选项2',
        label: '双皮奶',
        text:"双皮奶"
    }, {
        value: '选项3',
        label: '蚵仔煎',
        text:"蚵仔煎"
    }, {
        value: '选项4',
        label: '龙须面',
        text:"龙须面"
    }, {
        value: '选项5',
        label: '北京烤鸭',
        text:"北京烤鸭"
    }];
    const demoData2= [{
        value: '选项2',
        label: '双皮奶'
    }];


    export default {
        data() {
            this.data = demoData;
            return {
                demoData,
                jsonData:JSON.stringify(demoData)
            }
        },
        methods: {
            handleChange (value,option) {
                console.log(`selected ${value}`)
                //console.log(`option ${option}`)
            },
            handleBlur() {
                //console.log('blur');
            },
            handleFocus() {
                //console.log('focus');
            },
            fetchResult (value) {
                const PinyinMatch = require('pinyin-match')
                if (value)
                {
                    this.demoData = JSON.parse(this.jsonData);
                    this.copyData =[];
                    this.copyData= this.data.concat();
                    //console.log(this.copyData)
                    var result = []
                    this.copyData.forEach(i=>{
                        i.text = i.label
                        var m = PinyinMatch.match(i.label,value)
                        if (m)
                        {
                            console.log(`m ${m}`)
                            i.text = this.hightlight(i.text,m[0],m[1])
                            result.push(i)
                        }
                    })
                    this.demoData = result;
                }
                else
                {
                    this.demoData= JSON.parse(this.jsonData);
                }
            },
            dropdownChange(open)
            {
                console.log(`open ${open}`);
            },
            select(value,option)
            {
                this.demoData= JSON.parse(this.jsonData);
            },
            filterOption(input, option) {
                //  console.log('option')
                // console.log(option.componentOptions)
                // console.log('chilren')
                //  console.log(option.componentOptions.children[0])

                console.log(`option ${option}`)
                //const PinyinMatch = require('pinyin-match');
                if (input)
                {
                    // var markInstance = new Mark(document.querySelector(".context"))
                    // console.log(markInstance)
                    // markInstance.unmark({
                    //   done: function(){
                    //     markInstance.mark(input)
                    //   }
                    // })

                    // $('.context').unmark({
                    //   done: function() {
                    //     $('.context').mark(input)
                    //   }
                    // })



                    //console.log(option.componentOptions.children[0].elm.innerHTML)
                }
                //return option.componentOptions.children[0].data.attrs.spellcode.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            dropdownRender(menuVode,props)
            {
                console.log(`menuVode ${menuVode}`);
                console.log(`props ${props}`);
            },
            hightlight(str, start ,end) {
                return str.substring(0, start) + '<span class="highlight">' + str.substring(start, end + 1) + '</span>' + str.substring(end + 1)
            }

        }
    }
</script>

<style>
    .highlight {
        background-color: yellow;
    }

</style>
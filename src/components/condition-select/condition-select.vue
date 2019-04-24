<template>
  <div>
    <div v-for="(cd,index) in conditions" class="margin-top-10">
      <a-row>
        <a-col :span="7"></a-col>
        <a-col :span="4">
          <a-select class="width-100" v-model="cd.val">
            <a-select-option
              v-for="item in levelData"
              :value='item.id'
              :key="index"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="2">
          <a-select class="width-100 margin-left-5" v-model="cd.calculate">
            <a-select-option
              v-for="item in classData"
              :value='item.id'
              :key="index"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <!--文本输入框-->
          <a-input v-if="cd.val==1" class="width-100 marLeft10" v-model="cd.value"></a-input>
          <!--下拉框-->
          <a-select :mode="selectMode" maxTagPlaceholder="..." :maxTagCount="2" v-else-if="cd.val==2"
                    class="width-100 marLeft10" v-model="cd.list">
            <a-select-option
              v-for="item in classData"
              :value='item.id'
              :key="index"
            >
              {{item.text}}
            </a-select-option>
          </a-select>
          <!--日期框-->
          <a-date-picker class="width-100 marLeft10" v-else-if="cd.val==3" v-model="cd.value"></a-date-picker>
          <!--日期范围-->
          <a-range-picker class="width-100 marLeft10" v-else-if="cd.val==6" v-model="cd.list"/>
          <!--数字范围-->
          <div v-else-if="cd.val==4" class="width-100 marLeft10">
            <a-input-number v-model="cd.value" style="width:44%"></a-input-number>
            <span>~</span>
            <a-input-number v-model="cd.valueTwo" style="width:44%"></a-input-number>
          </div>
          <!--默认为输入框-->
          <!--<a-input v-else class="width-100 marLeft10" v-model="cd.value"></a-input>-->
        </a-col>
        <a-col :span="1">
          <a-icon class="iconStyle" @click="deleteCon(index)" type="minus-circle" theme="filled"/>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'condition-select',
    props: {
      conditions: {
        type: Array,
        required: true
      },
      classData:{
        type: Array,
        required: true
      },
      levelData:{
        type: Array,
        required: true
      },
      deleteCon:{
        type:Function,
        required: true
      }
    },
    data(){
      return{
        selectMode:'tags',
      }
    }
  }
</script>

<style scoped>

</style>
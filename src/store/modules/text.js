export default {
  namespaced: true,
  state: { name: 'pake',age:22,height:80 },
  getters: {
    names: state => {
      return state.age + 'ddd'
    }
  },
  mutations:{
    decrement:(state)=>{
      setTimeout(() => {
        state.age++
      }, 1000)  
    },
    reduces(state){
      state.age--
      setTimeout(() => {
        state.age--
      }, 2000)  
    },
  }
}

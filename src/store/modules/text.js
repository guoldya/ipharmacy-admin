export default {
  namespaced: true,
  state: { name: 'pake',age:22,height:80 },
  getters: {
    names: state => {
      return state.age + 'ddd'
    }
  },
  mutations:{
    decrement(state){
      state.age++
    }
  }
}

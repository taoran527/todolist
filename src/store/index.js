import Vue from 'vue'
import vuex from 'vuex'
import mutations from './mutation'
import localstore_s from '../localstore.js'
// 引入 axios
import axios from 'axios'
Vue.use(vuex);

// const state = {
//   offset:0
// }
export default new vuex.Store({
  state:{
    // offset:localstore_s.fetch("offset"),
    offset:0,
    recordNum:localstore_s.fetch("recordNum")
  },
  mutations,
  actions:{
    // // 封装一个 ajax 方法
    // saveForm (context) {
    //   axios({
    //     method: 'post',
    //     url: '/user',
    //     data: context.state.test02
    //   })
    // }
  }
})

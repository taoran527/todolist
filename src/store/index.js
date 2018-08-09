import Vue from 'vue'
import vuex from 'vuex'
import mutations from './mutation'
import localstore_s from '../localstore.js'
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
  mutations
})

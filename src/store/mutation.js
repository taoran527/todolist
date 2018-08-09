import * as types from './mutation-types'
import localstore_m from '../localstore.js'
export default {
// 分页 上一页
  [types.PRE_PAGE] (state, offset) {
    state.offset -= offset;
    localstore_m.save("offset",state.offset);
  },
// 分页 下一页
  [types.NEXT_PAGE] (state, offset) {
    state.offset += offset
    localstore_m.save("offset",state.offset);
  },
// 分页 跳转到指定页码
  [types.GO_PAGE] (state, offset) {
    state.offset = offset
    localstore_m.save("offset",state.offset);
  },
  //记录的总数
  [types.RECORD_NUM](state,length){
    state.recordNum = length;
    localstore_m.save("recordNum",state.recordNum);
  }
};

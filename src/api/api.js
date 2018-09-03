import axios from 'axios'
import qs from 'qs'
//延时设置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.params = {}
// POST传参序列化
axios.interceptors.request.use((config) => {
  // if (config.method === 'post') {
  //     config.data = qs.stringify(config.data)
  // }
  let URL = config.url.split(config.baseURL)
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
  //console.log(res)
  return res
}, (error) => {
  return Promise.reject(error)
})


//封装获取数据
export const oGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(res => {
        resolve(res.data)
        console.log(res);
      }, err => {
        reject(err)
      }).catch(err => {
      reject(err)
    })
  })
};
//封装发送数据
export const oPost = (url, params) => {
  return new Promise((resolve, reject) => {
    var data = qs.stringify(params,{ indices: false });
    axios.post(url, data).then(res => {
        console.log(res);
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
      reject(err)
    })
  })
}
//封装更新数据
export const oUpdate = (url ,params) => {
  return new Promise((resolve , reject) => {
    axios.patch(url , qs.stringify(params,{ indices: false }))
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
      reject(err)
    })
  })
}
//封装删除数据
export const oRemove = (url , params) => {
  return new Promise((resolve,reject) => {
    axios.delete(url,params)
      .then(res => {
        resolve(res.data)
      },err => {
        reject(err)
      }).catch(err => {
      reject(err)
    })
  })
}

export default {

  //获取用户数据
  _get () {
    return oGet('api/selectAll');
  },

  //新建用户
  _post (params) {
    return oPost('api/insert',params);
  },

  //更新用户数据
  _update (params) {
    return oUpdate('api/update', params);
  },

  //删除单个用户
  _remove(user){
    var userid = user.id;
    return oRemove('api/delete'+ userid);

  },

  //批量删除
  _removes(){
    var ids = [];
    $.each(this.selected, (i, user) => {
      ids.push(user.id);
    });
    ids = ids.join(",");
    return oRemove('api/delete'+ids);
  },
}

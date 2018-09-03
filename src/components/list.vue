<template>
<div id="todo" class="todo">
  <header>
    <h1>TodoList</h1>
    <input type="text" placeholder="What needs to be done?" @keyup.enter="add($event)" v-model="thing"/>
  </header>
  <div class="content">
    <div class="all">
      <input type="checkbox" @change="select_all($event)" v-model="selectAll"/>
      <label style="margin-right: 10px">Mark all as complete</label>
      <div class="reverse" @click="reversefun">Reverse</div>
    </div>
    <div class="item" >
      <ul v-for="(item,index) in showPeople">
        <li v-bind:id="(getindex+index)" @dblclick="edit(getindex+index)" v-bind:class="{editli:editItem === getindex+index}">
          <div class="showItem" >
            <input type="checkbox" v-model="checkItem" @change="singleChecked(item.id,getindex+index)" :value="item.id"/>
            <label v-bind:class="{delete: item.state}">{{item.name}}</label>
            <a class="del" @click="del(item.id,getindex+index)"></a>
          </div>
          <input type="text" class="editItem" v-show="editItem === getindex+index" v-model="newname" @keyup.enter="updatename(getindex+index)"   v-focus="focusState" @focus="focus($event)" v-on:blur="test"/>
        </li>
      </ul>
    </div>
    <div style="width: 100%" v-show="isPage"><page></page></div>
  </div>
  <footer>
    <div class="item_keep">
      <span>{{left}}</span>
      <label>items left</label>
    </div>
    <div class="clear" @click="delsome">
      Clear {{delList}} completed items
    </div>
  </footer>
</div>
</template>

<script>
  import localstore_l from '../localstore.js'
  import page from './page.vue'
  import api from '../api/api.js'
    export default {
      data(){
        return {
          isPage:false,
          //反选
          reverse:false,
          id:localstore_l.fetch("id"),
          //单个是否为选中状态：
          flag:false,
          focusState:true,
          //删除线
          editItem:'',
          //临时id
          tempid:"",
          //临时名字
          newname:"",
          //全选框
          selectAll:localstore_l.fetch("selectAll"),
          //单选按钮是否勾选
          // checkItem:[],
          checkItem:localstore_l.fetch("checkItem"),
          thing: "",
          //false是未完成状态，初始化都是未完成的状态
          // peoples: [{id:"1",name:"小鬼王",state:false},{id:'2',name:"沈巍",state:false},{id:'3',name:"沈教授",state:false},{id:'4',name:"朱一龙",state:false}],
          // peoples: localstore_l.fetch("peoples")
          //存放record
          peoples:[],
          //创建record
          create:{},
          update:{},
        }
      },
      //组件
      components: {
        'page': page,
      },
      computed:{
        //显示的数据数组
        showPeople(){
          var arr = [];
          var off = this.$store.state.offset;
          this.peoples.forEach((value,index)=>{(index>=off && index< off+5)&&arr.push(value)});
          // arr = this.peoples.slice(off,5+off);
          // console.log("computed arr", arr);
          // console.log(this.peoples, off);
          // console.log(this.peoples.length)
          // console.log(this.getindex);
          return arr;
        },
        //数组索引
        getindex:function(){
          return this.$store.state.offset;
        },
        left:function () {
          return this.peoples.filter(function(item){
            //状态为false代表未完成，即剩下的项目
            return !item.state
          }).length;
        },
        delList:function () {
          return this.peoples.filter(function(item){
            //状态为true代表已完成，需要删除
            return item.state
          }).length;
        }
      },
      directives: {
        focus: {
          update: function (el, {value}) {
            if (value) {
              el.focus()
            }
          }
        }
      },
      created: function () {
        this.getRecord();
        this.showPage();
        // localStorage.clear();
      },
      watch: {//深度 watcher
        checkItem: {
          handler: function (val) {
            this.judgeLength();
            // console.log(val);
            localstore_l.save("checkItem",val);
          },
          deep: true
        },
        peoples:{
          handler:function (val,oldVal) {
            this.judgeLength();
            localstore_l.save("peoples",val);
            // console.log(this.peoples.length)
            this.$store.commit('RECORD_NUM',this.peoples.length );
            // console.log(this.$store.state.recordNum);

            this.showPage();
          },
          deep:true
        },
        id:{
          handler:function (val,oldVal) {
            localstore_l.save("id",val);
          },
          deep:true
        },
        selectAll:{
          handler:function (val,oldVal) {
            localstore_l.save("selectAll",val);
          },
          deep:true
        }
      },

      methods: {
        //判断是否显示页码
        showPage(){
          if (this.peoples.length>5){
            this.isPage = true;
          } else{
            this.isPage = false;
          }
        },
        getRecord(){
          api._get().then(res =>{
            this.peoples = res;
          },err =>{
            console.log(err);
          })
        },
        // 添加项目
        add(){
          var thing = this.thing;
          if(thing === ''){
            alert("请输入代办项目！");
          }else{
            // this.peoples.unshift({id:this.id++,name:thing,state:false});
            this.create = {id:this.id++,name:thing,state:false};
            // var params = new URLSearchParams();
            // params.append("id",this.id++);
            // params.append("name",thing);
            // params.append("state",false);
            // console.log(params);
            api._post(this.create).then(res=>{
              console.log(this.peoples);
              this.getRecord();
              console.log(this.peoples);
            })
            this.thing = '';
          }
          this.$store.commit('GO_PAGE',0 );
          // console.log(this.$store.state.offset);
        },
        //单个删除项目
        del(value,index){
          this.peoples.splice(index,1);
          var n = this.checkItem.indexOf(value);
          if (n != -1){
            this.checkItem.splice(n,1);
          }
        },
        //批量删除
        delsome(){
          for (var i = 0;i<this.peoples.length;i++){
            if (this.peoples[i].state === true){
              this.peoples.splice(i,1);
              i--;
            }
          }
          //选中的项目设置为空
          this.checkItem=[];
        },
        //单选将本条的状态改编为true
        singleChecked(value,index){
          if(this.checkItem.indexOf(value)!=-1){
            this.peoples[index].state = true;
          }else{
            this.peoples[index].state = false;
          }
        },
        //全选和全不选
        select_all(e){
          //只要是点击全选或者非全选就清空checkItem
          this.checkItem = [];
          if (this.selectAll===true){//全选框为选中的状态
            this.peoples.forEach(function (value,index) {
              //选择框
              this.checkItem.push(value.id);
              //样式以及完成的状态
              this.peoples[index].state = true;
            },this)
          }else {//全选框为未选中的状态
            this.peoples.forEach(function (value,index) {
              this.peoples[index].state = false;
            },this)
          }
        },
        //反选
        reversefun(){
          // console.log("hey"+this.checkItem);
          this.peoples.forEach(function (value,index) {
             var flag = this.checkItem.indexOf(this.peoples[index].id);
              if (this.peoples[index].state === true){
                this.peoples[index].state = false;
                this.checkItem.splice(flag,1);
              }else{
                console.log(1);
                this.peoples[index].state = true;
                this.checkItem.push(this.peoples[index].id);
              }
            },this);
          // console.log("byb"+this.checkItem);
        },
        //编辑项目
        edit(index){
          this.editItem = index;
          this.tempid = this.peoples[index].id;
          //输入框内带入名字
          this.newname = this.peoples[index].name;
          this.focusState = true;
          //如果在checkItem中存在就删除，设置flag为true记录为存在
          if (this.peoples[index].state){
            this.flag = true;
            this.checkItem.splice(this.checkItem.indexOf(this.tempid),1);

          }
        },
        //更新名字
        updatename(index){
          //li恢复原状
          this.editItem = "";
          if (this.newname ===''){
            this.del(this.peoples[index].id,index);
          }else{
            //更新people中的数据
            // this.peoples[index].name = this.newname;
            this.update = {id:this.peoples[index].id,name:this.newname,state:this.peoples[index].state};
            api._update(this.update).then(res=>{
              console.log(res);
            });
            this.getRecord();
            // 如果是已经选中的状态就变成选中状态，如果非选中状态不执行
            if (this.peoples[index].state){
              //判断是否在已选中数组中，在则不push，不在则push，因为是id，不需要考虑重复的情况
              if (this.checkItem.indexOf(this.peoples[index].id)===-1){
                this.checkItem.push(this.peoples[index].id);
                // console.log(this.checkItem);
              }
            }
          }
        },
        //获取焦点
        focus(event) {
          event.currentTarget.select();
        },
        //判断people和item是否是相等长度
        judgeLength(){
          if (this.peoples.length===0){
            this.selectAll = false;
          } else{
            if (this.checkItem.length === this.peoples.length) {
              this.selectAll=true;
            }else{
              this.selectAll=false;
            }
          }
        },
        test() {
          console.log("on blur");
          this.editItem = 10000;
        }
      }
    }
</script>

<style scoped>
  *{margin: 0;padding: 0}
  /*整体*/
  .todo{
    width: 600px;
    height: auto;
    background-color: #fff;
    box-shadow: 1px 1px 5px;
    border: 1px solid #c9c9c9;
    border-radius: 5px;
    margin: 0 auto;
    font-family: "微软雅黑";
    color: black;
    position: relative;
  }
  /*头部*/
  header{
    padding: 20px 20px 0;
  }
  header input{
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #a5a5a5;
    font-size: 24px;
    line-height: 1.5em;
    outline: none;
    padding: 5px;
    margin-top: 10px;
  }
  input::-webkit-input-placeholder{
    font-style: italic;
  }

  /*内容部分*/
  .content{
    padding: 20px;
    text-align: left;
  }
  .content .reverse{
    display: inline-block;
    background-color: #c5c5c5;
    text-align: center;
    padding: 3px 10px;
    border-radius: 50px;
    cursor: pointer;
  }
  .content .all{
    margin-bottom: 15px;
  }
  .content .item ul{
    list-style: none;
    font-size: 24px;
  }
  .content .item ul li{
    border-bottom: 1px solid #a3a3a3;
    padding: 15px 0;
    position: relative;
    height: 37px;
  }
  .content .item ul .editli{
    border: 1px solid #a3a3a3;
    box-shadow:1px 1px 3px #c8c8c8 inset;
    padding: 15px ;
    height: 40px;
    overflow: hidden;
  }
  .content .item ul li .editItem{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 15px;
    font-size: 24px;
    box-shadow:1px 1px 3px #c8c8c8 inset;
    border: none;
  }
  .content .item ul li .delete{
    text-decoration: line-through;
    color: #707070;
  }
  /*删除按钮*/
  .content .item ul li .del{
    display: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: url("../assets/destroy.png") no-repeat 0 0 ;
    cursor: pointer;
    position: absolute;
    top: 25px;
    right: 7px;
  }
  .content .item ul li .del:hover{
    background-position: 0 -20px;
  }
  .content .item ul li:hover a{
    display: inline-block;
  }

  /*尾部*/
  footer{
    background-color: #f4fce8;
    padding: 10px 20px;
    text-align: left;
    font-size: 14px;
    color: #7e7e8a;
  }
  footer .item_keep{
    display: inline-block;
  }
  footer .item_keep span{
    font-weight: bold;
    color: #625f62;
  }
  footer .clear{
    float: right;
    font-size: 12px;
    background-color: #d0d6c4;
    line-height: 23px;
    height: 23px;
    padding: 0 10px;
    border-radius: 20px;
    cursor: pointer;
  }
</style>

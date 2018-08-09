<template>
    <div class="page">
      <div class="pre-page" v-show="prepage" @click="goPrePage"><a>上一页</a></div>
      <ul class="pages">
        <li v-for="item in showPageBtn" @click="goPage(item)" v-bind:class="{choose: currentPage === item}">
          <a v-if="item" class="one-button" >{{item}}</a>
          <a v-else class="dot">...</a>
        </li>
      </ul>
      <div class="next-page" v-show="nextpage" @click="goNextPage"><a>下一页</a></div>
    </div>
</template>

<script>
    export default {
        name: "page",
      data(){
          return {
            //显示的页码数
            num:this.$store.state.recordNum,
            limit:5,
            //一行显示多少个页面
            pagenum:5
          }
      },
      // //计算属性
      computed:{
          //记录总数
        getrecord(){
          return this.$store.state.recordNum;
        },
          //总页数
        totalPage(){
          this.num = this.getrecord;
          console.log(this.num);
          //总记录数除以一页的记录数即为总页数，向上取整
          return Math.ceil(this.num/this.limit);
        },
        //页码偏移量
        offset(){
          //初始化为0
          return this.$store.state.offset;
        },
        //当前页面
        currentPage(){
          return Math.ceil(this.offset / this.limit) + 1;
        },
        //是否显示上一页
        prepage(){
          return this.offset !== 0 && this.num !==0;
        },
        //是否显示上下一页
        nextpage(){
          //位于第1页的时候offset是0，所以位于最后一页的时候offset是总数-一页的记录数
          return ((this.offset+this.limit) <this.num) && (this.num !==0);
        },
        //页码计算，控制显示的样式
        showPageBtn() {
          let pageNum = this.totalPage,
            index = this.currentPage,
            arr = [];
          //当前页码数小于指定的数值，直接显示全部的页码
          if (pageNum <= this.pagenum) {
            for(let i = 1; i <= pageNum; i++) {
              arr.push(i)
            }
            return arr
          }
          //设置为0 即显示...的位置
          //当前页码数是小于等于2的，那么...的位置显示在倒数第二位
          if (index <= 2) return [1,2,3,0,pageNum]
          //当前页码数是大于等于页码总数-1，那么...的位置显示在第二位
          if (index >= pageNum -1) return [1,0, pageNum -2, pageNum -1, pageNum]
          //当前页码数是等于的，那么...的位置显示在倒数第二位，多显示一个页码
          if (index === 3) return [1,2,3,4,0,pageNum]
          if (index === pageNum -2) return [1,0, pageNum-3, pageNum-2, pageNum-1, pageNum]
          return [1,0, index-1, index, index + 1, 0, pageNum]
        }
      },
      beforeUpdate:function () {

      },
      methods:{
        goPage(params) {
          //如果是当前页码不做处理
          if (params === this.currentPage) return;
          //当前偏移量 = （页码数-1）* 一页的记录数
          this.$store.commit('GO_PAGE', (params-1) * this.limit)
          this.$emit('getNew')
        },
        goPrePage() {
          //当前偏移量 - 一页显示的记录数
          this.$store.commit('PRE_PAGE', this.limit)
          this.$emit('getNew')
        },
        goNextPage() {
          //当前的偏移量 + 一页显示的记录数
          this.$store.commit('NEXT_PAGE', this.limit)
          this.$emit('getNew')
        }
      }
    }
</script>

<style scoped>
  .page{
    text-align: center;
    font-size: 15px;
    font-family: Arial;
    padding: 0;
  }
  /*上一页下一页*/
  .page .pre-page,.next-page{
    display: inline-block;
    border: 1px solid #e8e8e8;
    width: 50px;
    padding: 10px;
    vertical-align: center;
    border-radius: 4px;
    cursor: pointer;
  }
  .page .pre-page{
    margin-right: 20px;
  }
  .page .pre-page:hover,.next-page:hover{
    background-color: #00a1d6;
  }
  .page .next-page{
    margin-left: 20px;
  }
  /*所有页码*/
  .page .pages{
    display: inline-block;
    list-style: none;
    padding: 0;
  }
  .page .pages li{
    /*float: left;*/
    display: inline-block;
    width: 35px;
    height: 40px;
    margin: 0 7px;
  }
  .page .pages li a{
    display: inline-block;
    width: 35px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    cursor: pointer;
  }
  .page .pages li:hover a{
    background-color: #00a1d6;
  }
  .page .pages li.choose a{
    background-color: #00a1d6;
  }
  .page .pages li .dot{
    border: none;
    margin: 0;
    cursor: text;
  }
  .page .pages li:hover .dot{
    background-color: #fff;
  }
</style>

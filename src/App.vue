<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab boder-1px">

      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>

       <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>

       <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>

    </div>
  <keep-alive>
    <router-view :seller='seller'></router-view>
  </keep-alive>
    
  </div>
</template>

<script>
// import './common/scss/icon.scss';
import header from './components/header/header.vue';
import {urlParse} from './common/js/tools.js';

const ERR_OK=0;
export default {
  data(){
    return{
      seller:{
        id:(()=>{
          let queryParam=urlParse();
          // console.log(queryParam);
          return queryParam.id;
        })()
      }
    }
  },
  created() {
    
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;// 获取数据，object类型
     
      // 判断是不是成功拿到了数据
      if (response.errno === ERR_OK) {
        // 成功获取到数据，之后子组件header使用props接收数据，header组件进行渲染
        // this.seller = response.data;// 直接赋值会id丢失，this.seller.id=undefind
        this.seller = Object.assign({}, this.seller, response.data); // 对象合并
        // console.log(this.seller);
      }
    });
  },
  components: {
    'v-header': header
  },
}
</script>

<style lang="scss" scoped="" type="text/css">
@import './common/scss/border.scss';
@import './common/scss/icon.scss';
  .tab{
    display: flex;
    width:100%;
    line-height: 40px;
    height:40px;
    @include border-1px(rgba(7,17,27,0.1));
    .tab-item{
      flex:1;
      text-align: center;
      &>a{
        display: block;
        font-size: 14px;
        color:rgb(77,85,93);
        &.active{
          color:red;
        }
      }
    }
  }
</style>



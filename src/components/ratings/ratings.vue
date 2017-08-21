<template>
    <div class="ratings" ref="ratingsContent">
        <div class="ratings_content">
            <div class="overview">
                <div class="overview_left">
                    <h1 class="foodScore">{{seller.foodScore}}</h1>
                    <div class="title">综合平分</div>
                    <div class="rankRate">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview_right">
                    <div class="score_wrapper">
                        <span class="title">服务态度</span>
                        <v-star :size="36" :score="seller.score"></v-star>
                        <span class="score">{{seller.score}}</span>
                    </div>
                    <div class="score_wrapper">
                        <span class="title">服务态度</span>
                         <v-star :size="36" :score="seller.score"></v-star>
                        <span class="score">{{seller.score}}</span>
                    </div>
                    <div class="delivery_wrapper">
                        <span class="title">送达时间</span>
                        <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <v-split></v-split>
            <v-ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @isContent="isContent" @selRatings="filterRatings"></v-ratingselect>
            <div class="ratings_wrapper">
                <ul>
                    <li class="ratings_item border-1px" v-for="(ratingItem,index) in ratings" :key="index" v-show="showRatings(ratingItem.rateType,ratingItem.text)">
                        <div class="avatar">
                            <img  :src="ratingItem.avatar" width="28" height="28">
                        </div>
                        <div class="content">
                            <div class="username">{{ratingItem.username}}</div>
                            <div class="star_wrapper">
                                <v-star :size="24" :score="ratingItem.score"></v-star>
                                <span class="deliveryTime" v-show="ratingItem.deliveryTime">{{ratingItem.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{ratingItem.text}}</p>
                            <div class="recommend_wrapper">
                                <i class="icon" :class="{'icon-thumb_up':ratingItem.rateType===0,'icon-thumb_down':ratingItem.rateType===1}"></i>
                                <span class="text" v-for="(recommentendItem,index) in ratingItem.recommend" v-show="ratingItem.recommend && ratingItem.recommend.length" :key="index">{{recommentendItem}}</span>
                            </div>
                            <div class="rating_time">{{ratingItem.rateTime| formatDate('yyyy-MM-dd hh:mm')}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import BScroll from 'better-scroll';
    import star from '../star/star';
    import split from '../split/split';
    import ratingsselect from '../ratingsSelect/ratingsselect';
    import '../../common/js/formatdate.js';
    const ERROR_OK=0;
    const ALL=2;
    export default{
        name:'ratings',
        props:{
            seller:{
                type:Object
            },
        },
        data(){
            return{
                 ratings:[],
                 selectType:ALL,
                 onlyContent:true,
                 desc:{
                    all:'全部',
                    positive:'满意',
                    negative:"不满意"
                 }
            }   
        },
        components:{
            'v-star':star,
            'v-split':split,
            'v-ratingselect':ratingsselect
        },
        created(){
            this.$http.get('/api/ratings').then((response)=>{
                response=response.body;
               if(response.errno===ERROR_OK){
                    this.ratings=response.data;
                    // this.$nextTick(()=>{
                    //     this._initScroll();
                    // })
                     // console.log(response.data)
               }
            })
        },
        methods:{
            _initScroll(){
                this.scroll=new BScroll(this.$refs.ratingsContent,{
                    click:true
                })
            },
            showRatings(type,text){
                let date=new Date();
                let times=date.getTime();
                console.log(times);
                if(this.onlyContent && !text){
                    return false;
                }
                if(this.selectType===ALL){
                    return true;
                }else{
                    return this.selectType===type;
                }
            },
            isContent(bl){
                this.onlyContent=bl;
                this.$nextTick(()=>{
                    this.scroll.refresh();
                })
            },
            filterRatings(type){
                this.selectType=type;
                 this.$nextTick(()=>{
                    this.scroll.refresh();
                })
            },
            needShowList(type,text){
                if(this.onlyContent && !text){
                    return false;
                }
                if(this.selectType===ALL){
                    return true;
                }else{
                    return this.selectType===type;
                }
            }
        }
    }
</script>
<style type="text/css" scoped="" lang="scss">
    @import '../../common/scss/border.scss';
    @import '../../common/scss/icon.scss';
    .ratings{
        // position: fixed;
        top:175px;
        left:0;
        bottom: 0;
        width:100%;
        overflow: hidden;
        .overview{
            display: flex;
            padding: 18px 0;
            .overview_left{
                flex:0 0 137px;
                padding-bottom: 6px;
                width:137px;
                text-align: center;
                border-right: 1px solid rgba(7,17,27,0.3);
                @media only screen and (max-width:320px) {
                    flex:0 0 120px;
                    width:120px;
                }
                .foodScore{
                    font-size:24px;
                    color:rgb(255,153,0);
                    line-height:28px;
                    margin-bottom:10px;
                }
                .title{
                    font-size:12px;
                    line-height:12px;
                    color:rgb(7,17,27);
                    margin-bottom:8px;
                }
                .rankRate{
                    font-size:10px;
                    line-height:10px;
                    color:rgb(147,153,159);
                }
            }
            .overview_right{
                flex:1;
                padding:6px 0 0 24px;
                font-size:0;
                @media only screen and (max-width:320px){
                    padding:12px;

                }
                .score_wrapper{
                    margin-bottom:8px;
                    .title{
                        font-size:12px;
                        display:inline-block;
                        line-height: 18px;
                    }
                    .star{
                        display:inline-block;
                        padding:0 12px;
                        vertical-align: top;
                        @media only screen and (max-width:320px){   
                            padding:0 6px;
                        }
                    }
                    .score{
                        display:inline-block;
                        font-size:12px;
                        line-height:18px;
                        color:rgb(255,153,0);
                    }
                }
                .delivery_wrapper{
                    margin-bottom: 6px;
                    font-size: 0;
                    .title,.deliveryTime{
                        font-size:12px;
                        line-height:18px;
                        padding-right:12px;
                    }
                    .deliveryTime{
                       color: rgba(7,17,27,0.5);
                    }
                }
            }
        }
        .ratings_wrapper{
            .ratings_item{
                padding:18px;
                display:flex;
                @include border-1px(rgba(7,17,27,0.3));
                .avatar{
                    flex:0 0 28px;
                    width:28px;
                    margin-right: 12px;
                    img{
                        border-radius: 50%;
                        background: red;
                    }
                }
            }
            .content{
                flex:1;
                position:relative;
                .username{
                    padding-bottom:8px;
                    font-size:10px;
                    line-height:12px;
                    color:rgb(7,17,27);
                }
                .star_wrapper{
                    font-size:0;
                    padding-bottom:6px;
                    .deliveryTime{
                        display:inline-block;
                        vertical-align:top;
                        font-size:10px;
                        font-weight:200;
                        line-height:12px;
                        color:rgb(147,153,159);
                    }
                   
                }
                .text{
                    font-size:12px;
                    line-height:18px;
                    color:rgb(7,17,27);
                    padding-bottom:8px;
                }
                .recommend_wrapper{
                    width:100%;
                    font-size:0;
                    .icon{
                        display:inline-block;
                        font-size:12px;
                        line-height:16px;
                        color:rgb(0,160,220);
                        margin:0 8px 6px 0;
                        &.icon-thumb_up{
                            width:16px;
                            height:16px;
                            background: url("../../assets/thumbselected.png") no-repeat;
                        }
                        &.icon-thumb_down{
                            width:16px;
                            height:16px;
                            background: url("../../assets/thumb.png") no-repeat;
                        }
                }

                    .text{
                        display:inline-block;
                        width:70px;
                        // height:20px;
                        box-sizing:border-box;
                        margin-right:8px;
                        margin-bottom: 5px;
                        padding:0 6px;
                        border:1px solid rgba(7,17,27,0.1);
                        border-radius:1px;
                        background:#fff;
                        text-align:center;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        font-size:9px;
                        line-height:16px;
                        color:rgb(147,153,159);
                    }
                }
                .rating_time{
                    position:absolute;
                    right:5px;
                    top:0;
                    display:inline-block;
                    font-size:10px;
                    font-weight:200;
                    line-height:12px;
                    color:rgb(147,153,159);
                }
            }
        }
    }
</style>
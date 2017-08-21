<template>
    <div class="goods">
        <div class="menu_wrapper" ref="menuWrapper">
            <ul>
                <li class="menu_item" v-for="(item,$index) in goods" :class="{'current':currentIndex===$index}"
                @click="selectMenu($index,$event)">
                    <span class="text border-1px">
                        <!-- <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span> -->
                        <v-iconClassMap v-show="item.type" :iconType="item.type"></v-iconClassMap>
                        {{item.name}}
                    </span>

                </li>
            </ul>
        </div>
        <div class="foods_wrapper" ref="foodWrapper">
            <ul>
                <li class="foods_list foods_list_hook" v-for="(item,$index) in goods" >
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li class="foods_item border-1px" v-for="(foodItem,$index) in item.foods" @click="selectFood(foodItem,$event)">
                            <div class="icon">
                                <img :src="foodItem.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{foodItem.name}}</h2>
                                <p class="desc">{{foodItem.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{foodItem.sellCount}}份</span>
                                    <span>好评率{{foodItem.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{foodItem.price}}</span>
                                    <span class="old">￥{{foodItem.oldPrice}}</span>
                                </div>
                                <div class="cartControl_wrapper">
                                    <v-cartControl :foodItem="foodItem"></v-cartControl>
                                </div>
                            </div>
                        </li>
                        
                    </ul>
                </li>
            </ul>
        </div>
        <v-shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></v-shopcart>
        <v-foodinfo :food="selectedFood" ref="foodinfo"></v-foodinfo>
    </div>
</template>
<script type="text/javascript">
	import BScroll from "better-scroll";
    import cartControl from '@/components/cartControl/cartControl';
    import iconClassMap from '@/components/iconClassMap/iconClassMap';
    import shopcart from "@/components/shopCart/shopcart";
    import foodinfo from "@/components/foodInfo/foodinfo";
    const ERR_OK=0;
    export default{
        name:'goods',
        props:{
        	seller:{
        		type:Object
        	}
        },
        data(){
            return{
                goods:[],
                selectedFood:{},
                scrollY:0,
                listHeight:[]
            }   
        },
        components:{
            'v-cartControl':cartControl,
            'v-iconClassMap':iconClassMap,
            'v-shopcart':shopcart,
            'v-foodinfo':foodinfo
        },
        created(){
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            this.$http.get('/api/goods').then(function(response){
                response=response.body;
                if(response.errno===ERR_OK){
                    this.goods=response.data;
                    this.$nextTick(()=>{
                    	this._initScroll();
                    	this._calculateHeight();
                    });
                }
            });
        },
         computed:{
            currentIndex(){
            	for(let i=0;i<this.listHeight.length;i++){
            		let currentHeight=this.listHeight[i];
            		let nextHeight=this.listHeight[i+1];
            		if(!nextHeight || (this.scrollY>=currentHeight && this.scrollY<nextHeight)){
            			return i;
            		}
            	}
            	return 0;
            },
            selectFoods(){
                let foods=[];
                this.goods.forEach((item)=>{
                    item.foods.forEach((food)=>{
                        if(food.count){
                            foods.push(food);
                        }
                    })
                })
                return foods;
            }

         },
         methods:{
         	_initScroll(){
                this.menuScroll=new BScroll(this.$refs.menuWrapper,{
                    click:true
                })
         		this.foodsScroll=new BScroll(this.$refs.foodWrapper,{
         			click:true,
         			probeType:3
         		}),
         		this.foodsScroll.on("scroll",(pos)=>{
         			this.scrollY=Math.abs(Math.round(pos.y));
         		})
         	},
         	_calculateHeight(){
         		let foodList=this.$refs.foodWrapper.getElementsByClassName("foods_list_hook");
         		let height=0;
         		this.listHeight.push(height);
         		for(let i=0;i<foodList.length;i++){
         			let item =foodList[i];
         			height+=item.clientHeight;
         			this.listHeight.push(height);
         		}

         	},
            selectMenu(index,event){
                let foodList=this.$refs.foodWrapper.getElementsByClassName("foods_list_hook");
                let el=foodList[index];
                this.foodsScroll.scrollToElement(el,300)
            },
            selectFood(food,event){
                this.selectedFood=food;
                this.$refs.foodinfo.initShow();
            }
         }
        
    }
</script>
<style scoped="" lang="scss" type="text/css">
    @import '../../common/scss/border.scss';
    @import '../../common/scss/icon.scss';
    .goods{
        display: flex;
        position: absolute;
        top: 175px;
        bottom: 48px;
        width:100%;
        overflow: hidden; 
        .menu_wrapper{
            flex:0 0 80px;
            width:80px;
            .menu_item{
                display:table;
                height:54px;
                width:56px;
                padding: 0 12px;
                line-height: 14px;
                margin: 0 auto;
                background-color: #f3f5f7;
                &.current{
                    margin-top:-1px;
                    z-index: 10;
                    background-color: #fff;
                    .text{
                        @include border-none();
                    }

                }
                .text{
                    display: table-cell;
                    vertical-align: middle;
                    font-size:12px;
                    @include border-1px(rgba(7,17,27,0.1));
                }
            }
        }
        .foods_wrapper{
            flex:1;
            .title{
                padding-left: 14px;
                height:26px;
                line-height:26px;
                border-left: 2px solid #d9dde1;
                font-size:12px;
                color:rgb(147,153,159);
                background-color:#f3f5f7;
            }
            .foods_item{
                display: flex;
                margin:18px 18px 0 18px;
                padding-bottom: 18px;
                @include border-1px(rgba(7,17,27,0.3));
                &:last-child{
                    @include border-none();
                }
                .icon{
                    flex:0 0 57px;
                    margin-right:10px;
                }
                .content{
                    flex:1;
                    .name{
                        font-size:14px;
                        line-height:14px;
                        height:14px;
                        margin:2px 0 8px 0;
                        color:rgb(7,17,27);
                    }
                    .desc,.extra{
                        line-height:10px;
                        font-size:10px;
                        color:rgb(147,153,159);
                    }
                    .desc{
                        line-height:12px;
                        margin-bottom: 8px;
                    }
                    .extra{
                        .count{
                            margin-right: 5px;
                        }
                    }
                    .price{
                        line-height:24px;
                        font-weight: 700px;
                        .now,.old{
                            line-height:24px;
                            margin-right:0;
                        }
                        .now{
                            font-size:14px;
                            font-weight:700px;
                            color:rgb(240,20,20);
                        }
                        .old{
                            font-size:10px;
                            color:rgb(147,153,159);
                            text-decoration:line-through;
                        }
                    }
                }
            }
        }
    }

</style>
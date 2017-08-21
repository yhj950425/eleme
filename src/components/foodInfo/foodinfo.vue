<template>
	<transition name="move">
		<div class="foodInfo" ref="foodInfo" v-show="showFlag">
			<div class="food_content">
				<div class="img_header">
					<img :src="food.image" alt="" class="img">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift">
							
						</i>
					</div>
				</div>
				<div class="content">
					<div class="title">{{food.name}}</div>
					<div class="extra">
						<span class="count">月售{{food.sellCount}}份</span>
						<span>好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartControl_wrapper">
						<v-cartControl :foodItem="food"></v-cartControl>
					</div>
					<transition name="addCartMove">
						<div class="addCartShop" @click="addFirst($event)" v-show="!food.count || food.count===0">加入购物车
						</div>
					</transition>
				</div>
				<v-split></v-split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<v-split v-show="food.info"></v-split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<v-ratingsselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selRatings="filterRatings" @isContent="isContent"></v-ratingsselect>
					<div class="ratings_wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li class="ratings_item border-1px" v-for="(ratingItem,index) in food.ratings" :key="index" v-show="needShowList(ratingItem.rateType,ratingItem.text)">
								<div class="rating_time">{{ratingItem.rateTime | formatDate("yyyy-MM-dd hh:mm")}}</div>
								<div class="user">
									<span class="name">{{ratingItem.username}}</span>
									<img class="avatar" width="12" height="12" :src="ratingItem.avatar"/>
								</div>
								<p class="text">
									<i class="icon" :class="{'icon-thumb_up':ratingItem.rateType===0,'icon-thumb_down':ratingItem.rateType===1}"></i>
									<span>{{ratingItem.text}}</span>
								</p>
							</li>
						</ul>
						<div class="no_ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script type="text/javascript">
	import split from '../split/split';
	import ratingSelect from "../ratingsSelect/ratingsselect";
	import cartControl from "../cartControl/cartControl";
	import Vue from "vue";
	import BScroll from 'better-scroll';
	import "../../common/js/formatdate.js";
	const ALL=2;
	export default {
		props:{
			food:{
				type:Object
			},
			ratings:[]
		},
		data(){
			return {
				showFlag:false,
				selectType:ALL,
				onlyContent:false,
				desc:{
					all:"全部",
					positive:"满意",
					negative:"不满意"
				}
			};
		},
		components:{
			"v-split":split,
			"v-ratingsselect":ratingSelect,
			'v-cartControl':cartControl
		},
		methods:{
			initShow(){
				// console.log(food)
				this.showFlag=true;
				this.selectType=ALL;
				this.onlyContent=false;
				this.$nextTick(()=>{
					if(!this.scroll){
						this.scroll=new BScroll(this.$refs.foodInfo,{
							click:true
						});
					}else{
						this.scroll.refresh();
					}
				})
			},
			hide(){
				this.showFlag=false;
			},
			addFirst(event){
				if(!event._constructed){
					return;
				}
				Vue.set(this.food,'count',1);
				this.$root.eventHub.$emit('cart.add',event.target);
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

		},
	}
</script>
<style type="text/css" scoped="" lang="scss">
	@import '../../common/scss/border.scss';
	.foodInfo{
		position: fixed;
		left:0;
		top:0;
		bottom:48px;
		z-index:30;
		width:100%;
		background:#fff;
		transition:all 0.3s;
		&.move-enter-active{
			transform:translate3d(0,0,0);

		}
		&.move-enter,&.move-leave-to{
			transform:translate3d(100%,0,0);
		}
		.img_header{
			position:relative;
			width:100%;
			height:0;
			padding-top: 100%;
			.img{
				position:absolute;
				top:0;
				left:0;
				width:100%;
				height: 100%;
			}
			.back{
				position:fixed;
				left:0;
				top:10px;
				.icon-arrow_lift{
					display: block;
					padding: 10px;
					font-size:20px;
					color:#fff;
					width:32px;
					height:32px;
					background: url("../../assets/left.png") no-repeat;
				}
			}
		}
		.content{
			position:relative;
			padding: 18px;
			.title{
				font-size:14px;
				line-height: 14px;
				margin-bottom: 8px;
				font-weight: 700;
				color:rgb(7,17,27);
			}
			.extra{
				margin-bottom: 18px;
				line-height: 10px;
				height:10px;
				font-size:10px;
				color:rgb(147,153,159);
				.count{
					margin-right: 12px;
				}
			}
			.price{
				line-height: 24px;
				font-weight:700;
				.now,.old{
					line-height: 24px;
					margin-right:0px;
				}
				.now{
					color:red;
				}
				.old{
					font-size:10px;
					color:rgb(147,153,159);
					text-decoration: line-through;
				}
			}
			.cartControl_wrapper{
				position:absolute;
				width:108px;
				right:12px;
				bottom:12px;
			}
			.addCartShop{
				position:absolute;
				right:16px;
				bottom:22px;
				z-index:10;
				padding: 0 12px;
				text-align: center;
				line-height:24px;
				height:24px;
				font-size: 10px;
				color:#fff;
				background:rgb(0,160,220);
				border-radius: 12px;
				box-sizing:border-box;
				transition:all 0.2s;
				&.addCartMove-enter-active{
					opacity: 1;
				}
				&.addCartMove-enter,&.addCartMove-leave-to{
					opacity:0;
				}
			}
		}
		
		.info{
			padding: 18px;
			.title{
				line-height: 14px;
				margin-bottom:16px;
				font-size:14px;
				font-weight:700;
				color:rgb(7,17,27);
			}
			.text{
				color:rgb(77,85,93);
				line-height: 24px;
				font-size:12px;
				font-weight:200;
				padding: 0 8px;
			}
		}
		.rating{
			padding-top:18px;
			.title{
				line-height: 14px;
				margin-left: 18px;
				font-size:14px;
				font-weight: 700;
				color:rgb(7,17,27);

			}
			.ratings_wrapper{
				padding: 0 18px;
				.ratings_item{
					position: relative;
					padding:16px 0;
					@include border-1px(rgba(7,17,27,0.1));
					font-size:0;
					.rating_time{
						display:inline-block;
						position:absolute;
						left:0;
						top:16px;
						font-size:10px;
						line-height:12px;
						color:rgb(147,153,159);
					}
					.user{
						display:inline-block;
						position:absolute;
						right:0;
						top:16px;
						line-height:12px;
						font-size:10px;
						color:rgb(147,153,159);
						.name{
							font-size:10px;
							line-height:12px;
							color:rgb(147,153,159);
							vertical-align: top;

						}
						.avatar{
							width:12px;
							height:12px;
							border-radius:50%;
							vertical-align:top;
						}
					}
					.text{
						font-size:12px;
						line-height: 24px;
						color:rgb(7,17,27);
						margin-top: 18px;
						.icon{
							width:16px;
							height:16px;
							margin-right: 4px;
							display:inline-block;
							z-index:1000;
							&.icon-thumb_up{
								width:16px;
								height:16px;
								background: url("../../assets/thumbselected.png") no-repeat;
								background-size: 16px 16px;
							}
							&.icon-thumb_down{
								width:16px;
								height:16px;
								background: url("../../assets/thumb.png") no-repeat;
								background-size: 16px 16px;
							}
						}
						span{
							vertical-align:top;
						}
					}
				}
			}
		}
	}
</style>
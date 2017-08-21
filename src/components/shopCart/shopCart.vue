<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="con_left">
				<div class="logo_wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}">
							
						</i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="con_right" @click.stop.prevent="pay">
				<div class="minPriceDesc" :class="isEnough">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball_container">
			<transition-group name="drop" @before-enter="beforeEnter" @enter ="enter" @after-enter="afterEnter">
				<div class="ball" v-for="(ball,index) in balls" v-show="ball.show" :key="index">
					<span class="inner inner_hook icon-remove_circle_outline"></span>
				</div>
			</transition-group>
		</div>
		<transition name="fold">
			<div class="shopCart_list" v-show="listShow">
				<div class="list_header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list_content" ref="listContent">
					<ul>
						<li class="food" v-for="(food,index) in selectFoods" :key="index">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price*food.count}}</span>
							</div>
							<div class="cartControl_wrapper">
								<v-cartControl :foodItem="food"></v-cartControl>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="maskMove">
			<div class="mask" v-show="listShow" @click.stop.prevent="hideList"></div>
		</transition>
		<div class="payMethods_wrapper" v-show="payMethodsShow">
			<div class="payMethods_contener">
				<div class="head">
					<h2 class="title">请选择支付方式</h2>
				</div>
				<div class="payMethods_list">
					<ul>
						<li class="payMethods">
							<input type="radio" name="paymethods">
							<i class="ico">
								<img src="">
							</i>
							<span class="info">微信支付</span>
						</li>
						<li class="payMethods">
							<input type="radio" name="paymethods">
							<i class="ico">
								<img src="">
							</i>
							<span class="info">支付宝</span>
						</li>
						<li class="payMethods">
							<input type="radio" name="paymethods">
							<i class="ico">
								<img src="">
							</i>
							<span class="info">信用卡支付</span>
						</li>
						<li class="payMethods">
							<input type="radio" name="paymethods">
							<i class="ico">
								<img src="">
							</i>
							<span class="info">网上银行</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="footer">
				<button class="payResult" @click="payResult">确认支付</button>
				<button class="back" @click="back">返回上一页</button>
			</div>
			
		</div>
	</div>
</template>
<script type="text/javascript">
import cartControl from '../cartControl/cartControl';
import BScroll from 'better-scroll';
	export default{
		props:{
			deliveryPrice:{
				type:Number,
				default:0
			},
			minPrice:{
				type:Number,
				default:0
			},
			selectFoods:{
				type:Array,
				default(){
					// return [{price:0,count:0}];
				}
			}

		},
		data(){
			return{
				balls:[
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					}
				],
				dropBalls:[],
				fold:true,
				payMethodsShow:false
			}
		},
		created(){
			this.$root.eventHub.$on('cart.add',this.drop);
		},
		components:{
			'v-cartControl':cartControl
		},
		computed:{
			totalPrice(){
				let total=0;
				this.selectFoods.forEach((item)=>{
					console.log(item)
					total+=item.price*item.count;
				});
				return total;
			},
			totalCount(){
				let count=0;
				this.selectFoods.forEach((item)=>{
					count+=item.count;
				});
				return count;
			},
			payDesc(){
				if(this.totalPrice===0){
					return '￥'+this.minPrice+'元起送';
				}else if(this.totalPrice<this.minPrice){
					let differPrice=this.minPrice-this.totalPrice;
					return '还差'+differPrice+'元起送';
				}else if(this.totalPrice>=this.minPrice){
					return '去结算';
				}
			},
			isEnough(){
				if(this.totalPrice<this.minPrice){
					return 'not-enough';
				}else{
					return 'enough';
				}
			},
			listShow(){
				if(!this.totalCount){
					this.fold=true;
					return false;
				};
				let show =!this.fold;
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll){
							this.scroll=new BScroll(this.$refs.listContent,{
								click:true
							});
						}else{
							this.scroll.refresh();
						}
					})
				}
				return show;
			}

		},
		methods:{
			drop(ele){
				// console.log(ele);
				for(let i=0;i<this.balls.length;i++){
					let ball=this.balls[i];
					if(!ball.show){
						ball.show=true;
						ball.el=ele;
						this.dropBalls.push(ball);

						return;

					}
				}
			},
			beforeEnter(ele){
				let len=this.balls.length;
				while(len--){
					let ball=this.balls[len];
					if(ball.show){
						let rect=ball.el.getBoundingClientRect();
						let x=rect.left-32;
						let y=-(window.innerHeight-rect.top-22);
						ele.style.display="";
						ele.style.webkitTransform='translate3d(0,'+y+'px,0)';
						ele.style.transform='translate3d(0,'+y+'px,0)';
						let inner=ele.getElementsByClassName("inner_hook")[0];
						inner.style.webkitTransform='translate3d(0,0,0)';
						inner.style.transform='translate3d(0,0,0)'
					}
				}
			},
			enter(ele){
				ele.offsetHeight;
				this.$nextTick(()=>{
					ele.style.webkitTransform='translate3d(0,0,0)';
					ele.style.transform='translate3d(0,0,0)';
					let inner=ele.getElementsByClassName('inner_hook')[0];
					inner.style.webkitTransform='translate3d(0,0,0)';
					inner.style.transform='translate3d(0,0,0)';
				})
			},
			afterEnter(ele){
				let ball=this.dropBalls.shift();
				if(ball){
					ball.show=false;
					ele.style.display="none";
				}
			},
			toggleList(){
				if(!this.totalCount){
					return;
				};
				this.fold=!this.fold;
				console.log(this.fold)
			},
			hideList(){
				this.fold=true;
			},
			empty(){
				this.selectFoods.forEach((food)=>{
					food.count=0;
				})
			},
			pay(){
				if(this.totalPrice===0){
					return;
				};
				this.payMethodsShow=true;
			},
			payResult(ele){
				alert("需支付"+this.totalPrice+"元");
			},
			back(){
				this.payMethodsShow=false;
			}
		}
	}
</script>
<style type="text/css" scoped="" lang="scss">
	@import '../../common/scss/border.scss';
	.shopcart{
		position: fixed;
		left:0;
		bottom:0;
		width:100%;
		height:48px;
		z-index:50;
		.content{
			display:flex;
			background: #141d27;
			color:rgba(255,255,255,0.4);
			.con_left{
				flex:1;
				font-size: 0;
				.logo_wrapper{
					display:inline-block;
					position: relative;
					top:-10px;
					margin:0 12px;
					padding: 6px;
					vertical-align: top;
					width:56px;
					height:56px;
					box-sizing: border-box;
					border-radius: 50%;
					background: #141d27;
					.logo{
						width:100%;
						height:100%;
						border-radius:50%;
						text-align: center;
						background: #2b343c;
						&.highlight{
							background: rgb(0,160,220);
							
						}
						.icon-shopping_cart{
							display:block;
							font-size:24px;
							color:#80858a;
							line-height: 48px;
							width:32px;
							height:32px;
							background: url("../../assets/cart.png") 2px 5px no-repeat;
							&.highlight{
								width:32px;
								height:32px;
								background: url("../../assets/cartselected.png") 2px 5px no-repeat ;
							}
						}
					}
					.num{
						position:absolute;
						right:0;
						top:0;
						width: 24px;
						height:24px;
						line-height: 16px;
						text-align: center;
						border-radius: 16px;
						font-size:9px;
						font-weight:700;
						color:#fff;
						background: rgb(240,20,20);
						box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
						border-radius:50%;	
					}
				}
				.price{
					display: inline-block;
					vertical-align: top;
					padding-right: 12px;
					margin-top: 12px;
					line-height: 24px;
					font-size: 16px;
					font-weight:700;
					box-sizing:border-box;
					border-right:1px solid rgba(255,255,255,0.1);
					&.highlight{
						color:rgb(255,255,255);	
					}
				}
				.desc{
					display: inline-block;
					vertical-align: top;
					margin:12px 0 0 12px;
					line-height: 24px;
					font-size: 12px;
					box-sizing:border-box;
				}
			}
			.con_right{
				flex:0 0 95px;
				width:95px;
				text-align: center;
				.minPriceDesc{
					font-size: 12px;
					font-weight:700px;
					line-height: 48px;
					&.not-enough{
						background: #2b333b;
					}
					&.enough{
						background: #00b43c;
						color:#fff;
					}
				}
			}
		}
		.ball_container{
			.ball{
				position:fixed;
				left:32px;
				bottom:22px;
				color:#fff;
				&.drop-enter,&.drop-enter-active{
					transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
					.inner{
						display: inline-block;
						width:16px;
						height:16px;
						background-radius:50%;
						background: rgb(0,160,220);
						transition:all 0.4s linear;
					}
				}
			}
		}
		.shopCart_list{
			position:absolute;
			left:0;
			top:0;
			z-index: -1;
			width:100%;
			transform:translate3d(0,-100%,0);
			&.fold-enter-active,&.fold-leave-active{
				transition:all 0.5s;
			}
			&.fold-leave-active{
				transform:translate3d(0,-100%,0);
			}
			&.fold-enter,&.fold-leave-active{
				transform:translate3d(0,0,0);
			}
			.list_header{
				height:40px;
				line-height: 40px;
				padding:0 18px;
				background: #f3f5f7;
				border-bottom:1px solid rgba(7,17,27,0.1);
				.title{
					float: left;
					font-size:14px;
				}
				.empty{
					float:right;
					font-size:12px;
					color:rgb(0,160,220);

				}
			}
			.list_content{
				padding:0 18px;
				max-height:217px;
				background: #fff;
				overflow: hidden;
				.food{
					position: relative;
					padding:12px 0;
					line-height: 24px;
					box-sizing:border-box;
					@include border-1px(rgba(7,17,27,0.1));
					.name{
						font-size:14px;
						color:rgb(7,17,27);
					}
					.price{
						position:absolute;
						right:90px;
						bottom:12px;
						font-size: 14px;
						font-weight:700;
						color:rgb(240,20,20);
						margin-left:6px;
						padding:0 12px;
					}
					.cartControl_wrapper{
						position: absolute;
						right:0;
						top:12px;
						width:108px;
						height:50px;

					}
				}
			}
		}
		.mask{
			width:100%;
			height:100%;
			position: fixed;
			left:0;
			top:0;
			background:rgba(7,17,27,0.6);
			filter:blur(10px);
			background-filter:blur(10px);
			z-index:-2;
			&.maskMove-enter-active,&.maskMove-leave-active{
				transition:all 0.5s;
			}
			&.maskMove-enter{
				opacity: 1;
			}
			&.maskMove-leave-active{
				opacity:0;
			}
		}
		.payMethods_wrapper{
			position:fixed;
			left:0;
			top:0;
			z-index:100;
			width:100%;
			height:100%;
			.payMethods_contener{
				width:100%;
				height:100%;
				background: #fff;
				padding:30px;
				box-sizing:border-box;
				.head{
					height:50px;
					line-height: 50px;
					@include border-1px(rgba(7,17,27,0.1));
					.title{
						font-size: 18px;
						font-weight:700;
						color:#666;

					}
				}
				.payMethods_list{
					padding:20px 0;
					.payMethods{
						font-size: 16px;
						line-height:26px;
						padding:10px 0;
					}
				}

			}
			.footer{
				.payResult,.back{
					width:100px;
					height:50px;
					text-align:center;
					display:inline-block;
					position:fixed;
					bottom:50px;
					box-sizing:border-box;
					line-height: 50px;
					color:#fff;
				}
				.payResult{
					left:20px;
					background: #00b43c;
				}
				.back{	
					right:20px;
					background:#aaa;
				}
			}
			
		}	
	}
			
</style>
<template>
	<div class="seller" ref="sellerWrapper">
		<div class="seller_content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc">
					<v-star :size="36" :score="seller.score"></v-star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>		
				</div>
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':isFavorite}">
					</span>
					<span class="text">{{favoriteText}}</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2 class="text">起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>
							<span class="yuan">元</span>
						</div>
					</li>
					<li class="block">
						<h2 class="text">商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>
							<span class="yuan">元</span>
						</div>
					</li>
					<li class="block">
						<h2 class="text">平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>
							<span class="yuan">分钟</span>
						</div>
					</li>
				</ul>
				<v-split></v-split>
				<div class="bulletin_wrapper">
					<h1 class="title">公告与活动</h1>
					<p class="text">{{seller.bulletin}}</p>
					<ul class="supports_wrapper">
						<li class="supports_item border-1px" v-for="(supportItem,index) in seller.supports">
							<v-iconClassMap :iconType="supportItem.type"></v-iconClassMap>
							<span class="description">{{supportItem.description}}</span>
						</li>
					</ul>
				</div>
				<v-split></v-split>
				<div class="pics">
					<h1 class="title">商家实景</h1>
					<div class="pic_wrapper" ref="picsWrapper">
						<ul class="pic_list" ref="piclist">
							<li class="pic_item" v-for="(picItem,index) in seller.pics" :key="index">
								<img :src="picItem" alt="" class="pic" width="120" height="90">
							</li>
						</ul>
					</div>
				</div>
				<v-split></v-split>
				<div class="infos_wrapper">
					<h1 class="title border-1px">商家信息</h1>
					<ul class="infos_list">
						<li class="infos_item border-1px" v-for="(item,index) in seller.infos">
							<span class="text">{{item}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import BScroll from 'better-scroll';
	import star from '../star/star';
	import iconClassMap from '../iconClassMap/iconClassMap';
	import split from '../split/split';
	import { saveToLocal, loadFromLocal } from '../../common/js/store.js';
	const ERR_OK = 0;
	export default{
		props:{
			seller:{
				type:Object
			},
			scrollX: { 
				type: Boolean, 
				default: false 
			},
		},
		components:{
			'v-star':star,
			'v-iconClassMap':iconClassMap,
			'v-split':split
		},
		data(){
			return {
				isFavorite:(()=>{
					return loadFromLocal(this.seller.id,"isFavorite",false);
				})()
			}
		},
		watch:{
			'seller'(){
				this.$nextTick(()=>{
					this._initScroll();
					this._initPicScroll();
				})
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this._initScroll();
				this._initPicScroll();
			})
		},
		methods:{
			_initScroll(){
				if(!this.scroll){
					this.scroll=new BScroll(this.$refs.sellerWrapper,{
						click:true
					})
				}else{
					this.scroll.refresh();
				}
			},
			_initPicScroll(){
				if(this.seller.pics){

					let picW = 120;
			        let margin = 6;
			        let w = (picW + margin) * this.seller.pics.length - margin;
			        this.$refs.piclist.style.width = w + "px";
			        this.$nextTick(() => {
			          	if (!this.picScroll) {
				            this.picScroll = new BScroll(this.$refs.picsWrapper, {
				              	scrollX: true,
				              	eventPassthrough: 'vertical',// 滚动方向横向
				              	click: true
				            })
			        	}else{
			        		this.pics.refresh();
			        	}
					})
			    }
			},
			toggleFavorite(event){
				this.isFavorite=!this.isFavorite;
				saveToLocal(this.seller.id,'isFavorite',this.isFavorite);
			}
		},
		computed:{
			favoriteText(){
				return this.isFavorite?'已收藏':'收藏';
			}
		}
	
  }
  
	
</script>
<style type="text/css" lang="scss" scoped="">
	@import '../../common/scss/border.scss';
	.seller{
		position:absolute;
		left:0;
		top:174px;
		width:100%;
		bottom:0;
		overflow:hidden;
		.overview{
			padding:0 18px;
    		position:relative;
    		.title{
    			font-size: 14px;
				line-height: 14px;
				color:rgb(7,17,27);
    			padding: 18px 0 8px 0;
    		}
    		.desc{
    			padding-bottom: 18px;
    			@include border-1px(rgba(7,17,27,0.1));
    			font-size: 0;
    			.star{
    				display: inline-block;
    				margin-right: 8px;
    				vertical-align: top;
    			}
    			.text{
    				display:inline-block;
        			font-size:10px;
        			line-height:18px;
        			color:rgb(77,85,93);
        			margin-left:6px;
        			vertical-align:top;
    			}
    		}
    		.favorite{
    			position:absolute;
      			right:18px;
      			top:18px;
      			width:40px;
      			.icon-favorite{
      				width:32px;
      				height:32px;
      				display:block;
        			margin-bottom:4px;
        			font-size:24px;
        			line-height:24px;
        			color:#d4d6d9;
        			text-align:center;
        			background: url("../../assets/gift.png") no-repeat;
        			&.active{
      				// color: rgb(240,20,20);
      				background: url("../../assets/giftselected.png") no-repeat;
      				}
      			}
      			.text{
      				display:block;
       				font-size:10px;
			        line-height:10px;
			        color:rgb(77,85,93);
			        text-align:center; 
			        margin-left:-10px; 
      			}

    		}
    		.remark{
    			padding:18px 0;
    			display: flex;
    			.block{
    				flex:3;
    				border-right:1px solid rgba(7,17,27,0.1);
    				text-align:center;
    				&:last-child{
    					border-right:none;
    				}
    				.text{
    					font-size:10px;
    					line-height: 10px;
    					color: rgb(147,153,150);
    				}
    				.content{
    					margin-top:4px;
			            font-size:10px;
			            line-height:24px;
			            color:rgb(7,17,27);
			            .stress{
			            	font-size:24px;
            				font-weight:200;
			            }
    				}
    			}
    		}
		}
		.bulletin_wrapper{
			padding:0 0 14px 0;
			.title{
				font-size:14px;
				line-height:14px;
			    color:rgb(7,17,27);
			    padding:18px 0 8px 0;
			}
			.text{
				padding:0 12px 14px 0px;
			    font-size:12px;
			    line-height:24px;
			    font-weight:200;
			    color:rgb(240,20,20);
			    @include border-1px(rgba(7,17,27,0.1));
			    &:last-child{
			    	@include border-none();
			    }
			}
		}
		.supports_wrapper{
			.supports_item{
				@include border-1px(rgba(7,17,27,0.1));
				padding:16px 12px;
				.description{
					font-size:12px;
        			line-height:12px;
        			font-weight:200;
        			color:rgb(7,17,27);
        			vertical-align:top;
				}
			}
		}
		.pics{
			padding:0px 0px 14px 0;
			.title{
				font-size:14px;
      			line-height:14px;
      			color:rgb(7,17,27);
      			padding-bottom:12px;
			}
			.pic_wrapper{
				width:100%;
			    overflow:hidden;
			    white-space:nowrap;
			    .pic_list{
			    	font-size:0;
			    	.pic_item{
			    		display: inline-block;
			    		margin-right: 6px;
			    		margin-bottom: 6px;
			    		width:120px;
			    		height:90px;
			    		&:last-child{
			    			margin:0;
			    		}
			    	}
			    }
			}
		}
		.infos_wrapper{
			padding:18px;
			.title{
				font-size:14px;
				line-height:14px;
				color: rgb(7,17,27);
				padding-bottom:12px;
				@include border-1px(rgba(7,17,27,0.1));
				.infos_item{
					padding:16px 12px;
					@include border-1px(rgba(7,17,27,0.1));
					&:last-child{
						@include border-none();
					}
					.text{
						line-height:16px;
					}
				}
			}
		}
	}
</style>
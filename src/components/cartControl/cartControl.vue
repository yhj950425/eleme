<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart_decrease" v-show="foodItem.count>0" @click.stop.prevent="decreaseCart($event)">
				<span class="inner icon-remove_circle_outline">
					<img src="../../assets/decrease.png">
				</span>
			</div>
		</transition>
		<div class="cart_count" v-show="foodItem.count>0">{{foodItem.count}}</div>
		<div class="cart_add icon-add_circle" @click.stop.prevent="addCart($event)">
			<img src="../../assets/add.png">
		</div>
	</div>
</template>
<style type="text/css" scoped="" lang="scss">
 @import '../../common/scss/icon.scss';
	.cartcontrol{
		font-size: 0;
		position: absolute;
		right:0px;
		bottom:10px;
		.cart_decrease{
			display: inline-block;
			padding: 6px;
			transition:all 0.4s linear;
			.inner{
				display:inline-block;
				font-size: 24px;
				line-height: 24px;
				color: rgb(0,160,220);
				transition:all 0.4s linear;
				img{
					width:20px;
					height:20px;
				}
			}
			&.move-enter-active{
				opacity: 1;
				transform:translate3d(0,0,0);
				.inner{
					transform:rotate(0);
				}
			}
			&.move-enter,&.move-leave-to{
				opacity: 0;
				transform:translate3d(24px,0,0);
				.inner{
					transform:rotate(180deg);
				}
			}
		}
		.cart_count{
			display:inline-block;
			vertical-align: top;
			font-size:10px;
			line-height: 24px;
			padding:6px;
			color:rgb(147,153,159);
		}
		.cart_add{
			display:inline-block;
			padding: 6px;

			font-size:24px;
			// line-height: 24px;
			color:rgb(0,160,220);
			img{

				width:20px;
				height:20px;
			}
		}
	}
</style>
<script type="text/javascript">
import Vue from 'vue';
	export default{
		props:{
			foodItem:{
				type:Object
			}
		},
		methods:{
			decreaseCart(event){
				// if(!event._constructed){
				// 	return;
				// }
				if(this.foodItem.count){
					this.foodItem.count--;
				}
			},
			addCart(event){
				// if(!event._constructed){
				// 	return;
				// }
				if(!this.foodItem.count){
					Vue.set(this.foodItem,"count",1);
				}else{
					this.foodItem.count++;
					
				}
				console.log(1);
				this.$root.eventHub.$emit('cart.add',event.target);
			}
		}
	}
</script>
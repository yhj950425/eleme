<template>
	<div class="star" :class="starType">
		<span class="star-item"  v-for='(itemClass,index) in itemClasses' :key="index" :class="itemClass">
			
		</span>
	</div>
</template>
<script type="text/javascript">
	const LENGTH=5;//表示5颗星
	const CLS_ON='on';
	const CLS_HALF='half';
	const CLS_OFF="off";

	export default{
		name:'star',
		props:{
			size:{
				type:Number
			},
			score:{
				type:Number
				
			}
		},
		computed:{
			starType(){
				return 'star_'+this.size;
			},
			itemClasses(){
				let result=[];//存放星星数组
				//0.5表示半颗星，计算分数是0.5的几倍，再乘以2，就是几颗星
				let score=Math.floor(this.score*2)/2;//4
				let hasDecimal=score%1!==0;//判断是否有小数，即判断是不是有半颗星
				let integer=Math.floor(score);//整数部分，完整的星
				for(let i=0;i<integer;i++){
					result.push(CLS_ON);//数组中放入整颗星
				}
				if(hasDecimal){
					result.push(CLS_HALF);//数组中放入半颗星，且半颗星只出现一次
				}
				//剩余补齐
				while(result.length<LENGTH){
					result.push(CLS_OFF);//放入灰色星
				}
				return result;
			}
		}
	}
</script>
<style type="text/css" scoped="" lang="scss">
@import '../../common/scss/border.scss';
	.star{
		font-size: 0;
		.star-item{
			display: inline-block;
			background-repeat: no-repeat;
		}
		&.star_48{
			.star-item{
				width:20px;
				height:20px;
				margin-right: 22px;
				background-size: 20px 20px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					@include bg-image("star48_on");
				}
				&.half{
					@include bg-image('star48_half');
				}
				&.off{
					@include bg-image('star48_off');
				}
			}
		}
		&.star_36{
			.star-item{
				width:15px;
				height:15px;
				margin-right: 6px;
				background-size: 15px 15px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					@include bg-image('star36_on');
				}
				&.half{
					@include bg-image('star36_half');
				}
				&.off{
					@include bg-image('star36_off');
				}
			}
		}
		&.star_24{
			.star-item{
				width:10px;
				height:10px;
				margin-right: 3px;
				background-size: 10px 10px;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					@include bg-image('star24_on');
				}
				&.half{
					@include bg-image('star24_half');
				}
				&.off{
					@include bg-image('star24_off');
				}
			}
		}

	}
</style>
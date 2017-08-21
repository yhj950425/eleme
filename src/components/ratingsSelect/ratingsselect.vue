<template>
	<div class="ratingsSelect">
		<div class="rating_type border-1px">
			<span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{desc.all}}
				<span class="count">{{ratings.length}}</span>
			</span>
			<span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{desc.positive}}
				<span class="count">{{positives.length}}</span>
			</span>
			<span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{desc.negative}}
				<span class="count">{{negatives.length}}</span>
			</span>
		</div>
		<div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>
<style type="text/css" scoped="" lang="scss">
	@import '../../common/scss/border.scss';
	.ratingsSelect{
		.rating_type{
			padding: 18px 0;
			margin: 0 18px;
			font-size: 0;
			@include border-1px(rgba(2,17,27,0.1));
			.block{
				display: inline-block;
				padding:8px 12px;
				margin-right: 8px;
				border-radius: 1px;
				color:rgb(77,85,93);
				font-size:12px;
				line-height: 24px;
				&.active{
					color:#fff;
				}
				.count{
					margin-left: 2px;
					font-size:8px;
					line-height:16px;
				}
				&.positive{
					background: rgba(0,160,220,0.2);
					&.active{
						background:rgb(0,160,220);
					}
				}
				&.negative{
					background:rgba(77,85,93,0.2);
					&.active{
						background:rgb(77,85,93);
					}
				}
			}
		}
		.switch{
			padding:12px 18px;
			line-height: 24px;
			color:rgb(147,153,159);
			border-bottom: 1px solid rgba(7,17,27,0.2);
			&.on{
				.icon-check_circle{
					width:32px;
					height:32px;
					background: url("../../assets/selected.png") no-repeat;
				}
			}
			.icon-check_circle{
				display:inline-block;
				margin-right:4px;
				font-size:24px;
				width:32px;
				height:32px;
				background: url("../../assets/select.png") no-repeat;

			}
			.text{

				font-size: 16px;
				vertical-align: top;
			}
		}
		.no_rating{
			padding:16px 0;
			font-size: 12px;
			line-height: 24px;
			color: rgb(147,153,159);
		}
	}
</style>
<script type="text/javascript">
	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;
	export default {
		data(){
			return {
				onlyContent:{
					type:Boolean,
					default:false
				},
				selectType:{
					type:Number,
					default:ALL
				}
			}
		},
		props:{
			ratings:{
				type:Array,
				default(){
					return [];
				}
			},
			desc:{
				type:Object,
				default(){
					return {
						all:"全部",
						positive:"满意",
						negative:"不满意"
					}
				}
			}
		},
		computed:{
			positives(){
				return this.ratings.filter((item)=>{
					return item.rateType===POSITIVE;
					
				})
			},
			negatives(){
				return this.ratings.filter((item)=>{
					return item.rateType===NEGATIVE;
				})
			}
		},
		methods:{
			select(type,event){
				// if(!event._contructed){
				// 	return;
				// }

				this.selectType=type;
				this.$emit('selRatings',this.selectType);
			},
			toggleContent(event){
				// if(!event._contructed){
				// 	return;
				// }
				this.onlyContent=!this.onlyContent;
				this.$emit('isContent',this.onlyContent);
			}
		}
	}
</script>

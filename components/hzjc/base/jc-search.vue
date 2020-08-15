<template>
	<view class="jc-search" :style="'background:'+bgColor">
		<view :class="['box-left',cancelButton?'small':'large']">
			<text class="iconfont icon-sousuo text-26 text-80"></text>
			<input class="text-28 margin-left-10" type="text" v-model="keyword" :placeholder="placeholder" 
			@input="inputInput" @blur="inputBlur" @focus="inputFocus" @confirm="inputConfirm"/>
			<text v-if="clearButton" class="iconfont icon-no text-26 text-80" @tap="clear"></text>
		</view>
		<text v-if="cancelButton" class="text-30 text-4d" @tap="cancel">{{cancelText}}</text>
	</view>
</template>

<script>
	export default {
		name:'jc-search',
		data() {
			return {
				keyword:''
			}
		}, 
		props:{
			placeholder:{ //提示语
				type: String,
				default: '关键字'
			},
			clearButton:{ //清空按钮
				type: Boolean,
				default: true
			},
			cancelButton:{ //取消按钮
				type: Boolean,
				default: true
			},
			cancelText:{ //取消按钮文本
				type: String,
				default: '取消'
			},
			bgColor:{ //背景色
				type: String,
				default: '#fff'
			}
		},
		methods: {
			clear(){
				this.keyword='';
			},
			inputInput(e){
				this.$emit('input',e.detail.value);
			},
			inputBlur(e){
				this.$emit('blur',e.detail.value);
			},
			inputFocus(e){
				this.$emit('focus',e.detail.value);
			},
			inputConfirm(e){
				this.$emit('confirm',e.detail.value);
			},
			cancel(){
				this.$emit('cancel');
			}
		}
	}
</script>

<style scoped>
	.jc-search{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20upx 30upx;
	}
	.box-left{
		display: flex;
		align-items: center;
		height: 60upx;
		padding: 0 20upx;
		border-radius: 30upx;
		background: #f5f5f5;
	}
	input{
		display: flex;
		align-items: center;
		height: 60upx;
	}
	.large{
		width: 690upx;
	}
	.large input{
		width: 600upx;
	}
	.small{
		width: 600upx;
	}
	.small input{
		width: 500upx;
	}
</style>

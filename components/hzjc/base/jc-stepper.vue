<template>
	<view class="jc-stepper">
		<view class="stepper">
			<text :class="['text-30',nums==minNum?'text-e6':'text-1a']" @tap="reduce">－</text>
			<view :class="['stepper__num',nums==maxNum||nums==minNum?'':'stepper__shadow']">
				<input :disabled="disabled" @blur="inputBlur" type="number" v-model="nums" />
			</view>
			<text :class="['text-30',nums==maxNum?'text-e6':'text-1a']" @tap="add">＋</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:'jc-stepper',
		data() {
			return {
				nums:0
			}
		},
		props:{
			num:{ //当前值
				type: Number,
				default: 0
			},
			step:{ //步数
				type: Number,
				default: 1
			},
			minNum :{ //最小
				type: Number,
				default: 0
			},
			maxNum :{//最大
				type: Number,
				default: 9999
			},
			disabled :{//是否可输入
				type: Boolean,
				default: true
			},
			size :{ //大小
				type: String,
				default: 'medium'
			},
			asyncChange :{//同步异步
				type: Boolean,
				default: false
			},
			shape :{ //样式
				type: String,
				default: 'default'
			}
		},
		created() {
			this.nums=+this.num;
		},
		methods: {
			add(){
				let value = Number(this.nums);
				let step = Number(this.step);
				if((value+step)<=this.maxNum){
					value+=step;
				}else{
					return;
					uni.showToast({
					    title: '不能再加了~',
						icon: 'none'
					});
				}
				this.nums=value;
			},
			reduce(){
				let value = Number(this.nums);
				let step = Number(this.step);
				if(this.minNum<=(value-step)){
					value-=step;
				}else{
					return;
					uni.showToast({
					    title: '不能再减了~',
						icon: 'none'
					});
				}
				this.nums=value;
			},
			inputBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.maxNum) {
					value = this.maxNum;
				} else if (value < this.minNum) {
					value = this.minNum;
				}
				this.nums = value;
			}
		},
		watch: {
			num(val) {
				this.nums = +val;
			},
			nums(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", newVal);
				}
			}
		}
	}
</script>

<style scoped>
	.stepper{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.stepper__num{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 70upx;
		height: 36upx;
		margin: 0 15upx;
		background: #f5f5f5;
		border-radius: 4upx;
	}
	.stepper__shadow{
		box-shadow:0px 2px 4px 0px rgba(0,0,0,0.5);
	}
	.stepper__num input{
		width: 70upx;
		height: 36upx;
		font-size: 22upx;
		color: #4d4d4d;
		text-align: center;
	}
</style>

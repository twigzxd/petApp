<template>
	<view class="personal">
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">头像</text>
			<view class="right">
				<image :src="infos.avatar" mode="" @click="_chooseImage"></image>
				<view class="icon-jiantou iconfont"></view>
			</view>
		</view>
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">昵称</text>
			<input type="text" v-model="infos.nickname" placeholder="请填写" />
		</view>
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">手机号</text>
			<input type="number" v-model="infos.mobile_phone" placeholder="请填写" />
		</view>
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">性别</text>
			<view style="flex:1">
				<picker mode="selector" :value="index" :range="array" range-key="name" @change="change">
					<view v-if="sex==0||sex==''" style="text-align: right;" class="fs_26 c_1a">请选择性别<text class="iconfont icon-jiantou"></text></view>
					<view v-else style="text-align: right;">{{array[index].name}} <text class="iconfont icon-jiantou"></text></view>
				</picker>
			</view>
		</view>
		<view class="flex__between__center item">
				<text class="fs_26 c_1a">生日</text>
				<view style="flex:1">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view style="text-align: right;" class="fs_26 c_1a">{{date}}<text class="iconfont icon-jiantou"></text></view>
					</picker>
				</view>
		</view>
<!-- 		<view class="flex__between__center item">
			<text class="fs_26 c_1a">身份证号</text>
			<input type="text" v-model="infos.inentity" placeholder="请填写" />
		</view>
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">开户银行</text>
			<input type="text" v-model="infos.card_bank" placeholder="请输入您的开户行" />
		</view>
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">开户名</text>
			<input type="text" v-model="infos.card_name" placeholder="请输入您的开户名" />
		</view>
		<view class="flex__between__center item">
			<text class="fs_26 c_1a">开户账号</text>
			<input type="number" v-model="infos.card_account" placeholder="请输入您的开户账号" />
		</view> -->
		<view class="footer">
		    <button @click="create">确定</button>
		</view>
	</view>
</template>

<script>
const app=getApp();
export default {
    name: "Personal",
    data(){
        return{
            infos:{
				
			},
			index:0,
			array:[{id:1,name:'男'},{id:2,name:'女'}],
			date:'',
			startDate:'1900-01-01',
			endDate:'',
			sex:'',
        }
    },
    methods:{
		bindDateChange(e){
			this.date=e.detail.value
		},
		change(e){
			this.index=e.detail.value
			this.sex=this.array[e.detail.value].id
		},
		create(){
			let that=this
			app.$vm.getData({
				url: 'Setup/changeUserInfo', 
				that: this,
				data: {
					avatar:that.infos.avatar,
					nickname:that.infos.nickname,				
					sex:that.sex,
					birthday:that.date
				},
				loading: 1
			}).then(res => {
				if(res.code==1){
					uni.showModal({
						content: res.message,
						showCancel: false,
						success() {
							uni.navigateBack()
						}
					});
				}else{
					uni.showToast({
						title:res.message,
						icon: 'none'
					})
				}
			})
		},
		//选择图片
		_chooseImage() {
			var that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					that._imageUpload(res.tempFilePaths);
				}
			})
			
		},
		// 图片上传
		_imageUpload(tempFilePaths) {
			console.log(tempFilePaths)
			var that = this;
			uni.showLoading({
				title: '加载中'
			})
			uni.uploadFile({
				url: 'https://xachongniapp.jucheng01.net/app.php/Basic/saveFile',
				filePath: tempFilePaths[0],
				name: 'file',
				header: {
					'content-type': 'multipart/form-data'
				},
				success: function(res) {
		
				},
				complete: function(res) {
					uni.hideLoading();
					if (res.statusCode == 200) { //微信上传图片状态完成
						var res = JSON.parse(res.data);
						if (res.code == 1) { //控制器上传是否成功
							that.infos.avatar = res.data.url;
						} else {
							uni.showToast({
								title:'上传图片失败',
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title:'上传图片失败',
							icon: 'none'
						})
					}
				}
			})
			// that.order_product[index].img_path.push('https://juchenghb1.oss-cn-qingdao.aliyuncs.com/ycscapp/uid2/applet/20190527/5cebc886b8d0c.png')
		}
    },
    onLoad(){
		var date = new Date()
		var year =date.getFullYear()
		var month = date.getMonth()+1
		var day =date.getDate()
		this.endDate=year+'-'+month+'-'+day
		this.date=year+'-'+month+'-'+day
		app.$vm.getData({
			url:'Setup/getUserInfo ',
			data: {},
			that:this,
			loading: 1
		}).then(res=>{
			if(res.code==1){
				this.infos=res.data;
				this.date=res.data.birthday
				if(res.data.sex==1){
					this.index=0
					this.sex=this.array[this.index].id
				}else if(res.data.sex==2){
					this.index=1
					this.sex=this.array[this.index].id
				}
			}
		})
    }

}
</script>
<style>
	page{
		background: #FFFFFF;
	}
</style>
<style scoped>
	.personal{
		background: #fff;
	}
	.item{
		height: 100upx;
		border-bottom: 2upx solid #E6E6E6;
		margin: 0 30upx;
	}
	.item:first-child{
		height: 120upx;
	}
	/* .item:nth-last-child(2){
		border: 0;
	} */
	.item image{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		background: #f5f5f5;
		margin-right: 10upx;
	}
	.item input{
		width: 500upx;
		text-align: right;
	}
	.footer{
	    /* width: 100%; */
		margin:88upx 30upx 0 ;
	}
	.footer button{
	    width: 100%;
	    height: 90upx;
	    line-height: 90upx;
		border-radius: 45upx;
	    font-size: 32upx;
	    background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
	    box-shadow:0px 6px 8px 0px rgba(204,132,255,0.24);
	    color: #fff;
	}
	.right{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.icon-jiantou{
		font-size: 26upx;
		color:#989898;
	}
</style>

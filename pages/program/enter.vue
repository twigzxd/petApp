<template>
	<div>
		<div class='li_item'>
			<div class='shaopname'>门店名称</div>
			<input type="text" v-model="name" placeholder-class="place" placeholder="请输入门店名称" />
		</div>
		<div class='li_item'>
			<div class='shaopname'>门店地址</div>
			<input type="text" v-model="local" placeholder-class="place" placeholder="请输入门店地址" />
			<!-- <view style="flex:1">
				<picker mode="selector" :value="index" :range="array" range-key="name" @change="change">
					<view style="text-align: right;">{{array[index].name}} <text class="iconfont icon-jiantou"></text></view>
					<view style="text-align: right;color:#CCCCCC;" class="fs_26 " >请选择分类<text class="iconfont icon-jiantou"></text></view>
				</picker>
			</view> -->
		</div>
		<div class='li_item' @click='location'>
			<input type="text"  v-model="address" disabled="true" placeholder-class="place" placeholder="详细地址" />
			<div class='iconfont icon-dingwei1 ' ></div>
		</div>
		<div class='li_item'>
			<div class='item'>门店分类</div>
			<view style="flex:1">
				<picker mode="selector" :value="index" :range="array" range-key="name" @change="change">
					<view style="text-align: right;" v-if="index">{{array[index].name}} <text class="iconfont icon-jiantou"></text></view>
					<view style="text-align: right;color:#CCCCCC;" class="fs_26 "  v-else>请选择分类<text class="iconfont icon-jiantou"></text></view>
				</picker>
			</view>
		</div>
		<div class='li_items'>
			<div class='item'>门店电话</div>
			<input type="number"  v-model="telephone" placeholder-class="place" placeholder="请输入门店电话" />
		</div>
		<view class="li_item">
				<div class='item' style='margin-right: 200upx;'>营业时间</div>
				<view style="flex:1">
					<picker mode="time" :value="time" :start="startDate" :end="endDate" @change="bindTimeChange">
						<view v-if='time' style="text-align: right;" class="fs_26 c_1a">{{time}}<text class="iconfont icon-jiantou"></text></view>
						<view v-else style="text-align: right;color:#CCCCCC;" class="fs_26 " >请选择时间<text class="iconfont icon-jiantou"></text></view>
					</picker>
				</view>
				<view style="flex:1">
					<picker mode="time" :value="times" :start="startDates" :end="endDate" @change="bindTimeChanges">
						<view v-if='times' style="text-align: right;" class="fs_26 c_1a">{{times}}<text class="iconfont icon-jiantou"></text></view>
						<view v-else style="text-align: right;color:#CCCCCC;" class="fs_26 " >请选择时间<text class="iconfont icon-jiantou"></text></view>
					</picker>
				</view>
		</view>
		<div class='li_items'>
			<div class='item'>联系人姓名</div>
			<input type="text" v-model="linkname" placeholder-class="place" placeholder="请输入联系人姓名" />
		</div>
		<div class='li_items'>
			<div class='item'>联系人电话</div>
			<input type="number" v-model="linkphone" placeholder-class="place" placeholder="请输入联系人电话" />
		</div>
		<div class='shopmessagebox'>
			<div class='shopmessagetxt'>门店信息</div>
			<textarea  v-model="textarea" maxlength="500"  @input="input" value='textarea'  placeholder="请输入详细信息" />
			<view class="numberbox">{{textnumber}}/500</view>
		</div>
		<div class='up'>
			<div class='uptext'>上传门店图片</div>
			<div class="flex wrap up-image-box">
				<div class="img-box" v-for="(item1,index1) in img_path" :key="index1">
					<image :src="item1" mode=""></image>
					<image class="del" src="../../static/images/del.png"   @click="_removeimg(index1)" mode=""></image>
					<!-- <text class="iconfont icon-ai54 c_1a fs_48" @click="_removeimg(index,index1)"></text> -->
				</div>
				<div class="img-box" style="position:relative;" v-if="img_path.length<1">
					<image src="../../static/images/add.png" mode="" @click="_chooseImage"></image>
					<view class="uploadt">上传图片</view>
				</div>
			</div>			
			<div class='tips'>（支持上传jpg、png格式，小于5M）</div>
		</div>
		<div class='btn' @click='up' v-if="status==null||status==''||status==2">提交</div>
		<div class='btn'  v-if="status==0">待审核</div>
		<div class='btn'  v-if="status==1">已审核</div>
	</div>
</template>

<script>
	const app=getApp();
	export default {
	    name:'enter',
	    data(){
	        return{
	          name:'',
			  img_path:[],
			  image_count: 1,
			  count:'',
			  textarea:'',
			  textnumber:0,
			  startDate:'00:00',
			  endDate:'23:59',
			  startDates:'',
			  time:'',
			  times:'',
			  array:'',
			  index:'',
			  address:'',
			  lat:'',
			  lng:'',
			  linkname:'',
			  linkphone:'',
			  telephone:'',
			  local:'',
			  cate_id:'',
			  status:'',
	        }
	    },
		onLoad() {
			app.$vm.getData({
				url:'Collage/getCate',
				data:{},
				that:this,
				loading:1
			}).then(res=>{
				this.array=res.data
			})
			app.$vm.getData({
				url:'Collage/getSubmit',
				data:{},
				that:this,
				loading:1
			}).then(res=>{
				if(res.code==1){
					if(res.data&&res.data.length!=0&&res.data!=null){
						this.name=res.data.name
						this.linkname=res.data.linkname
						this.linkphone=res.data.linkphone
						this.telephone=res.data.telephone
						this.local=res.data.local
						this.time=res.data.start_time
						this.times=res.data.end_time
						this.address=res.data.address
						this.img_path=res.data.img_path
						this.textarea=res.data.description
						this.lat=res.data.lat
						this.lng=res.data.lng
						this.textnumber=res.data.description.length
					}
				}
			
			})
		},
		onShow() {
	
			app.$vm.getData({
				url:'Collage/getStatus',
				data:{},
				that:this,
				loading:1
			}).then(res=>{
				this.status=res.data.status
			})
			this.startDates='00:00'
		},
		methods:{
			up(){
				if(!this.name){
					uni.showToast({
						icon:'none',
						title:'请输入门店名称'
					})
					return false
				}
				if(!this.local){
					uni.showToast({
						icon:'none',
						title:'请输入门店地址'
					})
					return false
				}
				if(!this.address){
					uni.showToast({
						icon:'none',
						title:'请输入详细地址'
					})
					return false
				}
				if(!this.index){
					uni.showToast({
						icon:'none',
						title:'请选择分类'
					})
					return false
				}
				if(!this.telephone){
					uni.showToast({
						icon:'none',
						title:'请输入门店电话'
					})
					return false
				}
				if(!this.time){
					uni.showToast({
						icon:'none',
						title:'请选择开始时间'
					})
					return false
				}
				if(!this.times){
					uni.showToast({
						icon:'none',
						title:'请选择结束时间'
					})
					return false
				}
				if(!this.linkname){
					uni.showToast({
						icon:'none',
						title:'请输入联系人姓名'
					})
					return false
				}
				if(!this.linkphone){
					uni.showToast({
						icon:'none',
						title:'请输入联系人电话'
					})
					return false
				}
				if(!this.textarea){
					uni.showToast({
						icon:'none',
						title:'请输入详细信息'
					})
					return false
				}
				if(this.img_path.length==0){
					uni.showToast({
						icon:'none',
						title:'请上传门店图片'
					})
					return false
				}
				app.$vm.getData({
					url:'Collage/submitCollage',
					data:{
						name:this.name,
						local:this.local,
						address:this.address,
						lat:this.lat,
						lng:this.lng,
						cate_id:this.cate_id,
						telephone:this.telephone,
						start_time:this.time,
						end_time:this.times,
						linkname:this.linkname,
						linkphone:this.linkphone,
						description:this.textarea,
						img_path:this.img_path,
						
					},
					loading:1,
					that:this
				}).then(res=>{
					if(res.code==1){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title:res.message,
							icon:'none'
						})
					}
				})
			},
			location() {
				console.log(11)
				let that = this;
						uni.getLocation({
							type: 'wgs84', 
							success(res) {
								const latitude = res.latitude
								const longitude = res.longitude
								that.lat=res.latitude
								that.lng=res.longitude 
								uni.chooseLocation({
									latitude,
									longitude,
									success(res) {
										console.log(res)
										that.address=res.name;
										that.lat=res.latitude
										that.lng=res.longitude 
										console.log(that.address)
									},
									fail(res) {
										console.log(res)
									}
								})
							},
							fail(res) {
								console.log(res)
							}
						})
				
			 },
			change(e){
				this.index = e.target.value
				this.cate_id=this.array[e.target.value].id
			},
			bindTimeChange(e){
				this.time = e.target.value
				this.startDates=this.time
			},
			bindTimeChanges(e){
				this.times = e.target.value
			},
			input(e){
				this.textnumber=e.detail.cursor
			},
			_chooseImage() {
				var count = parseInt(this.image_count) - this.img_path.length;
				var that = this;
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						that._imageUpload(res.tempFilePaths);
					}
				})
			},
			// 图片上传
			_imageUpload(tempFilePaths) {
				var that = this;
				uni.showLoading({
					title: '加载中'
				})
				uni.uploadFile({
					url: 'https://ycscapp.jucheng01.net/applet.php/Basic/saveFile',
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
								var data = res.data.url;
								that.img_path.push(data);
								tempFilePaths.splice(0, 1);
								if(tempFilePaths.length>0){
									that._imageUpload(tempFilePaths);
								}
								var count = parseInt(that.image_count) - that.img_path.length;
								that.count=count
								console.log(count)
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
			},
			// 删除图片
			_removeimg(index1) {
				console.log(this.img_path);
				this.$set(this.img_path,this.img_path.splice(index1, 1));
				var count = parseInt(this.image_count) - this.order_product[index].img_path.length;
				this.count=count
			}
		}
	}
</script>
<style>
	page{
		background: #FFFFFF;
	}
	
</style>

<style scoped>
	.li_item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 30upx;
		padding: 30upx 30upx 30upx 0;
		border-bottom: 1upx solid #EDEDED;
	}
	.li_items{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 30upx;
		padding: 30upx 30upx 30upx 0;
		border-bottom: 1upx solid #EDEDED;
	}
	.item{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:42upx;
	}
	.li_item input{
		flex: 1;
	} 
	.li_items input{
		flex: 1;
		text-align: right;
	}
	.shaopname{
		margin-right:92upx;
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:42upx;
	}
	.place{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(204,204,204,1);
		line-height:42upx;
	}
	.icon-dingwei1{
		color: #989BF9;
		font-size: 40upx;
	}
	.up{
		margin-left: 30upx;
		margin-top: 30upx;
	}
	.up .uptext{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:42upx;
		margin-bottom: 30upx;
	}
	.up .tips{
		height:33upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:33upx;
		margin-top: 30upx;
	}
	.up-image-box{
		padding: 0 30upx;
	}
	.up-image-box image{
		width: 165upx;
		height: 165upx;
	}
	.up-image-box .img-box{
		position: relative;
		margin-left: 10upx;
		margin-top: 10upx;
	}
	.img-box .del{
		position: absolute;
		top: -5upx;
		right: -5upx;
		width: 30upx;
		height: 30upx;
		display:block;
	}
	.img-box text{
		position: absolute;
		top: 0;
		right: 0;
	}
	.up-image-box .img-box:nth-child(4n+1){
		margin-left: 0;
	}
	.uploadt{
		position: absolute;
		transform: translate(-50%);
		left: 50%;
		bottom: 35upx;
		height:28upx;
		font-size:20upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(179,179,179,1);
		line-height:28upx;
		width:140upx;
		text-align: center;
	}
	.shopmessagebox{
		margin-left: 30upx;
		padding-bottom: 25upx;
		padding-top: 30upx;
		padding-right: 30upx;
		
		border-bottom:1upx solid #EDEDED ;
	}
	.shopmessagebox textarea{
		width: 100%;
	}
	.shopmessagetxt{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(26,26,26,1);
		line-height:42upx;
		margin-bottom: 30upx;
	}
	.numberbox{
		text-align: right;
	}
	.btn{
		height:90upx;
		background:linear-gradient(90deg,rgba(208,164,245,1) 0%,rgba(255,175,220,1) 100%);
		box-shadow:0px 6upx 8upx 0upx rgba(204,132,255,0.24);
		border-radius:45upx;
		margin: 110upx 30upx 0;
		color: #FFFFFF;
		line-height: 90upx;
		text-align: center;
	}
</style>

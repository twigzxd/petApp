<script>
	export default {
		HOST:'https://xachongniapp.jucheng01.net/app.php/',
		globalData:{
			openid: '',
			address_id: '',
			keyword: ''
		},
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods:{
			// post请求
			fetchPost(url, data) {
				return new Promise((resolve, reject) => {
					uni.request({
					  method: 'POST',
					  url: url,
					  data: data,
					  header: {
						'content-type': 'application/x-www-form-urlencoded'
					  },
					  dataType: 'json',
					  success: function(res) {
						resolve(res.data)
					  },
					  fail: function(res) {
						reject(res)
					  }
					})
				})
			},
			//page=1时，自动清空列表加载第1页 page!=1时，加载下一页
			getList(initial) {
				return new Promise((resolve, reject) => {
					if (initial.loading) {
						uni.showLoading({
							title: '加载中',
							mask: true
						});
					}
					initial.that.load_status="loading";
					initial.data.user_id = uni.getStorageSync('user_id');
					//判断当前加载页数
					if (initial.page != 1) {
						initial.page = initial.that.page + 1;
					} else {
						initial.page = 1;
						initial.that.list=[];
					}
					initial.data.page = initial.page;
					
					this.fetchPost(this.$options.HOST + initial.url, initial.data).then(res => {
						initial.that.load_status="loading";
						if (initial.loading) {
							uni.hideLoading();
						}
						if(res.code==666){
							uni.showModal({
								content: res.message,
								showCancel: false,
								success(modal_res){
									if(modal_res.confirm){
										uni.reLaunch({
											url: '/pages/mine/login'
										})
									}else{
										uni.navigateBack()
									}
								}
							});
						}else{
							resolve(res);
							if(initial.page == 1){
								initial.that.list=[];
							}
							let data_list = res.data.data_list; //返回数据里面的列表数据
							// if (data_list.total == 0) {
							//   let ajax_type = 'no_data';
							//   let ajax_content = '暂无内容～'
							//   let load_finish = true;
							// } else if (data_list.current_page == data_list.last_page) {
							//   let ajax_type = 'load_finish';
							//   let ajax_content = '我们是有底线的～'
							//   let load_finish = true;
							// } else {
							//   let ajax_type = '';
							//   let load_finish = false;
							// }
							// let ajax_param = {
							//   type: ajax_type,
							//   content: ajax_content
							// };
							if (data_list.data.length) {
								let list = 	initial.that.list;
								list = list.concat(data_list.data);
								initial.that.list=list;
								initial.that.page= initial.page;
								// this.ajax_param=ajax_param;
								// this.load_finish=load_finish;
							} else {
							 //  that.setData({
								// ajax_param: ajax_param,
								// load_finish: load_finish
							 //  });
							}
						}
					}).catch(res=>{
						reject(res)
					});
				})
			},
			//获取数据  
			getData(initial) {
				return new Promise((resolve, reject) => {
					if(initial.loading){
						uni.showLoading({
							title: '加载中',
							mask: true
						});
					}		
					//请求数据
					initial.data.user_id = uni.getStorageSync('user_id') || '';
					//访问 request
					this.fetchPost(this.$options.HOST + initial.url, initial.data).then(res=> {
						if (initial.loading) {
							uni.hideLoading();
						}
						if(res.code==666){
							uni.showModal({
								content: '请先登录',
								showCancel: false,
								success(modal_res){
									if(modal_res.confirm){
										uni.reLaunch({
											url: '/pages/mine/login'
										})
									}else{
										uni.navigateBack()
									}
								}
							});
						}else{
							resolve(res)
						}
					}).catch(res=>{
						reject(res)
					});
				})
			}
		}
	}
</script>

<style>
	
@import "./common/uni.css";
@import "./common/generality.css";
	
	/*每个页面公共css */
	@font-face {
		font-family: 'iconfont';
		/* project id 1014267 */
		 
		src: url('//at.alicdn.com/t/font_1044412_5dj74f3euwr.ttf') format('truetype')
	}
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	page{
		background: #F5F5F5;
		padding-bottom: 120rpx;
	}
</style>

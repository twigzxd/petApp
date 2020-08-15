<template>
    <div ref="outerWrapper" class="register">
        <div class="header">
            <img :src="register_logo" alt="">
        </div>
        <div class="flex__column content">
            <input type="number" placeholder="手机号" v-model="mobile_phone">
            <div class="flex__between__center content__item">
                <input type="number" placeholder="请输入验证码" v-model="code" maxlength="6">
                <span class="fs_28 c_1a" @click="getCode" v-if="check_get">{{code_text}}</span>
                <span class="fs_28 c_1a" v-else>{{time}}{{code_text}}</span>
            </div>
            <input type="password" placeholder="请输入密码" v-model="password">
            <input type="text" placeholder="请输入邀请码（选填）" v-model="invite_code">
        </div>
        <div class="footer">
            <button @click="register">完成</button>
            <div class="flex__center__center footer__bottom">
                <span class="fs_28 c_b3">已有账号</span>
                <span class="fs_28 c_main" v-link="'/Mine/Login'">立即登陆</span>
            </div>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:"Register",
    data(){
        return{
            logo_img:'',
            mobile_phone:'',
            password: '',
            register_logo: '',
            code: '',
            check_code: true,
            check_get: true,
            time: '',
            code_text: '获取验证码',
            isCanScroll: false,
			invite_code: ''//邀请码
        }
    },
    methods:{
		// 注册
        register(){
            if(!this.mobile_phone){
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
                return;
            }else if(!this.code){
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				})
                return;
            }else if(!this.password){
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				})
                return;
            }
			app.$vm.getData({
				url:'Vip/register',
				that: this,
				data: {
					openid: app.globalData.openid,
					mobile_phone: this.mobile_phone,
					code:this.code,
					password: this.password,
					invite_code: this.invite_code
				},
				loading: 1
			}).then(res=>{
                if(res.code==1){
					uni.setStorageSync('user_id', res.data.user_id);
					uni.navigateBack();
                }else{
					uni.showToast({
						title:res.message,
						icon: 'none'
					})
                }
            })
        },
        // 获取验证码
        getCode() {
            if (this.mobile_phone && this.check_get) {
				app.$vm.getData({
					url:'Vip/getCode',
					that: this,
					data: {
						mobile_phone: this.mobile_phone,
					},
					loading: 1
				}).then(res=>{
                    if (res.code==1) {
                        this.check_get=false;
                        this.code_text='重新获取';
                        this.time= '60s';
                        var times = 60;
                        const interval = setInterval(()=>{
                            times--;
                            if (times) {
                                this.time=times + 's';
                            } else {
                                clearInterval(interval);
                                this.time='';
                                this.check_get=true;
                                this.code_text='重发验证码';
                            }
                        }, 1000);
                    } else {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
                    }
                });
            } else {
                if (!this.mobile_phone) {
					uni.showToast({
						title:'请输入正确的手机号',
						icon: 'none'
					})
                }
            }
        },
    },
    onLoad(){
		app.$vm.getData({
			url:'Vip/getRegisterLogo',
			that: this,
			data: {},
			loading: 1
		}).then(res=>{
            this.register_logo=res.data.register_logo;
        })
    }
}
</script>
<style scoped>
.register{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    padding: 0 75upx;
    background: #fff;
}
.header{
    margin-top: 120upx;
    text-align: center;
}
.header img{
    width: 200upx;
	height: 200upx;
}
.content{
    margin-top: 60upx;
}
.content input{
    height: 100upx;
    border-bottom: 2upx solid #e6e6e6;
    font-size: 28upx;
}
.content__item input{
    border: 0;
}
.content__item{
    border-bottom: 2upx solid #e6e6e6;
}
.footer{
    margin-top: 80upx;
}
.footer button {
    width: 600upx;
    height: 98upx;
	line-height: 98upx;
    border-radius: 10upx;
    background: #1A1A1A;
    font-size: 32upx;
    color: #fff;
}
.footer .footer__bottom{
    margin-top: 40upx;
}
</style>




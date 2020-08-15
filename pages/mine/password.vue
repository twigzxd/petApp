<template>
    <div class="forget">
        <div class="header">
            <img :src="register_logo" alt="">
        </div>
        <div class="flex__column content">
            <input type="text" placeholder="手机号" v-model="mobile_phone">
            <div class="flex__between__center content__item">
                <input type="text" placeholder="请输入验证码" v-model="code" maxlength="6">
                <span class="fs_28 c_1a" @click="getCode" v-if="check_get">{{code_text}}</span>
                <span class="fs_28 c_1a" v-else>{{time}}{{code_text}}</span>
            </div>
            <input type="text" placeholder="请输入密码" v-model="password">
            <input type="text" placeholder="请再次输入密码" v-model="repassword">
        </div>
        <div class="footer">
            <button @click="register">完成</button>
        </div>
    </div>
</template>
<script>
const app=getApp();
export default {
    name:"Forget",
    data(){
        return{
            logo_img:'',
            mobile_phone:'',
            password: '',
            repassword: '',
            register_logo: '',
            code: '',
            check_code: true,
            check_get: true,
            time: '',
            code_text: '获取验证码'
        }
    },
    methods:{
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
            if(this.password!=this.repassword){
				uni.showToast({
					title: '两次密码不一致',
					icon: 'none'
				})
			    return;
            }
			app.$vm.getData({
				url:'Vip/forget',
				that: this,
				data: {
					mobile_phone: this.mobile_phone,
					code:this.code,
					password: this.password,
					repassword: this.repassword
				},
				loading: 1
			}).then(res=>{
                if(res.code==1){
					uni.navigateTo({
						url: '../mall/index'
					})
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
						mobile_phone: this.mobile_phone
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
    mounted(){
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
.forget{
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
    width: 215upx;
    height: 200upx;
}
.content{
    margin-top: 160upx;
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




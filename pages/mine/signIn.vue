<template>
  <div id="sign">
    <div class="header">
      <img :src="getData.headimgurl" alt="">
      <h1 class="nickname">{{getData.nickname}}</h1>
      <span>共有金币</span>
      <p>{{getData.money_my}}</p>
      <div class="flex__around__center continuity">
				<span>共签到{{getData.sign_total}}</span>
				<text>|</text>
				<text>连续签到{{getData.sign_continuity}}</text>
      </div>
      <div class="btn" :class="getData.is_sign != 1 ? 'active':'on'" @click="getData.is_sign != 1?sign():''">{{getData.is_sign != 1 ? '签到':'已签到'}}</div>
			<view class="flex__around__center rule-box" @click="this.showPopup=!this.showPopup">
				<text class="iconfont icon-guanyu-copy c_ff"></text>
				<text class="fs_26 c_ff">签到规则</text>
			</view>
			<navigator url="/pages/account/rankingList">
				<view class="sign-in">签到排行榜</view>
			</navigator>
		</div>
    <!--    日历-->
    <div id="calendar">
      <div class="date">
        <i class="iconfont icon-jiantou arrow" @click="toggleDate(-1)"></i>
        <div>
          <h1>{{getData.day}}</h1>
          <p>{{getData.year}}年{{getData.mouth}}月</p>
        </div>
        <i class="iconfont icon-jiantou" @click="toggleDate(1)"></i>
      </div>
      <ul class="week">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>   
        <li>五</li>
        <li>六</li>
      </ul>
      <div class="line"></div>
      <div class="signCalendar">
        <div v-for="(item,index) in calendar" :class="item.is_now == 1 ? 'active':''" :key="index" @click="setDate(index)">
          <div class="nowDate" v-if="item.is_now == 1"><p>{{item.day}}</p></div>
          <p v-else :class="item.is_same_mouth == 1 ? 'active':'on'">{{item.day}}</p>
          <span v-if="item.is_same_mouth == 1 && item.is_sign != 3 && item.is_now == 2"
                :class="item.is_sign == 1 ? 'on':'active'"></span>
        </div>
      </div>
    </div>
    <!--    未签到   已签到-->
    <div class="signStyle">
      <div>
        <span style="background-color:#CACCD5"></span>未签到
      </div>
      <div>
        <span style="background-color:#F93A42"></span>已签到
      </div>
    </div>
		<uni-popup :show="showPopup" type="middle" mode="insert" @hidePopup="this.showPopup=!this.showPopup">
			<view class="rule-content">
				<rich-text :nodes="rule"></rich-text>
			</view>
	</uni-popup>
  </div>
</template>

<script>
import {uniPopup} from '@dcloudio/uni-ui'
const app=getApp();
export default {
    name: "sign",
    data() {
      return {
				showPopup: false,
        userInfo:{
          head_img:'',
          realname:''
        },
        getData: {
          day: '',
          year: '',
          mouth: ''
        },
        YY: '',
        MM: '',
        DD: '',
        calendar: [],
				rule: '',
				sign_time: ''
      }
    },
		components: {uniPopup},
    onLoad() {
      var date = new Date();
      this.YY = date.getFullYear();
      this.MM = date.getMonth() + 1;
      this.DD = date.getDate();
      this.indexData();
    },
    methods: {
			// 选择日期
			setDate(index){
				if(this.calendar[index].is_same_mouth==1&&this.calendar[index].day<=this.getData.day){
					for(let i=0;i<this.calendar.length;i++){
						this.calendar[i].is_now=2;
					}
					this.calendar[index].is_now=1;
					this.getData.is_sign=this.calendar[index].is_sign;
					this.sign_time=this.getData.year+'-'+this.getData.mouth+'-'+this.calendar[index].day;
				}
				this.$set(this.calendar,this.calendar);
			},
      indexData() {
				app.$vm.getData({
					url:'Sign/getIndexData',
					that: this,
					data: {},
					loading: 1
				}).then(res=>{
          this.sign_continuity = res.data.sign_continuity;
          this.sign_total = res.data.sign_total;
          this.getData = res.data;
          this.calendar = res.data.calendar;
					this.sign_time=this.getData.year+'-'+this.getData.mouth+'-'+this.getData.day;
					this.rule=res.data.rule.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');;
        });
      },
      //点击签到
      sign(){
				uni.showLoading({
          mask: true,
          title: '加载中...'
				});
				app.$vm.getData({
					url:'Sign/submitSign',
					that: this,
					data: {
						sign_time:this.sign_time
					},
					loading: 1
				}).then(res=>{
          if(res.code == 1){
            this.indexData();
          }else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
        })
      },
      //切换月份
      toggleDate(index) {
				uni.showLoading({
				  mask: true,
				  title: '加载中...'
				});
        this.calendar = [];
        var _this = this;
        if (index == 1) {
          if (_this.MM >= 12) {
            _this.MM = 1;
            _this.YY += 1;
          } else {
            _this.MM ++;
          }
        } else {
          if(_this.MM <= 1){
            _this.MM = 12;
            _this.YY -= 1;
          }else{
            _this.MM --;
          }
        }
        this.getData.day = _this.DD;
        this.getData.year = _this.YY;
        this.getData.mouth = _this.MM;
        var post = {};
        post.year = _this.YY;
        post.mouth = _this.MM;
        post.day = _this.DD;
				app.$vm.getData({
					url:'Sign/getCalendar',
					that: this,
					data: post,
					loading: 1
				}).then(res=>{
          if (res.code == 1) {
            this.calendar = res.data.calendar;
          }
        })
      }
    },
  }
</script>

<style scoped>
	.arrow{
		transform:rotate(180deg);
	}
  .line {
    width: 690upx;
    height: 2upx;
    margin: 0 auto;
    background-color: #E6E6E6;
  }

  .header {
		position: relative;
    width: 750upx;
    height: 570upx;
    text-align: center;
		background:linear-gradient(360deg,rgba(81,94,106,1) 0%,rgba(46,46,46,1) 100%);
  }

  .header > img {
    width: 130upx;
    height: 130upx;
    margin: 30upx 0 10upx;
    border-radius: 50%;
  }
	.rule-box{
		position: absolute;
		right: 0;
		top: 30upx;
		width:182upx;
		height:60upx;
		padding: 0 10upx;
		background:rgba(0,0,0,0.1);
		border-radius: 30upx 0 0 30upx;
	}
	.rule-content{
		width: 600upx;
		height: 600upx;
		padding: 30upx;
		overflow: auto;
		background: #fff;
		border-radius: 10upx;
	}
  .nickname {
    height: 50upx;
    line-height: 50upx;
    color: #fff;
    font-weight: 600;
    font-size: 36upx;
  }

  .header > span {
    height: 30upx;
    line-height: 30upx;
    font-size: 22upx;
    color: #fff;
  }

  .header > p {
    height: 56upx;
    line-height: 56upx;
    font-size: 40upx;
    color: #fff;
  }

  .continuity {
    width: 500upx;
    height: 72upx;
    margin: 30upx auto;
    line-height: 72upx;
    color: #fff;
    font-size: 28upx;
    background-color: rgba(0, 0, 0, .1);
  }
	
  .btn {
    width: 300upx;
    height: 80upx;
    margin: 0 auto;
    border-radius: 40upx;
    text-align: center;
    line-height: 80upx;
    font-size: 30upx;
  }

  /*未签到*/
  .btn.active {
    box-shadow: 0upx 10upx 18upx 0upx rgba(109, 31, 31, 0.13);
    background: #F93A42;
    color: #fff;
  }

  /*已签到*/
  .btn.on {
    color: #FFFFFF;
    background-color: rgba(0, 0, 0, .1);
    box-shadow: 0upx 10upx 18upx 0upx rgba(109, 31, 31, 0.13);
  }

  /*  日历*/

  #calendar {
    width: 750upx;
    height: 638upx;
    background-color: #fff;
  }

  .date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 141upx;
    padding: 0 20upx;
    box-sizing: border-box;
    text-align: center;
  }

  .date > i {
    font-size: 36upx;
    color: #666666;
  }

  .date i.active {
    transform: rotate(180deg);
  }

  .date > div > h1 {
    font-size: 47upx;
    color: #000;
  }

  .date > div > p {
    margin-top: 10upx;
    font-size: 23upx;
    color: #CACCD5;
  }

  .week {
    width: 690upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 23upx;
    font-size: 27upx;
    color: #343951;
  }

  .week > li {
    width: 14.28%;
    text-align: center;
  }

  .signStyle {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 27upx;
    padding: 0 61upx;
    box-sizing: border-box;
  }

  .signStyle div {
    margin-right: 79upx;
  }

  .signStyle div:first-child {
    color: #CACCD5
  }

  .signStyle div:last-child {
    color: #F93A42;
  }

  .signStyle div span {
    display: inline-block;
    width: 28upx;
    height: 4upx;
    margin-right: 13upx;
    vertical-align: middle;
  }

  .signCalendar {
    display: flex;
    flex-wrap: wrap;
    width: 690upx;
    margin: 0 auto;
  }

  .signCalendar > div {
    position: relative;
    width: 14.28%;
    height: 75upx;
    line-height: 75upx;
    text-align: center;
    color: #343951;
  }

  .signCalendar > div > p {
    font-size: 28upx;
  }

  .signCalendar > div > p.on {
    color: #CACCD5;
  }

  .signCalendar > div > span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 28upx;
    height: 4upx;
    margin: 0 auto;
    border-radius: 28upx;
  }

  .signCalendar > div > span.active {
    background-color: #E6E6E6;
  }

  .signCalendar > div > span.on {
    background-color: #F93A42;
  }

  .nowDate {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 28upx;
  }

  .nowDate > p {
    position: absolute;
    width: 57upx;
    height: 57upx;
    line-height: 57upx;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 50%;
    color: #fff;
    background-color: #F93A42;
  }
	/* 金币排行榜 */
	.sign-in{
		position: absolute;
		right:0;
		top:100upx;
		width: 180upx;
		height: 60upx;
		padding: 0 10upx;
		background: rgba(0,0,0,0.1);
		border-radius: 30upx 0 0 30upx;
		text-align: center;
		line-height: 60upx;
		color: #fff;
		font-size: 26upx;
	}
</style>

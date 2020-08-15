<template>
	<view class="padding-lr-10">
		<u-parse :content="agreement" @preview="preview" @navigate="navigate" />
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				agreement: '',
				hierarchy: 2,
			}
		},
		onLoad(options) {
			if (options.hasOwnProperty('hierarchy')) {
				this.hierarchy = parseInt(options.hierarchy)
			}
			this.request.getData("Register/getAgreement", {}).then(res => {
				if (res.code === 1) {
					this.agreement = res.data.agreement;
				} 
			})
		},
		methods: {
			preview(src, e) { //预览图片
				// do something
				uni.previewImage({
					urls: [src],
					longPressActions: true
				})
			},
			navigate(href, e) { // 跳转地址
				// #ifdef H5
				Window.location.href = href;
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: "/pages/webview?url=" + encodeURI(href)
				})
				// #endif
			}
		},
		// #ifdef APP-PLUS|H5
		onNavigationBarButtonTap(index) {
			if (index.type === "close") {
				uni.navigateBack({
					delta: this.hierarchy
				})
			}
		},
		// #endif
	}
</script>

<style>
	page {
		background: #FFFFFF !important;
	}
</style>

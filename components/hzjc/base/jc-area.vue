<template>
	<view class="jc-area">
		<picker
			mode="multiSelector"
			:value="multiIndex"
			:range="multiArray" 
			range-key="name"
			@change="pickerChange"
			@columnchange="columnChange"
			@cancel="cancel"
		>
			<view class="text-28 inline-block">{{ province }}{{ column >= 2 ? ',' : '' }}{{ city }}{{ column == 3 ? ',' : '' }}{{ area }}</view>
			<text class="hzjcicon hzjcicon-below-s text-b3 text-22"></text>
		</picker>
	</view>
</template>

<script>
export default {
	name:'jc-area',
	data() {
		return {
			multiArray: [],
			multiIndex: [0, 0, 0],
			province: '',
			city: '',
			area: ''
		} 
	},
	props:{
		list: { //数据
			type: Array,
			default: []
		},
		value: { //初始索引数组
			type: Array,
			default:()=>{
				return []
			}
		},
		column: { //列级数
			type: Number,
			default: 3
		}
	},
	created() {
		let multiIndex = [];
		if (!this.list.length) {
			return false;
		}
		this.multiIndex=Array.apply(null, Array(this.column)).map(() => 0);
		if (this.value.length) {
			for (let i = 0; i < list.length; i++) {
				if (list[i].name == this.value[0]) {
					multiIndex.push(i);
				}
			}

			if (this.column >= 2) {
				for (let i = 0; i < this.list[multiIndex[0]].city.length; i++) {
					if (this.list[multiIndex[0]].city[i].name == this.value[1]) {
						multiIndex.push(i);
					}
				}
			}

			if (this.column == 3) {
				for (let i = 0; i < this.list[multiIndex[0]].city[multiIndex[1]].area.length; i++) {
					if (this.list[multiIndex[0]].city[multiIndex[1]].area[i].name == this.value[2]) {
						multiIndex.push(i);
					}
				}
			}
			this.multiIndex=multiIndex;
		}

		this.getMultiArray();
		multiIndex = this.multiIndex;
		this.province=this.list[multiIndex[0]].name;
		this.city=this.column >= 2 ? this.list[multiIndex[0]].city[multiIndex[1]].name : '';
		this.area=this.column == 3 ? this.list[multiIndex[0]].city[multiIndex[1]].area[multiIndex[2]].name : '';
	},
	methods: {
		//某一列的值改变时初始化下级内容
		columnChange(e) {
			let multiIndex = this.multiIndex;
			let column = e.detail.column;
	
			if (column == 0) {
				multiIndex[0] = e.detail.value;
				if (this.column >= 2) {
					multiIndex[1] = 0;
				}
				if (this.column >= 3) {
					multiIndex[2] = 0;
				}
			} else if (column == 1) {
				multiIndex[1] = e.detail.value;
				if (this.column >= 3) {
					multiIndex[2] = 0;
				}
			} else if (column == 2) {
				multiIndex[2] = e.detail.value;
			}
			this.multiIndex=multiIndex;
			this.getMultiArray();
			this.$emit("change", {
				multiIndex: multiIndex,
				province: this.list[multiIndex[0]].name,
				city: this.column >= 2 ? this.list[multiIndex[0]].city[multiIndex[1]].name : '',
				area: this.column >= 3 ? this.list[multiIndex[0]].city[multiIndex[1]].area[multiIndex[2]].name : '',
				province_id: this.list[multiIndex[0]].id,
				city_id: this.column >= 2 ? this.list[multiIndex[0]].city[multiIndex[1]].id : '',
				area_id: this.column >= 3 ? this.list[multiIndex[0]].city[multiIndex[1]].area[multiIndex[2]].id : '',
			});
		},
		
		//点击选择器左上方的选择按钮
		cancel() {
			this.$emit("cancel");
		},

		//选择器的选中的值改变时
		pickerChange(e) {
			let value = e.detail.value; 
			this.multiIndex=value;
			this.province=this.list[value[0]].name;
			this.city=this.column >= 2 ? this.list[value[0]].city[value[1]].name : '';
			this.area=this.column >= 3 ? this.list[value[0]].city[value[1]].area[value[2]].name : '';
			this.$emit('confirm',{
				multiIndex: value,
				province: this.list[value[0]].name,
				city: this.column >= 2 ? this.list[value[0]].city[value[1]].name : '',
				area: this.column >= 3 ? this.list[value[0]].city[value[1]].area[value[2]].name : '',
				province_id: this.list[value[0]].id,
				city_id: this.column >= 2 ? this.list[value[0]].city[value[1]].id : '',
				area_id: this.column >= 3 ? this.list[value[0]].city[value[1]].area[value[2]].id : '',
			});
		},
		//根据地址的级别数目和选择的值将数据复制到地址选择框的数组中
		getMultiArray() {
			let provinces = [],
				citys = [],
				areas = [],
				multiArray = [];
			let multiIndex = this.multiIndex;
			provinces = this.list;
			citys = this.column >= 2 ? provinces[multiIndex[0]].city : '';
			areas = this.column == 3 ? citys[multiIndex[1]].area : '';

			multiArray.push(provinces)
			if (this.column >= 2) {
				multiArray.push(citys)
			}
			if (this.column == 3) {
				multiArray.push(areas)
			}
			this.multiArray=multiArray;
		}
	}
}
</script>

<style scoped></style>

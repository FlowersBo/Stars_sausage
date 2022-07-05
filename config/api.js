module.exports = {
	auth: 'reserve/customer/auth',
	banner: 'reserve/common/banner',
	prepare: 'reserve/order/prepare', //设备下商品列表
	near: 'reserve/common/near', //设备列表
	getPhone: 'reserve/customer/phone',
	createOrder: 'reserve/order/create',
	confirm: 'reserve/order/confirm',
	pay: 'reserve/order/pay',
	detail: 'reserve/order/detail',
	cancel: 'reserve/order/cancel',
	orderList: 'reserve/order/list',
	upload: 'reserve/common/upload',
	suggest: 'reserve/common/suggest',
	recreate: 'reserve/order/recreate',
	status: 'reserve/order/dev/status', //设备状态
	getCity: 'reserve/common/getCity', //城市列表
	search: 'reserve/common/search', //搜索点位
}
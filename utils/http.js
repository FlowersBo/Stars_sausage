import * as api from '../config/api';
import {
  Request
} from './requestUrl';
let baseUrl = 'https://res.morninggo.cn/';
// let baseUrl = 'http://192.168.110.97:8080/reserve-http/';
// let baseUrl = 'http://restest.morninggo.cn/';
function addQueryString(params) { //post拼接参数
  let paramStr = '';
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      paramStr += key + '=' + params[key] + '&';
    }
  }
  return '?' + paramStr.substr(0, paramStr.length - 1);
}
module.exports = {
  Auth(data = {}) {
    return Request(baseUrl + api.auth, data, 'get')
  },

  Banner(data = {}) {
    return Request(baseUrl + api.banner, data, 'get')
  },

  Prepare(data = {}) {
    return Request(baseUrl + api.prepare, data, 'get')
  },

  Near(data = {}) {
    return Request(baseUrl + api.near, data, 'get')
  },

  getPhone(data = {}) {
    return Request(baseUrl + api.getPhone, data, 'get')
  },

  createOrder(data = {}) {
    return Request(baseUrl + api.createOrder, data, 'post')
  },

  Confirm(data = {}) {
    return Request(baseUrl + api.confirm, data, 'get')
  },

  pay(data = {}) {
    return Request(`${baseUrl + api.pay+addQueryString(data)}`, data, 'post')
  },

  Detail(data = {}) {
    return Request(baseUrl + api.detail, data, 'get')
  },

  Cancel(orderId, data = {}) {
    return Request(`${baseUrl + api.cancel}?orderId=${orderId}`, data, 'post')
  },

  OrderList(data = {}) {
    return Request(baseUrl + api.orderList, data, 'get')
  },

  Recreate(orderId, data = {}) {
    console.log(orderId)
    return Request(`${baseUrl + api.recreate}?orderId=${orderId}`, data, 'post')
  },

  Suggest(data = {}) {
    return Request(baseUrl + api.suggest, data, 'post')
  },

  Status(data = {}) {
    return Request(baseUrl + api.status, data, 'get')
  },

  GetCity(data = {}) {
    return Request(baseUrl + api.getCity, data, 'get')
  },

  Search(data = {}) {
    return Request(baseUrl + api.search, data, 'get')
  },

  Refund(data = {}) {
    // let paramsData = '';
    // for (var Key in params) {
    //   paramsData += `${Key}=${params[Key]}&`;
    // }
    // paramsData = paramsData.substr(0, paramsData.length - 1);
    let paramsData = [];
    for (const key in data) {
      paramsData.push(`${key}=${data[key]}`)
    }
    return Request(`${baseUrl + api.refund}?${paramsData.join('&')}`, data, 'post')
  },

  RefundShow(data = {}) {
    return Request(baseUrl + api.refundShow, data, 'get')
  },

  CouponList(data = {}) {
    return Request(baseUrl + api.couponList, data, 'get')
  },

  CouponBag(data = {}) {
    return Request(baseUrl + api.couponBag, data, 'get')
  },

  CouponBc(data = {}) {
    return Request(baseUrl + api.couponBc, data, 'get')
  },

  DrawBag(data = {}) {
    return Request(`${baseUrl + api.drawBag+addQueryString(data)}`, data, 'post')
  },

  DrawCoupon(data = {}) {
    return Request(`${baseUrl + api.drawCoupon+addQueryString(data)}`, data, 'post')
  },
  Np(data = {}) {
    return Request(baseUrl + api.np, data, 'get')
  },
}
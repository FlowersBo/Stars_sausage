import * as api from '../config/api';
import {
  Request
} from './requestUrl';
let baseUrl = 'https://res.morninggo.cn/';
// let baseUrl = 'http://192.168.110.97:8080/reserve-http/';
// let baseUrl = 'http://restest.morninggo.cn/';

function Auth(data = {}) {
  return Request(baseUrl + api.auth, data, 'get')
}

function Banner(data = {}) {
  return Request(baseUrl + api.banner, data, 'get')
}

function Prepare(data = {}) {
  return Request(baseUrl + api.prepare, data, 'get')
}

function Near(data = {}) {
  return Request(baseUrl + api.near, data, 'get')
}

function getPhone(data = {}) {
  return Request(baseUrl + api.getPhone, data, 'get')
}

function createOrder(data = {}) {
  return Request(baseUrl + api.createOrder, data, 'post')
}

function confirm(data = {}) {
  return Request(baseUrl + api.confirm, data, 'get')
}

function pay(orderId, data = {}) {
  return Request(`${baseUrl + api.pay}?orderId=${orderId}`, data, 'post')
}

function Detail(data = {}) {
  return Request(baseUrl + api.detail, data, 'get')
}

function Cancel(orderId, data = {}) {
  return Request(`${baseUrl + api.cancel}?orderId=${orderId}`, data, 'post')
}

function OrderList(data = {}) {
  return Request(baseUrl + api.orderList, data, 'get')
}

function Recreate(orderId, data = {}) {
  console.log(orderId)
  return Request(`${baseUrl + api.recreate}?orderId=${orderId}`, data, 'post')
}

function Suggest(data = {}) {
  return Request(baseUrl + api.suggest, data, 'post')
}

function Status(data = {}) {
  return Request(baseUrl + api.status, data, 'get')
}

function GetCity(data = {}) {
  return Request(baseUrl + api.getCity, data, 'get')
}

function Search(data = {}) {
  return Request(baseUrl + api.search, data, 'get')
}

function Refund(data = {}) {
  // let paramsData = '';
  // for (var Key in params) {
  //   paramsData += `${Key}=${params[Key]}&`;
  // }
  // paramsData = paramsData.substr(0, paramsData.length - 1);
  let paramsData = [];
  for (const key in data) {
    paramsData.push(`${key}=${data[key]}`)
  }
  return Request(`${baseUrl + api.refund}?${paramsData.join('&')}`,data, 'post')
}

function RefundShow(data = {}) {
  return Request(baseUrl + api.refundShow, data, 'get')
}
module.exports = {
  baseUrl,
  Auth,
  Banner,
  Prepare,
  Near,
  getPhone,
  createOrder,
  confirm,
  pay,
  Detail,
  Cancel,
  OrderList,
  Recreate,
  Suggest,
  Status,
  GetCity,
  Search,
  Refund,
  RefundShow
}
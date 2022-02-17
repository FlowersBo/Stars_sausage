import * as api from '../config/api';
import {
  Request
} from './requestUrl';
let baseUrl = 'https://res.morninggo.cn/';
// let baseUrl = 'https://api.morninggo.cn/';

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
  Suggest
}
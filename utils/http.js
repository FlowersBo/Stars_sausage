import * as api from '../config/api';
import {Request} from './requestUrl';
let baseUrl = 'http://res.morninggo.cn/'; //测试
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
function getPhone(data={}){
  return Request(baseUrl + api.near, data, 'get')
}
module.exports = {
  Auth,
  Banner,
  Prepare,
  Near,
  getPhone
}
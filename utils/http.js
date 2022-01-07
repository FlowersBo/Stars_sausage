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
module.exports = {
  Auth,
  Banner
}
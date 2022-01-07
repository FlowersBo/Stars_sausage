import * as api from '../config/api';
import {Request} from './requestUrl';
let baseUrl = 'https://w3.morninggo.cn/'; //测试
// let baseUrl = 'https://api.morninggo.cn/';

function Banner(data = {}) {
  return Request(baseUrl + api.auth, data, 'get')
}
function Banner(data = {}) {
  return Request(baseUrl + api.banner, data, 'get')
}
module.exports = {
  Banner
}
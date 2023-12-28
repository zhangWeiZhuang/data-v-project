
import request from '../../utils/request'

const bestyoung='http://www.bestyoung.cn:20798'
const juhe='https://apis.juhe.cn'
//模拟登录
export function login(data) {
  return request({
    url: bestyoung+'/login',
    method: 'post',
    data
  })
}

//基础信息
export function basic() {
  return request({
    url: bestyoung+'/bigscreen/basic',
    method: 'get',
  })
}

//获取组织
export function org() {
  return request({
    url: bestyoung+'/bigscreen/org',
    method: 'get',
  })
}

//经营数据
export function businessData(yearMonth) {
  return request({
    url:  bestyoung+`/bigscreen/financedata/${yearMonth}`,
    method: 'get',
  })
}


//幼儿园日常信息-月
export function lifeDataMonth(yearMonth) {
  return request({
    url:  bestyoung+`/bigscreen/lifedatamonth/${yearMonth}`,
    method: 'get',
  })
}

//幼儿园日常信息-天
export function lifeDataDay(yearMonth) {
  return request({
    url: bestyoung+ `/bigscreen/lifedatadaily/${yearMonth}`,
    method: 'get',
  })
}

//增值服务信息
export function valueAddedData(yearMonth) {
  return request({
    url:  bestyoung+`/bigscreen/valueaddeddata/${yearMonth}`,
    method: 'get',
  })
}

//增值服务信息-按年-项目
export function valueaddeddataproj(year) {
  return request({
    url:  bestyoung+`/bigscreen/valueaddeddataproj/${year}`,
    method: 'get',
  })
}

//获取天气
export function weather(city) {
  return request({
    url:  juhe+`/simpleWeather/query?city=${city}&key=d96056bb52732d61745cc4a501e1d65f`,
    method: 'get',
  })
}

import request from "@/utils/request";
export function provincesAll() {
    return request({
      url: "provinces/provincesAll",
      method: "get",
    });
}

export function findCitys(cityNames){
  return request({
    url: `provinces/findCitys/${cityNames}`,
    method: "get"
  })
}


export function provincesTrees(){
  return request({
    url: 'provinces/provincesTrees',
    method: 'get'
  })
}

export function cityTrees(value){
  return request({
    url: `provinces/cityTrees/${value}`,
    method: 'get'
  })
}

export function areaTrees(value){
  return request({
    url: `provinces/areaTrees/${value}`,
    method: 'get'
  })
}
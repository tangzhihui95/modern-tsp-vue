import request from "@/utils/request";


export function updateVersion(data) {
    return request({
      url: 'tsp/tbox/version/updateVersion',
      method: "put",
      data: data
    });
}


export function get(vin) {
    return request({
      url: `tsp/tbox/version/get/${vin}`,
      method: "get",
    });
}
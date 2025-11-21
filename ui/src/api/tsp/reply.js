import request from "@/utils/request";
export function downloadPackage(data) {
    return request({
      url: "tsp/vehicle/downloadPackage",
      method: "post",
      data: data
    });
}

import request from "@/utils/request";

export function getEmmc(vin) {
    return request({
      url: `tsp/vehicle/emmc/getEmmc/${vin}`,
      method: "get",
    });
}
import request from "@/utils/request";
export function sendCommand(data) {
    return request({
      url: "tsp/vehicle/sendCommand",
      method: "post",
      data: data
    });
}

export function getCommandExecuteResult(vin) {
  return request({
    url: `tsp/vehicle/commandExecuteResult/${vin}`,
    method: "get",
  });
}

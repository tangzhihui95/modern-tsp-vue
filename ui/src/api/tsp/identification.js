import request from "@/utils/request";

export function sendVehicleMessage(tspVehicleId) {
  return request({
    url: `/tsp/identification/sendVehicleMessage/${tspVehicleId}`,
  });
}

export function updateVehicleMessage(tspVehicleId) {
  return request({
    url: `/tsp/identification/updateVehicleMessage/${tspVehicleId}`,
  });
}


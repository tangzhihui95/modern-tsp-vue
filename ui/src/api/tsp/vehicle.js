import request from '@/utils/request'

export function list(query) {
  return request({
    url: "/tsp/vehicle/list",
    method: "post",
    data: query,
  });
}

export function listVehicle(query) {
  return request({
    url: "/tsp/vehicle/listVehicle",
    method: "post",
    data: query,
  });
}

export function add(data) {
  return request({
    url: "/tsp/vehicle/add",
    method: "post",
    data: data,
  });
}

export function edit(data) {
  return request({
    url: "/tsp/vehicle/edit",
    method: "put",
    data: data,
  });
}

export function remove(vehicleId) {
  return request({
    url: `/tsp/vehicle/delete/${vehicleId}`,
    method: "delete",
  });
}

export function removes(tspVehicleIds) {
  return request({
    url: `/tsp/vehicle/deletes/${tspVehicleIds}`,
    method: "delete",
  });
}

export function exportVehicle(query) {
  return request({
    url: "/tsp/vehicle/export",
    method: "post",
    data: query,
  });
}

export function exportExFactory(query) {
  return request({
    url: "/tsp/vehicle/exportExFactory",
    method: "post",
    data: query,
  });
}

export function exportSales(query) {
  return request({
    url: "/tsp/vehicle/exportSales",
    method: "post",
    data: query,
  });
}

export function importSales(params) {
  return request({
    url: "/tsp/vehicle/importSales",
    method: "post",
    params: params,
  });
}

export function importVehicle(params) {
  return request({
    url: "/tsp/vehicle/importVehicle",
    method: "post",
    params: params,
  });
}

export function importExFactoryTemplate() {
  return request({
    url: "/tsp/vehicle/importExFactoryTemplate",
    method: "get",
  });
}

export function importSaleTemplate() {
  return request({
    url: "/tsp/vehicle/importSaleTemplate",
    method: "get",
  });
}

export function get(tspVehicleId) {
  return request({
    url: `/tsp/vehicle/get/${tspVehicleId}`,
  });
}

export function equipmentHistory(tspVehicleId) {
  return request({
    url: `/tsp/vehicle/equipmentHistory/${tspVehicleId}`,
  });
}

export function equipmentNow(tspEquipmentId) {
  return request({
    url: `/tsp/vehicle/equipmentNow/${tspEquipmentId}`,
  });
}

export function bind(tspVehicleId) {
  return request({
    url: `/tsp/vehicle/bind/${tspVehicleId}`,
  });
}

export function getAuditInfo(tspVehicleId) {
  return request({
    url: `/tsp/vehicle/getAuditInfo/${tspVehicleId}`,
  });
}

export function scrap(data) {
  return request({
    url: "/tsp/vehicle/scrap",
    method: "put",
    data: data,
  });
}

export function relationMobileOption(){
  return request({
    url: "/tsp/vehicle/relationMobileOption",
    method: "get",
  })
}

export function saleNameList(){
  return request({
    url: "/tsp/vehicle/saleNameList",
    method: "get",
  })
}

export function saleNameListByLikeAddress(address){
  return request({
    url: "/tsp/vehicle/saleNameListByLikeAddress",
    method: "get",
    params:{
      address
    }
  })
}

export function saleNameGetAddress(dealerName){
  return request({
    url: `/tsp/vehicle/saleNameGetAddress/${dealerName}`,
    method: "get",
  })
}

export function dealEquipment(tspEquipmentId){
  return request({
    url: `/tsp/vehicle/dealEquipment/${tspEquipmentId}`,
    method: "get",
  })
}

export function data(){
  return request({
    url: "/tsp/vehicle/data",
    method: "get",
  })
}

export function getRealNameResult(tspVehicleId) {
  return request({
    url: `/tsp/vehicle/getRealNameResult/${tspVehicleId}`,
  });
}

export function getBind(tspVehicleId) {
  return request({
    url: `/tsp/vehicle/getBind/${tspVehicleId}`,
  });
}

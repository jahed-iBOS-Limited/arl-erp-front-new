import axios from "axios";

export function getDeliveryInfoById(id) {
  return axios.get(`/wms/Delivery/GetDeliveryInfoByID?DeliveryId=${id}`);
}

export function saveDeliveryData(data) {
  return axios.put(`/wms/Delivery/EditDeliveryOrders`, data);
}

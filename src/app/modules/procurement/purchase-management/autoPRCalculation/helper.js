import { confirmAlert } from "react-confirm-alert";
import { savePurchaseRequest } from "../purchaseRequestNew/helper";
import { _todayDate } from "../../../_helper/_todayDate";

const IConfirmModal = props => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
        title: title,
        message: message,
        buttons: [
            {
                label: 'Ok',
                onClick: () => noAlertFunc(),
            },
        ],
    });
};

export const createPurchaseRequest = ({rowData, singleRowData, profileData, selectedBusinessUnit, sbuList, cb, setDisabled}) => {
   let createPurchaseRequestRow = rowData?.map(item => ({
             itemId: singleRowData?.itemId,
             uoMid: singleRowData?.uoMid,
             uoMname: singleRowData?.uomName,
             numRequestQuantity: +item?.requestQuantity,
             dteRequiredDate: item?.purchaseRequestDate,
             billOfMaterialId: 0,
             remarks: 'For production',
   
           }));
   
           let payload = {
             createPurchaseRequestHeader: {
   
               accountId: profileData?.accountId,
               accountName: profileData?.accountName,
               actionBy: profileData?.userId,
               businessUnitId: selectedBusinessUnit?.value,
               businessUnitName: selectedBusinessUnit?.label,
               costControlingUnitId: 0,
               costControlingUnitName: "",
               deliveryAddress: rowData[0]?.warehouseAddress || "",
               plantId: rowData[0]?.plantId,
               plantName: rowData[0]?.plantName,
               purchaseOrganizationId: rowData[0]?.purchaseOrganizationId || 0,
               purchaseOrganizationName: rowData[0]?.purchaseOrganizationName || "",
               purchaseRequestCode: "",
               purchaseRequestTypeId: 2,
               purchaseRequestTypeName: "Standard PR",
               reffNo: "",
               requestDate: _todayDate(),
               requiredDate: rowData[0]?.purchaseRequestDate,
               sbuid: sbuList[0]?.value,
               sbuname: sbuList[0]?.label,
               strPurpose: "Raw material requirement",
               supplyingWarehouseId: 0,
               supplyingWarehouseName: "",
               warehouseId: rowData[0]?.warehouseId,
               warehouseName: rowData[0]?.warehouseName,
             },
             createPurchaseRequestRow,
           };
           savePurchaseRequest(payload, cb, setDisabled, IConfirmModal);
}


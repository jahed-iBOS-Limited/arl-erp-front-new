import { confirmAlert } from "react-confirm-alert";
import { savePurchaseRequest } from "../purchaseRequestNew/helper";

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

const createPurchaseRequest = (values, profileData, rowData, selectedBusinessUnit, location, rowDto, cb, setDisabled) => {
    let createPurchaseRequestRow = rowDto?.map(item => ({
        itemId: item?.itemName?.value,
        uoMid: item?.uomName?.value || item?.itemName?.baseUoMId,
        uoMname: item?.itemName?.baseUoMName,
        numRequestQuantity: +item?.quantity,
        dteRequiredDate: item?.requiredDate,
        costElementId: item?.costElement?.value,
        costElementName: item?.costElement?.label,
        billOfMaterialId: 0,
        remarks: item?.rowPurpose || '',
    }));

    let payload = {
        createPurchaseRequestHeader: {
            purchaseRequestCode: '',
            reffNo: values?.refNo,
            purchaseRequestTypeId: values?.requestType?.value,
            purchaseRequestTypeName: values?.requestType?.label,
            accountId: profileData?.accountId,
            accountName: profileData?.accountName,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuid: location?.state?.sbu?.value,
            sbuname: location?.state?.sbu?.label,
            purchaseOrganizationId: location?.state?.po?.value,
            purchaseOrganizationName: location?.state?.po?.label,
            plantId: location?.state?.plant?.value,
            plantName: location?.state?.plant?.label,
            warehouseId: location?.state?.wh?.value,
            warehouseName: location?.state?.wh?.label,
            deliveryAddress: values?.address,
            supplyingWarehouseId: values?.supplyingWh?.value || 0,
            supplyingWarehouseName: values?.supplyingWh?.label || '',
            requestDate: values?.requestDate,
            actionBy: profileData?.userId,
            costControlingUnitId: values?.controllingUnit?.value || 0,
            costControlingUnitName: values?.controllingUnit?.value || '',
            costCenterName: values?.costCenter?.label,
            costCenterId: values?.costCenter?.value,
            costElementId: values?.costElement?.value,
            costElementName: values?.costElement?.label,
            requiredDate: values?.requiredDate,
            strPurpose: values?.purpose || '',
        },
        createPurchaseRequestRow,
    };
    savePurchaseRequest(payload, cb, setDisabled, IConfirmModal);
}


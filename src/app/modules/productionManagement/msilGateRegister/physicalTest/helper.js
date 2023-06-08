import { _todayDate } from "../../../_helper/_todayDate";

export function makePayload({ isEdit, values, buId, userId, fields, headerId }) {
    return {
        "qcTransactionHeaderId": headerId || 0,
        "shiftId": values?.shift?.value || 0,
        "shiftName": values?.shift?.label || "",
        "qcTransactionCode": "",
        "transactionDate": values?.date,
        "startTime": values?.time,
        "machineId": values?.vrmName?.value || 0,
        "machineName": values?.vrmName?.label || "",
        "isActive": true,
        "itemId": 0,
        "itemName": "",
        "itemTypeId": 0,
        "itemTypeName": "",
        "sl": 0,
        "businessUnitId": buId,
        "sbuId": 0,
        "plantId": 0,
        "employeeId": 0,
        "comments": values?.remarks,
        "createdby": isEdit ? 0 : userId,
        "createdAt": isEdit ? null : _todayDate(),
        "updatedby": isEdit ? userId : 0,
        "updatedAt": isEdit ? _todayDate() : null,
        "durationInMinute1": values?.initialTime || "",
        "durationInMinute2": values?.finalTime || "",
        "qcTestType": "PhysicalTest",
        "row": fields?.data?.map((item) => ({
            "qcParameterId": item?.qcParameterId,
            "qcParameterName": item?.qcParameterName,
            "uoMname": item?.uoMname,
            "quantity": +item?.quantity,
            "createdby": userId,
            "createdAt": _todayDate(),
        }))
    }
}
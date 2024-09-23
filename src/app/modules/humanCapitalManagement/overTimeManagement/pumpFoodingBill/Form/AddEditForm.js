import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getTimeDifference } from "../../../../chartering/_chartinghelper/_getDateDiff";
import { pumpFoodingBillEntry } from "../helper";
import Form from "./Form";

const initData = {
  workPlace: "",
  employee: "",
  enroll: "",
  designation: "",
  designationId: "",
  code: "",
  date: _todayDate(),
  startTime: "",
  endTime: "",
  hours: "",
  otCount: "",
  taka: "",
  remarks: "",
  warehouse: "",
  plant: "",
};

const headers = [
  "SL",
  "Employee Name",
  "Enroll",
  "Workplace",
  "Designation",
  "Start Date",
  "Start Time",
  "End Date",
  "End Time",
  "Taka",
  "Remarks",
  "Action",
];

export function PumpFoodingBill() {
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [plantDDL, getPlantDDL] = useAxiosGet();

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, userId]);

  const addHandler = (values, cb) => {
    try {
      const exists = rowData?.filter((item) => {
        const compareTimeIntervals = () => {
          const fromDateTime = new Date(
            `${values.fromDate} ${values.fromTime}`
          ).getTime();
          const toDateTime = new Date(
            `${values.toDate} ${values.toTime}`
          ).getTime();
          const preFromDateTime = new Date(
            `${item?.date} ${item?.startTime}`
          ).getTime();
          const preToDateTime = new Date(
            `${item?.endDate} ${item?.endTime}`
          ).getTime();

          //check is the employee is available in this intervale of date time
          const isAddable =
            (preFromDateTime >= fromDateTime &&
              preFromDateTime <= toDateTime) ||
            (preToDateTime >= fromDateTime && preToDateTime <= toDateTime);

          if (isAddable) {
            return true;
          } else return false;
        };

        return compareTimeIntervals();
      });
      if (
        exists?.length > 0 &&
        exists?.some((item) => +item?.employeeId === +values?.employee?.value)
      ) {
        return toast.warn("Employee is not available in this time interval!");
      }
      // custom validation for warehouse
      const warehouseLabel = values?.warehouse?.label;
      const warehouseValue = values?.warehouse?.value;      
      if (!warehouseLabel || !warehouseValue)
        return toast.warn("Please select warehouse");

      const diff = getTimeDifference(
        values?.date,
        values?.startTime,
        values?.endTime
      );
      const newRow = {
        employeeId: values?.employee?.value,
        employeeName: values?.employee?.label,
        enroll: values?.enroll,
        designation: values?.designation,
        businessUnitId: buId,
        workplaceId: values?.workPlace?.value,
        workplaceName: values?.workPlace?.label,
        date: values?.fromDate,
        endDate: values?.toDate,
        startTime: values?.fromTime,
        endTime: values?.toTime,
        hours: 0,
        // hours: diff,
        otcount: diff,
        taka: values?.taka,
        billAmount: values?.taka,
        remarks: values?.remarks,
        insertBy: userId,
        approvedBySupervisorId: 0,
        wareHouseId: values?.warehouse?.value,
        wareHouseName: values?.warehouse?.label,
        attachmentUrl: values?.attachmentUrl,
      };
      setRowData([...rowData, newRow]);
      console.log({ newRow });
      cb();
    } catch (error) {
      alert(error);
    }
  };

  const deleteHandler = (index) => {
    setRowData(rowData?.filter((_, i) => i !== index));
  };

  const saveHandler = async (cb) => {
    pumpFoodingBillEntry(rowData, setLoading, () => {
      cb();
      setRowData([]);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="mt-0">
        <Form
          buId={buId}
          accId={accId}
          userId={userId}
          headers={headers}
          rowData={rowData}
          plantDDL={plantDDL}
          initData={initData}
          addHandler={addHandler}
          saveHandler={saveHandler}
          deleteHandler={deleteHandler}
        />
      </div>
    </>
  );
}

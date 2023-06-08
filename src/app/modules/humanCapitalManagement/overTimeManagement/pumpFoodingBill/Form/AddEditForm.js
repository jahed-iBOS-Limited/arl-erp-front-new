import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getTimeDifference } from "../../../../chartering/_chartinghelper/_getDateDiff";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getWorkplaceDDL_api, pumpFoodingBillEntry } from "../helper";
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
  const [workPlaceDDL, setWorkplaceDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [plantDDL, getPlantDDL] = useAxiosGet();

  useEffect(() => {
    getWorkplaceDDL_api(accId, buId, setWorkplaceDDL);
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, userId]);

  const addHandler = (values, cb) => {
    try {
      const exists = rowData?.filter(
        (item) =>
          item?.employeeId === values?.employee?.value &&
          values?.date === item?.date
      );
      if (exists?.length > 0) {
        return toast.warn("Duplicate item not allowed!");
      }

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
      };
      setRowData([...rowData, newRow]);
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
          workPlaceDDL={workPlaceDDL}
          deleteHandler={deleteHandler}
        />
      </div>
    </>
  );
}

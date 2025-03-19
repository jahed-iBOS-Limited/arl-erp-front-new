/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { GetSalesOrganizationDDL_api } from "../../../../salesManagement/report/shipToPartyDelivery/helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getEmployeeDDL } from "../../performanceAppraisal/helper";
import { bulkKPIEntry } from "../helper";
import Form from "./form";

const initData = {
  SO: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  employee: "",
  month: "",
  year: "",
};

export default function BulkKPIEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [rowData, setRowData] = useState([]);
  const [soDDL, setSoDDL] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [, getKPIList, loader] = useAxiosGet();
  const [isLoading, setLoading] = useState(false);
  const [tempRows, setTempRows] = useState([]);

  useEffect(() => {
    GetSalesOrganizationDDL_api(accId, buId, setSoDDL);
    getEmployeeDDL(accId, buId, setEmployeeList);
  }, [accId, buId]);

  const getPendingKPI = (values) => {
    getKPIList(
      `/oms/SalesInformation/GetSalesForceKPIAchivementInfo?intPartid=1&intunitid=${buId}&intSalesOrganizationId=${values?.SO?.value}&fromdate=${values?.fromDate}&todate=${values?.toDate}&intAreaid=${values?.area?.value}&intemployeeid=${values?.employee?.value}`,
      (resData) => {
        setRowData(resData?.map((item) => ({ ...item, isSelected: false })));
        setTempRows(resData?.map((item) => ({ ...item, isSelected: false })));
      }
    );
  };

  const saveHandler = (values, cb) => {
    const payload = rowData
      ?.filter((item) => item?.isSelected)
      ?.map((item) => ({
        employeeId: item?.intEmployeeId,
        rowId: item?.intRowId,
        achievement: item?.numAchivement || 0,
      }));
    bulkKPIEntry(payload, setLoading, () => {
      cb();
      setRowData([]);
    });
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  return (
    <>
      {(isLoading || loader) && <Loading />}
      <div className="mt-0">
        <Form
          soDDL={soDDL}
          rowData={rowData}
          tempRows={tempRows}
          initData={initData}
          allSelect={allSelect}
          setRowData={setRowData}
          selectedAll={selectedAll}
          saveHandler={saveHandler}
          employeeList={employeeList}
          getPendingKPI={getPendingKPI}
          rowDataHandler={rowDataHandler}
        />
      </div>
    </>
  );
}

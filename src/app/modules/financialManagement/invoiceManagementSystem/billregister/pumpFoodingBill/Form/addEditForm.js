import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getWarehouseDDL } from "../../helper";
import Form from "./form";

const initData = {
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  warehouse: { value: "", label: "All" },
  toDate: _todayDate(),
  fromDate: _todayDate(),
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
  "Approve Amount",
  "Remarks",
];

export default function PumpFoodingBillForm() {
  const [fileObjects, setFileObjects] = useState([]);
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [supplierDDL, setSupplierDDL] = useState([]);
  const [warehouseDDL, setWareHouseDDL] = useState([]);
  const [uploadedImage, setUploadedImage] = useState("");
  const { state: headerData } = useLocation();
  const [rowData, getRowData, loader, setRowData] = useAxiosGet({ data: [] });
  const [, postData, loading] = useAxiosPost();

  const billType = headerData?.billType?.value;

  useEffect(() => {
    if (accId && buId && headerData?.plant?.value) {
      getWarehouseDDL(
        userId,
        accId,
        buId,
        headerData?.plant?.value,
        setWareHouseDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, headerData]);

  const getRows = (values) => {
    getRowData(
      `/hcm/MenuListOfFoodCorner/GetPumpFoodingBillPagination?BusinessUnitId=${buId}&warehouseId=${values?.warehouse?.value}&Status=3&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=1&PageSize=1000&ViewOrder=desc`
    );
  };

  const saveHandler = async (values, cb) => {
    const selectedItems = rowData?.data?.filter((item) => item?.isSelected);
    // const totalAmount = selectedItems?.reduce(
    //   (total, row) => total + row.billAmount,
    //   0
    // );
    const payload = {
      billRegister: selectedItems?.map((item) => ({
        autoId: item?.autoId,
        naration: values?.narration,
        adjustAmount: 0,
        netAmount: item?.billAmount,
        billRef: values?.billNo,
        billTypeId: billType,
      })),
      image: {
        imageId: uploadedImage[0]?.id,
      },
    };
    postData(
      `/hcm/HCMOverTime/PumpFoodingBillRegisterSave?accountId=${accId}&businessUnitId=${buId}&actionById=${userId}&advanceAmount=0`,
      payload,
      () => {},
      true
    );
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;
    setRowData({
      ...rowData,
      data: _data,
    });
  };

  const allSelect = (value) => {
    let _data = [...rowData?.data];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData({
      ...rowData,
      data: modify,
    });
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.length
      ? true
      : false;
  };

  const [objProps, setObjprops] = useState({});
  return (
    <div className="purchaseInvoice">
      <IForm
        title="Pump Fooding Bill"
        getProps={setObjprops}
        isDisabled={loader || loading}
      >
        {(loader || loading) && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accId={accId}
          buId={buId}
          rowData={rowData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          headerData={headerData}
          supplierDDL={supplierDDL}
          setSupplierDDL={setSupplierDDL}
          warehouseDDL={warehouseDDL}
          getRows={getRows}
          headers={headers}
          selectedAll={selectedAll}
          allSelect={allSelect}
          rowDataHandler={rowDataHandler}
          setUploadedImage={setUploadedImage}
        />
      </IForm>
    </div>
  );
}

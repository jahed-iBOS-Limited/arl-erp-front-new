/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import {
  GetSupplier_api,
  getLandingData,
  saveCommercialPayment,
} from "../helper";
import Form from "./form";

let initData = {
  polcNo: "",
  supplier: "",
  billingStatus:  { value: 0, label: "Pending" },
  billNo: "",
  fromDate:_dateFormatter(new Date(new Date().setDate(new Date().getDate()-7))),
  toDate:_todayDate(),
  vatamount: "",
  chargeType:"",
  subChargeType:"",
};

const statusOption = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Done" },
];

export function CommercialPayment() {
  const [isDisabled, setDisabled] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [rowDto, setRowDto] = useState([]);
  const [allSelect, setAllSelect] = useState(false);
  const [uploadImage, setUploadImage] = useState([]);
  const [objProps] = useState({});
  const [totalCount, setTotalCount] = useState("");
  const { state } = useLocation();
  

  const [supplierDDL, setSupplierDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const rowDtoSelectHandler = (costTypeName, name, value, sl, item) => {
    if(item?.modifyVatPercentage){
      return toast.warn("After modifying Modify Vat Percentage you cannot check or uncheck. If you want to change, reload this page and do it again")
    }
    let data = [...rowDto];
    const isCheckPreviousVlaue = data.some(
      (item) => item?.costTypeName === costTypeName && item?.isSelect
    );
    if (isCheckPreviousVlaue) {
      let _sl = data[sl];
      _sl[name] = value;
      setRowDto(data);
    } else {
     const modifiedData = data.map(item=>({...item,isSelect:false}))
     let _sl = modifiedData[sl];
     _sl[name] = value;
     setRowDto(modifiedData);
    }
  };

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    setRowDto(data);
  };

  const setAllCheck = () => {
    setAllSelect(!allSelect);
    const data = rowDto?.map((item) =>{
      if(item.costTypeId===12 || item.costTypeId===21 || item.costTypeId===22){
        return({
          ...item,
          isSelect: false,
        })
      }else{
        return({
          ...item,
          isSelect: !allSelect,
        })
      }
    });
    setRowDto(data);
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetSupplier_api(
        setDisabled,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSupplierDDL
      );
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        "",
        "",
        0,
        setRowDto,
        pageNo,
        pageSize,
        setDisabled,
        setTotalCount
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const getLandingDataForCommercialBill = (poLc, supplierId, billingStatus, chargeTypeName = "", subChargeTypeId = 0) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      poLc,
      supplierId,
      billingStatus,
      setRowDto,
      pageNo,
      pageSize,
      setDisabled,
      setTotalCount,
      chargeTypeName,
      subChargeTypeId
    );
  };

  const saveHandler = (values, cb) => {
    if (values?.billNo) {
      saveCommercialPayment(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        state?.plant?.value,
        state?.sbu?.value,
        values?.supplier?.value,
        profileData?.userId,
        values?.billNo,
        uploadImage[0]?.id || "",
        rowDto,
        setDisabled,
        cb,
        () => getLandingDataForCommercialBill("", "", 0, "", 0)
      );
    } else {
      toast.error("Please Enter Bill No");
    }
  };

const rowData = rowDto.map((item) => ({
    ...item,
    vatAmount: item?.vatamount,
  }));
  console.log('data', rowData);

  return (
    <>
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          pageNo={pageNo}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setPageNo={setPageNo}
          saveHandler={saveHandler}
          selectedBusinessUnit={selectedBusinessUnit}
          profileData={profileData}
          rowDto={rowDto}
          setRowDto={setRowDto}
          supplierDDL={supplierDDL}
          statusOption={statusOption}
          getLandingDataForCommercialBill={getLandingDataForCommercialBill}
          rowDtoHandler={rowDtoHandler}
          setAllCheck={setAllCheck}
          setUploadImage={setUploadImage}
          setDisabled={setDisabled}
          setTotalCount={setTotalCount}
          totalCount={totalCount}
          state={state}
          rowDtoSelectHandler={rowDtoSelectHandler}
        />
      </div>
    </>
  );
}

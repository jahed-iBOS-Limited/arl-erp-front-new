/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getDistributionChannelDDL_api } from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getSalesOrgList,
  getTargetQtyList,
  liftingEntryApproveApi,
} from "../helper";
import Form from "./form";
import * as Yup from "yup";
import { toast } from "react-toastify";

export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const date = new Date();
export const yearsDDL = [];

let year = date.getFullYear();
let max = year + 5;

for (var i = year - 5; i <= max; i++) {
  yearsDDL.push({ value: i, label: i });
}

const initData = {
  liftingPlanType: { value: 1, label: "Lifting Entry" },
  month: "",
  year: "",
  salesOrg: "",
  channel: "",
  item: "",
  area: "",
  region: "",
  status: "unapproved",
};

const validationSchema = Yup.object().shape({
  liftingPlanType: Yup.object().shape({
    value: Yup.string().required("Please select lifting plan type"),
    label: Yup.string().required("Please select lifting plan type"),
  }),
  month: Yup.object().shape({
    value: Yup.string().required("Please select month"),
    label: Yup.string().required("Please select month"),
  }),
  year: Yup.object().shape({
    value: Yup.string().required("Please select year"),
    label: Yup.string().required("Please select year"),
  }),
  salesOrg: Yup.object().shape({
    value: Yup.string().required("Please select sales organization"),
    label: Yup.string().required("Please select sales organization"),
  }),
  channel: Yup.object().shape({
    value: Yup.string().required("Please select distribution channel"),
    label: Yup.string().required("Please select distribution channel"),
  }),
  item: Yup.object().shape({
    value: Yup.string().required("Please select item"),
    label: Yup.string().required("Please select item"),
  }),
  area: Yup.object().shape({
    value: Yup.string().required("Please select area"),
    label: Yup.string().required("Please select area"),
  }),
  region: Yup.object().shape({
    value: Yup.string().required("Please select region"),
    label: Yup.string().required("Please select region"),
  }),
});

export default function LiftingEntryApproveForm() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [isDisabled, setIsDisabled] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [salesOrgs, setSalesOrgs] = useState([]);
  const [totalLiftingQty, setTotalLiftingQty] = useState(0);

  useEffect(() => {
    getDistributionChannelDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributionChannelDDL
    );
    getSalesOrgList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSalesOrgs,
      setIsDisabled
    );
  }, [profileData, selectedBusinessUnit]);

  const commonGridFunc = (values) => {
    getTargetQtyList(
      selectedBusinessUnit?.value,
      values?.item?.value,
      values?.liftingPlanType?.value,
      values?.month?.value,
      values?.year?.value,
      values?.area?.value,
      setRowData,
      setIsDisabled
    );
  };

  const saveHandler = async (values) => {
    const filterIsSelect = rowData?.filter((item) => item?.isSelected);

    if (filterIsSelect?.length === 0) {
      return toast.warn("Please select atleast one row");
    }

    const payload = filterIsSelect?.map((item) => {
      return {
        intId: item?.intId,
        numApproveQuantity: +item?.liftingQty || 0,
        strRemarks: item?.remarks || "",
        isApprove: true,
        intApproveBy: profileData?.userId,
      };
    });

    liftingEntryApproveApi(payload, setIsDisabled, () => {
      commonGridFunc(values);
    });
  };

  const [objProps, setObjProps] = useState({});

  const dataChangeHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
    setRowData(_data);
    const total = _data
      ?.filter((item) => item?.isSelected)
      .reduce((a, b) => a + Number(b?.liftingQty), 0);
    setTotalLiftingQty(total);
    console.log(total, "total");
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return { ...item, isSelected: value };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.filter((item) => item.isSelected)?.length ===
      rowData?.length && rowData?.length > 0
      ? true
      : false;
  };

  return (
    <IForm
      isHiddenReset={true}
      title={"Lifting Approve"}
      getProps={setObjProps}
      isDisabled={
        isDisabled || rowData?.filter((item) => item.isSelected)?.length < 1
      }
      submitBtnText={"Approve"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        distributionChannelDDL={distributionChannelDDL}
        rowData={rowData}
        setRowData={setRowData}
        commonGridFunc={commonGridFunc}
        loading={isDisabled}
        dataChangeHandler={dataChangeHandler}
        monthDDL={monthDDL}
        salesOrgs={salesOrgs}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setLoading={setIsDisabled}
        yearsDDL={yearsDDL}
        validationSchema={validationSchema}
        selectedAll={selectedAll}
        allSelect={allSelect}
        totalLiftingQty={totalLiftingQty}
      />
    </IForm>
  );
}

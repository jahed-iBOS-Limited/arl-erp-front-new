/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getDistributionChannelDDL_api } from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getSalesOrgList,
  getTargetQtyList,
  liftingEntryAPI,
  liftingEntryEditAPI,
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

export default function LiftingEntryForm() {
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
    const payload = rowData
      ?.map((item, i) => {
        return {
          intId: item?.intId || 0,
          intItemId: values?.item?.value,
          strItemName: values?.item?.label,
          intUomid: 0,
          strUomname: "",
          numTargetQuantity: +item?.liftingQty || 0,
          numApproveQuantity: 0,
          isActive: true,
          strRemarks: item?.remarks,
          intUnitId: selectedBusinessUnit?.value,
          intRequistionBy: profileData?.userId,
          dteFromDate: item?.date,
          intDayId: i + 1,
          intTargetYear: values?.year?.value,
          intTargetMonth: values?.month?.value,
          intEntryTypeId: values?.liftingPlanType?.value,
          strEntryTypeName: values?.liftingPlanType?.label,
          intL6id: values?.area?.value,
          strNl6: values?.area?.label,
          isSelected: item?.isSelected,
          isApprove: item?.isApprove,
        };
      })
      .filter((item) => item?.isSelected && !item?.isApprove);

    if (payload?.length === 0) {
      return toast.warn("Please select atleast one row");
    }

    const checkLiftingQty = payload?.filter(
      (item) => Number(item?.numTargetQuantity) < 1
    );

    if (checkLiftingQty?.length > 0) {
      return toast.warn(
        "Lifting qty should be greater than 0 in all selected rows"
      );
    }

    const filterEditMode = payload?.some((item) => item?.intId);
    if (filterEditMode) {
      liftingEntryEditAPI(payload, setIsDisabled);
    } else {
      liftingEntryAPI(payload, setIsDisabled, () => {
        setRowData([]);
      });
    }
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
    const modify = _data?.map((item) => {
      if (item?.isApprove) {
        return item;
      } else {
        return { ...item, isSelected: value };
      }
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
      title={"Lifting Entry"}
      submitBtnText={
        rowData?.filter((item) => item?.isSelected && item?.intId)?.length > 0
          ? "Edit"
          : "Save"
      }
      getProps={setObjProps}
      isDisabled={
        isDisabled || rowData?.filter((item) => item.isSelected)?.length < 1
      }
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        distributionChannelDDL={distributionChannelDDL}
        rowData={rowData}
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

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getDistributionChannelDDL_api } from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  CastingScheduleEntryEditAPI,
  CastingScheduleEntrySaveAPI,
  getCastingEntryById,
  getSalesOrgList,
  getShipPointist,
} from "../helper";
import Form from "./form";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import moment from "moment";

const date = new Date();

const initData = {
  dteInformationDate: moment(date).format("YYYY-MM-DD HH:mm"),
  dteCastingDate: "", // Date & Time,
  dteDemandDate: _todayDate(),
  customer: "", // DDL
  strAddress: "",
  strContactPerson: "",
  workType: "", // DDL
  strRemarks: "",
  salesOrg: "", // DDL for item
  shipPoint: "", // DDL
  item: "", // DDL
  numQuantity: 0,
  strShift: { value: 1, label: "Day" }, // DDL
  intNumberOfPump: 0,
  intPipeFeet: 0,
  intLargeTyre: 0,
  intSmallTyre: 0,
  intBagCementUse: 0,
  castingProcedure: "", // DDL, search ddl
  buetTestReportDay: "",
  waterproof: "",
  phone:"",
  nonPump:"",
};

const validationSchema = Yup.object().shape({
  dteCastingDate: Yup.string().required("Field is required"),
  customer: Yup.object().shape({
    value: Yup.string().required("Customer is required"),
    label: Yup.string().required("Customer is required"),
  }),
  strAddress: Yup.string().required("Field is required"),
  strContactPerson: Yup.string().required("Field is required"),
  workType: Yup.object().shape({
    value: Yup.string().required("Work Type is required"),
    label: Yup.string().required("Work Type is required"),
  }),
  castingProcedure: Yup.object().shape({
    value: Yup.string().required("Field is required"),
    label: Yup.string().required("Field is required"),
  }),
  shipPoint: Yup.object().shape({
    value: Yup.string().required("Field is required"),
    label: Yup.string().required("Field is required"),
  }),
});

export default function CastingScheduleForm() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const params = useParams();

  const [isDisabled, setIsDisabled] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [salesOrgs, setSalesOrgs] = useState([]);
  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    getDistributionChannelDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributionChannelDDL
    );
    getShipPointist(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShipPointDDL
    );
    getSalesOrgList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSalesOrgs,
      setIsDisabled
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      getCastingEntryById(params.id, setSingleData, setIsDisabled, setRowData);
    }
  }, [params?.id]);

  const saveHandler = async (values) => {
    if (rowData?.length <= 0) return toast.warn("Please add atleast one item");

    const payload = {
      header: {
        intId: params?.id || 0,
        dteInformationDate: values?.dteInformationDate,
        dteDemandDate: values?.dteDemandDate,
        dteCastingDate: values?.dteCastingDate,
        intCustomerId: values?.customer?.value,
        strCustomerName: values?.customer?.label,
        strAddress: values?.strAddress,
        strContactPerson: values?.strContactPerson,
        strRemarks: values?.strRemarks,
        intWorkTypeId: values?.workType?.value,
        strWorkTypeName: values?.workType?.label,
        numTotalOrderQuantity: rowData?.reduce(
          (acc, obj) => acc + +obj?.numQuantity,
          0
        ),
        numItemSalesRate: 1,
        intUnitId: selectedBusinessUnit?.value,
        intRequistionBy: profileData?.userId,
        intTargetYear: +values?.dteDemandDate?.split("-")[0],
        intTargetMonth: +values?.dteDemandDate?.split("-")[1],
        intEntryTypeId: 3,
        strEntryTypeName: "Casting Plan",
        intl7Id: 0,
        strNl7: "",
        intL6id: 0,
        strNl6: "",
        intL5id: 0,
        strNl5: "",
        intDayId: +values?.dteDemandDate?.split("-")[2],
        intYearId: +values?.dteDemandDate?.split("-")[0],
        intMonthId: +values?.dteDemandDate?.split("-")[1],

        intShippingPointID: values?.shipPoint?.value,
        strShippingPointName: values?.shipPoint?.label,
        intCastingProcedureBy: values?.castingProcedure?.value,
        strCastingProcedureBy: values?.castingProcedure?.label,
        intStatus: 0,
        strStatus: "pending",
        intTestReportDayId: values?.buetTestReportDay?.value,
        strTestReportDay: values?.buetTestReportDay?.label,
        strConcernPhone: values?.phone || "",
      },
      row: rowData,
    };

    if (params?.id) {
      CastingScheduleEntryEditAPI(payload, setIsDisabled, () => {});
    } else {
      CastingScheduleEntrySaveAPI(payload, setIsDisabled, () => {
        setRowData([]);
      });
    }
  };

  const dataChangeHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
    setRowData(_data);
  };

  const [objProps, setObjProps] = useState({});
  return (
    <IForm
      isHiddenReset={true}
      title={"Casting Schedule Entry"}
      getProps={setObjProps}
      isDisabled={isDisabled || params?.type === "view"}
      isHiddenSave={params?.type === "view"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        distributionChannelDDL={distributionChannelDDL}
        rowData={rowData}
        setRowData={setRowData}
        salesOrgs={salesOrgs}
        loading={isDisabled}
        dataChangeHandler={dataChangeHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setLoading={setIsDisabled}
        validationSchema={validationSchema}
        shipPointDDL={shipPointDDL}
      />
    </IForm>
  );
}

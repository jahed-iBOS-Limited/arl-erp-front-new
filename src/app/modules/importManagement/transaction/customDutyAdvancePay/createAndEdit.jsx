import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { getShipmentDDL } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  poLc: "",
  shipment: "",
  paymentType: "",
  narration: "",
  paymentAmount: "",
};

const validationSchema = Yup.object().shape({
  poLc: Yup.object()
    .shape({
      label: Yup.string().required("PO is required"),
      value: Yup.string().required("PO is required"),
    })
    .typeError("PO is required"),
  shipment: Yup.object()
    .shape({
      label: Yup.string().required("Shipment is required"),
      value: Yup.string().required("Shipment is required"),
    })
    .typeError("Shipment is required"),
  paymentType: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),

  narration: Yup.string().required("Narration is required"),
  paymentAmount: Yup.number().required("Payment Amount is required"),
  //   date: Yup.date().required("Date is required"),
});

export default function CustomDutyAdvancePayCreateEdit() {


  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [shipmentDDL, setShipmentDDL] = useState(false);
  const [typeDDL, getTypeDDL, typeLoading, setTypeDDL] = useAxiosGet()
  const [, customDutyAdvancePayCreateEdit] = useAxiosPost()
  const [, getSingleData, singleLoading] = useAxiosGet()
  const [modifyData, setModifyData] = useState({})
  const { state } = useLocation();

  useEffect(() => {
    if (state?.intCustomDutyAdvancePaymentId) {
      getSingleData(`/imp/CustomDuty/GetCustomDutyAdvancePaymentById?intCustomDutyAdvancePaymentId=${state?.intCustomDutyAdvancePaymentId}`,
        (res) => {
          const data = {
            poLc: {
              value: res?.intPoId,
              label: res?.strPoNo,
            },
            shipment: {
              value: res?.intShipmentId,
              label: res?.strShipmentCode,
            },
            paymentType: {
              value: res?.intPaymentTypeId,
              label: res?.strPaymentType,
            },
            narration: res?.strNarration,
            paymentAmount: res?.numPaymentAmount,
          }
          setModifyData(data)
        }
      )
    }
    getTypeDDL(`/imp/CustomDuty/GetAllAdvancePaymentType`,
      (res) => {
        const data = res?.map((item) => {
          return {
            ...item,
            value: item?.intPaymentTypeId,
            label: item?.strPaymentType,
          };
        });
        setTypeDDL(data);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get PO List DDL
  const polcList = (v) => {
    if (v?.length < 3) return [];
    return axios.get(
      `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };
  const [objProps, setObjprops] = useState({});


  const saveHandler = (values, cb) => {

    const payload = {
      intCustomDutyAdvancePaymentId: state?.intCustomDutyAdvancePaymentId ? state?.intCustomDutyAdvancePaymentId : 0,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intPoId: values?.poLc?.poId || 0,
      intShipmentId: values?.shipment?.value,
      dtShipmentDate: _todayDate(),
      intPaymentTypeId: values?.paymentType?.value || 0,
      strPaymentType: values?.paymentType?.label || "",
      strNarration: values?.narration || "",
      numPaymentAmount: values?.paymentAmount || 0,
      intBillId: 0,
      isReceived: false,
      dtReceivedDate: null,
      isActive: true,
      intActionBy: profileData?.userId,
      dtLastActionDate: _todayDate()
    }
    console.log("edit")
    customDutyAdvancePayCreateEdit(`/imp/CustomDuty/CreateNUpdateCustomDutyAdvancePayment`, payload,
      () => { },
      true
    )
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={state?.intCustomDutyAdvancePaymentId ? modifyData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(typeLoading || singleLoading) && <Loading />}
          <IForm title="Custom Duty Advance Payment" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-md-3 col-lg-3">
                  <label>PO</label>
                  <SearchAsyncSelect
                    selectedValue={values?.poLc}
                    isSearchIcon={true}
                    paddingRight={10}
                    name="poLc"
                    handleChange={(valueOption) => {
                      setFieldValue("poLc", valueOption);
                      getShipmentDDL(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.label,
                        setShipmentDDL
                      );
                      setFieldValue("shipment", "");
                      //   getGrid(
                      //     valueOption?.label,
                      //     valueOption ? values?.shipment?.value : ""
                      //   );
                    }}
                    isDisabled={state?.intCustomDutyAdvancePaymentId}
                    loadOptions={polcList || []}
                    placeholder="Search by PO"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.item}
                    label="Item"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="shipment"
                    options={shipmentDDL || []}
                    label="Shipment No"
                    value={values?.shipment}
                    onChange={(valueOption) => {
                      setFieldValue("shipment", valueOption);
                      //   getGrid(values?.poLc?.label, valueOption?.value);
                      // getLandingData(
                      //   profileData?.accountId,
                      //   selectedBusinessUnit?.value,
                      //   valueOption?.value,
                      //   values?.poLc?.label,
                      //   pageSize,
                      //   pageNo,
                      //   setGridData
                      // );
                    }}
                    placeholder="Shipment"
                    errors={errors}
                    isDisabled={state?.intCustomDutyAdvancePaymentId}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentType"
                    options={typeDDL || []}
                    label="Type"
                    value={values?.paymentType}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("paymentType", valueOption);
                      } else {
                        setFieldValue("paymentType", "");
                      }
                    }}
                    isDisabled={state?.intCustomDutyAdvancePaymentId}
                    placeholder="Payment Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    name="narration"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("narration", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.paymentAmount}
                    label="Payment Amount"
                    name="paymentAmount"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        setFieldValue("paymentAmount", 0);
                      } else {
                        setFieldValue("paymentAmount", e.target.value);
                      }
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div> */}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
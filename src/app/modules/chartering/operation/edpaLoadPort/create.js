import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import * as Yup from "yup";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
const initData = {
  strEmailAddress: "",
  strAttachmentForPort: "",
  strAttachmentForPortDisbursment: "",
  strVesselNominationCode: "",
  numGrandTotalAmount: 0,
};
export default function EDPALoadPortCreate() {
  const {
    businessUnitList,
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  const [attachment, setAttachment] = useState("");

  const [, onSave, loader] = useAxiosPost();

  useEffect(() => {}, []);

  const saveHandler = (values, cb) => {
    const payload = {
      intEpdaAndPortInfoId: 0,
      intAccountId: accountId,
      intBusinessUnitId: buId,
      strBusinessUnitName: label,
      strEmailAddress: values?.strEmailAddress,
      strAttachmentForPort: values?.strAttachmentForPort,
      strAttachmentForPortDisbursment: values?.strAttachmentForPortDisbursment,
      intVesselNominationId: 0,
      strVesselNominationCode: values?.code,
      numGrandTotalAmount: values?.numGrandTotalAmount,
      isActive: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
    };

    onSave(`domain/VesselNomination/CreateEpdaAndPortInfo`, payload, cb, true);
  };

  //   const mapStateToInitialValues = (state) => ({
  //     businessUnit: { value: buId, label: label },
  //     territory: state?.strTerritoryName || "",
  //     district: { value: state?.intDistrictId, label: state?.strDistrictName },
  //     thana: { value: state?.intThanaId, label: state?.strThanakName } || "",
  //     deedNo: state?.strDeedNo || "",
  //     deedAmount: state?.monDeedValue || "",
  //     deedType:
  //       deedTypeDDL.find((type) => type.value === state?.intDeedTypeId) || "",
  //     registrationDate: state?.dteDeedDate
  //       ? moment(state?.dteDeedDate).format("YYYY-MM-DD")
  //       : "",
  //     landQuantity: state?.numTotalLandPurchaseQty || "",
  //     seller: state?.strSellerName || "",
  //     buyer: state?.strBuyer || "",
  //     remarks: state?.strRemark || "",
  //     csKhatian: state?.strCskhatian || "",
  //     csPlot: state?.strCsplotNo || "",
  //     saKhatian: state?.strSakhatianNo || "",
  //     cityJaripKhatian: state?.strCityJoripKhatianNo || "",
  //     saPlot: state?.strSaplotNo || "",
  //     rsPlot: state?.strRsplotNo || "",
  //     rsKhatian: state?.strRskhatianNo || "",
  //     rsLandQuantity: state?.numRsplotLandBaseQty || "",
  //     mouza: state?.strMouzaName || "",
  //     cityJaripPlot: state?.strCityJoripPlot || "",
  //     cityJaripPlotLand: +state?.numCityJoripLandQty || "",
  //     registrationCost: state?.monRegistrationCost || "",
  //     brokerAmount: state?.monBroker || "",
  //     deedYear: { value: state?.calcDeadYear, label: state?.calcDeadYear },
  //     otherCost: state?.monOtherCost,
  //     biakhatian: state?.strBiaMutationKhotian || "",
  //     // dagNo: state?.strDagNo,
  //     // ploatNo: state?.strPloatNo,
  //     subRegister: {
  //       value: state?.intSubOfficeId,
  //       label: state?.strSubOfficeName,
  //     },
  //   });

  const validationSchema = Yup.object().shape({
    // businessUnit: Yup.object().required("Business Unit is required"),
    // deedType: Yup.object().required("Deed Type  is required"),
    // // deedYear: Yup.object().required("Deed Year  is required"),
    // territory: Yup.string().required("Territory is required"),
    // seller: Yup.string().required("Seller Name is required"),
    // buyer: Yup.string().required("Buyer Name is required"),
    // deedNo: Yup.string().required("Deed No is required"),
    // mouza: Yup.string().required("Mouza is required"),
    // deedAmount: Yup.number().required("Deed Value is required"),
    // landQuantity: Yup.number().required("Land Quantity is required"),
    // registrationDate: Yup.date().required("Registration Date is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {loader && <Loading />}
          <IForm
            title={`Create EDPA Port Info `}
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                {/* bu */}
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {/* Email */}
                <div className="col-lg-2">
                  <InputField
                    value={values.strEmailAddress}
                    label="Email Address"
                    name="strEmailAddress"
                    type="email"
                    onChange={(e) =>
                      setFieldValue("strEmailAddress", e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.code}
                    label="Code"
                    name="code"
                    type="text"
                    onChange={(e) => setFieldValue("code", e.target.value)}
                  />
                </div>

                {/* Land Quantity (Decimal) */}
                <div className="col-lg-2">
                  <InputField
                    value={values.numGrandTotalAmount}
                    label="Grand Total"
                    name="numGrandTotalAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("numGrandTotalAmount", e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-1 ">
                  <label htmlFor="">Attachment For Port</label>
                  <div className="">
                    <AttachmentUploaderNew
                      style={{
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setAttachment(attachmentData?.[0]?.id);
                          setFieldValue(
                            "strAttachmentForPort",
                            attachmentData?.[0]?.id
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-2 " style={{ marginLeft: "-20px" }}>
                  <label htmlFor="">Attachment For Port Disbursment</label>
                  <div className="">
                    <AttachmentUploaderNew
                      style={{
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setAttachment(attachmentData?.[0]?.id);
                          setFieldValue(
                            "strAttachmentForPortDisbursment",
                            attachmentData?.[0]?.id
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

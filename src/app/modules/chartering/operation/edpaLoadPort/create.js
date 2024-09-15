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
import { imarineBaseUrl } from "../../../../App";
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

    onSave(`${imarineBaseUrl}/domain/VesselNomination/CreateEpdaAndPortInfo`, payload, cb, true);
  };

  const validationSchema = Yup.object().shape({});

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

import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import * as Yup from "yup";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  monMutationFees: "",
  monVat: "",
  strDcrno: "",
  strHoldingNo: "",
  strMutitaionKhotianNo: "",
  strMutationAttachment: "",
};
export default function UpdateMutation({
  singleData,
  getLandingData,
  setSingleData,
  setIsShowUpdateModal,
}) {
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  console.log({ singleData });
  const [, onSave, loader] = useAxiosPost();
  const dispatch = useDispatch();

  const saveHandler = (values) => {
    const cb = () => {
      getLandingData();
      setSingleData(null);
      setIsShowUpdateModal(false);
    };
    const payload = {
      intLandGeneralPk: singleData?.intLandGeneralPk,
      monVat: values?.monVat,
      monMutationFees: values?.monMutationFees,
      strDcrno: values?.strDcrno,
      strHoldingNo: values?.strHoldingNo,
      strMutitaionKhotianNo: values?.strMutitaionKhotianNo,
      strMutationAttachment: values?.strMutationAttachment
        ? values?.strMutationAttachment
        : singleData?.strMutationAttachment,
      intInsertBy: userId,
    };

    onSave(
      `/asset/AGLandMange/SaveMutation
    `,
      payload,
      cb,
      true
    );
  };
  const validationSchema = Yup.object().shape({
    strHoldingNo: Yup.string()
      .required("Holding No is required")
      .typeError("Holding No is required"),
    strMutitaionKhotianNo: Yup.string()
      .required("Mutitaion Khotian is required")
      .typeError("Mutation Khatian is required"),
    // monMutationFees: Yup.number().required("Mutation Fees is required"),
    // monVat: Yup.number().required("Vat is required"),
  });
  return (
    <Formik
      enableReinitialize={true}
      initialValues={singleData}
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

          <Form>
            <div className="form-group  global-form row">
              {/* monVat */}
              <div className="col-lg-3">
                <InputField
                  value={values.monVat}
                  label="Govt Fee"
                  name="monVat"
                  type="number"
                  onChange={(e) => setFieldValue("monVat", e.target.value)}
                />
              </div>
              {/* monMutationFees */}
              <div className="col-lg-3">
                <InputField
                  value={values.monMutationFees}
                  label="Mutation Fees"
                  name="monMutationFees"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("monMutationFees", e.target.value)
                  }
                />
              </div>

              {/* strDcrno */}
              <div className="col-lg-3">
                <InputField
                  value={values.strDcrno}
                  label="DCR No"
                  name="strDcrno"
                  type="text"
                  onChange={(e) => setFieldValue("strDcrno", e.target.value)}
                />
              </div>
              {/* strHoldingNo */}
              <div className="col-lg-3">
                <InputField
                  value={values.strHoldingNo}
                  label="Holding No"
                  name="strHoldingNo"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strHoldingNo", e.target.value)
                  }
                />
              </div>
              {/* strMutitaionKhotianNo */}
              <div className="col-lg-3">
                <InputField
                  value={values.strMutitaionKhotianNo}
                  label="Mutation Khatian"
                  name="strMutitaionKhotianNo"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strMutitaionKhotianNo", e.target.value)
                  }
                />
              </div>
              <div className="col-lg-3 mt-5">
                <div className="">
                  <AttachmentUploaderNew
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                    }}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        console.log(attachmentData);
                        console.log({ attachment: attachmentData });
                        setFieldValue(
                          "strMutationAttachment",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-1 mt-3" style={{ marginLeft: "-20px" }}>
                <div className="mt-4">
                  {singleData?.strMutationAttachment ? (
                    <OverlayTrigger
                      overlay={<Tooltip id="cs-icon">View Attachment</Tooltip>}
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(
                              singleData?.strMutationAttachment
                            )
                          );
                        }}
                        className=" "
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          className={`fa pointer fa-eye`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-3">
                <button type="submit" className="btn  btn-primary mt-5">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}

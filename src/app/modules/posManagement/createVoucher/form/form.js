/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import placeholderImg from "../../../_helper/images/placeholderImg.png";
import "./style.css"
import { attachment_action } from "./helper";

const validationSchema = Yup.object().shape({
  warehouse: Yup.object().shape({
    label: Yup.string().required("Warehouse is required"),
    value: Yup.string().required("Warehouse is required"),
  }),
  voucherNo: Yup.string().required("Voucher No is required"),
  dteDate: Yup.string().required("Date is required"),
  numAmount: Yup.number().required("Amount is required"),
});

export default function _Form({
  initData,
  whName,
  btnRef,
  saveHandler,
  resetBtnRef,
  setRowDto,
  attachmentFile,
  setAttachmentFile
}) {
  // const saveBtnRef = useRef();
  // const resetBtnRef = useRef();

  const history = useHistory();
  const inputAttachFile = useRef(null);

  const backHandler = () => {
    history.goBack();
  };
  
  const [validation] = useState(validationSchema);

  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validation}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
            setAttachmentFile("");
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title="Create Voucher"
              >
                <CardHeaderToolbar>
                  <>
                    <button
                      type='reset'
                      onClick={backHandler}
                      ref={resetBtnRef}
                      className='btn btn-light ml-2'
                    >
                      <i className='fa fa-arrow-left'></i>
                      Back
                    </button>
                    <button
                      type='reset'
                      onClick={resetForm}
                      ref={resetBtnRef}
                      className='btn btn-light ml-2'
                    >
                      <i className='fa fa-redo'></i>
                      Reset
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary ml-2'
                      onClick={handleSubmit}
                    // ref={saveBtnRef}
                    // disabled={!isAvailable}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className='form form-label-right voucher-create-wrapper'>
                  <div className='row'>
                    <div className='col-lg-6 d-flex align-items-center'>
                      <span className='d-flex align-items-center mr-2'>
                        {/* <span className="ml-2">Enlisted Supplier</span> */}
                      </span>
                    </div>
                    <div className='col-lg-12'>
                      <div className='row global-form'>
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="warehouse"
                              options={whName}
                              value={values?.warehouse}
                              onChange={(valueOption) => {
                                setFieldValue("warehouse", valueOption);
                              }}
                              placeholder="Warehouse Name"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Voucher No</label>
                            <InputField
                              value={values?.voucherNo}
                              placeholder="Voucher No"
                              name="voucherNo"
                              type="text"
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Date</label>
                            <InputField
                              value={_dateFormatter(values?.dteDate)}
                              placeholder="Date"
                              name="dteDate"
                              type="date"
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Amount</label>
                            <InputField
                              value={values?.numAmount}
                              placeholder="Amount"
                              name="numAmount"
                              type="number"
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3 mt-3">
                            <label>Attachment Upload</label>
                      <div
                        className={
                          attachmentFile
                            ? "image-upload-box with-img"
                            : "image-upload-box"
                        }
                        onClick={onButtonAttachmentClick}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          height: "35px",
                        }}
                      >
                        <input
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              attachment_action(e.target.files)
                                .then((data) => {
                                  setAttachmentFile(data?.[0]?.id);
                                })
                                .catch((error) => {
                                  setAttachmentFile("");
                                });
                            }
                          }}
                          type="file"
                          ref={inputAttachFile}
                          id="file"
                          style={{ display: "none" }}
                        />
                        <div>
                          {!attachmentFile && (
                            <img
                              style={{ maxWidth: "65px" }}
                              src={placeholderImg}
                              className="img-fluid"
                              alt="Upload or drag documents"
                            />
                          )}
                        </div>
                        {attachmentFile && (
                          <div className="d-flex align-items-center">
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#0072E5",
                                cursor: "pointer",
                                margin: "0px",
                              }}
                            >
                              {attachmentFile}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                        </>
                      </div>
                    </div>
                  </div>
                  <button
                    type='submit'
                    style={{ display: "none" }}
                    ref={btnRef}
                    onSubmit={() => handleSubmit()}
                  ></button>
                  <button
                    type='reset'
                    style={{ display: "none" }}
                    ref={resetBtnRef}
                  // onSubmit={() => resetForm(initData)}
                  ></button>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

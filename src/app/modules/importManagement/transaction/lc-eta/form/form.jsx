/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import { validationSchema } from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
}) {
  const [, gettLetterOfCreaditByPo, lcLoading] = useAxiosGet("");
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {}, []);
  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetDirectPOForLC?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchPO=${v}`
      )
      .then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
        }) => (
          <>
            {lcLoading && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <>
                    <div className="col-lg-3 col-md-3">
                      <label>PO No/ LC No</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poNo || ""}
                        isSearchIcon={true}
                        paddingRight={10}
                        handleChange={(valueOption) => {
                          setFieldValue("poNo", valueOption);
                          setFieldValue("lcid", "");
                          gettLetterOfCreaditByPo(
                            `/imp/Shipment/GettLetterOfCreaditByPo?PoId=${valueOption?.value}`,
                            (resData) => {
                              setFieldValue("lcid", resData?.lcid || "");
                            },
                            (errors) => {
                              toast.warning("LC Not Found");
                            }
                          );
                        }}
                        loadOptions={loadPartsList}
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="poNo"
                        touched={touched}
                      />
                    </div>
                  </>

                  <div className="col-lg-3">
                    <label>ETA Date</label>
                    <InputField
                      value={values?.etaDate || ""}
                      name="etaDate"
                      placeholder="ETA Date"
                      type="date"
                    />
                  </div>
                  {/* nvoiceNo input */}
                  <div className="col-lg-3">
                    <label>Invoice No</label>
                    <InputField
                      value={values?.invoiceNo || ""}
                      name="invoiceNo"
                      placeholder="Invoice No"
                      type="text"
                    />
                  </div>
                  {/* blno */}
                  <div className="col-lg-3">
                    <label>BL No</label>
                    <InputField
                      value={values?.blNo || ""}
                      name="blNo"
                      placeholder="BL No"
                      type="text"
                    />
                  </div>
                  {/* vesselName */}
                  <div className="col-lg-3">
                    <label>Vessel Name</label>
                    <InputField
                      value={values?.vesselName || ""}
                      name="vesselName"
                      placeholder="Vessel Name"
                      type="text"
                    />
                  </div>

                  {/* numberOfContainer */}
                  <div className="col-lg-3">
                    <label>Number of Container</label>
                    <InputField
                      value={values?.numberOfContainer || ""}
                      name="numberOfContainer"
                      placeholder="Number of Container"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

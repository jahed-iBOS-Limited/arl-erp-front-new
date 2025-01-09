/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import NewSelect from "../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  // taxBranchAddress: Yup.object().shape({
  //   label: Yup.string().required("Branch Address is required"),
  //   value: Yup.string().required("Branch Address is required"),
  // }),
  deliveryNo: Yup.object().shape({
    label: Yup.string().required("Delivery No. requirFed"),
    value: Yup.string().required("Delivery No. required"),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  // deliveryAddress: Yup.string().required("Delivery address required"),
  // vehicleNo: Yup.string().required("Vehice no. required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  taxBranchDDL,
  landingData,
  toBranch,
  isEdit,
  inventoryTransferDDL,
  distributionChannelDDL,
}) {
  //
  const [valid, setValid] = useState(true);
 
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                taxBranchAddress: landingData?.selectedTaxBranchDDL,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
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
          isValid,
        }) => (
          <>
          
          {console.log(values)}
            {/* {disableHandler(!isValid)} */}
            <Form className="form from-label-right global-form">
              <div className="form-group row">
                {/* <div className="col-lg-3 pl pr-1 mb-1">
                  <NewSelect
                    name="transferTo"
                    options={toBranch || []}
                    value={values?.transferTo}
                    label="Transfer To (Branch)"
                    onChange={(valueOption) => {
                      setFieldValue("transferTo", valueOption);
                    }}
                    placeholder="Transfer To (Branch)"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {/* <div className="col-lg-3 pl pr-1 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.deliveryNo}
                    label="Delivery No."
                    name="deliveryNo"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        setFieldValue("deliveryNo", "");
                      } else {
                        setFieldValue("deliveryNo", e.target.value);
                      }
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={distributionChannelDDL || []}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("distributionChannel", valueOption);
                    }}
                    placeholder="Distribution Channel"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="deliveryNo"
                    options={inventoryTransferDDL || []}
                    value={values?.deliveryNo || ""}
                    label="Transfer No"
                    onChange={(valueOption) => {
                      setFieldValue("deliveryNo", valueOption);
                    }}
                    placeholder="Transfer No"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3 pl pr-1 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.deliveryAddress}
                    label="Delivery Address"
                    name="deliveryAddress"
                  />
                </div>
                <div className="col-lg-3 pl pr-2 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.vehicleNo}
                    label="Vehicle No"
                    name="vehicleNo"
                  />
                </div>
                <div className="col-lg-3 pl pr-2 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.deliveryDate}
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                  />
                </div> */}
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

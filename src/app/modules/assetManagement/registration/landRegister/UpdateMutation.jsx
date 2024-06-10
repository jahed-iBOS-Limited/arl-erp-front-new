import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  monMutationFees: "",
  monVat: "",
  strDcrno: "",
  strHoldingNo: "",
  strMutitaionKhotianNo: "",
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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={singleData}
      // validationSchema={validationSchema}
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
                  label="Vat"
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
                  label="Dcr No"
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
                  label="Mutitaion Khotian"
                  name="strMutitaionKhotianNo"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strMutitaionKhotianNo", e.target.value)
                  }
                />
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

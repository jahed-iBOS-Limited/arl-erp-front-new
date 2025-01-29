import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { getCostTypeDDL, saveNewCostType } from "../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import FormikInput from "../../../_chartinghelper/common/formikInput";

export default function AddCostTypeForm({ setOpen, value, setCostTypeDDL }) {
  const initData = {
    voyageType: {
      value: value?.voyageNo?.voyageTypeID,
      label: value?.voyageNo?.voyageTypeName,
    },
    costTypeName: "",
  };

  const validationSchema = Yup.object().shape({
    voyageType: Yup.object().shape({
      label: Yup.string().required("Voyage Type is required"),
      value: Yup.string().required("Voyage Type is required"),
    }),
    costTypeName: Yup.string().required("Cost Type Name is required"),
  });

  const [loading, setLoading] = useState(false);

  const saveHandler = (values, cb) => {
    const payload = {
      costName: values?.costTypeName,
      voyageTypeId: values?.voyageType?.value,
      voyageTypeName: values?.voyageType?.label,
    };

    saveNewCostType(payload, setLoading, () => {
      getCostTypeDDL(value?.voyageNo?.voyageTypeID, setCostTypeDDL, setLoading);
      cb();
      setOpen(false);
    });
  };

  return (
    <>
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
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-modal-form-card">
              <div className="marine-form-card-heading">
                <p>Create Cost Type</p>
                <div>
                  <button
                    type="button"
                    onClick={() => resetForm(initData)}
                    className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                    disabled={false}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="marine-form-card-content pb-3">
                <div className="row">
                  <div className="col-lg-6">
                    <FormikSelect
                      value={values?.voyageType || ""}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "Time Charter" },
                        { value: 2, label: "Voyage Charter" },
                      ]}
                      styles={customStyles}
                      name="voyageType"
                      placeholder="Voyage Type"
                      label="Voyage Type"
                      onChange={(valueOption) => {
                        setFieldValue("voyageType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-6">
                    <label>Cost Type Name</label>
                    <FormikInput
                      value={values?.costTypeName}
                      name="costTypeName"
                      placeholder="Cost Type Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}

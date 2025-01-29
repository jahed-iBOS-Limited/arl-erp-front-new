import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { IInput } from "../../../_helper/_input";
import NewSelect from "../../../_helper/_select";

const validationSchema = Yup.object().shape({
  kpi: Yup.string().required("KPI name is required"),
  bscPerspective: Yup.object().shape({
    label: Yup.string().required("BSC Perspective is required"),
    value: Yup.string().required("BSC Perspective is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  editData,
}) {
  const [bscPerspectiveDDL, getBscPerspectiveDDL] = useAxiosGet();
  const [modifiedData, setModifiedData] = useState();
  useEffect(() => {
    if (editData?.intKpiMasterId) {
      setModifiedData({
        bscPerspective: {
          value: editData?.intBscPerspectiveId,
          label: editData?.strBscPerspectiveName,
        },
        kpi: editData?.strKpiMasterName,
        status: editData?.isActive
          ? { value: 1, label: "Active" }
          : { value: 2, label: "InActive" },
      });
    }
  }, [editData]);

  useEffect(() => {
    getBscPerspectiveDDL(`/pms/CommonDDL/BSCPerspectiveDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={editData?.intKpiMasterId ? modifiedData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (!editData?.intKpiMasterId) {
              resetForm(initData);
            }
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
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-3">
                  <NewSelect
                    name="bscPerspective"
                    options={bscPerspectiveDDL || []}
                    value={values?.bscPerspective}
                    label="BSC Perspective"
                    onChange={(valueOption) => {
                      setFieldValue("bscPerspective", valueOption);
                    }}
                    placeholder="BSC Perspective"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-6 disable-border disabled-feedback">
                  <IInput value={values?.kpi} label="KPI Name" name="kpi" />
                </div>
                {editData?.intKpiMasterId ? (
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 1, label: "Active" },
                        { value: 2, label: "Inactive" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : (
                  ""
                )}
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

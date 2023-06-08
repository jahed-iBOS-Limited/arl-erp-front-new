import React, { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import InputField from "../../../../_helper/_inputField";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _todayDate } from "../../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
const initData = {
  trainigName: "",
};
export default function AddTraining({ getTrainingName }) {
  const [trainingList, setTrainList] = useState([]);
  const [, saveData] = useAxiosPost();
  const { userId } = useSelector((state) => {
    return state.authData?.profileData;
  }, shallowEqual);

  const saveHandler = () => {
    const payload = trainingList?.map((item) => ({
      strTrainingName: item?.name,
      strTrainingCode: "",
      isActive: true,
      intActionBy: userId,
      dteActionDate: _todayDate(),
    }));

    saveData(
      `/hcm/Training/CreateTrainingName`,
      payload,
      () => {
        setTrainList([]);
        getTrainingName(`/hcm/Training/TrainingNameDDL`);
      },
      true
    );
  };

  const addHandler = (values, resetForm) => {
    const isExist = trainingList.findIndex(
      (item) =>
        item?.name?.replace(/\s/g, "").toLowerCase() ===
        values?.trainigName?.replace(/\s/g, "")?.toLowerCase()
    );
    if (isExist !== -1) return toast.warn("Training Name exist already");
    setTrainList([{ name: values?.trainigName }, ...trainingList]);
    resetForm(initData);
  };
  const removeHandler = (index) => {
    const data = trainingList?.filter((item, i) => i !== index);
    setTrainList([...data]);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.trainigName}
                    label="Training Name"
                    name="trainigName"
                  />
                </div>

                <div style={{ marginTop: "18px" }} className="col-lg-1">
                  <button
                    disabled={!values?.trainigName}
                    onClick={() => {
                      addHandler(values, resetForm);
                    }}
                    className="btn btn-primary"
                  >
                    ADD
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  disabled={trainingList?.length < 1}
                  onClick={() => {
                    saveHandler();
                  }}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>

              <div className="row mb-4">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>SL</th>
                        <th>Training Name</th>
                        <th style={{ width: "70px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingList?.length > 0 &&
                        trainingList?.map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td className="text-center">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">{"Remove"}</Tooltip>
                                }
                              >
                                <span>
                                  <i
                                    className={`fa fa-trash`}
                                    onClick={() => {
                                      removeHandler(index);
                                    }}
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

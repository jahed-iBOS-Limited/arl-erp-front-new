import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { deleteInitiativeAction } from "../../../_helper/deleteInitiative";
import CommonTrForInitiative from "../../../_helper/initiativeRow/CommonTrForInitiative";
import { getStatudDDLAction, getStrategicDataAction } from "../helper";

const validationSchema = Yup.object().shape({});

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  sbuDDL,
  year,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [finance, setFinance] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [process, setProcess] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [statusDDL, setStatusDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState("");

  useEffect(() => {
    getStatudDDLAction(setStatusDDL);
    setEdit("");
  }, []);

  const rowDtoHandler = (name, value, index, xdata, setData) => {
    let data = [...xdata];
    let sl = data[index];
    sl[name] = value;
    setData([...data]);
  };

  const deleteHandler = (id, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        const cb = () => {
          getStrategicDataAction(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            3,
            values?.sbu?.value,
            3,
            values?.year?.value,
            setFinance,
            setCustomer,
            setProcess,
            setGrowth,
            setLoading
          );
        };
        setFinance([]);
        setCustomer([]);
        setProcess([]);
        setGrowth([]);
        deleteInitiativeAction(id, setLoading, cb);
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let sbuProject = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 981) {
      sbuProject = userRole[i];
    }
  }

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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="Select SBU"
                    placeholder="Select SBU"
                    name="sbu"
                    options={sbuDDL}
                    value={values?.sbu}
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Select Year"
                    placeholder="Select Year"
                    name="year"
                    options={year}
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3" style={{ marginTop: "19px" }}>
                  <button
                    onClick={() => {
                      if (!values?.sbu || !values?.year) {
                        return toast.warn("Please select all fields");
                      }
                      getStrategicDataAction(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        3,
                        values?.sbu?.value,
                        3,
                        values?.year?.value,
                        setFinance,
                        setCustomer,
                        setProcess,
                        setGrowth,
                        setLoading
                      );
                    }}
                    type="button"
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>

              <h2
                className="text-center"
                style={{
                  background: "rgb(255, 191, 2)",
                  marginTop: "20px",
                  padding: "10px",
                }}
              >
                Project
              </h2>

              <div
                style={{ marginTop: "-12px" }}
                className="loan-scrollable-table kpi-new-table"
              >
                <div
                  style={{ maxHeight: "600px" }}
                  className="scroll-table _table"
                >
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "200px" }}>
                          {values?.category?.label} Perspective
                        </th>
                        <th style={{ minWidth: "70px" }}>Initiative No</th>
                        <th style={{ minWidth: "70px" }}>Initiative owner</th>
                        <th style={{ minWidth: "70px" }}>Priority</th>
                        <th style={{ minWidth: "70px" }}>Budget</th>
                        <th style={{ minWidth: "70px" }}>Start Date</th>
                        <th style={{ minWidth: "70px" }}>End Date</th>
                        <th style={{ minWidth: "100px" }}>Status</th>
                        <th style={{ minWidth: "70px" }}>Comments</th>
                        <th style={{ minWidth: "70px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {finance?.length > 0 && (
                        <CommonTrForInitiative
                          obj={{
                            edit,
                            rowDtoHandler,
                            data: finance,
                            setData: setFinance,
                            statusDDL,
                            title: "Finance",
                            permission: sbuProject,
                            setEdit,
                            setLoading,
                            values,
                            profileData,
                            deleteHandler,
                            typeId: 3,
                            typeName: "SBU",
                            refId: values?.sbu?.value,
                            refName: values?.sbu?.label,
                            modalHeading: "SBU Project Report",
                            finance,
                            customer,
                            process,
                            growth,
                            isProject: true,
                          }}
                        />
                      )}
                      {customer?.length > 0 && (
                        <CommonTrForInitiative
                          obj={{
                            edit,
                            rowDtoHandler,
                            data: customer,
                            setData: setCustomer,
                            statusDDL,
                            title: "Customer",
                            permission: sbuProject,
                            setEdit,
                            setLoading,
                            values,
                            profileData,
                            deleteHandler,
                            typeId: 3,
                            typeName: "SBU",
                            refId: values?.sbu?.value,
                            refName: values?.sbu?.label,
                            modalHeading: "SBU Project Report",
                            finance,
                            customer,
                            process,
                            growth,
                            isProject: true,
                          }}
                        />
                      )}
                      {process?.length > 0 && (
                        <CommonTrForInitiative
                          obj={{
                            edit,
                            rowDtoHandler,
                            data: process,
                            setData: setProcess,
                            statusDDL,
                            title: "Internal Processes",
                            permission: sbuProject,
                            setEdit,
                            setLoading,
                            values,
                            profileData,
                            deleteHandler,
                            typeId: 3,
                            typeName: "SBU",
                            refId: values?.sbu?.value,
                            refName: values?.sbu?.label,
                            modalHeading: "SBU Project Report",
                            finance,
                            customer,
                            process,
                            growth,
                            isProject: true,
                          }}
                        />
                      )}
                      {growth?.length > 0 && (
                        <CommonTrForInitiative
                          obj={{
                            edit,
                            rowDtoHandler,
                            data: growth,
                            setData: setGrowth,
                            statusDDL,
                            title: "People, Learning & Growth",
                            permission: sbuProject,
                            setEdit,
                            setLoading,
                            values,
                            profileData,
                            deleteHandler,
                            typeId: 3,
                            typeName: "SBU",
                            refId: values?.sbu?.value,
                            refName: values?.sbu?.label,
                            modalHeading: "SBU Project Report",
                            finance,
                            customer,
                            process,
                            growth,
                            isProject: true,
                          }}
                        />
                      )}
                    </tbody>
                  </table>
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

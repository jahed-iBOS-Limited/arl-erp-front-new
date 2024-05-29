/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { editCNF } from "../helper";

const initData = { cnf: "", phoneNo: "" };

const CNFForm = ({ setShow, getData, formType, singleData }) => {
  const [, postData, isLoading] = useAxiosPost();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user data from store
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const addRow = (values, callBack) => {
    const newRow = {
      cnfagentName: values?.cnf,
      phone: values?.phoneNo,
      insertby: userId,
      businessUnitId: buId,
    };
    setRows([...rows, newRow]);
    callBack();
  };

  const removeRow = (index) => {
    setRows(rows?.filter((_, i) => i !== index));
  };

  const saveHandler = (values) => {
    if (formType === "create") {
      const cb = () => {
        getData("", 0, 15);
        setShow(false);
      };
      postData(`/wms/FertilizerOperation/CreateLighterCNF`, rows, cb, true);
    } else {
      const payload = {
        cnFid: singleData?.cnFid,
        cnfagentName: values?.cnf,
        phone: values?.phoneNo,
      };
      const cb = () => {
        getData("", 0, 15);
        setShow(false);
      };
      editCNF(payload, setLoading, cb);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          formType === "edit"
            ? {
                cnf: singleData?.cnfagentName,
                phoneNo: singleData?.phone,
              }
            : initData
        }
        onSubmit={() => {}}
      >
        {({ values, resetForm }) => (
          <>
            <ICustomCard
              title={`${formType === "edit" ? "Edit" : "Create"} CnF Agency`}
              resetHandler={() => resetForm(initData)}
              saveHandler={() => saveHandler(values)}
              saveDisabled={
                formType === "create"
                  ? rows?.length < 1
                  : !values?.cnf || !values?.phoneNo
              }
            >
              {(loading || isLoading) && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <InputField
                        label="CnF Agent Name"
                        placeholder="CnF Agent Name"
                        value={values?.cnf}
                        name="cnf"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-6">
                      <InputField
                        label="Phone No"
                        placeholder="Phone No"
                        value={values?.phoneNo}
                        name="phoneNo"
                        type="text"
                      />
                    </div>
                    {formType === "create" && (
                      <div className="col-12 mt-3 text-right">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            const callBack = () => resetForm();
                            addRow(values, callBack);
                          }}
                          disabled={!values?.cnf || !values?.phoneNo}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {rows?.length > 0 && formType === "create" && (
                  <div className="table-responsive">
                    <table
                      id="table-to-xlsx"
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {["SL", "CnF Agent Name", "Phone No", "Action"]?.map(
                            (th, index) => {
                              return <th key={index}> {th} </th>;
                            }
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {rows?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.cnfagentName}</td>
                              <td>{item?.phone}</td>
                              <td className="text-center">
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IDelete remover={removeRow} id={index} />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default CNFForm;

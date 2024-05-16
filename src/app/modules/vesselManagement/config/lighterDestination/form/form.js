/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";

const initData = { destinationName: "" };

const StevedoreCreateForm = ({ setShow, getData, formType, singleData }) => {
  const [, postData, isLoading] = useAxiosPost();
  const [rows, setRows] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const addRow = (values, callBack) => {
    const newRow = {
      destinationName: values?.destinationName,
      accountId: accId,
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
      postData(
        `/wms/FertilizerOperation/CreateLighterDestination`,
        rows,
        cb,
        true
      );
    } else {
      // const payload = {
      //   destinationName: values?.destinationName,
      //   destinationId: singleData?.destinationId,
      //   accountId: accId,
      //   insertby: userId,
      //   businessUnitId: buId,
      // };
      // const cb = () => {
      //   getData("", 0, 15);
      //   setShow(false);
      // };
      // editStevedore(payload, setLoading, cb);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          formType === "edit"
            ? {
                destinationName: singleData?.destinationName,
              }
            : initData
        }
        onSubmit={() => {}}
      >
        {({ values, resetForm }) => (
          <>
            <ICustomCard
              title={`${
                formType === "edit" ? "Edit" : "Create"
              } Lighter Destination`}
              resetHandler={() => resetForm(initData)}
              saveHandler={() => saveHandler(values)}
              saveDisabled={
                formType === "create"
                  ? rows?.length < 1
                  : !values?.destinationName
              }
            >
              {isLoading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-12">
                      <InputField
                        label="Lighter Destination Name"
                        placeholder="Lighter Destination Name"
                        value={values?.destinationName}
                        name="destinationName"
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
                          disabled={!values?.destinationName}
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
                          {["SL", "Lighter Destination Name", "Action"]?.map(
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
                              <td>{item?.destinationName}</td>
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

export default StevedoreCreateForm;

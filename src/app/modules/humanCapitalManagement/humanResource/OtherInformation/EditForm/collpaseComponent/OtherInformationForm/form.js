// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import InputField from "../../../../../../_helper/_inputField";
import NewSelect from "./../../../../../../_helper/_select";
import * as Yup from "yup";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  isDisabled,
  title,
  rowFormData,
  singleData,
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
    }
  }, [edit]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

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
          <div className={!edit ? "editForm" : ""}>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={`Create ${title}`}>
                  <CardHeaderToolbar>
                    {edit ? (
                      <>
                        <button
                          onClick={() => {
                            setEdit(false);
                            resetForm(initData);
                          }}
                          className="btn btn-light "
                          type="button"
                        >
                          <i className="fas fa-times pointer"></i>
                          Cancel
                        </button>
                        <button
                          //onClick={handleSubmit}
                          className="btn btn-primary ml-2"
                          type="submit"
                          disabled={isDisabled}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEdit(true)}
                        className="btn btn-light"
                        type="button"
                      >
                        <i className="fas fa-pen-square pointer"></i>
                        Edit
                      </button>
                    )}
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="form form-label-right">
                    {edit && (
                      <>
                        <div className="row global-form global-form-custom bj-left pb-2">
                          {rowFormData?.map((itm) => (
                            <>
                              {itm?.strControlType === "DDL" ? (
                                <div className="col-lg-3">
                                  <NewSelect
                                    name={itm?.strAttributeName}
                                    options={
                                      itm?.sectionAttributeList?.map((itm) => ({
                                        value: itm?.intSectionAttributeId,
                                        label: itm?.strSectionAttributeName,
                                      })) || []
                                    }
                                    value={values?.[itm?.strAttributeName]}
                                    label={itm?.strAttributeName}
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        itm?.strAttributeName,
                                        valueOption
                                      );
                                    }}
                                    placeholder={itm?.strAttributeName}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={!edit}
                                  />
                                  <input
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={values?.[itm?.strAttributeName]}
                                    required={itm?.isMandatory}
                                  />
                                  {/* {!props.disabled && (
                                
                              )} */}
                                </div>
                              ) : itm?.strControlType === "TextBox" ? (
                                <div className="col-lg-3">
                                  <label>{itm?.strAttributeName}</label>
                                  <InputField
                                    value={values?.[itm?.strAttributeName]}
                                    name={itm?.strAttributeName}
                                    placeholder={itm?.strAttributeName}
                                    type="text"
                                    disabled={!edit}
                                    required={itm?.isMandatory}
                                  />
                                </div>
                              ) : itm?.strControlType === "Number" ? (
                                <div className="col-lg-3">
                                  <label>{itm?.strAttributeName}</label>
                                  <InputField
                                    value={values?.[itm?.strAttributeName]}
                                    name={itm?.strAttributeName}
                                    placeholder={itm?.strAttributeName}
                                    type="number"
                                    disabled={!edit}
                                    required={itm?.isMandatory}
                                    min="0"
                                  />
                                </div>
                              ) : (
                                <div className="col-lg-3">
                                  <label>{itm?.strAttributeName}</label>
                                  <InputField
                                    value={values?.[itm?.strAttributeName]}
                                    name={itm?.strAttributeName}
                                    placeholder={itm?.strAttributeName}
                                    type="date"
                                    disabled={!edit}
                                    required={itm?.isMandatory}
                                  />
                                </div>
                              )}
                            </>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Table Header input end */}
                    <div className="global-table">
                      <div className="">
                        <table className={"table"}>
                          {singleData?.length > 0 && (
                            <>
                              <thead>
                                <tr>
                                  <th style={{ width: "20px" }}>SL</th>
                                  <th>Section Name</th>
                                  <th>Section Value</th>
                                </tr>
                              </thead>
                            </>
                          )}
                          <tbody>
                            {singleData?.length > 0 &&
                              singleData.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="text-left pl-2">
                                      {item?.strProfileSection}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left pl-2">
                                      {item?.strSectionAttributeValue}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}

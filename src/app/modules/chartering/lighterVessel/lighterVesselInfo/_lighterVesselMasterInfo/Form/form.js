import { Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getBankBranchDDL } from "../../../../helper";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../../_chartinghelper/icons/_edit";
// import IEdit from "../../../../_chartinghelper/icons/_edit";
import ICustomTable from "../../../../_chartinghelper/_customTable";
import { editRowDataClick, rowDataEditHandler } from "../utils";

export default function _Form({
  title,
  initData,
  saveHandler,
  gridData,
  headers,
  changeStatus,
  addRow,
  rowData,
  setRowData,
  setEditMode,
  editMode,
  bankDDL,
  branchDDL,
  setBranchDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setEditMode({ mode: false });
          });
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          resetForm,
          setValues,
          setFieldValue,
        }) => (
          <>
            <form className="marine-modal-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-default ml-2 px-3 py-2"}
                    onClick={() => resetForm(initData)}
                    disabled={false}
                  >
                    <i class="fas fa-history"></i>
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                    disabled={!gridData?.length}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.strAccountHolderName}
                      name="strAccountHolderName"
                      label="A/C Holder Name"
                      placeholder="A/C Holder Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.strAccountHolderNumber}
                      name="strAccountHolderNumber"
                      label="A/C Number"
                      placeholder="A/C Number"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.strBankName || ""}
                      isSearchable={true}
                      options={bankDDL || []}
                      styles={customStyles}
                      name="strBankName"
                      label="Bank Name"
                      placeholder="Bank Name"
                      onChange={(valueOption) => {
                        getBankBranchDDL(valueOption?.value, setBranchDDL);
                        setFieldValue("strBankName", valueOption);
                        setFieldValue("strBankBranchName", "");
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.strBankBranchName || ""}
                      isSearchable={true}
                      options={branchDDL || []}
                      styles={customStyles}
                      name="strBankBranchName"
                      label="Branch Name"
                      placeholder="Branch Name"
                      onChange={(valueOption) => {
                        setFieldValue("strBankBranchName", valueOption);
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <FormikInput
                      value={values?.strBankName}
                      name="strBankName"
                      label="Bank Name"
                      placeholder="Bank Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {/* <div className="col-lg-3">
                    <FormikInput
                      value={values?.strBankBranchName}
                      name="strBankBranchName"
                      label="Bank Branch Name"
                      placeholder="Bank Branch Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.strBankAddress}
                      name="strBankAddress"
                      label="Bank Address"
                      placeholder="Bank Address"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.strRoutingNumber}
                      name="strRoutingNumber"
                      label="Routing Number"
                      placeholder="Routing Number"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {!editMode?.mode ? (
                    <div className="col-lg-3 mt-5">
                      <button
                        type="button"
                        disabled={
                          !values.strAccountHolderName ||
                          !values?.strAccountHolderNumber ||
                          !values?.strBankName ||
                          !values?.strBankBranchName
                        }
                        className="btn btn-primary px-3 py-2"
                        onClick={() => {
                          addRow(values, resetForm);
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  ) : (
                    <div className="col-lg-12 d-flex justify-content-end">
                      <div>
                        <button
                          type="button"
                          className="btn btn-info px-3 py-2 mt-2 mr-2"
                          onClick={() => {
                            rowDataEditHandler(
                              values,
                              rowData,
                              setRowData,
                              editMode,
                              setEditMode,
                              () => {
                                resetForm(initData);
                              }
                            );
                          }}
                          disabled={
                            !values.strAccountHolderName ||
                            !values?.strAccountHolderNumber ||
                            !values?.strBankName ||
                            !values?.strBankBranchName
                          }
                        >
                          Done
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger px-3 py-2 mt-2"
                          onClick={() => {
                            // setOperationFieldClear(setFieldValue);
                            setEditMode({
                              mode: false,
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <ICustomTable ths={headers}>
                {gridData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center" style={{ width: "40px" }}>
                      {index + 1}
                    </td>
                    <td>{item?.strAccountHolderName}</td>
                    <td>{item?.strAccountHolderNumber}</td>
                    <td>{item?.strBankName}</td>
                    <td>{item?.strBankBranchName}</td>
                    <td>{item?.strBankAddress}</td>
                    <td>{item?.strRoutingNumber}</td>
                    <td className="text-center">
                      {item?.isActive ? (
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">
                              {"Click here to Inactive"}
                            </Tooltip>
                          }
                        >
                          <span>
                            <button
                              type="button"
                              className="btn btn-success ml-2 px-2 py-1"
                              onClick={() => {
                                changeStatus(item, index, false);
                              }}
                            >
                              Active
                            </button>
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">
                              {"Click here to Active"}
                            </Tooltip>
                          }
                        >
                          <span>
                            <button
                              type="button"
                              className="btn btn-danger ml-2 px-2 py-1"
                              onClick={() => {
                                changeStatus(item, index, true);
                              }}
                            >
                              Inactive
                            </button>
                          </span>
                        </OverlayTrigger>
                      )}
                    </td>
                    {/* {item?.intAutoId ? ( */}
                    <td
                      className="text-center"
                      onClick={() => {
                        editRowDataClick(
                          item,
                          values,
                          setValues,
                          setEditMode,
                          index
                        );
                      }}
                    >
                      <IEdit />
                    </td>
                    {/* ) : (
                      <td></td>
                    )} */}
                  </tr>
                ))}
              </ICustomTable>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}

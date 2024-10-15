import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { getBankBranchDDL_api, getBankDDL_api, getCountryDDL } from "./helper";
import { empAttachment_action } from "./../../../../../../inventoryManagement/warehouseManagement/assetReceive/helper/Actions";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
import { toast } from "react-toastify";
import { useLocation } from "react-router";

export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  setEdit,
  edit,
  rowDto,
  setFileObjects,
  fileObjects,
  rowDataAddHandler,
  setUploadImage,
  editBtnHandler,
  editClick,
  setEditClick,
  remover,
  itemSlectedHandler,
  singleData,
  setRowDto,
  getEmpBankInfoById,
  isDisabled,
  empName,
}) {
  const [bankDDL, setBankDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (edit) {
      getBankDDL_api(setBankDDL);
    }
  }, [edit]);

  const bankOnChangeHandler = (bankId) => {
    getBankBranchDDL_api(bankId, setBankBranchDDL);
  };
  //FOR SINGLE EDIT
  const branchOnChangeHandler = (value) => {
    getBankBranchDDL_api(value?.bankId, setBankBranchDDL);
  };

  const [countryDDL, setCountryDDL] = useState("");
  useEffect(() => {
    getCountryDDL(setCountryDDL);
  }, []);

  const location = useLocation();

  console.log("T", initData?.accountName || empName)

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          countryName: { value: 18, label: "Bangladesh" },
          accountName: empName,
        }}
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
          setValues,
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Bank Information"}>
                {!location?.state?.fromReRegistration && (
                  <CardHeaderToolbar>
                    {edit ? (
                      <>
                        <button
                          onClick={() => {
                            setEdit(false);
                            resetForm(initData);
                            setEditClick(false);
                            setRowDto([]);
                            getEmpBankInfoById();
                            // !singleData.length > 0 && setRowDto([]);
                          }}
                          className="btn btn-light "
                          type="button"
                        >
                          <i className="fas fa-times pointer"></i>
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary ml-2"
                          type="submit"
                          disabled={isDisabled}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEdit(true);
                        }}
                        className="btn btn-light"
                        type="button"
                      >
                        <i className="fas fa-pen-square pointer"></i>
                        Edit
                      </button>
                    )}
                  </CardHeaderToolbar>
                )}
              </CardHeader>
              <CardBody>
                
                <Form className="form form-label-right">
                  {edit && (
                    <div className="row global-form global-form-custom bj-left pb-2">
                      <div className="col-lg-3">
                        <label>Account/Beneficiary</label>
                        <InputField
                          value={values?.accountName}
                          name="accountName"
                          placeholder="Acc/Beneficiary Name"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Account Number</label>
                        <InputField
                          value={values?.accountNumber}
                          name="accountNumber"
                          placeholder="Account Number"
                          type="text"
                          disabled={!edit}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="countryName"
                          options={countryDDL || []}
                          value={values?.countryName}
                          label="Country"
                          onChange={(valueOption) => {
                            setFieldValue("bank", "");
                            setFieldValue("bankBranch", "");
                            setFieldValue("countryName", valueOption);
                          }}
                          placeholder="Country"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      {values?.countryName?.value !== 18 ? (
                        <>
                          <div className="col-lg-3 mb-2">
                            <label>Bank Name</label>
                            <InputField
                              value={values?.bank}
                              name="bank"
                              placeholder="Bank Name"
                              type="text"
                              // disabled={!edit}
                            />
                          </div>
                          <div className="col-lg-3 mb-2">
                            <label>Bank Branch</label>
                            <InputField
                              value={values?.bankBranch}
                              name="bankBranch"
                              placeholder="Bank Branch"
                              type="text"
                              // disabled={!edit}
                            />
                          </div>
                          <div className="col-lg-3 mb-2">
                            <label>Swift Code</label>
                            <InputField
                              value={values?.swiftCode}
                              name="swiftCode"
                              placeholder="Swift Code"
                              type="text"
                              // disabled={!edit}
                            />
                          </div>
                          <div className="col-lg-3 mb-2">
                            <label>IBAN No:</label>
                            <InputField
                              value={values?.ibanNo}
                              name="ibanNo"
                              placeholder="IBAN No"
                              type="text"
                              // disabled={!edit}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="bank"
                              options={bankDDL || []}
                              value={values?.bank}
                              label="Bank"
                              onChange={(valueOption) => {
                                setFieldValue("bank", valueOption);
                                setFieldValue("bankBranch", "");
                                bankOnChangeHandler(valueOption?.value);
                              }}
                              placeholder="Bank Name"
                              errors={errors}
                              touched={touched}
                              isDisabled={!edit}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="bankBranch"
                              options={bankBranchDDL || []}
                              value={values?.bankBranch}
                              label="Bank Branch"
                              onChange={(valueOption) => {
                                setFieldValue("bankBranch", valueOption);
                                setFieldValue(
                                  "routingNumber",
                                  valueOption?.routingNo
                                );
                              }}
                              placeholder="Bank Branch"
                              errors={errors}
                              touched={touched}
                              isDisabled={!edit}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Routing Number</label>
                            <InputField
                              value={values?.routingNumber}
                              name="routingNumber"
                              placeholder="Routing Number"
                              type="text"
                              disabled={true}
                            />
                          </div>
                        </>
                      )}

                      <div className={!edit ? "d-none" : "col-lg-3 mt-5"}>
                        {/* <button
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          Identification Doc
                        </button> */}
                        {!editClick && (
                          <ButtonStyleOne
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                              if (values?.accountNumber.length >= 13) {
                                rowDataAddHandler(values);
                              } else {
                                toast.warn(
                                  "BankAccount Number should be at least 13 character"
                                );
                              }
                            }}
                            disabled={
                              !values.accountName ||
                              !values.accountNumber ||
                              !values.countryName ||
                              !values.bank ||
                              !values.bankBranch
                            }
                            label="Add"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* row end */}
                  {/* Table Start */}
                  {!editClick && (
                    <div className="row global-form global-form-custom bg_none">
                      <div className="col-lg-12 pr-0 pl-0">
                        {rowDto?.length > 0 && (
                           <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "35px" }}>
                                  Account/Beneficiary
                                </th>
                                <th style={{ width: "35px" }}>
                                  Account Number
                                </th>
                                <th style={{ width: "35px" }}>Country</th>
                                <th style={{ width: "35px" }}>Bank</th>
                                <th style={{ width: "35px" }}>Bank Branch</th>
                                <th style={{ width: "35px" }}>
                                  IBAN/Routing No:
                                </th>
                                <th style={{ width: "35px" }}>Swift Code</th>
                                <th style={{ width: "35px" }}>Default?</th>
                                {/* <th style={{ width: "35px" }}>Attachment</th> */}
                                {edit && (
                                  <th style={{ width: "35px" }}>Action</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((itm, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="">{itm?.accountName}</td>
                                  <td className="">{itm?.accountNumber}</td>
                                  <td className="">{itm?.countryName}</td>
                                  <td className="">{itm?.bankName}</td>
                                  <td className="">{itm?.bankBranchName}</td>
                                  <td className="">
                                    {itm?.bankRoutingNumber || itm?.ibanNo}
                                  </td>
                                  <td className="">{itm?.swiftCode}</td>
                                  <td className="text-center">
                                    <input
                                      id="isDefaultAccount"
                                      type="checkbox"
                                      className=""
                                      value={itm.isDefaultAccount}
                                      checked={itm.isDefaultAccount}
                                      name={itm.isDefaultAccount}
                                      onChange={(e) => {
                                        //setFieldValue("isDefaultAccount", e.target.checked);
                                        itemSlectedHandler(
                                          e.target.checked,
                                          index
                                        );
                                      }}
                                      disabled={!edit}
                                    />
                                  </td>
                                  {/* <td className="text-center">
                                    {itm?.documentPath && (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              itm?.documentPath
                                            )
                                          );
                                        }}
                                      />
                                    )}
                                  </td> */}

                                  {edit && (
                                    <td className="text-center">
                                      <div className=" d-flex justify-content-around">
                                        {singleData.length > 0 && (
                                          <span
                                            onClick={() => {
                                              editBtnHandler(
                                                index,
                                                itm,
                                                setValues
                                              );
                                              branchOnChangeHandler(itm);
                                              console.log(itm, "jasmin");
                                            }}
                                          >
                                            <IEdit />
                                          </span>
                                        )}
                                        {!singleData.length > 0 && (
                                          <IDelete
                                            id={index}
                                            remover={remover}
                                          />
                                        )}
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Table End */}
                  <DropzoneDialogBase
                    filesLimit={1}
                    acceptedFiles={["image/*", "application/pdf"]}
                    fileObjects={fileObjects}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={1000000}
                    open={open}
                    onAdd={(newFileObjs) => {
                      setFileObjects([].concat(newFileObjs));
                    }}
                    onDelete={(deleteFileObj) => {
                      const newData = fileObjects.filter(
                        (item) => item.file.name !== deleteFileObj.file.name
                      );
                      setFileObjects(newData);
                    }}
                    onClose={() => setOpen(false)}
                    onSave={() => {
                      setOpen(false);
                      empAttachment_action(fileObjects).then((data) => {
                        setUploadImage(data);
                      });
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}

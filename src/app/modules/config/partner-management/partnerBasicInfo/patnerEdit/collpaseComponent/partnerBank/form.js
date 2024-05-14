/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../../../selectCustomStyle";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import { IInput } from "../../../../../../_helper/_input";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  accountName: Yup.string()
    .min(2, "Minimum 0 range")
    .max(1000, "Maximum 1000 range")
    .required("Account Name is required"),
  accountNo: Yup.string()
    .min(2, "Minimum 2 range")
    .required("Account No is required"),
  bankName: Yup.object().shape({
    label: Yup.string().required("Bank is required"),
    value: Yup.string().required("Bank is required"),
  }),
  branchName: Yup.object().shape({
    label: Yup.string().required("Bank is required"),
    value: Yup.string().required("Bank is required"),
  }),
  routingNo: Yup.string()
    .min(2, "Minimum 0 range")
    .required("Routing No is required"),
});

export default function RoleExForm({
  product,
  btnRef,
  saveBusinessUnit,
  accountId,
  selectedBusinessUnit,
  setter,
  remover,
  rowDto,
  itemSlectedHandler,
  rowDataHandler
}) {
  const [bankDataListDDL, setorgtypeListDDL] = useState("");
  const [orgnameListDDL, setorgnameListDDL] = useState("");

  useEffect(() => {
    getEmployeeData(accountId, selectedBusinessUnit.value);
  }, [accountId, selectedBusinessUnit]);
  useEffect(() => {
    getBankData();
  }, []);

  const getBankData = async () => {
    try {
      const res = await Axios.get(
        "/partner/BusinessPartnerBankInfo/GetBankInfo"
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        let ItemType = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.bankId,
              label: item.bankName,
            };
            ItemType.push(items);
          });
        setorgtypeListDDL(ItemType);
      }
    } catch (error) {
     
    }
  };

  const getEmployeeData = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        let ItemType = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.businessPartnerId,
              label: item.businessPartnerName,
            };
            ItemType.push(items);
          });
        // setpartnerListDDL(ItemType);
      }
    } catch (error) {
     
    }
  };

  const getOrgNameData = async (id) => {
    try {
      const res = await Axios.get(
        `/partner/BusinessPartnerBankInfo/GetBranchDDLInfo?BankId=${id}`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        let ItemType = [];
        data &&
          data.forEach((item) => {
            let items = {
              ...item,
              value: item.bankBranchId,
              label: item.bankBranchName,
            };
            ItemType.push(items);
          });
        setorgnameListDDL(ItemType);
      }
    } catch (error) {
     
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(product);
          });
        }}
      >
        {({ values, errors, setFieldValue, isValid }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row align-items-center global-form">
                <div className="col-lg-3">
                  <Field
                    value={values.accountName}
                    name="accountName"
                    component={Input}
                    placeholder="Account Name"
                    label="Account Name"
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.accountNo}
                    name="accountNo"
                    component={Input}
                    placeholder="Account No"
                    label="Account No"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Bank List</label>
                  <Field
                    name="bankName"
                    component={() => (
                      <Select
                        options={bankDataListDDL}
                        placeholder="Select Bank List"
                        value={values.bankName}
                        onChange={(selectedOption) => {
                          setFieldValue("bankName", selectedOption);
                          getOrgNameData(selectedOption?.value);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={!bankDataListDDL}
                      />
                    )}
                    label="Bank List"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Branch Name</label>
                  <Field
                    name="branchName"
                    component={() => (
                      <Select
                        options={orgnameListDDL || []}
                        placeholder="Branch Name"
                        value={values.branchName}
                        onChange={(selectedOption) => {
                          setFieldValue(
                            "routingNo",
                            selectedOption?.strRoutingNo
                          );
                          setFieldValue("branchName", selectedOption);
                          // branchInfo();
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={!bankDataListDDL || !orgnameListDDL}
                      />
                    )}
                    label="Branch Name"
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    name="routingNo"
                    component={Input}
                    value={values.routingNo}
                    placeholder="Routing No"
                    label="Routing No"
                    disabled
                  />
                </div>

                <div className="col-lg-6">
                  <button
                    type="button"
                    onClick={() => {
                      const obj = {
                        bankId: values?.bankName?.value,
                        bankName: values?.bankName?.label,
                        bankBranchId: values?.branchName?.value,
                        bankBranchName: values?.branchName?.label,
                        routingNo: values?.routingNo,
                        bankAccountNo: values?.accountNo,
                        bankAccountName: values?.accountName,
                        isDefaultAccount: true,
                      };
                      setter(obj);
                    }}
                    className="btn btn-primary prurchaseBtn mt-6"
                    disabled={
                      !values.accountName ||
                      !values.accountNo ||
                      !values.bankName ||
                      !values.branchName ||
                      !values.routingNo
                    }
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="form-group row"></div>
              <div className="form-group row my-5">
                <div className="col-lg-12">
                  <FieldArray
                    name="entitys"
                    render={() => (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th>Sl</th>
                              <th>Account Name</th>
                              <th>Account Number</th>
                              <th>Bank</th>
                              <th>Bank Branch</th>
                              <th>Routing Number</th>
                              <th>IsDefault?</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto.map((itm, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {/* <td>{itm.bankAccountName}</td> */}
                                <td
                                  className="text-center align-middle"
                                  style={{ width: "250px" }}
                                >
                                  <IInput
                                    value={rowDto[index]?.bankAccountName}
                                    name="bankAccountName"
                                    type="text"
                                    disabled={false}
                                    onChange={(e) => {
                                      //const validNum = validateDigit(e.target.value);
                                      rowDataHandler(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                </td>
                                <td>{itm.bankAccountNo}</td>
                                <td>{itm.bankName}</td>
                                <td>{itm.bankBranchName}</td>
                                <td>{itm.routingNo}</td>

                                <td
                                  className="text-center"
                                  style={{ verticalAlign: "middle" }}
                                >
                                  <input
                                    id="isDefaultAccount"
                                    type="checkbox"
                                    className=""
                                    value={itm.isDefaultAccount}
                                    checked={itm.isDefaultAccount}
                                    name={itm.isDefaultAccount}
                                    onChange={(e) => {
                                      itemSlectedHandler(
                                        e.target.checked,
                                        index,
                                      );
                                    }}
                                  />
                                </td>

                                <td
                                  className="text-center"
                                  style={{ verticalAlign: "middle" }}
                                >
                                  <span
                                    className="pointer alterUomDeleteIcon"
                                    style={{
                                      width: "50%",
                                      marginTop: "3px",
                                    }}
                                  >
                                    <i
                                      onClick={() =>
                                        remover(index, itm?.configId)
                                      }
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      style={
                                        itm?.configId === 0
                                          ? { color: "red" }
                                          : null
                                      }
                                    ></i>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

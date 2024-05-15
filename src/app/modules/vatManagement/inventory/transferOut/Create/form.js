/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useEffect } from "react";
import {
  GetBranchDDL,
  GetItemNameDDL,
  GetTransactionTypeDDL,
  GetUomDDL,
  GetItemTypeDDL,
  GetToBusinessUnitDDL,
  getBranchName_api,
} from "../helper";
import FormikError from "../../../../_helper/_formikError";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Axios from "axios";
import { toast } from "react-toastify";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import { _fixedPointVat } from "./../../../../_helper/_fixedPointVat";

const createValidation = Yup.object().shape({
  branch: Yup.object().shape({
    label: Yup.string().required("Branch is required"),
    value: Yup.string().required("Branch is required"),
  }),
  branchAddress: Yup.string().required("Branmch Address is required"),
  transactionType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  }),
  itemType: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  transferTo: Yup.object().shape({
    label: Yup.string().required("Transfer To is required"),
    value: Yup.string().required("Transfer To is required"),
  }),
  address: Yup.string().required("address is required"),
  transactionDate: Yup.date().required("Transaction Date is required"),
  vehicleInfo: Yup.string().required("Vehicle Info is required"),
  referenceDate: Yup.date().required("Reference Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  profileData,
  selectedBusinessUnit,
  isEdit,
  total,
  setRowDto,
  landingData,
}) {
  const [branch, setBranch] = useState([]);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [itemType, setitemType] = useState([]);
  const [toBusinessUnit, setToBusinessUnit] = useState([]);

  const [itemName, setItemName] = useState([]);
  const [uom, setUom] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetBranchDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBranch
      );

      GetTransactionTypeDDL(setTransactionType);
      GetUomDDL(profileData.accountId, selectedBusinessUnit.value, setUom);
      GetItemTypeDDL(setitemType);
      GetToBusinessUnitDDL(setToBusinessUnit);
    }
  }, [profileData, selectedBusinessUnit]);

  const GetCustomDataStructureById = async (values) => {
    const { itemName, uom, quantity, basePrice } = values;
    // Item Type check (Purchase Book Item)
    if (values?.itemType?.value === 1) {
      const newData = {
        basePrice: basePrice,
        isOnQty: false,
        sdpercentage: 0,
        surchargePercentage: 0,
        uomId: 107,
        uomName: "Pices",
        vatamount: 0,
        vatpercentage: 0,
        individualAmount: basePrice * quantity,
        itemName,
        uom,
        quantity,
      };
      //isUnique check
      const isUnique =
        rowDto.filter((itm) => itm?.itemName?.value === itemName?.value)
          .length < 1;
      if (isUnique) {
        setRowDto([...rowDto, newData]);
      } else {
        toast.warn("Not allowed to duplicate item!", { toastId: 456 });
      }
    } else {
      try {
        const res = await Axios.get(
          `/vat/HsCode/GetCustomsDutyStructureById?TaxItemGroupId=${itemName?.value}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
        );
        if (res.status === 200 && res?.data) {
          if (res?.data?.length > 0) {
            const item = res?.data[0];
            const newData = {
              ...item,
              itemName,
              uom,
              quantity,
              individualAmount: item.basePrice * quantity,
            };
            //isUnique check
            const isUnique =
              rowDto.filter((itm) => itm?.itemName?.value === itemName?.value)
                .length < 1;
            if (isUnique) {
              setRowDto([...rowDto, newData]);
            } else {
              toast.warn("Not allowed to duplicate item!", { toastId: 456 });
            }
          } else {
            toast.warn("Data not found");
          }
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getBranchName_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (landingData?.itemType?.value) {
      GetItemNameDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.itemType?.value,
        setItemName
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                branch: landingData?.branch,
                itemType: landingData?.itemType,
                branchAddress: landingData?.branch?.address,
                transactionType:
                  transactionType?.length > 0
                    ? {
                        value: transactionType[6]?.value,
                        label: transactionType[6]?.label,
                      }
                    : "",
              }
        }
        validationSchema={createValidation}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
          setValid(true);
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-2">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 pl pr-1 mb-1">
                      <label>Select Branch</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("branch", valueOption);
                          setValues({
                            ...values,
                            branch: valueOption,
                            branchAddress: valueOption?.address,
                          });
                        }}
                        options={taxBranchDDL || []}
                        value={values?.branch || ""}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Branch"
                        name="branch"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="branch"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Branch Address</label>
                      <InputField
                        value={
                          values?.branch?.name || values?.branchAddress || ""
                        }
                        name="branchAddress"
                        placeholder="Branch Address"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Select Transaction Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("transactionType", valueOption);
                        }}
                        value={values?.transactionType || ""}
                        isSearchable={true}
                        options={transactionType || []}
                        styles={customStyles}
                        name="transactionType"
                        placeholder="Transaction Type"
                        isDisabled={initData || isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="transactionType"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Select Item Type</label>
                      <Select
                        onChange={(valueOption) => {
                          GetItemNameDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setItemName
                          );
                          setFieldValue("itemType", valueOption);
                          setFieldValue("itemName", "");
                        }}
                        value={values?.itemType || ""}
                        isSearchable={true}
                        options={itemType || []}
                        styles={customStyles}
                        name="itemType"
                        placeholder="Item Type"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="itemType"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Select Transfer To (Branch)</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("transferTo", valueOption);
                          setValues({
                            ...values,
                            transferTo: valueOption,
                            address: valueOption?.name,
                          });
                        }}
                        value={values?.transferTo || ""}
                        isSearchable={true}
                        options={branch || []}
                        styles={customStyles}
                        name="transferTo"
                        placeholder="Transfer To"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="transferTo"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Address</label>
                      <InputField
                        value={
                          values?.transferTo?.name || values?.address || ""
                        }
                        name="address"
                        placeholder="Address"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Transaction Date</label>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.transactionDate}
                        name="transactionDate"
                        onChange={(e) => {
                          setFieldValue("transactionDate", e.target.value);
                          setFieldValue("expenseFrom", e.target.value);
                          setFieldValue("expenseTo", e.target.value);
                        }}
                        type="date"
                        disabled={isEdit}
                        placeholder="Transaction date"
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <InputField
                        value={values?.vehicleInfo || ""}
                        label="Vehicle Info"
                        name="vehicleInfo"
                        placeholder="Vahicle Info"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <InputField
                        value={values?.referenceNo || ""}
                        label="Reference No"
                        name="referenceNo"
                        placeholder="Reference No"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Reference Date</label>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.referenceDate}
                        name="referenceDate"
                        onChange={(e) => {
                          setFieldValue("referenceDate", e.target.value);
                        }}
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-10">
                  {/* Table Header input */}
                  <div className={"row bank-journal-custom bj-right"}  style={{
                      marginLeft: "0px",
                      marginRight: "0px",
                      marginTop: "5px",
                    }}>
                    <div className="col-lg-3 pl pr-1">
                      <label>Select Item Name</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("uom", {
                            label: valueOption?.uomName,
                            value: valueOption?.uomId,
                          });
                          setFieldValue("itemName", valueOption);
                        }}
                        value={values?.itemName || ""}
                        isSearchable={true}
                        options={itemName || []}
                        styles={customStyles}
                        name="itemName"
                        placeholder="Item name"
                      />
                      <FormikError
                        errors={errors}
                        name="itemName"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1">
                      <label>Select Uom</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                        value={values?.uom || ""}
                        isDisabled
                        isSearchable={true}
                        options={uom || []}
                        styles={customStyles}
                        name="uom"
                        placeholder="Transaction"
                      />
                      <FormikError
                        errors={errors}
                        name="uom"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-0">
                      <IInput
                        value={values?.quantity || ""}
                        label="Quantity"
                        name="quantity"
                        onChange={(e) => {
                          if (e.target.value < 1) {
                            setFieldValue("quantity", "");
                          } else {
                            setFieldValue("quantity", e.target.value);
                          }
                        }}
                        type="number"
                        min={0}
                      />
                               
                    </div>
                    {values?.itemType?.value === 1 && (
                      <div className="col-lg-3">
                        <label>Base Price</label>
                        <InputField
                          value={values?.basePrice}
                          name="basePrice"
                          placeholder="Base Price"
                          onChange={(e) => {
                            if (e.target.value < 1) {
                              setFieldValue("basePrice", "");
                            } else {
                              setFieldValue("basePrice", e.target.value);
                            }
                          }}
                          type="number"
                          min={0}
                        />
                      </div>
                    )}

                    <div
                      className={
                        values?.itemType?.value === 1
                          ? "col-lg-3 offset-9 pl-2 d-flex justify-content-between align-items-center"
                          : "col-lg-3 pl-2 d-flex justify-content-between align-items-center"
                      }
                    >
                      <button
                        type="button"
                        disabled={
                          !values?.itemName ||
                          !values?.uom ||
                          !values?.quantity ||
                          values?.itemType?.value === 1
                            ? !values?.basePrice
                            : false
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          GetCustomDataStructureById(values, setRowDto);
                        }}
                      >
                        Add
                      </button>
                      <p className="m-0 text-right">
                        <strong>Total Amount :</strong> <br></br>
                        {_formatMoney(Math.abs(+total?.totalAmount))}
                      </p>
                    </div>
                  </div>
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  <div className="row">
                    <div className="col-lg-12 pr-0">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "120px" }}>Item Name</th>
                            <th style={{ width: "100px" }}>Uom</th>
                            <th style={{ width: "100px" }}>Quantity</th>
                            <th style={{ width: "100px" }}>Rate</th>
                            <th style={{ width: "100px" }}>Total Amount</th>
                            <th style={{ width: "50px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {item?.itemName?.label}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.uom?.label}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {_fixedPointVat(item?.quantity, 3)}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {Math.abs(
                                    _fixedPointVat(
                                      item?.basePrice || item?.rate
                                    )
                                  )}
                                </div>
                              </td>

                              <td>
                                <div className="text-center">
                                  {_fixedPointVat(item?.individualAmount)}
                                </div>
                              </td>

                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
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

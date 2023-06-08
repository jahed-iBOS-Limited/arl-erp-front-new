import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Axios from "axios";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { isUniq } from "./../../../../_helper/uniqChecker";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object().shape({
  branchName: Yup.object().shape({
    label: Yup.string().required("Branch Name is required"),
    value: Yup.string().required("Branch Name is required"),
  }),
  // transactionType: Yup.object().shape({
  //   label: Yup.string().required("Transaction Type is required"),
  //   value: Yup.string().required("Transaction Type is required"),
  // }),
  // itemName: Yup.object().shape({
  //   label: Yup.string().required('Item Name is required'),
  //   value: Yup.string().required('Item Name is required'),
  // }),
  branchAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Branch Address is required"),
  // quantity: Yup.number()
  //   .min(1, 'Minimum 2 symbols')
  //   .max(1000000000, 'Maximum 100 symbols')
  //   .required('Quantity is required'),
  referanceNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols"),
  referenceDate: Yup.date().required("Production Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  accountId,
  selectedBusinessUnit,
  saveHandler,
  resetBtnRef,
  taxBranchDDL,
  transactionType,
  itemNameDDL,
  isEdit,
  setRowDto,
  total,
  remover,
  rowDto,
  setDisabled,
  landingData,
  isView,
}) {
  // custom Data
  const getCustomData_api = async (values) => {
    const { itemName, quantity } = values;
    //TaxItemGroupId should be dynamic
    try {
      setDisabled(true);
      const res = await Axios.get(
        `/vat/HsCode/GetCustomsDutyStructureById?TaxItemGroupId=${values?.itemName?.value}&AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit}`
      );
      if (res?.data) {
        setDisabled(false);
        if (res?.data?.length > 0) {
          const item = res?.data[0];
          //quantity & basePrice
          const qtyAndRate = quantity * item.basePrice;
          // sd culculation
          const sd = (qtyAndRate * item?.sdpercentage) / 100;
          // vat culculation
          const vat = ((qtyAndRate + sd) * item.vatpercentage) / 100;
          //Surcharge culculation
          const surcharge = (qtyAndRate * item?.surchargePercentage) / 100;
          const newData = {
            ...item,
            quantity,
            itemName: itemName?.label,
            itemId: itemName?.value,
            sd: sd,
            vat: vat,
            surcharge: surcharge,
            totalAmount: (qtyAndRate + sd + vat),
          };
          if (isUniq("itemId", itemName?.value, rowDto)) {
            setRowDto([...rowDto, newData]);
          }
        } else {
          toast.warning("Data Not Found", {
            toastId: "itm",
          });
          setDisabled(false);
        }
      }
    } catch (error) {
      setDisabled(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                branchName: landingData?.taxBranch,
                branchAddress: landingData?.taxBranch?.address,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-3">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 pl pr-1 mb-1">
                      <NewSelect
                        name="branchName"
                        options={taxBranchDDL || []}
                        value={values?.branchName}
                        label="Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue("branchName", valueOption);
                        }}
                        placeholder="Branch Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
                      <div>Branch Address</div>
                      <InputField
                        value={values?.branchAddress}
                        name="branchAddress"
                        placeholder="Branch Address"
                        type="text"
                        disabled={true && isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1"></div>
                    {/* <div className="col-lg-12 pr-1 pl mb-1">
                      <NewSelect
                        name="transactionType"
                        options={transactionType || []}
                        value={values?.transactionType}
                        label="Transaction Type"
                        onChange={(valueOption) => {
                          setFieldValue("transactionType", valueOption);
                        }}
                        placeholder="Transaction Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div> */}
                    <div className="col-lg-12 pr pl-2 mb-1">
                      <label>Reference No</label>{" "}
                      <InputField
                        value={values?.referanceNo}
                        name="referanceNo"
                        placeholder="Reference No"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Production Date</label>
                      <InputField
                        value={values?.referenceDate}
                        name="referenceDate"
                        placeholder="Production Date"
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-9">
                  {!isView && (
                    <div className={"row bank-journal-custom bj-right"}>
                      <div className="col-lg-4 pr-1 pl mb-1">
                        <NewSelect
                          name="itemName"
                          options={itemNameDDL}
                          value={values?.itemName}
                          label="Item Name"
                          onChange={(valueOption) => {
                            setFieldValue("itemName", valueOption);
                          }}
                          placeholder="Item Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-4 pr-1 pl mb-1 ml-50">
                        <label>Quantity</label>
                        <InputField
                          value={values?.quantity || ""}
                          name="quantity"
                          placeholder="Quantity"
                          type="number"
                          min="0"
                          step="any"
                          // required
                          onChange={(e) => {
                            NegetiveCheck(
                              e.target.value,
                              setFieldValue,
                              "quantity"
                            );
                          }}
                        />
                      </div>

                      <div className="col-lg-1 pl-2 bank-journal mt-3">
                        <button
                          style={{ marginBottom: "20px", marginLeft: "-5px" }}
                          type="button"
                          className="btn btn-primary"
                          disabled={!values?.itemName || !values?.quantity}
                          onClick={() => {
                            getCustomData_api(values);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Table Header input end */}

                  <div className="row">
                    <div className="col-lg-12 pr-0">
                      <div
                        className="col-lg-12 pl-5 pr mb-0 mt-1 h-narration border-gray text-right"
                        style={{
                          position: "absolute",
                          top: "-31px",
                          right: "0",
                          zIndex: "111",
                        }}
                      >
                        <h6 className="p-0 m-0">
                          Total Amount:{_formatMoney(total?.totalAmount)}
                        </h6>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table mt-0">
                          <thead className={rowDto?.length < 1 && "d-none"}>
                            <tr>
                              <th style={{ width: "20px" }}>SL</th>
                              <th style={{ width: "80px" }}>Item Name</th>
                              <th style={{ width: "60px" }}>UoM</th>
                              <th style={{ width: "100px" }}>Quantity</th>
                              <th style={{ width: "60px" }}>Rate</th>
                              <th style={{ width: "50px" }}>SD(%)</th>
                              <th style={{ width: "80px" }}>VAT(%)</th>
                              <th style={{ width: "85px" }}>Surcharge(%)</th>
                              <th style={{ width: "100px" }}>Total Amount</th>
                              {!isView && (
                                <th style={{ width: "30px" }}>Actions</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="text-center">
                                    {item?.itemName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center pl-2 ">
                                    {item?.uomName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center pl-2">
                                    {Number(item?.quantity?.toFixed(3))}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {Number(item?.basePrice.toFixed(2))}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {Number(item?.sd.toFixed(2))}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center pr-2">
                                    {Number(item?.vat.toFixed(2))}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center pl-2">
                                    {Number(item?.surcharge.toFixed(2))}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center pl-2">
                                    <div className=" pl-0 bank-journal">
                                      {_formatMoney(item?.totalAmount)}
                                    </div>
                                  </div>
                                </td>
                                {!isView && (
                                  <td className="text-center">
                                    <IDelete remover={remover} id={index} />
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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

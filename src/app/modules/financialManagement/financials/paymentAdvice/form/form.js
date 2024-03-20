import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import {
  SetFinancialsPaymentAdviceAction,
  setPreparePaymentLastAction,
} from "../../../../_helper/reduxForLocalStorage/Actions";
import AdvForInternalView from "../../../invoiceManagementSystem/approvebillregister/advForInternal";
import ExpenseView from "../../../invoiceManagementSystem/approvebillregister/expenseView";
import SupplerInvoiceView from "../../../invoiceManagementSystem/approvebillregister/supplerInvoiceView";
import SupplierAdvanceView from "../../../invoiceManagementSystem/approvebillregister/supplierAdvanceView";
import BankJournalCreateForm from "../bank/addForm";
import { billTypeList, sumSelectedValue } from "../helper";
import PaginationSearch from "./../../../../_helper/_search";
// import { _todayDate } from "../../../../_helper/_todayDate";
import OthersBillView from "../../../invoiceManagementSystem/billregister/othersBillNew/view/othersBillView";
import ViewPumpFoodingBill from "../../../invoiceManagementSystem/billregister/pumpFoodingBill/view/viewPumpFoodingBill";
import ShippingInvoiceView from "../../../invoiceManagementSystem/shippingBillRegister/shippingInvoiceView";
import CustomerRefundModal from "../../customerRefund/customerRefundModal";
import ViewFuelBill from "./../../../invoiceManagementSystem/billregister/fuelBill/view/viewBillRegister";
import ViewLabourBill from "./../../../invoiceManagementSystem/billregister/labourBill/view/viewBillRegister";
import ViewSalesCommission from "./../../../invoiceManagementSystem/billregister/salesCommission/view/viewSalesCommission";
import ViewTransportBill from "./../../../invoiceManagementSystem/billregister/transportBill/view/viewBillRegister";
import GlobalTableForBillType from "./globalTable";
import OtherTableForBillType from "./otherTable";

// Validation schema
const validationSchema = Yup.object().shape({
  sbuUnit: Yup.object().shape({
    label: Yup.string().required("Sbu is required"),
    value: Yup.string().required("Sbu is required"),
  }),
  billType: Yup.object().shape({
    label: Yup.string().required("Bill Type is required"),
    value: Yup.string().required("Bill Type is required"),
  }),
  cashGl: Yup.string().when("type", {
    is: (status) => status === "Cash",
    then: Yup.string()
      .required("Cash is required")
      .typeError("Cash is required"),
  }),
  accountNo: Yup.string().when("type", {
    is: (status) => status === "Online",
    then: Yup.string()
      .required("Account No is required")
      .typeError("Account No required"),
  }),
  payDate: Yup.date().required("Pay Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  rowDto,
  setRowDto,
  remover,
  accountNoDDL,
  bankDDL,
  unitDDL,
  setBankDDL,
  setAccountNoDDL,
  setDisabled,
  getPaymentAdviceIndoPagination,
  allSelect,
  setAllSelect,
  allActivities,
  setAllActivities,
  sbuList,
  selectedBusinessUnit,
  typeDDL,
  supportButtonRefs,
  prepareChequeVoucher,
}) {
  //to manage prepare all voucher button
  const [, setIsAble] = useState("");
  const [billType, setbillType] = useState([]);
  const [mdalShow, setModalShow] = useState(false);
  const [gridItem, setGridItem] = useState("");
  const [gridData, setGridData] = useState("");
  const [bankModelShow, setBankModelShow] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    billTypeList(setbillType);
  }, []);

  const updateDate = (index, value) => {
    const gridData = [...rowDto];
    gridData[index].paymentDate = value;
    setRowDto(gridData);
  };

  ///all of this code done by selim

  const selectIndividualItem = (index) => {
    if (!allActivities) {
      let newRowdata = [...rowDto];
      newRowdata[index].isSelect = !newRowdata[index].isSelect;
      setRowDto(newRowdata);
    } else {
      let newRowdata = [...rowDto];
      if (newRowdata[index].isSelect) {
        newRowdata[index].isSelect = false;
      } else {
        newRowdata[index].isSelect = true;
      }
      setRowDto(newRowdata);
    }
    const foundAllDataSelect = rowDto?.filter((item) => item?.isSelect);
    if (foundAllDataSelect?.length === 0) {
      setAllSelect(false);
    } else if (foundAllDataSelect?.length === rowDto?.length) {
      setAllSelect(true);
    }
  };

  useEffect(() => {
    if (allSelect) {
      let data = rowDto?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setRowDto(data);
    } else {
      let data = rowDto?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setRowDto(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelect]);

  // All Activity Checkbox
  useEffect(() => {
    if (!allActivities) {
      let data = rowDto?.map((item) => {
        if (item?.isSelect) {
          return {
            ...item,
            isSelect: false,
          };
        }
        return item;
      });
      setRowDto(data);
    } else {
      let data = rowDto?.map((item) => {
        if (item?.isSelect) {
          return {
            ...item,
            isCreate: true,
            isEdit: true,
            isView: true,
            isClose: false,
          };
        }
        return item;
      });
      setRowDto(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allActivities]);

  const paginationSearchHandler = (value, values) => {
    getPaymentAdviceIndoPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbuUnit?.value,
      values?.billType?.value,
      values?.status?.value,
      setRowDto,
      setDisabled,
      value
    );
  };

  const preparepaymentIndex = useSelector((state) => {
    return state.localStorage.preparepaymentIndex;
  });

  const getLanding = (values) => {
    getPaymentAdviceIndoPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbuUnit?.value,
      values?.billType?.value,
      values?.status?.value,
      setRowDto,
      setDisabled
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // console.log("Test handler")
          saveHandler(values, () => {
            // resetForm(initData);
            setRowDto([]);
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="sbuUnit"
                      options={sbuList}
                      value={values?.sbuUnit}
                      label="SBU"
                      onChange={(valueOption) => {
                        setFieldValue("sbuUnit", valueOption);
                        setRowDto([]);
                        dispatch(
                          SetFinancialsPaymentAdviceAction({
                            ...values,
                            sbuUnit: valueOption,
                          })
                        );
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-2">
                    <NewSelect
                      name="type"
                      options={typeDDL}
                      value={values?.type}
                      placeholder="Instrument  Type"
                      label="Instrument Type"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("type", valueOption);
                          if (valueOption.value === 1) {
                            setFieldValue("cashGl", "");
                          } else if (valueOption.value === 4) {
                            setFieldValue("accountNo", "");
                          } else if (valueOption?.value === 2) {
                            setFieldValue("accountNo", "");
                            setFieldValue("cashGl", "");
                          }
                        } else {
                          setFieldValue("type", "");
                          setFieldValue("cashGl", "");
                          setFieldValue("accountNo", "");
                        }

                        // setFieldValue("type", "Bank");
                        setRowDto([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {/* <div
                    role="group"
                    aria-labelledby="my-radio-group"
                    className=" col-lg-2 mt-4 d-flex align-items-center cashJournalCheckbox"
                  >
                    <label className="mr-4">
                      <input
                        type="radio"
                        name="type"
                        checked={values.type === "Online"}
                        className="mr-1 pointer"
                        onChange={(e) => {
                          setFieldValue("type", "Online");
                          setRowDto([]);
                          setFieldValue("cashGl", "");
                          dispatch(
                            SetFinancialsPaymentAdviceAction({
                              ...values,
                              type: "Online",
                              accountNo: "",
                            })
                          );
                        }}
                      />
                      Online
                    </label>
                    <label className="mr-4">
                      <input
                        type="radio"
                        name="type"
                        checked={values.type === "Cash"}
                        className="mr-1 pointer"
                        onChange={(e) => {
                          setFieldValue("type", "Cash");
                          setRowDto([]);
                          setFieldValue("accountNo", "");
                          dispatch(
                            SetFinancialsPaymentAdviceAction({
                              ...values,
                              type: "Cash",
                              accountNo: "",
                            })
                          );
                        }}
                      />
                      Cash
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        checked={values.type === "Bank"}
                        className="mr-1 pointer"
                        onChange={(e) => {
                          setFieldValue("type", "Bank");
                          setRowDto([]);
                          setFieldValue("accountNo", "");
                          setFieldValue("cashGl", "");
                          dispatch(
                            SetFinancialsPaymentAdviceAction({
                              ...values,
                              type: "Bank",
                              accountNo: "",
                              cashGl: "",
                            })
                          );
                        }}
                      />
                      Bank
                    </label>
                  </div> */}
                  {values.type.value === 4 && (
                    <div className="col-lg-2">
                      <NewSelect
                        name="cashGl"
                        options={bankDDL}
                        value={values?.cashGl}
                        placeholder="Cash GL"
                        label="Cash GL"
                        onChange={(valueOption) => {
                          setFieldValue("cashGl", valueOption);
                          dispatch(
                            SetFinancialsPaymentAdviceAction({
                              ...values,
                              cashGl: valueOption,
                            })
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {[1, 2, 5].includes(values.type.value) && (
                    <div className="col-lg-2">
                      <NewSelect
                        name="accountNo"
                        options={accountNoDDL}
                        value={values?.accountNo}
                        placeholder="Account No"
                        label="Account No(Online)"
                        onChange={(valueOption) => {
                          setFieldValue("accountNo", valueOption);
                          dispatch(
                            SetFinancialsPaymentAdviceAction({
                              ...values,
                              accountNo: valueOption,
                            })
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 1, label: "Pending" },
                        { value: 2, label: "Complete" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        setRowDto([]);
                        dispatch(
                          SetFinancialsPaymentAdviceAction({
                            ...values,
                            status: valueOption,
                          })
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="billType"
                      options={billType}
                      value={values?.billType}
                      label="Bill Type"
                      onChange={(valueOption) => {
                        setFieldValue("billType", valueOption);
                        setRowDto([]);
                        dispatch(
                          SetFinancialsPaymentAdviceAction({
                            ...values,
                            billType: valueOption,
                          })
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Pay Date</label>
                    <InputField
                      value={values?.payDate}
                      name="payDate"
                      placeholder="Pay Date"
                      type="date"
                      // min={_todayDate()}
                      onChange={(e) => {
                        setFieldValue("payDate", e.target.value);
                        SetFinancialsPaymentAdviceAction({
                          ...values,
                          payDate: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <label>Pay Date</label>
                    <InputField value={values?.date} name="date" type="date" />
                  </div> */}
                  <div style={{ marginTop: "22px" }} className="col-lg-1">
                    <button
                      className="btn btn-primary"
                      disabled={!values?.billType}
                      type="button"
                      onClick={() => {
                        setRowDto([]);
                        getLanding(values);
                      }}
                    >
                      Show
                    </button>
                  </div>
                  <div
                    style={{ marginTop: "22px", marginLeft: "6px" }}
                    className="col-lg-2"
                  >
                    <button
                      style={{ display: "none" }}
                      className="btn btn-primary"
                      disabled={
                        !values?.sbuUnit
                        //||
                        // !values?.adviceBank ||
                        // !values?.accountNo
                      }
                      type="submit"
                      ref={supportButtonRefs?.current[0]}
                      onSubmit={() => {
                        saveHandler(values, () => {
                          resetForm(initData);
                          setRowDto([]);
                          setIsAble(false);
                        });
                      }}
                    >
                      Prepare Voucher
                    </button>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <PaginationSearch
                  placeholder="Bill No Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
                {values?.billType?.value === 1 && <p style={{fontWeight:"bold"}} className="text-right">Amount: {sumSelectedValue(rowDto)}</p>}
              </div>

              {[1, 2]?.includes(values?.billType?.value) ? (
                <OtherTableForBillType
                  values={values}
                  allSelect={allSelect}
                  setAllSelect={setAllSelect}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  selectIndividualItem={selectIndividualItem}
                  updateDate={updateDate}
                  preparepaymentIndex={preparepaymentIndex}
                  setModalShow={setModalShow}
                  setGridItem={setGridItem}
                  setPreparePaymentLastAction={setPreparePaymentLastAction}
                  setBankModelShow={setBankModelShow}
                  setGridData={setGridData}
                  dispatch={dispatch}
                />
              ) : (
                <GlobalTableForBillType
                  values={values}
                  allSelect={allSelect}
                  setAllSelect={setAllSelect}
                  rowDto={rowDto}
                  selectIndividualItem={selectIndividualItem}
                  updateDate={updateDate}
                  preparepaymentIndex={preparepaymentIndex}
                  setModalShow={setModalShow}
                  setGridItem={setGridItem}
                  setPreparePaymentLastAction={setPreparePaymentLastAction}
                  setBankModelShow={setBankModelShow}
                  setGridData={setGridData}
                  dispatch={dispatch}
                />
              )}

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
                onClick={() => setRowDto([])}
              ></button>
            </Form>
            <IViewModal
              show={bankModelShow}
              title="Bank Journal"
              onHide={() => setBankModelShow(false)}
            >
              <BankJournalCreateForm
                setBankModelShow={setBankModelShow}
                journalType={5}
                gridData={gridData}
                values={values}
                getLanding={getLanding}
              />
            </IViewModal>

            <>
              <IViewModal show={mdalShow} onHide={() => setModalShow(false)}>
                {values?.billType?.value === 1 && (
                  <SupplerInvoiceView
                    gridItem={gridItem}
                    landingValues={{ ...values, status: 2 }}
                    // laingValues={values}
                    // girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 2 && (
                  <SupplierAdvanceView
                    gridItem={gridItem}
                    landingValues={{ ...values, status: 2 }}
                    // laingValues={values}
                    bilRegister={false}
                    // girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 3 && (
                  <AdvForInternalView
                    gridItem={gridItem}
                    laingValues={{ status: { value: 2 } }}
                    //laingValues={values}
                    //girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {(values?.billType?.value === 4 ||
                  values?.billType?.value === 5) && (
                  <ExpenseView
                    gridItem={gridItem}
                    laingValues={{ status: { value: 2 } }}
                    //  girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 6 && (
                  <ViewTransportBill
                    landingValues={{ ...values, status: 2 }}
                    gridItem={gridItem}
                    // setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 7 && (
                  <ViewSalesCommission
                    billRegisterId={gridItem?.billRegisterId}
                    gridItem={gridItem}
                    // setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                    landingValues={{ ...values, status: 2 }}
                  />
                )}
                {values?.billType?.value === 8 && (
                  <ViewFuelBill
                    gridItem={gridItem}
                    // setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                    landingValues={{ ...values, status: 2 }}
                  />
                )}
                {(values?.billType?.value === 9 ||
                  values?.billType?.value === 10) && (
                  <ViewLabourBill
                    landingValues={{ ...values, status: 2 }}
                    gridItem={gridItem}
                    // setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 12 && (
                  <OthersBillView
                    landingValues={{ ...values, status: 2 }}
                    gridItem={gridItem}
                    // setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 15 && (
                  <ShippingInvoiceView
                    gridItem={gridItem}
                    landingValues={{ ...values, status: 2 }}
                    // laingValues={values}
                    // girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {values?.billType?.value === 18 && (
                  <ViewPumpFoodingBill
                    billRegisterId={gridItem?.billRegisterId}
                  />
                )}
                {values?.billType?.value === 33 && (
                  <CustomerRefundModal
                    billRegisterId={gridItem?.billRegisterId}
                  />
                )}
              </IViewModal>
            </>
          </>
        )}
      </Formik>
    </>
  );
}

import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  paymentName: "",
  paymentNameDDL: "",
  amount: "",
  date: "",
  fromDate: "",
  toDate: "",
  poLc: "",
  shipment: "",
};
export default function ProjectedCashFlowCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [cashList, setCashList] = useState([]);
  const [previousList, getPreviousList, lodar] = useAxiosGet();
  const [, inactiveSave] = useAxiosPost();
  const [viewType, setViewType] = useState(1);
  const [shipmentDDL, getShipment] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPreviousList(
      `/fino/FundManagement/FundProjectedExpenseLanding?partName=FundProjectedExpenseForLastThirtyDays`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    if (!cashList?.length)
      return toast.warn("Please add at least one Expense/Payment");
    saveData(
      `/fino/FundManagement/CreateFundProjectedExpense?partName=FundProjectedExpenseCreate&intId=${
        viewType === 1 ? 0 : viewType === 2 ? 1 : 2
      }`,
      cashList?.map((item) => ({
        intBusinessUnitId: selectedBusinessUnit?.value,
        strExpenseDescription: item?.paymentName,
        numAmount: +item?.amount,
        dteDueDate: item?.date,
        intLcId: item?.lcId || 0,
        strLcNo: item?.lcNo || "",
        intShipmentId: item?.shipmentId || 0,
        strShipmentNo: item?.shipmentNo || "",
        isImport: item?.isImport,
        isActive: true,
        intLastActionBy: profileData?.userId,
        dteLastActionTime: _todayDate(),
      })),
      () => {
        setCashList([]);
        getPreviousList(
          `/fino/FundManagement/FundProjectedExpenseLanding?partName=FundProjectedExpenseForLastThirtyDays&fromDate=${values?.fromDate ||
            ""}&toDate=${values?.toDate || ""}`
        );
      },
      true
    );
  };

  const addHandler = (values, setFieldValue) => {
    const isExist = cashList.findIndex(
      (item) =>
        item?.paymentName?.replace(/\s/g, "").toLowerCase() ===
        values?.paymentName?.replace(/\s/g, "")?.toLowerCase()
    );
    if (isExist !== -1) return toast.warn("Payment Name already exist");

    setCashList([
      {
        paymentName:
          viewType === 2 ? values?.paymentNameDDL?.label : values?.paymentName,
        amount: values?.amount,
        date: values?.date,
        isImport: viewType === 2,
        lcId: viewType === 2 ? values?.poLc?.value : 0,
        lcNo: viewType === 2 ? values?.poLc?.label : "",
        shipmentId: viewType === 2 ? values?.shipment?.value : 0,
        shipmentNo: viewType === 2 ? values?.shipment?.label : "",
      },
      ...cashList,
    ]);
    setFieldValue("paymentNameDDL", "");
    setFieldValue("poLc", "");
    setFieldValue("shipment", "");
    setFieldValue("paymentName", "");
    setFieldValue("amount", "");
    setFieldValue("date", "");
  };

  const removeHandler = (index) => {
    const data = cashList?.filter((item, i) => i !== index);
    setCashList([...data]);
  };

  const loadPoLc = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) => res?.data);
  };

  const disabledHandler = (values) => {
    if (
      (viewType === 1 || viewType === 3) &&
      (!values?.paymentName || !values?.amount || !values?.date)
    ) {
      return true;
    } else if (
      viewType === 2 &&
      (!values?.paymentNameDDL?.value ||
        !values?.amount ||
        !values?.date ||
        !values?.poLc?.value ||
        !values?.shipment?.value)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <IForm title="Create Projected Cash Flow" getProps={setObjprops}>
      {lodar && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
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
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="">
                  <div className="row">
                    <div
                      style={{ marginTop: "10px", marginBottom: "-6px" }}
                      className="col-lg-12"
                    >
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="viewType"
                          checked={viewType === 1}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(valueOption) => {
                            setViewType(1);
                            setCashList([]);
                          }}
                        />
                        Expense
                      </label>
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="viewType"
                          checked={viewType === 3}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(valueOption) => {
                            setViewType(3);
                            setCashList([]);
                          }}
                        />
                        Income
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="viewType"
                          checked={viewType === 2}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(e) => {
                            setViewType(2);
                            setCashList([]);
                          }}
                        />
                        Import
                      </label>
                    </div>
                    <div className="col-lg-6">
                      <div className="row form-group  global-form">
                        {viewType === 2 ? (
                          <>
                            <div className="col-lg-6">
                              <label>PO/LC No</label>
                              <SearchAsyncSelect
                                selectedValue={values?.poLc}
                                handleChange={(valueOption) => {
                                  setFieldValue("poLc", valueOption);
                                  getShipment(
                                    `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${profileData?.accountId}&buId=${selectedBusinessUnit?.value}&searchTerm=${valueOption?.label}`
                                  );

                                  setFieldValue("shipment", "");
                                }}
                                loadOptions={loadPoLc || []}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-6">
                              <NewSelect
                                name="shipment"
                                label="Shipment"
                                options={shipmentDDL || []}
                                value={values?.shipment}
                                onChange={(valueOption) => {
                                  setFieldValue("shipment", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-6">
                              <NewSelect
                                name="paymentNameDDL"
                                label="Payment Name"
                                options={[
                                  { value: "Deauty", label: "Deauty" },
                                  {
                                    value: "At sight payment",
                                    label: "At sight payment",
                                  },
                                ]}
                                value={values?.paymentNameDDL}
                                onChange={(valueOption) => {
                                  setFieldValue("paymentNameDDL", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        {(viewType === 1 || viewType === 3) ? (
                          <div className="col-lg-6">
                            <InputField
                              value={values?.paymentName}
                              label={viewType === 1 ? "Expense/Payment Name" : viewType === 3 ? "Income Name" : ""}
                              name="paymentName"
                              type="text"
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="col-lg-6">
                          <InputField
                            value={values?.amount}
                            label="Amount"
                            name="amount"
                            type="number"
                            onChange={(e) => {
                              if (+e.target.value < 0) return;
                              setFieldValue("amount", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-6">
                          <InputField
                            value={values?.date}
                            label="Due Date"
                            name="date"
                            type="date"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            style={{ marginTop: "18px" }}
                            disabled={disabledHandler(values)}
                            className="btn btn-primary ml-4"
                            onClick={() => {
                              addHandler(values, setFieldValue);
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div>
                        <h5 style={{ marginTop: "15px", marginBottom: "-5px" }}>
                          New List:
                        </h5>
                        <div className="table-responsive">
  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>Expense/Payment Name</th>
                              <th>Amount</th>
                              <th>Date</th>
                              <th style={{ width: "50px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cashList?.length > 0 &&
                              cashList.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.paymentName}</td>
                                  <td className="text-center">
                                    {item?.amount}
                                  </td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.date)}
                                  </td>
                                  <td className="text-center">
                                    <span
                                      onClick={() => {
                                        removeHandler(index);
                                      }}
                                    >
                                      <IDelete />
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
          </div>
                      
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row form-group  global-form">
                        <div className="col-lg-6">
                          <InputField
                            value={values?.fromDate}
                            label="From Date"
                            name="fromDate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-6">
                          <InputField
                            value={values?.toDate}
                            label="To Date"
                            name="toDate"
                            type="date"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            style={{ marginTop: "18px" }}
                            className="btn btn-primary ml-5"
                            disabled={!values?.fromDate || !values.toDate}
                            onClick={() => {
                              getPreviousList(
                                `/fino/FundManagement/FundProjectedExpenseLanding?partName=FundProjectedExpenseForLastThirtyDays&fromDate=${values?.fromDate ||
                                  ""}&toDate=${values?.toDate || ""}`
                              );
                            }}
                          >
                            Show
                          </button>
                        </div>
                      </div>
                      <div>
                        <h5 style={{ marginTop: "15px", marginBottom: "-5px" }}>
                          Previous List:
                        </h5>
                        <div className="loan-scrollable-table mt-3">
                          <div className="scroll-table _table">
                            <table className="table table-bordered bj-table bj-table-landing">
                              <thead>
                                <tr>
                                  <th style={{ minWidth: "30px" }}>SL</th>
                                  <th>Expense/Payment Name</th>
                                  <th style={{ minWidth: "80px" }}>Amount</th>
                                  <th style={{ minWidth: "80px" }}>Date</th>
                                  <th style={{ minWidth: "50px" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {previousList?.Result?.length > 0 &&
                                  previousList?.Result?.map((item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item?.ExpensePaymentConcat}</td>
                                      <td className="text-right">
                                        {_formatMoney(item?.numAmount)}
                                      </td>
                                      <td className="text-center">
                                        {_dateFormatter(item?.dteDueDate)}
                                      </td>
                                      <td className="text-center">
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="cs-icon">
                                              {"Inactive"}
                                            </Tooltip>
                                          }
                                        >
                                          <span>
                                            <i
                                              className="fa fa-minus-square"
                                              aria-hidden="true"
                                              onClick={() => {
                                                IConfirmModal({
                                                  message:
                                                    "Are you sure you want to inactive ?",
                                                  yesAlertFunc: () => {
                                                    inactiveSave(
                                                      `/fino/FundManagement/DeleteFundProjectedExpense?partName=DeleteProjectedExpense&intId=${item?.intAutoId}`,
                                                      null,
                                                      () => {
                                                        getPreviousList(
                                                          `/fino/FundManagement/FundProjectedExpenseLanding?partName=FundProjectedExpenseForLastThirtyDays&fromDate=${values?.fromDate ||
                                                            ""}&toDate=${values?.toDate ||
                                                            ""}`
                                                        );
                                                      },
                                                      true
                                                    );
                                                  },
                                                  noAlertFunc: () => {},
                                                });
                                              }}
                                            ></i>
                                          </span>
                                        </OverlayTrigger>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}

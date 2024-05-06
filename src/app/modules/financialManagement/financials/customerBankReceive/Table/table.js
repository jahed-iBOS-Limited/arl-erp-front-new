import React, { useState, useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  savecustomerBankRec,
  getCustomerBankRecLanding,
  getBankAccountNoDDL,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import FormikError from "../../../../_helper/_formikError";
import { toast } from "react-toastify";
import { SetFinancialsCustomerBankReceiveAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { useMemo } from "react";
import "./style.css";
import IClose from "../../../../_helper/_helperIcons/_close";
import IViewModal from "../../../../_helper/_viewModal";
import AmountSeparateModal from "./amountSeparateModal";

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const CustomerBankReceiveTable = () => {
  const [landing, setLanding] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [, setBankAccountNoDDL] = useState([]);
  const dispatch = useDispatch();
  const [isAmountSeparateModal, setIsAmountSeparateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const { profileData, selectedBusinessUnit, userRole } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const { financialsCustomerBankReceive } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );

  let initData = {
    fromDate: _todayDate(),
    toDate: financialsCustomerBankReceive?.toDate || _todayDate(),
    bankAccountNo: financialsCustomerBankReceive?.accountNo || "",
  };

  const viewPurchaseOrderData = (values) => {
    getCustomerBankRecLanding(
      selectedBusinessUnit?.value,
      values?.bankAccountNo?.value,
      _dateFormatter(new Date("2021-07-01")),
      values?.toDate,
      setLoading,
      setLanding,
      search
    );
  };
  useEffect(() => {
    getBankAccountNoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccountNoDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const isCreate = useMemo(() => {
    let obj =
      userRole?.length > 0
        ? userRole.filter((item) => item?.intFeatureId === 827)
        : [];
    return obj?.[0]?.isCreate;
  }, [userRole]);

  const totalAmount = useMemo(() => {
    let total = 0;
    if (landing?.length > 0) {
      total = landing.reduce(
        (acc, item) => acc + Number(item?.creditAmount),
        0
      );
    }
    return (total || 0).toFixed(2);
  }, [landing]);

  return (
    <div className="customer-bank-receive-fin">
      <ICustomCard title="Customer Bank Receive">
        <>
          <Formik
            enableReinitialize={true}
            validationSchema={validationSchema}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <>
                <Form className="form form-label-left">
                  <div
                    className="row global-form"
                    style={{
                      background: " #d6dadd",
                      margin: "3px 0",
                      padding: "4px 10px",
                    }}
                  >
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetFinancialsCustomerBankReceiveAction({
                              accountNo: values?.bankAccountNo,
                              toDate: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-4">
                      <label>Search(optional)</label>
                      <InputField
                        value={search}
                        name="search"
                        placeholder="Search"
                        type="text"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        style={{ paddingRight: "25px" }}
                      />
                      {search && (
                        <div
                          style={{
                            position: "absolute",
                            top: "21px",
                            right: "20px",
                            fontSize: "14px",
                          }}
                        >
                          <IClose
                            title="Clear"
                            closer={(e) => {
                              setSearch("");
                              getCustomerBankRecLanding(
                                selectedBusinessUnit?.value,
                                values?.bankAccountNo?.value,
                                _dateFormatter(new Date("2021-07-01")),
                                values?.toDate,
                                setLoading,
                                setLanding,
                                ""
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <button
                        style={{ marginTop: "19px" }}
                        type="submit"
                        className="btn btn-primary"
                        disabled={!values?.toDate}
                        onClick={() => {
                          viewPurchaseOrderData(values);
                        }}
                      >
                        Show
                      </button>
                    </div>
                    <div className="col-lg-4 text-right">
                      <h5 style={{ marginTop: "15px" }}>
                        <b>Total</b> : {totalAmount}
                      </h5>
                    </div>
                  </div>
                </Form>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="loan-scrollable-table">
                      <div
                        style={{ maxHeight: "550px" }}
                        className="scroll-table _table scroll-table-auto"
                      >
                        <table className="table table-striped table-bordered global-table table-font-size-sm">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "30px" }}>SL</th>
                              <th style={{ minWidth: "70px" }}>Date</th>
                              <th>Account No</th>
                              <th style={{ minWidth: "200px" }}>Particulars</th>
                              {/* <th style={{ minWidth: "150px" }}>Bank Name</th>
                            <th style={{ minWidth: "150px" }}>Account No.</th> */}
                              <th style={{ minWidth: "100px" }}>Cheque No.</th>
                              <th style={{ minWidth: "100px" }}>Amount</th>
                              <th style={{ minWidth: "150px" }}>
                                Customer List
                              </th>
                              {/* <th style={{ minWidth: "150px" }}>Remarks</th> */}
                              <th style={{ minWidth: "70px" }}>Action</th>
                            </tr>
                          </thead>
                          {loading ? (
                            <ILoader />
                          ) : (
                            <tbody>
                              {landing?.map((item, index) => (
                                <tr key={index}>
                                  <td style={{ fontSize: "10px" }}>
                                    {item?.sl}
                                  </td>
                                  <td style={{ fontSize: "10px" }}>
                                    {_dateFormatter(item?.bankTransectionDate)}
                                  </td>
                                  <td style={{ fontWeight: "bold" }}>
                                    {item?.bankAccountNo}
                                  </td>
                                  <td style={{ fontSize: "10px" }}>
                                    {item?.particulars}
                                  </td>
                                  {/* <td>{item?.bankName}</td>
                                <td>{item?.bankAccountNo}</td> */}
                                  <td style={{ fontSize: "10px" }}>
                                    {item?.chequeNo}
                                  </td>
                                  <td style={{ fontWeight: "bold" }}>
                                    {item?.creditAmount}
                                  </td>
                                  <td style={{ width: "200px" }}>
                                    {item?.reconsileStatusId === 1 ? (
                                      <>
                                        <SearchAsyncSelect
                                          position="unset"
                                          selectedValue={item?.customerList}
                                          handleChange={(valueOption) => {
                                            item["customerList"] = valueOption;
                                            setLanding([...landing]);
                                            // rowDtoHandler(
                                            //   "customerList",
                                            //   valueOption,
                                            //   index
                                            // );
                                          }}
                                          loadOptions={(v) => {
                                            if (v.length < 2) return [];
                                            return axios
                                              .get(
                                                `/fino/SupplierInvoiceInfo/GetPartnerList?BusinessUnitId=${selectedBusinessUnit?.value}&PartnerName=${v}`
                                              )
                                              .then((res) => {
                                                const updateList = res?.data.map(
                                                  (item) => ({
                                                    ...item,
                                                  })
                                                );
                                                return updateList;
                                              });
                                          }}
                                          isDisabled={false}
                                        />
                                        <FormikError
                                          errors={errors}
                                          name="customerList"
                                          touched={touched}
                                        />
                                      </>
                                    ) : (
                                      item?.customerList?.label
                                    )}
                                  </td>
                                  <td className="text-center align-middle">
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                      }}
                                    >
                                      {item?.reconsileStatusId === 1 && (
                                        <button
                                          className="btn p-0"
                                          disabled={
                                            item?.ysnReconciled ||
                                            !item?.customerList?.value
                                          }
                                          onClick={() => {
                                            if (!isCreate)
                                              return toast.warn(
                                                "You don't have permission"
                                              );

                                            if (!item?.customerList?.value) {
                                              return toast.warning(
                                                "Please add customer"
                                              );
                                            }

                                            let payload = [
                                              {
                                                StatementId:
                                                  item?.bankStatementId,
                                                BankAccountId:
                                                  item?.bankAccountId || 0,
                                                CustomerId:
                                                  item?.customerList?.value,
                                                CustomerName:
                                                  item?.customerList?.label,
                                                ActionById: profileData?.userId,
                                                typeId: 1,
                                                narration: "",
                                                sbuId: 0,
                                              },
                                            ];
                                            savecustomerBankRec(
                                              payload,
                                              setLoading,
                                              () => {
                                                landing.splice(index, 1);
                                                setLanding([...landing]);
                                              }
                                            );
                                          }}
                                        >
                                          <i
                                            className={
                                              (item?.partnerId
                                                ? "text-warning"
                                                : "text-success") +
                                              " fa fa-check-circle "
                                            }
                                          ></i>
                                        </button>
                                      )}
                                      {/* add icon add */}
                                      {item?.customerList?.value ? (
                                        <i
                                          className="fa fa-plus-circle cursor-pointer"
                                          onClick={() => {
                                            setIsAmountSeparateModal(true);
                                            setSelectedItem(item);
                                          }}
                                        ></i>
                                      ) : null}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {isAmountSeparateModal && (
                  <>
                    <IViewModal
                      show={isAmountSeparateModal}
                      onHide={() => {
                        setIsAmountSeparateModal(false);
                      }}
                    >
                      <AmountSeparateModal
                        selectedItem={{
                          ...selectedItem,
                        }}
                        separateModalCB={() => {
                          setIsAmountSeparateModal(false);
                          viewPurchaseOrderData(values);
                        }}
                      />
                    </IViewModal>
                  </>
                )}
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </div>
  );
};

export default CustomerBankReceiveTable;

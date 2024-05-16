import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "./../../../../../_metronic/_partials/controls";
import Loading from "./../../../_helper/_loading";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IConfirmModal from "../../../_helper/_confirmModal";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import AttachmentField from "./AttachmentField";

const initData = {
  fromDate: "",
  toDate: "",
  businessUnit: "",
  paymentType: "",
  bankAccount: "",
  instrumentType: "",
  attachment: "",
};

const PaymentPrepare = () => {
  const [rowDto, getData, loading, setRowDto] = useAxiosGet();
  // eslint-disable-next-line no-unused-vars
  const [data, getApproveData, getLoading, setData] = useAxiosPost();
  const [voucherBtn, setVoucherBtn] = useState(true);
  const [filterData, setFilterData] = useState("");
  const [bankAccountDDL, getBankAccountDDL] = useAxiosGet();
  const [instrumentTypeDDL, getInstrumentTypeDDL] = useAxiosGet();

  // ddl
  const [unitNameDDL, getUnitNameDDL] = useAxiosGet();
  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  // eslint-disable-next-line no-unused-vars
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state?.authData;
    },
    shallowEqual
  );

  useEffect(() => {
    getUnitNameDDL(generateAPI("UnitDDL"));
    getBankAccountDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${
        profileData?.accountId
      }&BusinssUnitId=${4}`
    );
    getInstrumentTypeDDL(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTrustAllLanding = (
    partName,
    paymentStatusId = 2,
    unitId,
    paymentType,
    fromDate,
    toDate
  ) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${partName}&PaymentStatusId=${paymentStatusId}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}&paymentTypeId=${paymentType}`;
  };

  const voucherSubmitlHandler = (values, setFieldValue) => {
    const checkedData = rowDto.filter((itm) => itm.itemCheck);
    const payload = [];
    checkedData.forEach((itm) =>
      payload.push({
        paymentScheduleId: itm?.PaymentScheduleId,
        userId: profileData?.userId,
        bankId: values?.bankAccount?.bankId || 0,
        bankName: values?.bankAccount?.bankName || "",
        bankBranchId: values?.bankAccount?.bankBranch_Id || 0,
        bankBranchName: values?.bankAccount?.bankBranchName || "",
        bankAccountId: values?.bankAccount?.value || 0,
        bankAccountNumber: values?.bankAccount?.bankAccNo || "",
        instrumentTypeId: values?.instrumentType?.value,
        instrumentTypeName: values?.instrumentType?.label,
      })
    );
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected voucher submit`,
      yesAlertFunc: () => {
        getApproveData(
          `/hcm/TrustManagement/PreparePaymentApprove?UserId=${profileData?.userId}&Attachment=${values?.attachment?.[0]?.id}`,
          payload,
          (data) => {
            toast.success(data[0]?.Column1 || "Submitted successfully");
            setFieldValue("bankAccount", "");
            setFieldValue("instrumentType", "");
            setFieldValue("attachment", "");
            getData(
              getTrustAllLanding(
                "GetAllPaymentStatusNDonationReciverList",
                2,
                filterData?.businessUnit || 4,
                filterData?.paymentType,
                filterData?.fromDate,
                filterData?.toDate
              )
            );
          }
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
    //
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
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
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Prepare Payment"}></CardHeader>
                <CardBody>
                  <div className="mt-0">
                    <div className="form-group row global-form">
                      <div className="col-8">
                        <div className="row">
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Unit Name
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <NewSelect
                                isHiddenToolTip={true}
                                name="businessUnit"
                                isHiddenLabel={true}
                                options={unitNameDDL || []}
                                value={values?.businessUnit}
                                onChange={(valueOption) => {
                                  setFieldValue("businessUnit", valueOption);
                                }}
                                placeholder="Unit Name"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              Payment Type
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <NewSelect
                                isHiddenToolTip={true}
                                name="paymentType"
                                isHiddenLabel={true}
                                options={[
                                  { value: 1, label: "Zakat" },
                                  { value: 2, label: "Donation/Sadaka" },
                                ]}
                                value={values?.paymentType}
                                onChange={(valueOption) => {
                                  setFieldValue("paymentType", valueOption);
                                }}
                                placeholder="Payment Type"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12"></div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              From Date
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  type="date"
                                  value={values?.fromDate}
                                  name="fromDate"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-2 mb-2">
                            <div className="d-flex align-items-center h-100">
                              To Date
                            </div>
                          </div>
                          <div className="col-lg-4 mb-2">
                            <div className="d-flex align-items-center w-100">
                              <span className="mr-2">:</span>
                              <div className="w-100">
                                <InputField
                                  type="date"
                                  value={values?.toDate}
                                  name="toDate"
                                  min={values?.fromDate}
                                  disabled={!values?.fromDate}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6 mb-2">
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ fontSize: "12px" }}
                              onClick={() => {
                                getData(
                                  getTrustAllLanding(
                                    "GetAllPaymentStatusNDonationReciverList",
                                    2,
                                    values?.businessUnit?.value || 4,
                                    values?.paymentType?.value,
                                    values?.fromDate,
                                    values?.toDate
                                  )
                                );
                                setFilterData({
                                  fromDate: values?.fromDate,
                                  toDate: values?.toDate,
                                  businessUnit: values?.businessUnit?.value,
                                  paymentType: values?.paymentType?.value,
                                });
                              }}
                              disabled={!values?.paymentType}
                            >
                              Show Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <AttachmentField
                          attachment={values?.attachment}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="instrumentType"
                          options={instrumentTypeDDL || []}
                          value={values?.instrumentType}
                          label="Instrument Type"
                          onChange={(valueOption) => {
                            if (["Cash"].includes(valueOption?.label)) {
                              setFieldValue("bankAccount", "");
                            }
                            setFieldValue("instrumentType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="bankAccount"
                          options={bankAccountDDL || []}
                          value={values?.bankAccount}
                          label="Select Bank AC"
                          onChange={(valueOption) => {
                            setFieldValue("bankAccount", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={["Cash"].includes(
                            values?.instrumentType?.label
                          )}
                        />
                      </div>
                      <div className="col-lg-2 mt-1">
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ fontSize: "12px", marginTop: "15px" }}
                          disabled={
                            voucherBtn ||
                            (!["Cash"].includes(
                              values?.instrumentType?.label
                            ) &&
                              !values?.bankAccount) ||
                            !values?.instrumentType
                          }
                          onClick={() => {
                            voucherSubmitlHandler(values, setFieldValue);
                          }}
                        >
                          All Voucher Prepare
                        </button>
                      </div>
                    </div>
                    <div>
                      <h6 style={{ marginBottom: 0, marginTop: "15px" }}>
                        Daily Donation Application For Prepare Voucher:
                      </h6>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "20px" }}>
                                  <input
                                    type="checkbox"
                                    id="parent"
                                    checked={
                                      rowDto?.length > 0 &&
                                      rowDto?.every((item) => item?.itemCheck)
                                    }
                                    onChange={(event) => {
                                      setRowDto(
                                        rowDto?.map((item) => ({
                                          ...item,
                                          itemCheck: event.target.checked,
                                        }))
                                      );
                                      setVoucherBtn(
                                        rowDto.some(
                                          (itm) => itm.itemCheck === true
                                        )
                                      );
                                    }}
                                  />
                                </th>
                                <th style={{ width: "20px" }}>SL</th>
                                <th>Application Id</th>
                                <th>Applicant Name</th>
                                <th>Mode Of Payment</th>
                                <th>Payment Amount</th>
                                <th>Payment Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.length > 0 &&
                                rowDto.map((data, index) => (
                                  <tr key={index}>
                                    <td>
                                      <input
                                        id="itemCheck"
                                        type="checkbox"
                                        className=""
                                        value={data?.itemCheck}
                                        checked={data?.itemCheck}
                                        name={data?.itemCheck}
                                        onChange={(e) => {
                                          let data = [...rowDto];
                                          data[index].itemCheck =
                                            e.target.checked;
                                          setRowDto([...data]);
                                          setVoucherBtn(
                                            !rowDto.some(
                                              (itm) => itm.itemCheck === true
                                            )
                                          );
                                        }}
                                      />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td className="text-center">
                                      {data?.intApplicationID}
                                    </td>
                                    <td>{data?.strApplicantName}</td>
                                    <td>{data?.strModeOfPayment}</td>
                                    <td className="text-right">
                                      {_formatMoney(data?.monAmount, 0)}
                                    </td>
                                    <td className="text-center">
                                      {_dateFormatter(data?.dtePaymentDate)}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default PaymentPrepare;

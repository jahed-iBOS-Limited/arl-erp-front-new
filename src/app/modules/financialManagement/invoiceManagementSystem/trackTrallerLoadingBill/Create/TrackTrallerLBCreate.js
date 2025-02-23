import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import FormikError from "../../../../_helper/_formikError";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import { getShippointDDL } from "../../../../financialManagement/invoiceManagementSystem/billregister/helper";
import useAxiosGet from "../../../../procurement/purchase-management/purchaseOrder/customHooks/useAxiosGet";
import {
  getSupplierDDL,
  getTrackTrallerLoadingBillData,
  handleTTLBSaveData,
  totalApproveAmount,
  trackTrallerLBInitData,
  trackTrallerLBIValidationSchema,
} from "../helper";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const TrackTrallerLBCreatePage = () => {
  // redux api
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // hook
  // location data
  const { state: headerData } = useLocation();
  const dispatch = useDispatch();

  // state
  const [objProps, setObjprops] = useState({});
  const [shippointDDL, setShippointDDL] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);

  // api action
  const [
    trackTrallerLBData,
    getTrackTrallerLBData,
    getTrackTrallerLBDataLoading,
    setTrackTrallerLBData,
  ] = useAxiosGet();

  const [
    ,
    saveTrackTrallerLBData,
    saveTrackTrallerLBDataLoading,
  ] = useAxiosPost();

  // use effect
  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      getShippointDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShippointDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // Supplier Form Field
  const SupplierFormField = (values, setFieldValue, errors, touched) => (
    <div className="col-lg-4">
      <label>Supplier Name</label>
      <SearchAsyncSelect
        selectedValue={values.supplier}
        handleChange={(valueOption) => {
          setTrackTrallerLBData([]);
          setFieldValue("supplier", valueOption);
        }}
        loadOptions={(value) =>
          getSupplierDDL({
            value,
            profileData,
            selectedBusinessUnit,
          })
        }
      />
      <FormikError errors={errors} name="supplier" touched={touched} />
    </div>
  );

  const isLoading =
    getTrackTrallerLBDataLoading || saveTrackTrallerLBDataLoading;

  // total count
  const grandTotal = trackTrallerLBData?.reduce(
    (acc, item) => {
      return {
        totalTransactionTraller: (acc.totalTransactionTraller +=
          item?.NumTransectionQuantityTraller || 0),
        totalTransactionTruck: (acc.totalTransactionTruck +=
          item?.NumTransectionQuantityTruck || 0),
        totalLabourTraller: (acc.totalLabourTraller +=
          item?.LoadingLabourAmountTraller || 0),
        totalLabourTruck: (acc.totalLabourTruck +=
          item?.LoadingLabourAmountTruck || 0),
        totalBillAmount: (acc.totalBillAmount += item?.decGrandTotalBill || 0),
        totalApproveAmount: (acc.totalApproveAmount +=
          item?.approvedAmount || 0),
      };
    },
    {
      totalTransactionTraller: 0,
      totalTransactionTruck: 0,
      totalLabourTraller: 0,
      totalLabourTruck: 0,
      totalBillAmount: 0,
      totalApproveAmount: 0,
    }
  );

  return (
    <IForm title="Truck Traller Loading Bill" getProps={setObjprops}>
      <Formik
        enableReinitialize={true}
        initialValues={trackTrallerLBInitData}
        validationSchema={trackTrallerLBIValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // save track traller loading data
          handleTTLBSaveData(
            {
              saveTrackTrallerLBData,
              values,
              profileData,
              selectedBusinessUnit,
              trackTrallerLBData,
              headerData,
              attachmentList,
            },
            () => {
              // occured after successfully post by callback
              // reset form
              resetForm(trackTrallerLBInitData);
              // set traller data empty
              setTrackTrallerLBData([]);
              // set attacment data empty
              setAttachmentList([]);
            }
          );
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
          <>
            {isLoading && <Loading />}

            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-12">
                  <div className="row align-items-end">
                    {SupplierFormField(values, setFieldValue, errors, touched)}

                    <div className="col-lg-4">
                      <NewSelect
                        label="Select Shippoint"
                        options={shippointDDL || []}
                        value={values?.shippoint}
                        name="shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shippoint", valueOption);
                        }}
                        placeholder="Ship Point"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* Form Date To Date with Time */}
                    <FromDateToDateForm obj={{ values, setFieldValue }} />

                    <div className="col d-flex justify-content-end align-content-center mt-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={!values?.supplier || !values?.shippoint}
                        onClick={() => {
                          getTrackTrallerLoadingBillData({
                            profileData,
                            selectedBusinessUnit,
                            values,
                            getTrackTrallerLBData,
                            setTrackTrallerLBData,
                          });
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  {/* Bill Section Start */}
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.billNo}
                        label="Bill No"
                        name="billNo"
                        placeholder="Bill No"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={_dateFormatter(values?.billDate)}
                        label="Bill Date"
                        type="date"
                        name="billDate"
                        placeholder="Bill Date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={_dateFormatter(values?.paymentDueDate)}
                        label="Payment Due Date"
                        type="date"
                        name="paymentDueDate"
                        placeholder="Payment Due Date"
                      />
                    </div>
                  </div>
                  <div className="row align-items-end">
                    <div className="col-9">
                      <InputField
                        value={values?.narration}
                        label="Narration No"
                        name="narration"
                        placeholder="Narration"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="row align-items-end">
                        <div className="col-5">
                          <AttachmentUploaderNew
                            CBAttachmentRes={(attachmentData) => {
                              if (Array.isArray(attachmentData)) {
                                setAttachmentList(attachmentData);
                              }
                            }}
                          />
                          {values?.attachmentId && (
                            <IView
                              classes="purchaseInvoiceAttachIcon"
                              clickHandler={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    values?.attachmentId
                                  )
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-1 ">
                <div className="col-lg-12">
                  <div
                    className="d-flex justify-content-end align-items-center"
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Total : </span>
                    <span>{totalApproveAmount(trackTrallerLBData, false)}</span>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th style={{ width: "30px" }}>
                            <input
                              type="checkbox"
                              checked={
                                trackTrallerLBData?.length > 0
                                  ? trackTrallerLBData?.every(
                                      (item) => item?.checked
                                    )
                                  : false
                              }
                              onChange={(e) => {
                                const data = [...trackTrallerLBData];
                                const updatedData = data?.map((item) => {
                                  return {
                                    ...item,
                                    checked: e?.target?.checked,
                                  };
                                });
                                setTrackTrallerLBData(updatedData);
                              }}
                            />
                          </th>
                          <th style={{ width: "40px" }}>SL</th>
                          <th>Complete Date</th>
                          <th>ShipmentCode</th>
                          <th>Transaction Traller (Qty)</th>
                          <th>Transaction Truck (Qty)</th>
                          <th>Labour Amount (Traller)</th>
                          <th>Labour Amount (Truck)</th>
                          <th>Total Bill</th>
                          <th>Bill Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trackTrallerLBData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center align-middle">
                              <input
                                type="checkbox"
                                checked={item?.checked}
                                onChange={(e) => {
                                  const data = [...trackTrallerLBData];
                                  data[index]["checked"] = e.target.checked;
                                  setTrackTrallerLBData(data);
                                }}
                              />
                            </td>
                            <td className="text-center align-middle">
                              {index + 1}
                            </td>
                            <td>{_dateFormatter(item?.DteCompleteDate)}</td>
                            <td>{item?.StrShipmentCode}</td>
                            <td className="text-right">
                              {_formatMoney(
                                item?.NumTransectionQuantityTraller || 0
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                item?.NumTransectionQuantityTruck || 0
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                item?.LoadingLabourAmountTraller || 0
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                item?.LoadingLabourAmountTruck || 0
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.decGrandTotalBill || 0)}
                            </td>
                            <td style={{ width: "100px" }}>
                              <InputField
                                value={item?.approvedAmount}
                                name="approvedAmount"
                                placeholder="Bill Amount"
                                onChange={(e) => {
                                  const data = [...trackTrallerLBData];
                                  data[index]["approvedAmount"] =
                                    e?.target?.value;
                                  setTrackTrallerLBData(data);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                        {trackTrallerLBData.length > 0 ? (
                          <tr>
                            <td colSpan={4}>Total</td>
                            <td className="text-right font-weight-bold">
                              {_formatMoney(
                                grandTotal?.totalTransactionTraller
                              )}
                            </td>
                            <td className="text-right font-weight-bold">
                              {_formatMoney(grandTotal?.totalTransactionTruck)}
                            </td>
                            <td className="text-right font-weight-bold">
                              {_formatMoney(grandTotal?.totalLabourTraller)}
                            </td>
                            <td className="text-right font-weight-bold">
                              {_formatMoney(grandTotal?.totalLabourTruck)}
                            </td>
                            <td className="text-right font-weight-bold">
                              {_formatMoney(grandTotal?.totalBillAmount)}
                            </td>
                            <td className="text-right font-weight-bold">
                              {_formatMoney(grandTotal?.totalApproveAmount)}
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </table>
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
                onSubmit={() => resetForm(trackTrallerLBInitData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </IForm>
  );
};

export default TrackTrallerLBCreatePage;

import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  DeliveryChallanInformation_api,
  GetInfoForChalalnCancell_api,
  getDistributionChannelDDL_api,
  getPermissionForShipmentModification,
} from "../helper";

const initData = {
  customer: "",
  challan: "",
  supplierName: "",
  distributionChannel: "",
  previousDate: "",
  remarks: "",
  reportType: "",
};

function ShipmentCancel() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [permitted, setPermitted] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
      getPermissionForShipmentModification(
        profileData?.userId,
        selectedBusinessUnit?.value,
        setPermitted,
        setLoading
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const commonGridFunc = (values) => {
    DeliveryChallanInformation_api(
      1,
      selectedBusinessUnit?.value,
      values?.challan,
      values?.previousDate,
      profileData?.userId,
      values?.customer?.value,
      setGridData,
      setLoading
    );
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ ...initData }}>
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Shipment Cancel"}>
                  <CardHeaderToolbar>
                    <div>
                      {values?.reportType?.value === 1 ? (
                        <button
                          className="btn btn-primary ml-2"
                          type="button"
                          onClick={(e) => {
                            if (+gridData?.[0]?.intBillNumber > 0) {
                              toast.warning("Already bill submitted");
                              return false;
                            } else {
                              DeliveryChallanInformation_api(
                                2,
                                selectedBusinessUnit?.value,
                                values?.challan,
                                values?.updateDate,
                                profileData?.userId,
                                values?.customer?.value,
                                setGridData,
                                setLoading,
                                true,
                                () => {
                                  resetForm(initData);
                                }
                              );
                            }
                          }}
                          disabled={
                            !values?.updateDate || !gridData?.length > 0
                          }
                        >
                          Submit Date Update
                        </button>
                      ) : (
                        permitted[0]?.ysnPermission && (
                          <button
                            className="btn btn-primary ml-2"
                            type="button"
                            onClick={(e) => {
                              if (+gridData?.[0]?.intBillNumber > 0) {
                                toast.warning("Already bill submitted");
                                return false;
                              } else {
                                GetInfoForChalalnCancell_api(
                                  selectedBusinessUnit?.value,
                                  values?.challan,
                                  values?.remarks,
                                  profileData?.userId,
                                  values?.customer?.value,
                                  setGridData,
                                  setLoading,
                                  () => {
                                    resetForm(initData);
                                  }
                                );
                              }
                            }}
                            disabled={!values?.remarks || !gridData?.length > 0}
                          >
                            Submit Shipment Cancel
                          </button>
                        )
                      )}
                    </div>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          // { value: 1, label: "Challan Date Update" }, 7
                          { value: 2, label: "Shipment Cancel" },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("reportType", valueOption);
                          setGridData([]);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                        isClearable={false}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={distributionChannelDDL}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", valueOption);
                          setFieldValue("customer", "");
                          setGridData([]);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <div>
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                            setGridData([]);
                          }}
                          isDisabled={!values?.distributionChannel}
                          placeholder="Search Customer"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${values?.distributionChannel?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Challan</label>
                      <InputField
                        value={values?.challan}
                        name="challan"
                        placeholder="Challan"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("challan", e.target.value);
                          setGridData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Previous Date</label>
                      <InputField
                        value={values?.previousDate}
                        name="previousDate"
                        placeholder="Previous Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("previousDate", e.target.value);
                          setGridData([]);
                        }}
                      />
                    </div>

                    <div className="col d-flex  align-items-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          setGridData([]);
                          commonGridFunc(values);
                        }}
                        disabled={
                          !values?.customer ||
                          !values?.challan ||
                          !values?.previousDate
                        }
                      >
                        View
                      </button>
                    </div>
                    <div className="col-lg-12">
                      <hr className="mb-0 mt-2" />
                    </div>
                    {values?.reportType?.value === 1 ? (
                      <div className="col-lg-3">
                        <label>Update Date</label>
                        <InputField
                          value={values?.updateDate}
                          name="updateDate"
                          placeholder="Update Date"
                          type="date"
                        />
                      </div>
                    ) : (
                      <div className="col-lg-3">
                        <label>Remarks</label>
                        <InputField
                          value={values?.remarks || ""}
                          name="remarks"
                          placeholder="Remarks"
                          type="text"
                        />
                      </div>
                    )}
                  </div>

                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Challan Date</th>
                        <th>Audit Approve Date</th>
                        <th>Delivery Challan No.</th>
                        <th>Sold To Partner Name</th>
                        <th>Transport Supplier Name</th>
                        <th>Vehicle Supplier Name</th>
                        <th>Transport Mode Name</th>
                        <th>Owner Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td> {_dateFormatter(item?.dteChallanDate)}</td>
                          <td> {_dateFormatter(item?.dteAuditApproveDate)}</td>
                          <td> {item?.strDeliverychallan}</td>
                          <td> {item?.strSoldToPartnerName}</td>
                          <td> {item?.strTransportsupplier}</td>
                          <td> {item?.strVehicleSupplierName}</td>
                          <td> {item?.strTransportModeName}</td>
                          <td> {item?.strOwnerType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default ShipmentCancel;

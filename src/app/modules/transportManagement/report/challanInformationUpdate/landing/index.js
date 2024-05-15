/* eslint-disable react-hooks/exhaustive-deps */
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
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  DeliveryChallanInformation_api,
  GetInfoForChalalnCancell_api,
  addManualChallanNumber,
  getChallanInfo,
  getDistributionChannelDDL_api,
  getSBUList,
  getSalesOrgDDL,
} from "../helper";

const initData = {
  customer: "",
  challan: "",
  supplierName: "",
  distributionChannel: "",
  previousDate: "",
  remarks: "",
  reportType: { value: 1, label: "Challan Date Update" },
  plant: "",
  salesOrg: "",
  shipPoint: "",
  fromDate: "",
  toDate: "",
  sbu: "",
};

const header = [
  "SL",
  "Delivery Code",
  "Complete Date",
  "Vehicle No",
  "Quantity",
  "Manual Challan No",
];

function ChallanInformationUpdate() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [shipPointList, getShipPointList] = useAxiosGet([]);
  const [salesOrgList, setSalesOrgList] = useState([]);
  const [sbuList, setSbuList] = useState([]);
  const [reportTypes, setReportTypes] = useState([
    { value: 1, label: "Challan Date Update" },
    { value: 2, label: "Challan Cancel" },
  ]);

  const shipPointDDL = shipPointList?.map((item) => ({
    ...item,
    value: item?.organizationUnitReffId,
    label: item?.organizationUnitReffName,
  }));

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (buId && accId) {
      getDistributionChannelDDL_api(accId, buId, setDistributionChannelDDL);
      getSBUList(accId, buId, setSbuList, setLoading);
    }

    getShipPointList(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${accId}&BusinessUnitId=${buId}`
    );

    // if ([4, 175]?.includes(buId)) {
    if ([4]?.includes(buId)) {
      const newReportTypes = [
        ...reportTypes,
        { value: 3, label: "Add Manual Challan No" },
      ];
      setReportTypes(newReportTypes);
    }
  }, [buId, accId]);

  const commonGridFunc = (values) => {
    if (values?.reportType?.value === 3) {
      getChallanInfo(
        accId,
        buId,
        values?.shipPoint?.value,
        values?.customer?.value,
        values?.fromDate,
        values?.toDate,
        values?.salesOrg?.value,
        setGridData,
        setLoading
      );
    } else {
      DeliveryChallanInformation_api(
        1,
        buId,
        values?.challan,
        values?.previousDate,
        userId,
        values?.customer?.value,
        setGridData,
        setLoading
      );
    }
  };

  const submitAPI = (values, resetForm) => {
    const typeId = values?.reportType?.value;
    if (+gridData?.[0]?.intBillNumber > 0) {
      toast.warning("Already bill submitted");
      return false;
    } else if (typeId === 1) {
      DeliveryChallanInformation_api(
        2,
        buId,
        values?.challan,
        values?.updateDate,
        userId,
        values?.customer?.value,
        setGridData,
        setLoading,
        true,
        () => {
          resetForm(initData);
        }
      );
    } else if (typeId === 2) {
      GetInfoForChalalnCancell_api(
        buId,
        values?.challan,
        values?.remarks,
        userId,
        values?.customer?.value,
        setGridData,
        setLoading,
        () => {
          resetForm(initData);
        }
      );
    } else if (typeId === 3) {
      const selectedData = gridData?.filter((itm) => itm?.isSelected);
      if (selectedData?.length > 0) {
        if (
          selectedData?.filter((item) => !item?.manualChallanNo)?.length > 0
        ) {
          toast.warning("Please fill all checked rows with manual challan no");
        } else {
          const payload = selectedData?.map((item) => ({
            deliveryId: item?.deliveryId,
            soldToPartnerId: item?.soldToPartnerId,
            manualChallanNo: item?.manualChallanNo,
            actionBy: userId,
          }));
          addManualChallanNumber(payload, setLoading, () => {});
        }
      } else {
        toast.warning("Please select at least one row");
      }
    }
  };

  const getBtnTitle = (reportTypeId) => {
    if (reportTypeId === 1) {
      return "Update Challan Date";
    } else if (reportTypeId === 2) {
      return "Cancel Challan";
    } else if (reportTypeId === 3) {
      return "Submit";
    }
  };

  const isDisabled = (values) => {
    return (
      (values?.reportType?.value === 1 && !values?.updateDate) ||
      (values?.reportType?.value === 2 && !values?.remarks) ||
      !gridData?.length > 0
    );
  };

  const rowDataHandler = (index, key, value) => {
    let _data = [...gridData];
    _data[index][key] = value;
    setGridData(_data);
  };

  const allSelect = (value) => {
    let _data = [...gridData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setGridData(modify);
  };

  const selectedAll = () => {
    return gridData?.length > 0 &&
      gridData?.filter((item) => item?.isSelected)?.length === gridData?.length
      ? true
      : false;
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ ...initData }}>
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Challan Info Update"}>
                  <CardHeaderToolbar>
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => {
                        submitAPI(values, resetForm);
                      }}
                      disabled={isDisabled(values)}
                    >
                      {getBtnTitle(values?.reportType?.value)}
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={reportTypes}
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
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.distributionChannel?.value}`
                            )
                            .then((res) => res?.data);
                        }}
                      />
                    </div>
                    {[3]?.includes(values?.reportType?.value) && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipPoint"
                            options={shipPointDDL}
                            value={values?.shipPoint}
                            label="ShipPoint"
                            onChange={(valueOption) => {
                              setFieldValue("shipPoint", valueOption);
                              setGridData([]);
                            }}
                            placeholder="Select ShipPoint"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-md-3">
                          <NewSelect
                            name="sbu"
                            options={sbuList || []}
                            value={values?.sbu}
                            label="SBU"
                            onChange={(valueOption) => {
                              setFieldValue("sbu", valueOption);
                              setFieldValue("salesOrg", "");
                              if (valueOption) {
                                getSalesOrgDDL(
                                  accId,
                                  buId,
                                  valueOption?.value,
                                  setSalesOrgList,
                                  setLoading
                                );
                              }
                            }}
                            placeholder="Select SBU"
                          />
                        </div>
                        <div className="col-md-3">
                          <NewSelect
                            name="salesOrg"
                            options={salesOrgList || []}
                            value={values?.salesOrg}
                            label="Sales Organization"
                            onChange={(valueOption) => {
                              setFieldValue("salesOrg", valueOption);
                            }}
                            placeholder="Select Sales Organization"
                            isDisabled={!values?.sbu}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.fromDate}
                            label="From Date"
                            name="fromDate"
                            placeholder="From Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                              setGridData([]);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.toDate}
                            label="To Date"
                            name="toDate"
                            placeholder="To Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                              setGridData([]);
                            }}
                          />
                        </div>
                      </>
                    )}
                    {[1, 2]?.includes(values?.reportType?.value) && (
                      <>
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
                      </>
                    )}
                    <div className="col d-flex  align-items-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          setGridData([]);
                          commonGridFunc(values);
                        }}
                        // disabled={
                        //   !values?.customer ||
                        //   !values?.challan ||
                        //   !values?.previousDate
                        // }
                      >
                        View
                      </button>
                    </div>
                    <div className="col-lg-12">
                      <hr className="mb-0 mt-2" />
                    </div>
                    {values?.reportType?.value === 1 && (
                      <div className="col-lg-3">
                        <label>Update Date</label>
                        <InputField
                          value={values?.updateDate}
                          name="updateDate"
                          placeholder="Update Date"
                          type="date"
                        />
                      </div>
                    )}
                    {![3]?.includes(values?.reportType?.value) && (
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

                  {gridData?.length > 0 &&
                  [1, 2]?.includes(values?.reportType?.value) ? (
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
                            <td>
                              {" "}
                              {_dateFormatter(item?.dteAuditApproveDate)}
                            </td>
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
                  ) : (
                    <div className="table-responsive">
                      <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr>
                          <th
                            onClick={() => allSelect(!selectedAll())}
                            className="cursor-pointer"
                            style={{ width: "40px" }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                          {header.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                className="text-center cursor-pointer"
                                onClick={() => {
                                  rowDataHandler(
                                    index,
                                    "isSelected",
                                    !item.isSelected
                                  );
                                }}
                                style={
                                  item?.isSelected
                                    ? {
                                        backgroundColor: "#aacae3",
                                        width: "40px",
                                      }
                                    : { width: "40px" }
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isSelected}
                                  checked={item?.isSelected}
                                  onChange={() => {}}
                                />
                              </td>

                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.deliveryCode}</td>
                              <td>{_dateFormatter(item?.completeDate)}</td>
                              <td>{item?.vehicleName}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.quantity, true)}
                              </td>
                              <td style={{ width: "250px" }}>
                                <InputField
                                  value={item?.manualChallanNo}
                                  name="manualChallanNo"
                                  placeholder="Manual Challan No"
                                  type="text"
                                  onChange={(e) => {
                                    rowDataHandler(
                                      index,
                                      "manualChallanNo",
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default ChallanInformationUpdate;

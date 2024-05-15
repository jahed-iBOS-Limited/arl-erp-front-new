import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import {
  GetSupplierAndVehicleInfo_api,
  getDistributionChannelDDL_api,
  getransportZoneDDL,
} from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";

const initData = {
  customer: "",
  challan: "",
  distributionChannel: "",
  shipPoint: "",
  remarks: "",
};

function TransportZoneUpdate() {
  const [transportZoneDDL, setTransportZoneDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
      getransportZoneDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTransportZoneDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const commonGridFunc = (values, type, isUpdateMassage) => {
    GetSupplierAndVehicleInfo_api(
      type,
      selectedBusinessUnit?.value,
      values?.challan,
      values?.shipPoint?.value,
      values?.customer?.value,
      profileData?.userId,
      values?.transportZone?.value || 0,
      values?.remarks || "",
      setGridData,
      setLoading,
      isUpdateMassage
    );
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ ...initData }}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Transport Zone Update"}>
                  <CardHeaderToolbar>
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => {
                        commonGridFunc(values, 2, true);
                      }}
                      disabled={
                        !values?.transportZone ||
                        !values?.remarks ||
                        !gridData?.length > 0
                      }
                    >
                      Save
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-4">
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

                    <div className="col-lg-4">
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
                      <NewSelect
                        name="shipPoint"
                        options={shipPointDDL || []}
                        value={values?.shipPoint}
                        label="Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                          setGridData([]);
                        }}
                        placeholder="Shippoint"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4">
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

                    <div className="col d-flex  align-items-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          setGridData([]);
                          commonGridFunc(values, 1);
                        }}
                        disabled={!values?.customer || !values?.challan}
                      >
                        View
                      </button>
                    </div>
                    <div className="col-lg-12">
                    <hr className="mb-0 mt-2"/>
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="transportZone"
                        options={transportZoneDDL || []}
                        value={values?.transportZone}
                        label="Transport Zone"
                        onChange={(valueOption) => {
                          setFieldValue("transportZone", valueOption);
                        }}
                        placeholder="Transport Zone"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4">
                      <label>Remarks</label>
                      <InputField
                        value={values?.remarks}
                        name="remarks"
                        placeholder="Remarks"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Challan No.</th>
                        <th>Date</th>
                        <th>Shippoint Name</th>
                        <th>Transport Zone Name</th>
                        <th>Sold To Partner Name</th>
                        <th>Ship To Partner Address</th>

                        <th>Supplier Name</th>
                        <th>Transport Zone Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td> {item?.strDeliveryCode}</td>
                          <td> {_dateFormatter(item?.dteDeliveryDate)}</td>
                          <td> {item?.strShipPointName}</td>
                          <td> {item?.strTransportZoneName}</td>
                          <td> {item?.strSoldToPartnerName}</td>
                          <td> {item?.strShipToPartnerAddress}</td>
                          <td> {item?.strSupplierName}</td>
                          <td className="text-right">
                            {item?.numTransportZoneRate}
                          </td>
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

export default TransportZoneUpdate;

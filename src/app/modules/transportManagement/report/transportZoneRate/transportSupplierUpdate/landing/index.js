import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "formik";
import axios from "axios";
import Loading from "../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import {
  getDistributionChannelDDL_api,
  GetSupplierAndVehicleInfo_api,
  EditVehicleAndSupplierInfo_api,
} from "../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

const initData = {
  customer: "",
  challan: "",
  supplierName: "",
  distributionChannel: "",
};

function TransportSupplierUpdate() {
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

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const commonGridFunc = (values) => {
    GetSupplierAndVehicleInfo_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.challan,
      setGridData,
      setLoading
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
                <CardHeader title={"Transport Supplier Update"}>
                  <CardHeaderToolbar>
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => {
                        const {
                          vehicleId,
                          vehicleName,
                          shipmentId,
                        } = gridData?.[0];
                        const payload = {
                          vehicleId: vehicleId || 0,
                          vehicleName: vehicleName || "",
                          supplierId: values?.supplierName?.value || 0,
                          supplierName: values?.supplierName?.label || "",
                          shipmentId: shipmentId || 0,
                          actionBy: profileData?.userId,
                        };
                        EditVehicleAndSupplierInfo_api(
                          payload,
                          setLoading,
                          () => {
                            commonGridFunc(values);
                          }
                        );
                      }}
                      disabled={!values?.supplierName || !gridData?.length > 0}
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
                    <div className="col-lg-4">
                      <label>Challan</label>
                      <InputField
                        value={values?.challan}
                        name="challan"
                        placeholder="Challan"
                        type="text"
                      />
                    </div>

                    <div className="col d-flex  align-items-end justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          setGridData([]);
                          commonGridFunc(values);
                        }}
                        disabled={!values?.customer || !values?.challan}
                      >
                        View
                      </button>
                    </div>
                    <div className="col-lg-12"></div>
                    <div className="col-lg-4">
                      <label>Supplier Name</label>
                      <SearchAsyncSelect
                        selectedValue={values.supplierName}
                        handleChange={(valueOption) => {
                          setFieldValue("supplierName", valueOption);
                        }}
                        loadOptions={(v) => {
                          const searchValue = v.trim();
                          if (searchValue.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${searchValue}&AccountId=${
                                profileData?.accountId
                              }&UnitId=${
                                selectedBusinessUnit?.value
                              }&SBUId=${0}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                              }));
                              return updateList;
                            });
                        }}
                      />
                    </div>
                  </div>

                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Supplier</th>
                        <th>Shipment</th>
                        <th>Vehicle No.</th>
                        <th>Ship to party</th>
                        <th>Address</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td> {item?.supplierName}</td>
                          <td> {item?.shipmentId}</td>
                          <td> {item?.vehicleName}</td>
                          <td> {item?.shipToPartnerName}</td>
                          <td> {item?.shiptToPartyAddress}</td>
                          <td> {_dateFormatter(item?.shipmentDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Form> 
          </>
        )}
      </Formik>
    </> 
  );
}

export default TransportSupplierUpdate;

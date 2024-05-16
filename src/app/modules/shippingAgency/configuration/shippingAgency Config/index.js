import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import {
  deleteShipAgency,
  getLandingData,
  getVesselDDL,
  getVesselTypeDDL,
} from "./helper";
const initData = {
  vesselType: "",
  vessel: "",
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
};
export default function ShippingAgencyLanding() {
  const [rowData, setRowData] = useState();
  const [vesselTypeDDL, setVesselTypeDDL] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId, label: businessUnitName },
    businessUnitList,
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const commonGridData = (_pageNo = pageNo, _pageSize = pageSize, values) => {
    getLandingData(
      setLoading,
      setRowData,
      values?.businessUnit?.value,
      values?.vesselType?.value,
      values?.vessel?.value,
      values?.fromDate,
      values?.toDate,
      _pageNo,
      _pageSize
    );
  };
  useEffect(() => {
    getVesselTypeDDL(setVesselTypeDDL, setLoading);
    if (buId && accId) {
      getVesselDDL(buId, accId, setVesselDDL, setLoading);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        businessUnit: { label: businessUnitName, value: buId },
      }}
      // validationSchema={{}}
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
          {loading && <Loading />}
          <IForm
            title="Shipping Agency"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/ShippingAgency/Configuration/ShippingAgencyConfig/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("businessUnit", valueOption);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vesselType"
                    options={[{ label: "All", value: 0 }, ...vesselTypeDDL]}
                    value={values?.vesselType}
                    label="Vessel Type"
                    onChange={(valueOption) => {
                      setFieldValue("vesselType", valueOption);
                    }}
                    // isDisabled={!values?.sbu}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={[{ label: "All", value: 0 }, ...vesselDDL]}
                    value={values?.vessel}
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("vessel", valueOption);
                    }}
                    // isDisabled={!values?.vesselType}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setRowData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setRowData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3 ">
                  <button
                    type="button"
                    onClick={() => commonGridData(pageNo, pageSize, values)}
                    className="btn btn-primary mt-5"
                    disabled={
                      !values?.vesselType ||
                      !values?.vessel ||
                      !values?.businessUnit ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="mt-7">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
                    <thead>
                      <tr className="cursor-pointer">
                        <th>Sl</th>
                        <th>Business Transaction</th>
                        <th>Vessel Type</th>
                        <th>Vessel Name</th>
                        <th>Profit Center</th>
                        <th>Revenue Center</th>
                        <th>Transfer Business</th>
                        <th>Transfer ProfitCenter</th>
                        <th>T.Cost Center</th>
                        <th>T.Cost Element</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.businessTransactionName}
                          </td>
                          <td className="text-center">
                            {item?.vesselTypeName}
                          </td>
                          <td className="text-center">{item?.vesselName}</td>
                          <td className="text-center">
                            {item?.profitCenterName}
                          </td>
                          <td className="text-center">
                            {item?.revenueCenterName}
                          </td>
                          <td className="text-center">
                            {item?.transferBusinessName}
                          </td>
                          <td className="text-center">
                            {item?.transferProfitCenterName}
                          </td>
                          <td className="text-center">
                            {item?.transferCostCenterName}
                          </td>
                          <td className="text-center">
                            {item?.transferCostElementName}
                          </td>
                          <td className="text-center ">
                            <div
                              style={{
                                display: "flex",
                                gap: "2px",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                onClick={() =>
                                  history.push(
                                    `/ShippingAgency/Configuration/ShippingAgencyConfig/edit/${item?.id}`,
                                    item
                                  )
                                }
                              >
                                <IEdit />
                              </span>
                              <span
                                style={{ marginLeft: "5px" }}
                                onClick={() => {
                                  deleteShipAgency(
                                    item?.id,
                                    buId,
                                    setLoading,
                                    () => {
                                      commonGridData(pageNo, pageSize, values);
                                    }
                                  );
                                }}
                              >
                                <IDelete />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rowData?.data?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      commonGridData(pageNo, pageSize, values);
                    }}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

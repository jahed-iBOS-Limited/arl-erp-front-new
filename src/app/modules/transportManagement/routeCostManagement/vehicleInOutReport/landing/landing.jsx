/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import { landingGridData } from "../helper";
import ShipmentCostViewForm from "../view/addEditForm";

const validationSchema = Yup.object().shape({
  reportType: Yup.object().shape({
    label: Yup.string().required("Report Type  is required"),
    value: Yup.string().required("Report Type  is required"),
  }),
});

const VehicleInOutReportLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);


  // Modal State
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const ShippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const initData = {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    reportType: "",
    shipPoint: ShippointDDL[0] || "",
  };


  // Initial Grid Data Loaded
  useEffect(() => {
    landingGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      _todayDate(),
      _todayDate(),
      "in",
      initData?.shipPoint?.value,
      setGridData,
      setLoading,
      null
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value, ShippointDDL]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    landingGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      values?.fromDate,
      values?.toDate,
      values?.reportType?.label,
      setGridData,
      setLoading,
      null
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    landingGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      values?.fromDate,
      values?.toDate,
      values?.reportType?.label,
      values?.shipPoint?.value,
      setGridData,
      setLoading,
      searchValue
    );
  };

  return (
    <ICustomCard title="Vehicle In Out Report">
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, reportType: { value: 1, label: "in" } }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          landingGridData(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            pageNo,
            pageSize,
            values?.fromDate,
            values?.toDate,
            values?.reportType?.label,
            values?.shipPoint?.value,
            setGridData,
            setLoading,
            null
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
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={[ {value: 0 , label: "All"},...ShippointDDL]}
                      value={values?.shipPoint}
                      label="Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                        setGridData([])
                      }}
                      placeholder="Shippoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate ? values?.fromDate : _todayDate()}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      label="From Date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate ? values?.toDate : _todayDate()}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      label="To Date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "in" },
                        { value: 2, label: "out" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setGridData([])
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-1" style={{ marginTop: "14px" }}>
                    <button type="submit" className="btn btn-primary mr-2" disabled={!values?.shipPoint || !values?.reportType}>
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <PaginationSearch
                placeholder="Item Name & Code Search"
                paginationSearchHandler={paginationSearchHandler}
                values={values}
              />
              <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL No</th>
                    <th>Shipment Code</th>
                    <th>Date</th>
                    <th>Vehicle No</th>
                    <th>Driver Name</th>
                    <th>Route Name</th>
                    <th>Distance KM</th>
                    <th>Standard Cost</th>
                    <th>Actual Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{data?.shipmentCode}</td>
                      <td>{_dateFormatter(data?.shipmentDate)}</td>
                      <td>{data?.vehicleNo}</td>
                      <td>{data?.driverName || "N/A"}</td>
                      <td>{data?.routeName}</td>
                      <td>{data?.distanceKM}</td>
                      <td>{data?.totalStandardCost}</td>
                      <td>{data?.totalActualCost}</td>
                      <td className="text-center">
                        <IView
                          title="Details"
                          clickHandler={() => {
                            // history.push(
                            //   `/transport-management/routecostmanagement/shipmentcost/view/${data?.shipmentCostId}`
                            // );
                            setId(data?.shipmentCostId);
                            setShowModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <IViewModal show={showModal} onHide={() => setShowModal(false)}>
                <ShipmentCostViewForm id={id} />
              </IViewModal>

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default VehicleInOutReportLanding;

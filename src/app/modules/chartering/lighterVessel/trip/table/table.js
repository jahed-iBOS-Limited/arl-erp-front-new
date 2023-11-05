/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import { CharteringContext } from "../../../charteringContext";
import { GetLighterVesselDDL } from "../../../helper";
// import ICustomTable from "../../../_chartinghelper/_customTable";
import moment from "moment";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import { getTripLandingData } from "../helper";

const headers = [
  { name: "SL" },
  { name: "Lighter Vessel Name" },
  { name: "Mother Vessel Name" },
  { name: "Trip No" },
  { name: "Trip Start Date-Time" },
  { name: "Trip End Date-Time" },
  { name: "Duration (DAYS)" },
  { name: "SR Number" },
  { name: "Status" },
  { name: "Actions" },
];

export default function TripLanding() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(50);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lighterDDL, setLighterDDL] = useState([]);
  const [state, setState] = useContext(CharteringContext);

  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetLighterVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLighterDDL
    );

    viewHandler(pageNo, pageSize, state?.lighterVesselLandingInitData);
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (pageNo, pageSize, values) => {
    getTripLandingData({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      lighterVesselId: values?.lighterVessel?.value || null,
      fromDate: values?.fromDate || null,
      toDate: values?.toDate || null,
      isComplete:
        values?.status?.value === 1
          ? "true"
          : values?.status?.value === 2
          ? "false"
          : null,
      pageNo,
      pageSize,
      setter: setGridData,
      setLoading,
    });
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewHandler(pageNo, pageSize, values);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={state?.lighterVesselLandingInitData}
        onSubmit={(values) => {}}
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
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Lighter Vessel Trip</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/lighterVessel/lighterVesselVoyage/create"
                      )
                    }
                    disabled={false}
                  >
                    + Create
                  </button>
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      label="From Date"
                      onChange={(e) => {
                        viewHandler(pageNo, pageSize, {
                          ...values,
                          fromDate: e.target.value,
                        });
                        setFieldValue("fromDate", e.target.value);
                      }}
                      type="date"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikInput
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      label="To Date"
                      onChange={(e) => {
                        viewHandler(pageNo, pageSize, {
                          ...values,
                          toDate: e.target.value,
                        });
                        setFieldValue("toDate", e.target.value);
                      }}
                      type="date"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.lighterVessel || ""}
                      isSearchable={true}
                      label={`Lighter Vessel`}
                      options={[{ value: 0, label: "All" }, ...lighterDDL]}
                      styles={customStyles}
                      name="lighterVessel"
                      placeholder="Lighter Vessel"
                      onChange={(valueOption) => {
                        viewHandler(pageNo, pageSize, {
                          ...values,
                          lighterVessel: valueOption,
                        });
                        setFieldValue("lighterVessel", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.status || ""}
                      isSearchable={true}
                      label={`Status`}
                      options={[
                        { value: null, label: "All" },
                        { value: 1, label: "Complete" },
                        { value: 2, label: "Not Complete" },
                      ]}
                      styles={customStyles}
                      name="status"
                      placeholder="Status"
                      onChange={(valueOption) => {
                        viewHandler(pageNo, pageSize, {
                          ...values,
                          status: valueOption,
                        });
                        setFieldValue("status", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              {/* table requirement change order by Asad sir Audit */}
              {gridData?.data?.length > 0 && (
                <div className="common-scrollable-table two-column-sticky">
                  <div className="scroll-table _table">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL No</th>
                          <th>Name of Lighter Vessel</th>
                          <th>Trip No</th>
                          <th>Trip Start Date-Time</th>
                          <th>Trip End Date-Time</th>
                          <th colSpan={4}>LOADING DETAILS WITH DATE & TIME</th>
                          <th colSpan={4}>
                            DISCHARGING DETAILS WITH DATE & TIME
                          </th>
                          <th>Cargo quantity</th>
                          <th>Mother Vessel</th>
                          <th>Cargo</th>
                          <th>Diesel Quantity</th>
                          <th>Lub Quantity</th>
                          {/* <th>Trip</th> */}
                          {/* <th>Trip Start Date-Time</th>
                          <th>Trip End Date-Time</th> */}
                          <th>SR Number</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>Arrival</th>
                          <th>Loading Start</th>
                          <th>Loading Complete</th>
                          <th>Departure</th>
                          <th>Arrival</th>
                          <th>Discharging Start</th>
                          <th>Discharging Complete</th>
                          <th>Duration</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.lighterVesselName}
                            </td>
                            <td className="text-center">{item?.tripNo}</td>
                            <td className="text-center">
                              {moment(item?.dteTripCommencedDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.dteTripCompletionDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.arrivalCtgDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.loadCommCtgDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.loadComplCtgDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.departureCtgDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.receiveDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.dischargeStartDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {moment(item?.dischargeComplDate).format(
                                "YYYY-MM-DD HH:mm A"
                              )}
                            </td>
                            <td className="text-center">
                              {item?.numTotalTripDuration} Days
                            </td>
                            <td className="text-center">
                              {item?.cargoQuantity}
                            </td>
                            <td className="text-center">
                              {item?.motherVesselName}
                            </td>
                            <td className="text-center">{item?.cargoName}</td>
                            <td className="text-center">
                              {item?.diselQuantity}
                            </td>
                            <td className="text-center">
                              {item?.lubeOilQuantity}
                            </td>
                            {/* <td>{item?.tripNo}</td>
                            <td>{item?.dteTripCommencedDate}</td>
                            <td>{item?.dteTripCompletionDate}</td> */}
                            <td className="text-center">{item?.srNumber}</td>
                            <td
                              style={{ width: "80px" }}
                              className="text-center"
                            >
                              <span
                                className={`badge badge-${
                                  item?.isComplete ? "success" : "warning"
                                }`}
                              >
                                {item?.isComplete ? "Complete" : "Not Complete"}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-around">
                                <IView
                                  clickHandler={() => {
                                    setState({
                                      ...state,
                                      lighterVesselLandingInitData: values,
                                    });
                                    history.push(
                                      `/chartering/lighterVessel/lighterVesselVoyage/view/${item?.lighterTripId}`
                                    );
                                  }}
                                />

                                {!item?.isComplete ? (
                                  <IEdit
                                    clickHandler={() => {
                                      setState({
                                        ...state,
                                        lighterVesselLandingInitData: values,
                                      });
                                      history.push(
                                        `/chartering/lighterVessel/lighterVesselVoyage/edit/${item?.lighterTripId}`
                                      );
                                    }}
                                  />
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.lighterVesselName}</td>
                    <td>{item?.motherVesselName}</td>
                    <td className="text-center">{item?.tripNo}</td>
                    <td className="text-center">
                      {moment(item?.dteTripCommencedDate).format(
                        "YYYY-MM-DD HH:mm A"
                      )}
                    </td>
                    <td className="text-center">
                      {item?.dteTripCompletionDate
                        ? moment(item?.dteTripCompletionDate).format(
                            "YYYY-MM-DD HH:mm A"
                          )
                        : "-"}
                    </td>
                    <td className="text-right">
                      {item?.numTotalTripDuration} DAYS
                    </td>
                    <td className="text-right">{item?.srNumber}</td>
                    <td style={{ width: "80px" }} className="text-center">
                      <span
                        className={`badge badge-${
                          item?.isComplete ? "success" : "warning"
                        }`}
                      >
                        {item?.isComplete ? "Complete" : "Not Complete"}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            setState({
                              ...state,
                              lighterVesselLandingInitData: values,
                            });
                            history.push(
                              `/chartering/lighterVessel/lighterVesselVoyage/view/${item?.lighterTripId}`
                            );
                          }}
                        />

                        {!item?.isComplete ? (
                          <IEdit
                            clickHandler={() => {
                              setState({
                                ...state,
                                lighterVesselLandingInitData: values,
                              });
                              history.push(
                                `/chartering/lighterVessel/lighterVesselVoyage/edit/${item?.lighterTripId}`
                              );
                            }}
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </ICustomTable> */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}

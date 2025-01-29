/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { setFuelConsumptionLandingAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import IViewModal from "../../../_helper/_viewModal";
import JVModalView from "./jvView";
import { toast } from "react-toastify";

export default function FuelConsumption() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const history = useHistory();
  const dispatch = useDispatch();
  const [showJVModal, setShowJVModal] = useState(false);

  const rebConsumptionLanding = useSelector((state) => {
    return state.localStorage.fuelConsumptionLanding;
  });

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getlandingData(
      `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?BusinessUnitId=${selectedBusinessUnit.value}&FromDate=${rebConsumptionLanding?.fromDate}&ToDate=${rebConsumptionLanding?.toDate}&Shift=${rebConsumptionLanding?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?BusinessUnitId=${selectedBusinessUnit.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };
  function validateDates(startDate, endDate) {
    // Create Date objects from the input values
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if both dates are in the same month and year
    const sameMonthAndYear =
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear();

    if (!sameMonthAndYear) {
      alert("Error: The selected dates must be in the same month and year.");
      return false;
    }

    // Get the first and last day of the month for the selected start date
    const firstDayOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastDayOfMonth = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0
    );

    const isStartDateFirstOfMonth =
      start.getDate() === firstDayOfMonth.getDate();

    const isEndDateLastOfMonth = end.getDate() === lastDayOfMonth.getDate();

    if (!isStartDateFirstOfMonth || !isEndDateLastOfMonth) {
      // alert("Error: Please select the first and last date of the same month.");
      return false;
    }

    return true;
  }
  return (
    <div>
      <ITable
        link="/production-management/msil-Electrical/GeneratorFuelConsumption/create"
        title="Fuel Consumption"
      >
        <Formik
          enableReinitialize={true}
          initialValues={rebConsumptionLanding}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <Form className="form form-label-right">
                {lodar && <Loading />}
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: "", label: "ALL" },
                        { value: "A", label: "A" },
                        { value: "B", label: "B" },
                        { value: "C", label: "C" },
                        { value: "General", label: "General" },
                      ]}
                      value={values?.shift}
                      label="Shift"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("shift", valueOption);
                        } else {
                          setFieldValue("shift", { value: "", label: "ALL" });
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getlandingData(
                          // `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
                          `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?BusinessUnitId=${selectedBusinessUnit.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${rebConsumptionLanding?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
                        );
                        dispatch(
                          setFuelConsumptionLandingAction({
                            ...values,
                          })
                        );
                      }}
                      className="btn btn-primary mt-1"
                      disabled={
                        !values?.fromDate || !values?.toDate || !values?.shift
                      }
                    >
                      Show
                    </button>
                  </div>
                  <div className="col-lg-2" style={{ marginTop: "1px" }}>
                    <button
                      onClick={() => {
                        if (validateDates(values?.fromDate, values?.toDate)) {
                          setShowJVModal(true);
                        } else {
                          toast.error(
                            "Please select the first and last date of the same month to create JV."
                          );
                        }
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      Month End
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <div>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}>SL</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Generator Name</th>
                            <th>Quantity [Liter]</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {landigData?.data?.length > 0 &&
                            landigData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strShift}</td>
                                <td>{item?.strGeneratorName}</td>
                                <td className="text-center">
                                  {item?.numQuantityLtr}
                                </td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/msil-Electrical/GeneratorFuelConsumption/edit/${item?.intGeneratorFuelConsumptionId}`,
                                        state: { ...item },
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {landigData?.data?.length > 0 && (
                    <PaginationTable
                      count={landigData.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={rebConsumptionLanding}
                    />
                  )}

                  {showJVModal && (
                    <IViewModal
                      title={"JV View for Fuel Consumption"}
                      show={showJVModal}
                      onHide={() => {
                        setShowJVModal(false);
                      }}
                    >
                      <JVModalView
                        values={values}
                        buId={selectedBusinessUnit?.value}
                        setShowJVModal={setShowJVModal}
                      />
                    </IViewModal>
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ITable>
    </div>
  );
}

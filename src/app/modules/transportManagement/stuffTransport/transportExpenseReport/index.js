import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import NewSelect from "../../../_helper/_select";
import { _getPreviousDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import DriverTripInfoTbl from "./reportTable/driverTripInfoTbl";
import DriverWiseExpenseTbl from "./reportTable/driverWiseExpenseTbl";
import EmployeeWiseFuelCostTbl from "./reportTable/employeeWiseFuelCostTbl";
import FuelStationPurchaseInfoTbl from "./reportTable/fuelStationPurchaseInfoTbl";
import FuelStationSummaryTbl from "./reportTable/fuelStationSummaryTbl";
import StandByVehicleStatus from "./reportTable/standByVehicleStatus";
import VehicleWiseFuelCostTbl from "./reportTable/vehicleWiseFuelCostTbl";
const initData = {
  reportType: "",
  fromDate: _monthFirstDate(),
  toDate: _getPreviousDate(),
  vehicle: "",
  fuelStation: "",
  driver: "",
  status: "",
};
console.log("firstDate",_monthFirstDate());
console.log("previous",_getPreviousDate());
export default function TransportExpenseReport() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [vehicleList, getVehicleList] = useAxiosGet();
  const [driverList, getDriverList, , setDriverList] = useAxiosGet();
  const [fuelStationList, getFuelStationList] = useAxiosGet();
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();

  useEffect(() => {
    getVehicleList(
      `/mes/VehicleLog/GetVehicleList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getDriverList(
      `/mes/VehicleLog/GetVehicleList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const modifyData = data?.map((item) => ({
          ...item,
          value: item?.intDriverId,
          label: item?.strDriverName,
        }));
        setDriverList(modifyData);
      }
    );
    getFuelStationList(
      `/mes/VehicleLog/GetSupplierFuelStationDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getData = ({ reportTypeId, values }) => {
    let requestUrl = "";
    if (reportTypeId === 1) {
      requestUrl = `/mes/VehicleLog/GetFuelStationCosting?partName=fuelStationCostSummery&intFuelStationId=0&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`;
    } else if (reportTypeId === 2) {
      requestUrl = `/mes/VehicleLog/GetFuelStationCosting?partName=fuelStationDetailsPurchaseInfo&intFuelStationId=${values?.fuelStation?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`;
    } else if (reportTypeId === 2) {
      requestUrl = `/mes/VehicleLog/GetFuelStationCosting?partName=fuelStationDetailsPurchaseInfo&intFuelStationId=${values?.fuelStation?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`;
    } else if (reportTypeId === 3) {
      requestUrl = `/mes/VehicleLog/GetDriverAndTripInfo?partName=driverWiseExpanse&intDriverId=${values?.driver?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`;
    } else if (reportTypeId === 4) {
      requestUrl = `/mes/VehicleLog/GetDriverAndTripInfo?partName=driverDateWiseTripInfo&intDriverId=${values
        ?.driver?.value || 0}&dteFromDate=${values?.fromDate}&dteToDate=${
        values?.toDate
      }&intVehicleId=${values?.vehicle?.value || 0}`;
    } else if (reportTypeId === 5) {
      requestUrl = `/mes/VehicleLog/GetDriverAndTripInfo?partName=VehicleWiseFuelCost&intDriverId=${values?.vehicle?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`;
    } else if (reportTypeId === 6) {
      requestUrl = `/mes/VehicleLog/GetFuelCostByEmployee?dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`;
    }else if (reportTypeId === 7) {
      requestUrl = `/mes/VehicleLog/GetBookingStandByVehicleStatus?fromDate=${values?.fromDate}&todate=${values?.toDate}&adminStatus=${values?.status?.value}&adminEnroll=${profileData?.employeeId}`;
    }
    if (requestUrl) getRowData(requestUrl);
  };

  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
        setValues,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Transport Expense Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 7, label: "StandBy Vehicle Status" },
                        { value: 1, label: "Fuel Station Summary" },
                        { value: 2, label: "Fuel Station Purchase Info" },
                        { value: 3, label: "Driver Wise Expense" },
                        { value: 4, label: "Driver Trip Details" },
                        { value: 5, label: "Vehicle Wise Fuel Cost" },
                        { value: 6, label: "Employee Wise Fuel Cost" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setValues({
                          ...initData,
                          reportType: valueOption || "",
                        });
                        setRowData([]);
                      }}
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
                  {[7]?.includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={[
                          { label: "All", value: 0 },
                          { label: "Pending", value: 1 },
                          { label: "Approved", value: 2 },
                          { label: "Reject", value: 3 },
                        ]}
                        value={values?.status}
                        label="Status"
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption );
                          setRowData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {[4,5]?.includes(values?.reportType?.value) ? (
                    <div className="col-lg-3">
                      <NewSelect
                        name="vehicle"
                        options={vehicleList}
                        value={values?.vehicle}
                        label="Vehicle"
                        onChange={(valueOption) => {
                          setFieldValue("vehicle", valueOption || "");
                          setRowData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  {[3]?.includes(values?.reportType?.value) ? (
                    <div className="col-lg-3">
                      <NewSelect
                        name="driver"
                        options={driverList}
                        value={values?.driver}
                        label="Driver"
                        onChange={(valueOption) => {
                          setFieldValue("driver", valueOption || "");
                          setRowData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  {[2]?.includes(values?.reportType?.value) ? (
                    <div className="col-lg-3">
                      <NewSelect
                        name="fuelStation"
                        options={fuelStationList}
                        value={values?.fuelStation}
                        label="Fuel Station"
                        onChange={(valueOption) => {
                          setFieldValue("fuelStation", valueOption || "");
                          setRowData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  <div>
                    <button
                      style={{ marginTop: "17px" }}
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={() => {
                        getData({
                          reportTypeId: values?.reportType?.value,
                          values,
                        });
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div>
                  {[1]?.includes(values?.reportType?.value) ? (
                    <FuelStationSummaryTbl rowData={rowData} values={values} />
                  ) : null}
                  {[2]?.includes(values?.reportType?.value) ? (
                    <FuelStationPurchaseInfoTbl rowData={rowData} />
                  ) : null}
                  {[3]?.includes(values?.reportType?.value) ? (
                    <DriverWiseExpenseTbl rowData={rowData} />
                  ) : null}
                  {[4]?.includes(values?.reportType?.value) ? (
                    <DriverTripInfoTbl rowData={rowData} />
                  ) : null}
                  {[5]?.includes(values?.reportType?.value) ? (
                    <VehicleWiseFuelCostTbl rowData={rowData} />
                  ) : null}
                  {[6]?.includes(values?.reportType?.value) ? (
                    <EmployeeWiseFuelCostTbl
                      rowData={rowData}
                      values={values}
                    />
                  ) : null}
                  {[7]?.includes(values?.reportType?.value) ? (
                    <StandByVehicleStatus
                      rowData={rowData}
                      getRowData={getRowData}
                      values={values}
                    />
                  ) : null}
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

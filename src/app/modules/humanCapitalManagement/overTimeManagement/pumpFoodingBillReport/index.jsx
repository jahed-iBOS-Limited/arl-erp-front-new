import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import PumpFoodingBillReportTbl from "./reportTable/pumpFoodingBillReport";
import DateWisePumpFoodingBillSMRT from "./reportTable/DateWisePumpFoodingBillSMRT";
import { getLastDateOfMonth } from "./helper";
const initData = {
  reportType: "",
  fromDate: "",
  toDate: "",
  plant: "",
  wareHouse: "",
};
export default function PumpFoodingBillReport() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [
    warehouseDDL,
    getWarehouseDDL,
    warehouseDDLloader,
    setWarehouseDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const [rowData, getRowData, loading, setRowData] = useAxiosGet();

  const getData = ({ reportTypeId, values }) => {
    let requestUrl = "";
    if (reportTypeId === 1) {
      requestUrl = `/hcm/MenuListOfFoodCorner/GetPumpFoodBillByEmployees?intBusinessUnit=${selectedBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intWareHouseId=${values?.wareHouse?.value || 0}`;
    } else if (reportTypeId === 2) {
      requestUrl = `/hcm/MenuListOfFoodCorner/GetDatewisePumpFoodingBillSummery?intBusinessUnit=${
        selectedBusinessUnit?.value
      }&dteFromDate=${values?.fromDate}&dteToDate=${
        values?.toDate
      }&intWareHouseId=${values?.wareHouse?.value || 0}`;
    }
    if (requestUrl) {
      getRowData(requestUrl);
    }
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
          {(loading || warehouseDDLloader) && <Loading />}
          <IForm
            title="Pump Fooding Bill Report"
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
                        { value: 1, label: "Pump Fooding Bill Report" },
                        {
                          value: 2,
                          label: "Date Wise Pump Fooding Bill Summery Report",
                        },
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
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("plant", valueOption);
                          setFieldValue("wareHouse", "");
                          getWarehouseDDL(
                            `/asset/DropDown/GetWareHouseByPlantId?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("plant", "");
                          setFieldValue("wareHouse", "");
                          setWarehouseDDL([]);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="wareHouse"
                      options={
                        warehouseDDL?.length > 0 && [
                          {
                            value: 0,
                            label: "All",
                          },
                          ...warehouseDDL,
                        ]
                      }
                      value={values?.wareHouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("wareHouse", valueOption || "");
                      }}
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
                      min={values?.fromDate}
                      max={
                        values?.reportType?.value === 2
                          ? getLastDateOfMonth(values?.fromDate)
                          : null
                      }
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      style={{ marginTop: "16px" }}
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
                    <PumpFoodingBillReportTbl
                      rowData={rowData}
                      values={values}
                    />
                  ) : null}
                  {[2]?.includes(values?.reportType?.value) ? (
                    <DateWisePumpFoodingBillSMRT
                      rowData={rowData}
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

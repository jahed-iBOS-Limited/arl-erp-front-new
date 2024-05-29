import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { Formik } from "formik";
import Loading from "../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "../../../_helper/_dateFormate";
// import IEdit from '../../../_helper/_helperIcons/_edit';
import PaginationTable from "../../../_helper/_tablePagination";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
const initData = {
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
  strShift: {
    value: "",
    label: "All",
  },
};
const PowerConsumptionAllsbu = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetPowerCosumptionAllSBULanding?BusinessUnitId=${selectedBusinessUnit?.value}&FromDate=${initData?.fromDate}&ToDate=${initData?.toDate}&Shift=${initData?.strShift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getRowData(
      `/mes/MSIL/GetPowerCosumptionAllSBULanding?BusinessUnitId=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${initData?.strShift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Power Consumption All SBU"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/ACCLFactory/powerConsumptionAllSbu/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-2">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          setFieldValue("toDate", "");
                          setFieldValue("strShift", "");
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          setFieldValue("strShift", "");
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="strShift"
                        options={[
                          { value: "A", label: "A" },
                          { value: "B", label: "B" },
                          { value: "C", label: "C" },
                          { value: "", label: "All" },
                        ]}
                        value={values?.strShift}
                        label="Shift"
                        onChange={(valueOption) => {
                          setFieldValue("strShift", valueOption);
                          setRowData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        disabled={
                          !values?.fromDate ||
                          !values?.toDate ||
                          !values?.strShift
                        }
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={() => {
                          getRowData(
                            `/mes/MSIL/GetPowerCosumptionAllSBULanding?BusinessUnitId=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.strShift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th colSpan={4} style={{ width: "30px" }}>
                              SL
                            </th>
                            <th colSpan={4}>Date</th>
                            <th colSpan={4}>Shift</th>
                            <th colSpan={4}>Unit Name</th>
                            <th colSpan={4}>Previous Reading</th>
                            <th colSpan={4}>Present Reading</th>
                            <th colSpan={4}>Total Consumption</th>
                            {/* <th style={{ width: "50px" }}>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.length > 0 &&
                            rowData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td colSpan={4}>{index + 1}</td>
                                <td colSpan={4} className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td colSpan={4} className="text-center">
                                  {item?.strShift}
                                </td>
                                <td colSpan={4}>
                                  {item?.strConsumptionBusinessUnitName}
                                </td>
                                {item?.numPreviousReadingM1 ||
                                item?.numPreviousReadingM2 ||
                                item?.numPreviousReadingM3 ? (
                                  <>
                                    <td className="text-center">
                                      M1 : {item?.numPreviousReading || 0}
                                    </td>
                                    <td className="text-center">
                                      M2 : {item?.numPreviousReadingM1 || 0}
                                    </td>
                                    <td className="text-center">
                                      M3 : {item?.numPreviousReadingM2 || 0}
                                    </td>
                                    <td className="text-center">
                                      M4 : {item?.numPreviousReadingM3 || 0}
                                    </td>
                                  </>
                                ) : (
                                  <td colSpan={4} className="text-center">
                                    {item?.numPreviousReading}
                                  </td>
                                )}
                                {item?.numPresentReadingM1 ||
                                item?.numPresentReadingM2 ||
                                item?.numPresentReadingM3 ? (
                                  <>
                                    <td className="text-center">
                                      M1 : {item?.numPreviousReading || 0}
                                    </td>
                                    <td className="text-center">
                                      M2 : {item?.numPresentReadingM1 || 0}
                                    </td>
                                    <td className="text-center">
                                      M3 : {item?.numPresentReadingM2 || 0}
                                    </td>
                                    <td className="text-center">
                                      M4 : {item?.numPresentReadingM3 || 0}
                                    </td>
                                  </>
                                ) : (
                                  <td colSpan={4} className="text-center">
                                    {item?.numPresentReading}
                                  </td>
                                )}

                                {item?.numTotalConsumptionM1 ||
                                item?.numTotalConsumptionM2 ||
                                item?.numTotalConsumptionM3 ? (
                                  <>
                                    <td className="text-center">
                                      M1 : {item?.numTotalConsumption || 0}
                                    </td>
                                    <td className="text-center">
                                      M2 : {item?.numTotalConsumptionM1 || 0}
                                    </td>
                                    <td className="text-center">
                                      M3 : {item?.numTotalConsumptionM2 || 0}
                                    </td>
                                    <td className="text-center">
                                      M4 : {item?.numTotalConsumptionM3 || 0}
                                    </td>
                                  </>
                                ) : (
                                  <td colSpan={4} className="text-center">
                                    {item?.numTotalConsumption}
                                  </td>
                                )}
                                {/* <td className="text-center">
                                                                <IEdit
                                                                    onClick={() => {
                                                                        history.push({
                                                                            pathname: `/production-management/ACCLFactory/powerConsumptionAllSbu/edit/${item?.intPowerConsumptionId}`,
                                                                            state: { ...item },
                                                                        })
                                                                    }
                                                                    }
                                                                />
                                                            </td> */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.data?.length > 0 && (
                      <PaginationTable
                        count={rowData?.totalCount}
                        setPositionHandler={setPositionHandler}
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
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default PowerConsumptionAllsbu;

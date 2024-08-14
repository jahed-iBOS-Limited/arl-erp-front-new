import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
// import IEdit from '../../../_helper/_helperIcons/_edit';
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import JVModalView from "./jvView";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const GeneratorGasConsumptionLanding = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getlandingData(
      `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?BusinessUnitId=${selectedBusinessUnit.value}&FromDate=${initData.fromDate}&ToDate=${initData.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?BusinessUnitId=${selectedBusinessUnit.value}&FromDate=${values.fromDate}&ToDate=${values.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };
  const [showJVModal, setShowJVModal] = useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gas Consumption"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-Electrical/GeneratorFuelConsumption/create`,
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
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
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
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={!values?.fromDate || !values.toDate}
                        onClick={() => {
                          getlandingData(
                            `/mes/MSIL/GetElectricalGeneratorFuelConsumptionLanding?BusinessUnitId=${selectedBusinessUnit.value}&FromDate=${values.fromDate}&ToDate=${values.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: "1px" }}>
                      <button
                        onClick={() => {
                          setShowJVModal(true);
                        }}
                        type="button"
                        className="btn btn-primary mt-5"
                      >
                        Month End
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
                            <th style={{ width: "20px" }}>SL</th>
                            <th>Date</th>
                            <th>Previous Reading</th>
                            <th>Present Reading</th>
                            <th>Gas Consumption</th>
                            <th>Total Generation</th>
                            <th>Gas Consumption Per Unit</th>
                            <th>Remarks</th>
                            {/* <th>Action</th> */}
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
                                <td className="text-center">
                                  {item?.numPreviousReading}
                                </td>
                                <td className="text-center">
                                  {item?.numPresentReading}
                                </td>
                                <td className="text-center">
                                  {item?.numGasConsumption}
                                </td>
                                <td className="text-center">
                                  {item?.numTotalGeneration}
                                </td>
                                <td className="text-center">
                                  {item?.numGasConsumptionPerUnit?.toFixed(2)}
                                </td>
                                <td>{item?.strRemarks}</td>
                                {/* <td className="text-center">
                                                                <IEdit
                                                                    class
                                                                    onClick={() => {
                                                                        history.push({
                                                                            pathname: `/production-management/msil-Electrical/GeneratorFuelConsumption/edit/${item?.intGeneratorFuelConsumptionId}`,
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
                        values={values}
                      />
                    )}
                    {showJVModal && (
                      <IViewModal
                        title={"JV View for Gas Consumption"}
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
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default GeneratorGasConsumptionLanding;

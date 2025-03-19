import { Form, Formik } from "formik";
import React, { useRef, useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ICard from "../../../_helper/_card";
import Loading from "../../../_helper/_loading";
import { getCastingScheduleAllData_api, getShippointDDL } from "./helper";
import "./style.css";
import PaginationTable from "../../../_helper/_tablePagination";
import NewSelect from "../../../_helper/_select";
import FormikInput from "../../../chartering/_chartinghelper/common/formikInput";
import { _todayDate } from "../../../_helper/_todayDate";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import { ConvertTime24to12 } from "../../../_helper/timeConverter";

// Validation schema
const validationSchema = Yup.object().shape({});
const initData = {
  status: { value: -1, label: "All" },
  shipPoint: { value: 0, label: "All" },
  formDate: _todayDate(),
  toDate: _todayDate(),
};
export default function LiftingPlanReport() {
  const printRef = useRef();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState({});
  const [shipPointDDL, setShipPointDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const viewHandler = async (
    values,
    setter,
    _pageNo = pageNo,
    _pageSize = pageSize
  ) => {
    setGridData([]);
    getCastingScheduleAllData_api({
      formDate: values.formDate,
      toDate: values.toDate,
      status: values.status?.value,
      buiId: selectedBusinessUnit?.value,
      shipPointId: values?.shipPoint?.value,
      pageNo: _pageNo,
      pageSize: _pageSize,
      setLoading,
      setter,
    });
  };

  useEffect(() => {
    viewHandler(initData, setGridData, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getShippointDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShipPointDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          viewHandler(values, setGridData, pageNo, pageSize);
        }}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => (
          <>
            <ICard
              printTitle="Print"
              title="Lifting Plan Report"
              isPrint={true}
              isShowPrintBtn={true}
              componentRef={printRef}
              isExcelBtn={
                gridData?.data?.length > 0 || gridData?.length > 0
                  ? true
                  : false
              }
              excelFileNameWillbe="Lifting Plan Report"
            >
              <div>
                <div className="mx-auto">
                  {loading && <Loading />}
                  <Form className="form form-label-right">
                    <div className="form-group row global-form printSectionNone">
                      <div className="col-lg-3">
                        <NewSelect
                          name="status"
                          options={[
                            { value: -1, label: "All" },
                            { value: 0, label: "Pending" },
                            { value: 1, label: "Complete" },
                            { value: 2, label: "Reject" },
                          ]}
                          value={values?.status}
                          label="Status"
                          onChange={(valueOption) => {
                            setFieldValue("status", valueOption);
                            setGridData([]);
                          }}
                          placeholder="Status"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={
                            [{ value: 0, label: "All" }, ...shipPointDDL] || []
                          }
                          value={values?.shipPoint}
                          label="Shippoint"
                          placeholder="Shippoint"
                          onChange={(valuesOption) => {
                            setFieldValue("shipPoint", valuesOption);
                            setGridData([]);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>From Date</label>
                        <FormikInput
                          value={values?.formDate}
                          name="formDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("formDate", e.target.value);
                            setGridData([]);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To Date</label>
                        <FormikInput
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                            setGridData([]);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary mt-5"
                          disabled={!values?.status}
                        >
                          View
                        </button>
                      </div>
                    </div>

                    {gridData?.data?.length > 0 && (
                      <>
                        <Table printRef={printRef} gridData={gridData} />

                        <PaginationTable
                          count={gridData?.totalCount}
                          setPositionHandler={(pageNo, pageSize) => {
                            viewHandler(values, setGridData, pageNo, pageSize);
                          }}
                          paginationState={{
                            pageNo,
                            setPageNo,
                            pageSize,
                            setPageSize,
                          }}
                          values={values}
                        />
                      </>
                    )}
                  </Form>
                </div>
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}

function Table({ printRef, gridData }) {
  let numQuantity = 0;
  let numApproveQuantity = 0;

  const dateWiseTotal = (_gridData) => {
    const lookUp = {};
    const shipPoint = {};

    for (let item of _gridData) {
      let date = _dateFormatter(item?.dteCastingDate);
      if (lookUp[date]) {
        lookUp[date] = {
          qty:
            lookUp[date]?.qty +
            item?.list?.reduce((acc, obj) => acc + +obj?.numQuantity, 0),
          date,
          numApproveQuantity:
            lookUp[date]?.numApproveQuantity +
            item?.list?.reduce((acc, obj) => acc + +obj?.numApproveQuantity, 0),
        };
      } else {
        lookUp[date] = {
          qty: item?.list?.reduce((acc, obj) => acc + +obj?.numQuantity, 0),
          date,
          numApproveQuantity: item?.list?.reduce(
            (acc, obj) => acc + +obj?.numApproveQuantity,
            0
          ),
        };
      }
    }

    for (let item of _gridData) {
      if (shipPoint[item?.intShippingPointID]) {
        shipPoint[item?.intShippingPointID] = {
          intShippingPointID: item?.intShippingPointID,
          strShippingPointName: item?.strShippingPointName,
          qty:
            shipPoint[item?.intShippingPointID]?.qty +
            item?.list?.reduce((acc, obj) => acc + +obj?.numQuantity, 0),
          numApproveQuantity:
            shipPoint[item?.intShippingPointID]?.numApproveQuantity +
            item?.list?.reduce((acc, obj) => acc + +obj?.numApproveQuantity, 0),
        };
      } else {
        shipPoint[item?.intShippingPointID] = {
          intShippingPointID: item?.intShippingPointID,
          strShippingPointName: item?.strShippingPointName,
          qty: item?.list?.reduce((acc, obj) => acc + +obj?.numQuantity, 0),
          numApproveQuantity: item?.list?.reduce(
            (acc, obj) => acc + +obj?.numApproveQuantity,
            0
          ),
        };
      }
    }

    return {
      dateWise: Object.values(lookUp),
      shipPointWise: Object.values(shipPoint),
    };
  };

  const { dateWise, shipPointWise } = dateWiseTotal(gridData?.data);

  return (
    <div className="mt-4" ref={printRef}>
      <div className="row">
        <div style={{ width: "50%" }} className="col-lg-6  table-responsive">
          <table className="sm-table table table-striped table-bordered global-table">
            <thead>
              <th>SL</th>
              <th>Casting Demand Date</th>
              <th>Quantity</th>
              <th>Approved Quantity</th>
            </thead>
            <tbody>
              {dateWise?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="text-center">{item?.date}</td>
                  <td className="text-right">{item?.qty}</td>
                  <td className="text-right">{item?.numApproveQuantity}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                <td></td>
                <td className="text-right">Total</td>
                <td className="text-right">
                  {dateWise?.reduce((acc, obj) => acc + +obj?.qty, 0)}
                </td>
                <td className="text-right">
                  {dateWise?.reduce(
                    (acc, obj) => acc + +obj?.numApproveQuantity,
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ width: "50%" }} className="col-lg-6 table-responsive">
          <div className="table-responsive">
            <table className="sm-table table table-striped table-bordered global-table">
              <thead>
                <th>SL</th>
                <th>Shipping Point</th>
                <th>Quantity</th>
                <th>Approved Quantity</th>
              </thead>
              <tbody>
                {shipPointWise?.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item?.strShippingPointName}</td>
                    <td className="text-right">{item?.qty}</td>
                    <td className="text-right">{item?.numApproveQuantity}</td>
                  </tr>
                ))}

                <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                  <td></td>
                  <td className="text-right">Total</td>
                  <td className="text-right">
                    {shipPointWise?.reduce((acc, obj) => acc + +obj?.qty, 0)}
                  </td>
                  <td className="text-right">
                    {dateWise?.reduce(
                      (acc, obj) => acc + +obj?.numApproveQuantity,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
            <div className="sta-scrollable-table scroll-table-auto">
              <div
                style={{ maxHeight: "500px" }}
                className="scroll-table _table scroll-table-auto"
              >
                <table className="table table-striped table-bordered global-table table-font-size-sm">
                  <thead>
                    <th>SL</th>
                    <th style={{ minWidth: "60px" }}>Casting Date</th>
                    <th style={{ minWidth: "55px" }}>Casting Time</th>
                    <th style={{ minWidth: "65px" }}>Client Name</th>
                    <th style={{ minWidth: "50px" }}>Project Address</th>
                    <th style={{ minWidth: "50px" }}>
                      Contact Person of Project
                    </th>
                    <th style={{ minWidth: "40px" }}>Type of Work</th>
                    <th style={{ minWidth: "50px" }}>Shipping Point Name</th>
                    <th style={{ minWidth: "75px" }}>PSI</th>
                    {/* <th style={{ minWidth: "35px" }}>Water proof</th>
                  <th style={{ minWidth: "55px" }}>BUET Test(Day)</th> */}
                    <th style={{ minWidth: "30px" }}>Qty</th>
                    <th style={{ minWidth: "30px" }}>App. Qty</th>
                    <th style={{ minWidth: "40px" }}>Shift</th>
                    <th style={{ minWidth: "40px" }}>No of Pump</th>
                    <th style={{ minWidth: "40px" }}>Pipe (RFT)</th>
                    <th style={{ minWidth: "40px" }}>Small Tyre</th>
                    <th style={{ minWidth: "40px" }}>Large Tyre</th>
                    <th style={{ minWidth: "40px" }}>Water Proof</th>
                    <th style={{ minWidth: "40px" }}>Buet Test Report</th>
                    <th style={{ minWidth: "60px" }}>Information Date</th>
                    <th style={{ minWidth: "40px" }}>Bag Cement</th>
                    <th style={{ minWidth: "50px" }}>Marketing concern</th>
                    <th style={{ minWidth: "50px" }}>Remarks</th>
                    <th style={{ minWidth: "50px" }}>Status</th>
                  </thead>
                  <tbody>
                    {gridData?.data?.map((item, i) => {
                      return item?.list?.map((element, index) => {
                        numQuantity += element.numQuantity || 0;
                        numApproveQuantity += element?.numApproveQuantity || 0;
                        return (
                          <tr key={index}>
                            {index < 1 && (
                              <td
                                rowSpan={item?.list?.length}
                                className="text-center sl"
                              >
                                {i + 1}
                              </td>
                            )}
                            {index < 1 && (
                              <td
                                rowSpan={item?.list?.length}
                                className="text-center"
                              >
                                {_dateFormatter(item?.dteCastingDate)}{" "}
                              </td>
                            )}
                            {index < 1 && (
                              <td
                                rowSpan={item?.list?.length}
                                className="text-center"
                              >
                                {index < 1 &&
                                  ConvertTime24to12(
                                    item?.dteCastingDate.split("T")[1]
                                  )}
                              </td>
                            )}
                            {index < 1 && (
                              <td
                                rowSpan={item?.list?.length}
                                style={{ wordBreak: "break-all" }}
                              >
                                {item?.strCustomerName}
                              </td>
                            )}
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strAddress}
                              </td>
                            )}
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strContactPerson}
                              </td>
                            )}
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strWorkTypeName}
                              </td>
                            )}
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strShippingPointName}
                              </td>
                            )}
                            <td className="text-left">{element?.strItem}</td>
                            {/* <td className="text-left">
                            {element?.isWaterProof === true
                              ? "Yes"
                              : element?.isWaterProof === false
                              ? "No"
                              : ""}
                          </td>
                          {index < 1 && (
                            <td rowSpan={item?.list?.length}>
                              {item?.strTestReportDay}
                            </td>
                          )} */}
                            <td className="text-right">
                              {_fixedPoint(element?.numQuantity || 0)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(element?.numApproveQuantity || 0)}
                            </td>
                            <td>{element?.strShift}</td>
                            <td>{element?.intNumberOfPump}</td>
                            <td>{element?.intPipeFeet}</td>
                            <td>{element?.intSmallTyre}</td>
                            <td>{element?.intLargeTyre}</td>
                            <td>
                              {element?.isWaterProof
                                ? "Yes"
                                : element?.isWaterProof === false
                                ? "No"
                                : ""}
                            </td>
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strTestReportDay}
                              </td>
                            )}
                            {index < 1 && (
                              <td
                                rowSpan={item?.list?.length}
                                className="text-center"
                              >
                                {`${_dateFormatter(
                                  item?.dteInformationDate
                                )}, ${ConvertTime24to12(
                                  item?.dteInformationDate.split("T")[1]
                                )}`}
                              </td>
                            )}
                            <td>{element?.intBagCementUse}</td>
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strCastingProcedureBy}
                              </td>
                            )}
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strRemarks}
                              </td>
                            )}
                            {index < 1 && (
                              <td rowSpan={item?.list?.length}>
                                {item?.strStatus}
                              </td>
                            )}
                          </tr>
                        );
                      });
                    })}
                    <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                      <td colSpan="9" className="text-right">
                        <b>Total: </b>
                      </td>
                      <td>{numQuantity}</td>
                      <td>{numApproveQuantity}</td>
                      <td colSpan="13"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getSalesContactIncompleteGridData,
  setGridEmptyAction,
} from "../_redux/Actions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import IViewModal from "./../../../../_helper/_viewModal";
import { ChallanModal } from "./challanModal";

export function TableRow({
  profileData,
  selectedBusinessUnit,
  ShippointDDL,
  initialData,
  btnRef,
  saveHandler,
  resetBtnRef,
}) {
  const [incompleteRowDto, setIncompleteRowDto] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [tableRowData, setTableRowData] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get gridData from store

  const incompleteGridData = useSelector((state) => {
    return state.shipment?.incompleteGridData;
  }, shallowEqual);

  useEffect(() => {
    const modifyGridData = incompleteGridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: false,
    }));
    setIncompleteRowDto(modifyGridData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incompleteGridData]);

  //viewClickHandler
  const viewBtnClickHandler = (pageNo, pageSize, values) => {
    dispatch(
      getSalesContactIncompleteGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.pgiShippoint?.value,
        values?.tillDate,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewBtnClickHandler(pageNo, pageSize, values);
  };

  // useEffect(() => {
  //   if (
  //     profileData?.accountId &&
  //     selectedBusinessUnit?.value &&
  //     shipmentlanding?.pgiShippoint?.value
  //   ) {
  //     viewBtnClickHandler(pageNo, pageSize, shipmentlanding);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    return () => {
      setIncompleteRowDto([]);
      dispatch(setGridEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          pgiShippoint: ShippointDDL[0] || "",
          reportType: { value: 2, label: "Shipment Unscheduled" },
          tillDate: _todayDate(),
          fromDate: _todayDate(),
          toDate: _todayDate(),
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialData);
          });
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Challan Shippoint Transfer"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row global-form">
                        <>
                          <div className="col-lg-3">
                            <ISelect
                              label="Select Shippoint"
                              options={ShippointDDL}
                              value={values.pgiShippoint}
                              name="pgiShippoint"
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                              dependencyFunc={(currentValue, value, setter) => {
                                // dispatch(
                                //   getSalesContactGridData(
                                //     profileData.accountId,
                                //     selectedBusinessUnit.value,
                                //     currentValue
                                //   )
                                // );
                              }}
                            />
                          </div>
                          <div className="col-lg-3">
                            <ISelect
                              label="Report Type"
                              options={[
                                { value: 1, label: "Shipment Created" },
                                {
                                  value: 2,
                                  label: "Shipment Unscheduled",
                                },
                                { value: 3, label: "Shipment Completed" },
                              ]}
                              value={values?.reportType}
                              name="reportType"
                              onChange={(optionValue) => {
                                setFieldValue("reportType", optionValue);
                                setIncompleteRowDto([]);
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled
                            />
                          </div>
                          {(values?.reportType?.value === 1 ||
                            values?.reportType?.value === 3) && (
                            <>
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.fromDate}
                                  label="From Date"
                                  type="date"
                                  name="fromDate"
                                />
                              </div>
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.toDate}
                                  label="To Date"
                                  type="date"
                                  name="toDate"
                                />
                              </div>
                            </>
                          )}
                          {values.reportType?.value === 2 && (
                            <div className="col-lg-3">
                              <InputField
                                value={values?.tillDate}
                                label="Till Date"
                                type="date"
                                name="tillDate"
                              />
                            </div>
                          )}

                          <div className="col d-flex  align-items-end justify-content-end">
                            <button
                              type="button"
                              className="btn btn-primary mt-4 mr-2"
                              onClick={() => {
                                setIncompleteRowDto([]);
                                viewBtnClickHandler(pageNo, pageSize, values);
                              }}
                            >
                              View
                            </button>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </Form>

                {/* Table Start */}
                {loading && <Loading />}
                <div className="row">
                  <div className="col-lg-12">
                    {incompleteRowDto?.length > 0 && (
                      <>
                      <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th>Delivery Date</th>
                              <th>Delivery Code</th>
                              <th>Delivery Type</th>
                              <th>Sold To Party</th>
                              <th>Transport Zone</th>
                              <th>Total Volume</th>
                              <th>Total Weight</th>
                              <th>Total Qty</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incompleteRowDto?.map((td, index) => (
                              <tr key={index}>
                                <td className="text-center"> {td?.sl} </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {_dateFormatter(td?.dteDeliveryDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {td?.strDeliveryCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {td?.strDeliveryTypeName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {td?.strSoldToPartnerName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {td?.strTransportZoneName}
                                  </div>{" "}
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {td?.numTotalVolume}
                                  </div>{" "}
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {td?.numTotalWeight}
                                  </div>{" "}
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {td?.itemTotalQty}
                                  </div>{" "}
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    <button
                                      className="btn btn-primary"
                                      onClick={(e) => {
                                        setIsModalShow(true);
                                        setTableRowData(td);
                                      }}
                                    >
                                      update
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      </>
                    )}
                  </div>
                </div>

                {incompleteGridData?.data?.length > 0 && (
                  <PaginationTable
                    count={incompleteGridData?.totalCount}
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
              </CardBody>
            </Card>
            <IViewModal show={isModalShow} onHide={() => setIsModalShow(false)}>
              <ChallanModal
                ShippointDDL={ShippointDDL}
                tableRowData={tableRowData}
                selectedBusinessUnit={selectedBusinessUnit}
                cb={() => {
                  viewBtnClickHandler(pageNo, pageSize, values);
                  setIsModalShow(false)
                }}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}

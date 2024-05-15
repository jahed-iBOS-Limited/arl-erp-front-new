/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { onGetRowDataOfQcAndWeighment } from "./helper";
import IViewModal from "../../../../_helper/_viewModal";
import WeighmentEditOnAdministration from "./WeighmentEditOnAdministration";
const initialValues = {
  businessUnit: "",
  shipPoint: "",
  date: "",
};
const AdministrationForWeighment = () => {
  const { profileData, businessUnitList, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paginationState, setPaginationState] = useState({
    pageNo: 1,
    pageSize: 15,
  });
  const [shipPointDDL, getShipPointDDL, shipPointLoader] = useAxiosGet();
  useEffect(() => {
    const theBusinessUnit = businessUnitList?.find(
      (item) => item?.value === selectedBusinessUnit?.value
    );
    if (theBusinessUnit) {
      initialValues.businessUnit = theBusinessUnit;
      getShipPointDDL(
        `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${theBusinessUnit?.value}&AutoId=${profileData?.userId}`,
        (data) => {
          if (data === []) return toast.warn("No Ship Point Found");
          initialValues.shipPoint = data[0];
          onGetRowDataOfQcAndWeighment({
            accountId: profileData?.accountId,
            businessUnitId: theBusinessUnit?.value,
            getRowData,
            pageNo: paginationState.pageNo,
            pageSize: paginationState.pageSize,
            shipPointId: data[0]?.value,
            setPaginationState,
          });
        }
      );
    }
  }, []);
  const [rowData, getRowData, loadingOnGetRowData] = useAxiosGet();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(formValues) => {
          onGetRowDataOfQcAndWeighment({
            accountId: profileData?.accountId,
            businessUnitId: formValues?.businessUnit?.value,
            getRowData,
            pageNo: paginationState.pageNo,
            pageSize: paginationState.pageSize,
            shipPointId: formValues?.shipPoint?.value,
            weightDate: formValues?.date,
            setPaginationState,
          });
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Administration"}>
                  <CardHeaderToolbar></CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {(shipPointLoader || loadingOnGetRowData) && <Loading />}

                  <div className="form-group  global-form">
                    <div className="row">
                      <div className="col-md-3">
                        <NewSelect
                          name="businessUnit"
                          options={businessUnitList || []}
                          value={values?.businessUnit}
                          label="Business Unit"
                          onChange={(valueOption) => {
                            setFieldValue("businessUnit", valueOption);
                            setFieldValue("shipPoint", "");

                            if (valueOption) {
                              getShipPointDDL(
                                `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${valueOption?.value}&AutoId=${profileData?.userId}`,
                                (data) => {
                                  if (data === [])
                                    return toast.warn("No Ship Point Found");
                                  setFieldValue("shipPoint", data[0]);
                                }
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <NewSelect
                          name="shipPoint"
                          options={shipPointDDL}
                          value={values?.shipPoint}
                          label="Ship Point"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          value={values?.date}
                          label="Date"
                          name="date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("date", e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <button
                          style={{ marginTop: "18px" }}
                          className="btn btn-primary"
                          disabled={!values?.businessUnit || !values?.shipPoint}
                          onClick={handleSubmit}
                        >
                          Show
                        </button>
                      </div>
                    </div>
                  </div>

                  {values?.businessUnit ||
                  values?.shipPoint ||
                  rowData?.weightBridge?.length > 0 ? (
                    <div className="mt-3">
                      <PaginationSearch
                        placeholder="Search"
                        paginationSearchHandler={(searchValue) => {
                          onGetRowDataOfQcAndWeighment({
                            accountId: profileData?.accountId,
                            businessUnitId: selectedBusinessUnit?.value,
                            getRowData,
                            pageNo: paginationState.pageNo,
                            pageSize: paginationState.pageSize,
                            shipPointId: values?.shipPoint?.value,
                            weightDate: values?.date,
                            search: searchValue,
                            setPaginationState,
                          });
                        }}
                        values={values}
                      />
                    </div>
                  ) : (
                    <></>
                  )}

                  <>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th>তারিখ</th>
                                <th>গাড়ীর নাম্বার</th>
                                <th>রেজি. নং</th>
                                <th>চালান নাম্বার</th>
                                <th>পণ্যের নাম</th>
                                <th>সাপ্লায়ারের নাম</th>
                                <th>ওজন নং</th>
                                <th>1st Weight</th>
                                <th>2nd Weight</th>
                                <th>Net Weight</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowData?.weightBridge?.length > 0 ? (
                                rowData?.weightBridge?.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      {/* {(paginationState?.pageNo - 1) *
                                      paginationState?.pageSize +
                                      index +
                                      1} */}
                                      {item?.sl}
                                    </td>
                                    <td className="text-center">
                                      {item?.dteLastWeightDateTime
                                        ? _dateFormatter(
                                            item?.dteLastWeightDateTime
                                          )
                                        : "N/A"}
                                    </td>
                                    <td>{item?.strTruckNumber}</td>
                                    <td className="text-center">
                                      {item?.strGateEntryCode}
                                    </td>
                                    <td className="text-center">
                                      {item?.strInvoiceNumber}
                                    </td>
                                    <td>{item?.strMaterialName}</td>
                                    <td>{item?.strSupplierName}</td>
                                    <td className="text-center">
                                      {item?.strWeightmentNo}
                                    </td>
                                    <td className="text-center">
                                      {item?.numFirstWeight}
                                    </td>
                                    <td className="text-center">
                                      {item?.numLastWeight}
                                    </td>
                                    <td className="text-center">
                                      {item?.numNetWeight}
                                    </td>
                                    <td>
                                      <div>
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="cs-icon">Edit</Tooltip>
                                          }
                                        >
                                          <span
                                            className="edit mr-3 mt-1 d-block w-100 text-center"
                                            onClick={() => {
                                              setShowModal(true);
                                              setSelectedRow(item);
                                            }}
                                          >
                                            <IEdit />
                                          </span>
                                        </OverlayTrigger>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <></>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {rowData?.weightBridge?.length > 0 ? (
                          <PaginationTable
                            count={rowData?.totalCount}
                            setPositionHandler={(pageNo, pageSize, values) => {
                              setPaginationState((prev) => ({
                                ...prev,
                                pageNo,
                                pageSize,
                              }));
                              onGetRowDataOfQcAndWeighment({
                                accountId: profileData?.accountId,
                                businessUnitId: selectedBusinessUnit?.value,
                                getRowData,
                                pageNo,
                                pageSize,
                                shipPointId: values?.shipPoint?.value,
                                weightDate: values?.date,
                                setPaginationState,
                              });
                            }}
                            paginationState={{
                              ...paginationState,
                              setPageNo: (newPageNo) => {
                                setPaginationState((prev) => ({
                                  ...prev,
                                  pageNo: newPageNo,
                                }));
                              },
                              setPageSize: (newPageNo) => {
                                setPaginationState((prev) => ({
                                  ...prev,
                                  pageSize: newPageNo,
                                }));
                              },
                            }}
                            values={values}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </>
                </CardBody>
              </Card>
              <IViewModal
                title="QC & Weighment"
                show={showModal}
                modelSize="lg"
                onHide={() => {
                  setShowModal(false);
                  setSelectedRow(null);
                }}
              >
                <WeighmentEditOnAdministration
                  businessUnit={values?.businessUnit?.label}
                  shipPoint={values?.shipPoint?.label}
                  selectedRow={selectedRow}
                  onHide={() => {
                    setShowModal(false);
                    setSelectedRow(null);
                    onGetRowDataOfQcAndWeighment({
                      accountId: profileData?.accountId,
                      businessUnitId: values?.businessUnit?.value,
                      getRowData,
                      pageNo: paginationState.pageNo,
                      pageSize: paginationState.pageSize,
                      shipPointId: values?.shipPoint?.value,
                      weightDate: values?.date,
                      setPaginationState,
                    });
                  }}
                />
              </IViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default React.memo(AdministrationForWeighment);

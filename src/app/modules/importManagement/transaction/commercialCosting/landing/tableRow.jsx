/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getCommercialCostingLanding } from "../helper";
import PoAddEditForm from "../poModal/form/addEditForm";
import { initData } from "../utils";
import IForm from "./../../../../_helper/_form";
import AddEditForm from "./../modal/form/addEditForm";
import "./commercialCosting.css";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import PaginationTable from "../../../../_helper/_tablePagination";
import { generateExcel } from "./excel";

export default function TableRow() {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bankDDL, getBankDDL, loadingOnGetBankDDL] = useAxiosGet();
  const [poId, setPoId] = useState("");
  const [lcId, setLcId] = useState("");
  const [businessDDL, getBusinessDDL] = useAxiosGet();
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [excelData, getExcelData] = useAxiosGet();

  const [show, setShow] = useState(false);

  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});

  const handleClose = () => {
    setShow(false);
    setLcId("");
    setPoId("");
  };

  const handlePoShow = (poId) => {
    setPoId(poId);
    setShow(true);
  };
  const handleLcShow = (lcId) => {
    setLcId(lcId);
    setShow(true);
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankDDL(
      `/imp/AllCharge/GetCommercialBankListDDL?intBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getBusinessDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
    );
    //   eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  const getGrid = ({ pageNo, pageSize, values, searchValue }) => {
    getCommercialCostingLanding({
      accId: profileData?.accountId,
      buId: values?.businessUnit?.value,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      isCompleted: values?.status?.value,
      setLoading,
      setter: setRowDto,
      bank: values?.bank,
      pageNo,
      pageSize,
      getExcelData,
    });
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGrid({ pageNo, pageSize, values, searchValue: "" });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          status: { value: false, label: "Outstanding" },
          bank: {
            value: 0,
            label: "All",
          },
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {/* {console.log("values", values)} */}
            {/* {console.log("rowDto", rowDto)} */}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Outstanding Payment"></CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {/* Header Start */}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessUnit"
                        options={[{ value: 0, label: "All" }, ...businessDDL]}
                        label="Business Unit"
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                          setRowDto([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={[
                          { value: true, label: "Complete" },
                          { value: false, label: "Outstanding" },
                        ]}
                        label="Status"
                        value={values?.status}
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Status"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.status?.label === "Complete" && (
                      <>
                        <div className="col-lg-3">
                          <label>From Date</label>
                          <InputField
                            value={values?.fromDate}
                            name="fromDate"
                            placeholder="From Date"
                            type="date"
                            onChange={(e) => {
                              if (e?.target?.value) {
                                setFieldValue("fromDate", e?.target?.value);
                                // getGrid(values, e);
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            name="toDate"
                            placeholder="To Date"
                            type="date"
                            onChange={(e) => {
                              if (e?.target?.value) {
                                setFieldValue("toDate", e?.target?.value);
                                // getGrid(values, e);
                              }
                            }}
                          />
                        </div>
                      </>
                    )}
                    <div className="col-lg-3">
                      <NewSelect
                        name="bank"
                        options={bankDDL || []}
                        label="Bank"
                        value={values?.bank}
                        onChange={(valueOption) => {
                          setFieldValue("bank", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Bank"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-1 mt-1">
                      <button
                        className="btn btn-primary btn-sm mt-5"
                        disabled={!values?.businessUnit}
                        onClick={(e) => {
                          getGrid({
                            pageNo,
                            pageSize,
                            values,
                            searchValue: "",
                          });
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {excelData?.data?.length > 0 && (
                      <div className="col-lg-2 mt-5">
                        <button
                          onClick={() => {
                            generateExcel(excelData?.data);
                          }}
                          className="btn btn-primary"
                        >
                          Export Excel
                        </button>
                      </div>
                    )}
                  </div>
                  {(loading || loadingOnGetBankDDL) && <Loading />}
                  {rowDto?.data?.length > 0 ? (
                    <div>
                      <div className="react-bootstrap-table table-responsive">
                        <table
                          className="table table-striped global-table"
                          id="table-to-xlsx"
                        >
                          <thead>
                            <tr>
                              <th style={{ minWidth: "30px" }}>SL</th>
                              <th style={{ minWidth: "30px" }}>Unit Code</th>
                              <th style={{ minWidth: "70px" }}>PO No</th>
                              <th style={{ minWidth: "100px" }}>LC No</th>
                              <th style={{ minWidth: "50px" }}>LC Type</th>
                              <th style={{ minWidth: "100px" }}>Bank</th>
                              <th style={{ minWidth: "50px" }}>Currency</th>
                              {/* <th style={{ minWidth: "100px" }}>Amount(FC)</th> */}
                              <th style={{ minWidth: "100px" }}>
                                Invoice Amount (BDT)
                              </th>
                              <th style={{ minWidth: "70px" }}>
                                Invoice Amount (FC)
                              </th>
                              <th style={{ minWidth: "70px" }}>Shipment NO</th>
                              <th style={{ minWidth: "70px" }}>
                                {values?.status?.label === "Complete"
                                  ? "Complete Date"
                                  : "Due Date"}
                              </th>
                              <th style={{ minWidth: "70px" }}>
                                Transaction Date
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {rowDto?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.businessUnitCode}</td>
                                <td style={{ width: "150px" }}>
                                  <div className="row">
                                    <div
                                      className="col-lg-12"
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      <span
                                        className="colorOnHoverForLcAndPo"
                                        onClick={() => {
                                          handlePoShow(item?.poId);
                                        }}
                                      >
                                        {item?.poNumber}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="row">
                                    <div
                                      className="col-lg-12 text-center"
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      <span
                                        className="colorOnHoverForLcAndPo"
                                        onClick={() => {
                                          handleLcShow(item?.lcId);
                                        }}
                                      >
                                        {item?.lcNumber}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td>{item?.lcType}</td>
                                <td>{item?.bank}</td>
                                <td>{item?.currency}</td>
                                {/* <td>{item?.lcAmount}</td> */}
                                <td>{item?.bdtAmount}</td>
                                <td>{item?.shipmentAmount}</td>
                                <td className="text-center">
                                  {item?.shipmentNo}
                                </td>
                                <td>
                                  {_dateFormatter(
                                    item?.dueDate ? item?.dueDate : ""
                                  )}
                                </td>
                                <td>
                                  {item?.dteTransactionDate
                                    ? _dateFormatter(item?.dteTransactionDate)
                                    : "N/A"}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="7" className="text-right">
                                <strong>Total</strong>
                              </td>
                              <td>
                                <strong>
                                  {rowDto?.data?.reduce(
                                    (acc, curr) => acc + curr?.bdtAmount,
                                    0
                                  )}
                                </strong>
                              </td>
                              <td>
                                <strong>
                                  {rowDto?.data?.reduce(
                                    (acc, curr) => acc + curr?.shipmentAmount,
                                    0
                                  )}
                                </strong>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {rowDto?.data?.length > 0 && (
                        <PaginationTable
                          count={rowDto?.totalCount}
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
                  ) : (
                    <></>
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      <Modal
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
        centered
        show={show}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          {lcId ? (
            <AddEditForm lcId={lcId} />
          ) : (
            <IForm
              title={"View Purchase Order"}
              getProps={setObjprops}
              isDisabled={isDisabled}
              isHiddenReset
              isHiddenSave
              isHiddenBack
            >
              <PoAddEditForm poId={poId} view={"view"} />
            </IForm>
          )}
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

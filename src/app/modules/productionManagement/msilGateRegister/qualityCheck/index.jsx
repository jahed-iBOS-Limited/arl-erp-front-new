import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import QcViewModal from "./qcViewModal";

const initData = {
  date: "",
  receiveType: "",
};

function QualityCheck() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [weightmentId, setWeightmentId] = useState(null);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/WeightBridge/GetAllQCLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&search=${""}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    let weightDate = values?.date ? `&WeightDate=${values?.date}` : "";
    getRowData(
      `/mes/WeightBridge/GetAllQCLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}${weightDate}&search=${searchValue}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"First Weight"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="receiveType"
                        options={[
                          // { value: 1, label: "With PO" },
                          { value: 2, label: "Without PO" },
                        ]}
                        value={values?.receiveType}
                        label="Receive Type"
                        onChange={(valueOption) => {
                          setFieldValue("receiveType", valueOption);
                        }}
                      />
                    </div> */}
                    <div className="col-lg-3">
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
                        disabled={false}
                        onClick={() => {
                          let weightDate = values?.date
                            ? `&WeightDate=${values?.date}`
                            : "";
                          getRowData(
                            `/mes/WeightBridge/GetAllQCLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${
                              profileData?.accountId
                            }&BusinessUnitId=${
                              selectedBusinessUnit?.value
                            }${weightDate}&search=${""}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={paginationSearchHandler}
                  />
                </div>
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
                            <th>সাপ্লায়ার নাম</th>
                            {/* <th>ওজন নং</th> */}
                            <th>1st Weight</th>
                            <th>2nd Weight</th>
                            {selectedBusinessUnit?.value === 171 ||
                            selectedBusinessUnit?.value === 224 ? (
                              <>
                                <th style={{ width: "110px" }}>
                                  Quality Checked
                                </th>
                                <th style={{ width: "60px" }}>Action</th>
                              </>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.weightBridge?.length > 0 &&
                            rowData?.weightBridge?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteFirstWeightDateTime)}
                                </td>
                                <td>{item?.strTruckNumber}</td>
                                <td className="text-center">
                                  {item?.strGateEntryCode}
                                </td>
                                <td>{item?.strInvoiceNumber}</td>
                                <td>{item?.strMaterialName}</td>
                                <td>{item?.strSupplierName}</td>
                                {/* <td className="text-center">
                                {item?.strWeightmentNo}
                              </td> */}
                                <td className="text-center">
                                  {item?.numFirstWeight}
                                </td>
                                <td className="text-center">
                                  {item?.numLastWeight}
                                </td>
                                {selectedBusinessUnit?.value === 171 ||
                                selectedBusinessUnit?.value === 224 ? (
                                  <>
                                    {item?.intClientTypeId === 1 ? (
                                      <td
                                        style={{
                                          backgroundColor: item?.isQualityChecked
                                            ? "#2EFF2E"
                                            : "#FF5C5C",
                                        }}
                                        className="text-center"
                                      >
                                        {item?.isQualityChecked
                                          ? "QC Passed"
                                          : "QC Not Passed"}
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                    <td className="text-center">
                                      {item?.intClientTypeId === 1 ? (
                                        <div className="d-flex justify-content-around">
                                          <div>
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip id="cs-icon">
                                                  {"Grading"}
                                                </Tooltip>
                                              }
                                            >
                                              <span>
                                                <i
                                                  className={`fas fa-plus-square`}
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                    if (item?.isQualityChecked)
                                                      return toast.warn(
                                                        "QC already passed"
                                                      );
                                                    history.push({
                                                      pathname: `/production-management/msil-gate-register/First-Weight/grading-two/${item?.intWeightmentId}`,
                                                      state: { ...item },
                                                    });
                                                  }}
                                                ></i>
                                              </span>
                                            </OverlayTrigger>
                                          </div>
                                          <div>
                                            <span
                                              onClick={() => {
                                                if (!item?.isQualityChecked)
                                                  return toast.warn(
                                                    "Please enter QC grade first"
                                                  );
                                                setWeightmentId(
                                                  item?.intWeightmentId
                                                );
                                                setIsShowModal(true);
                                              }}
                                            >
                                              <IView
                                                styles={{ fontSize: "17px" }}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      ) : null}
                                    </td>
                                  </>
                                ) : null}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.weightBridge?.length > 0 && (
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
      <div>
        <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <QcViewModal weightmentId={weightmentId} />
        </IViewModal>
      </div>
    </>
  );
}

export default QualityCheck;

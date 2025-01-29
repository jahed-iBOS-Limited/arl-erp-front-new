import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  GetProductWiseShipmentReport,
  getDistributionChannelDDL,
  getSBUDDL,
  getSalesOrgDDL,
} from "../helper";
import IView from "./../../../../_helper/_helperIcons/_view";
import IViewModal from "./../../../../_helper/_viewModal";
import "./style.css";
import TransferDetails from "./transferDetails";

const initData = {
  sbu: "",
  salesOrg: "",
  distributionChannel: "",
  reportType: "",
  shipPint: "",
  fromDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toDate: _todayDate(),
  toTime: _todaysEndTime(),
};

export default function ProductWiseShipmentReport() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [salesOrgDDL, setSalesOrgDDL] = useState([]);
  const [currentRowData, setCurrentRowData] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const shippintDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
      getSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const GetReport = (values) => {
    const fromDateTime = moment(
      `${values?.fromDate} ${values?.fromTime}`
    ).format("YYYY-MM-DDTHH:mm:ss");
    const toDateTime = moment(`${values?.toDate} ${values?.toTime}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    GetProductWiseShipmentReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.shipPint?.value,
      fromDateTime,
      toDateTime,
      values?.distributionChannel?.value,
      values?.salesOrg?.value,
      values?.reportType?.value,
      setLoading,
      setRowDto
    );
  };

  const makeInt = (str) => {
    if (+str) {
      return Number(str).toFixed(2);
    } else {
      return str;
    }
  };

  return (
    <>
      <ICard
        printTitle="Print"
        title="Product Wise Shipment Report"
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        isExcelBtn={true}
        excelFileNameWillbe={"Product Wise Shipment Report"}
      >
        <div>
          <div className="mx-auto">
            <Formik enableReinitialize={true} initialValues={initData}>
              {({ values, errors, touched, setFieldValue }) => (
                <>
                  <Form className="form form-label-right">
                    <div className="form-group row global-form printSectionNone">
                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                            getSalesOrgDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setSalesOrgDDL
                            );
                          }}
                          placeholder="Select SBU"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="salesOrg"
                          options={salesOrgDDL}
                          value={values?.salesOrg}
                          label="Sales Org"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrg", valueOption);
                          }}
                          placeholder="Select Sales Org"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="distributionChannel"
                          options={distributionChannelDDL || []}
                          value={values?.distributionChannel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("distributionChannel", valueOption);
                            setRowDto([]);
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={[
                            { value: 1, label: "Shipment" },
                            { value: 2, label: "Transfer" },
                          ]}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPint"
                          options={[{ value: 0, label: "All" }, ...shippintDDL] || []}
                          value={values?.shipPint}
                          label="Shippint"
                          onChange={(valueOption) => {
                            setRowDto([])
                            setFieldValue("shipPint", valueOption);
                          }}
                          placeholder="Shippint"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>From Date and Time</label>
                        <div className="d-flex">
                          <InputField
                            value={values?.fromDate}
                            type="date"
                            name="fromDate"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                          <InputField
                            value={values?.fromTime}
                            type="time"
                            name="fromTime"
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <label>To Date and Time</label>
                        <div className="d-flex">
                          <InputField
                            value={values?.toDate}
                            type="date"
                            name="toDate"
                            onChange={(e) => {
                              setFieldValue("toDate", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                          <InputField
                            value={values?.toTime}
                            type="time"
                            name="toTime"
                          />
                        </div>
                      </div>
                      <div className="mt-5 col-lg-3">
                        <button
                          className="btn btn-primary"
                          disabled={
                            !values?.reportType ||
                            !values?.salesOrg ||
                            !values?.sbu ||
                            !values?.shipPint ||
                            !values?.distributionChannel
                          }
                          onClick={() => {
                            GetReport(values);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                    {loading && <Loading />}

                    <div>
                      <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
                        <div className="product-wise-shipment-report">
                          <div className="loan-scrollable-table scroll-table-auto">
                            <div
                              style={{ maxHeight: "540px" }}
                              className="scroll-table _table scroll-table-auto table-responsive"
                            >
                              <table
                                ref={printRef}
                                id="table-to-xlsx"
                                className="table table-striped table-bordered global-table table-font-size-sm"
                              >
                                <thead>
                                  <tr>
                                    {rowDto?.head?.length && (
                                      <>
                                        <th style={{ minWidth: "30px" }}>SL</th>
                                        {rowDto?.head?.map((item, index) => (
                                          <React.Fragment key={index}>
                                            {index < 4 ? (
                                              <th style={{ minWidth: "100px" }}>
                                                {item}
                                              </th>
                                            ) : (
                                              <th>{item}</th>
                                            )}
                                          </React.Fragment>
                                        ))}
                                        {values?.shipPint?.value !== 0 && <th style={{ minWidth: "50px" }}>
                                          Actions
                                        </th>}
                                      </>
                                    )}
                                  </tr>
                                </thead>

                                <tbody>
                                  {rowDto?.rows?.map((itm, i) => {
                                    return (
                                      <tr key={i}>
                                        <td className="text-center">
                                          {" "}
                                          {i + 1}
                                        </td>
                                        {itm?.map((singleRow, index) => (
                                          <td
                                            className={`${isNaN(+singleRow)
                                              ? "text-left"
                                              : "text-right"
                                              }`}
                                            key={index}
                                          >
                                            {makeInt(singleRow)}
                                          </td>
                                        ))}
                                        {values?.shipPint?.value !== 0 && <td className={"text-center"}>
                                          <span className="view">
                                            <IView
                                              classes={"text-primary"}
                                              clickHandler={() => {

                                                setCurrentRowData(itm);
                                                setIsShowModal(true);

                                              }}
                                            />
                                          </span>
                                        </td>}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <IViewModal
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                      title="Shipment Transfer Details"
                    >
                      <TransferDetails
                        currentRowData={{
                          ...currentRowData,
                          ...values,
                          selectedBusinessUnit,
                          profileData,
                        }}
                      />
                    </IViewModal>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </ICard>
    </>
  );
}

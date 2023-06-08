/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  GetDomesticPortDDL,
  getMotherVesselDDL,
  GetShipPointDDL,
} from "../../generalInformation/helper";
import {
  getAllotmentDDLByMotherVessel,
  getLighterVesselDDLFromAllotment,
} from "../../loadingInformation/helper";
import ReportsByPowerBI from "./powerBIReport";
import GridView from "./table";

const initData = {
  shipPoint: "",
  motherVessel: "",
  lighterVessel: "",
  program: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
  port: "",
};

const reportTypes = [
  { value: 1, label: "Program Base" },
  { value: 2, label: "ShipPoint Base" },
  { value: 3, label: "Godown Base" },
  { value: 4, label: "G2G Challan Info (BI)" },
  { value: 5, label: "Lighter Vessel Time Sheet (BI)" },
];

const VesselOperationReport = () => {
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [lighterVesselDDL, setLighterVesselDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [allotmentDDL, setAllotmentDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [biReport, setBIReport] = useState(false);
  const [portDDL, setPortDDL] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values) => {
    const url = `/oms/SalesInformation/GetLighterVesselDetInfo?Pareid=${values?.reportType?.value}&UnitId=${buId}&MotherVesselId=${values?.motherVessel?.value}&LighterVesselId=${values?.lighterVessel?.value}&Program=${values?.program?.label}&ShippPoint=${values?.shipPoint?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}`;

    getRowData(url);
  };

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    getMotherVesselDDL(accId, buId, setMotherVesselDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const PBIReport = (values) => {
    return [4, 5].includes(values?.reportType?.value);
  };

  // const reportId = (typeId) => {
  //   return typeId === 4
  //     ? "5e1b59c0-c646-4bae-9ec6-f70de8d99c41"
  //     : typeId === 5
  //     ? "971cb3ef-54ba-4ef8-92f3-ce5147b36486"
  //     : "";
  // };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Vessel Operation Report"></CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={reportTypes}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            setBIReport(false);
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {values?.reportType && !PBIReport(values) && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="port"
                              options={portDDL || []}
                              value={values?.port}
                              label="Port"
                              onChange={(valueOption) => {
                                setFieldValue("port", valueOption);
                              }}
                              placeholder="Port"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="shipPoint"
                              options={shipPointDDL}
                              value={values?.shipPoint}
                              label="ShipPoint"
                              onChange={(valueOption) => {
                                setFieldValue("shipPoint", valueOption);
                              }}
                              placeholder="ShipPoint"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="motherVessel"
                              options={motherVesselDDL}
                              value={values?.motherVessel}
                              label="Mother Vessel"
                              onChange={(valueOption) => {
                                setFieldValue("motherVessel", valueOption);
                                if (valueOption) {
                                  getLighterVesselDDLFromAllotment(
                                    buId,
                                    valueOption?.value,
                                    values?.port?.value,
                                    setLighterVesselDDL,
                                    setLoading
                                  );
                                  getAllotmentDDLByMotherVessel(
                                    valueOption?.value,
                                    buId,
                                    setAllotmentDDL,
                                    setLoading
                                  );
                                }
                              }}
                              placeholder="Mother Vessel"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="program"
                              options={allotmentDDL}
                              value={values?.program}
                              label="Program"
                              onChange={(e) => {
                                setFieldValue("program", e);
                              }}
                              placeholder="Program"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="lighterVessel"
                              options={lighterVesselDDL}
                              value={values?.lighterVessel}
                              label="Lighter Vessel"
                              onChange={(valueOption) => {
                                setFieldValue("lighterVessel", valueOption);
                              }}
                              placeholder="Lighter Vessel"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <FromDateToDateForm obj={{ values, setFieldValue }} />
                        </>
                      )}
                      <div className="col-12 text-right">
                        <button
                          className="btn btn-primary btn-sm mt-5"
                          type="button"
                          onClick={() => {
                            if ([1, 2, 3].includes(values?.reportType?.value)) {
                              getData(values);
                            } else {
                              setBIReport(true);
                            }
                          }}
                          disabled={isLoading || !values?.reportType}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {values?.reportType && !PBIReport(values) && (
                    <GridView rowData={rowData} values={values} />
                  )}
                  {values?.reportType && PBIReport(values) && biReport && (
                    // <PowerBIReport
                    //   reportId={reportId(values?.reportType?.value)}
                    // />
                    <ReportsByPowerBI
                      reportTypeId={values?.reportType?.value}
                    />
                  )}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default VesselOperationReport;

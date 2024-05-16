/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import printIcon from "../../_helper/images/print-icon.png";
import { _dateFormatter } from "../../_helper/_dateFormate";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import { getBusinessUnitDDL_api } from "../createDocument/helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  unit: "",
  wpGroup: "",
  wp: "",
};

export default function DocSummaryReport() {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [unit, setUnitDDL] = useState([]);
  const [unitDetails, getUnitDetails] = useAxiosGet();
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet();
  const [wpGroup, getWpGroup] = useAxiosGet();
  const [wp, getWp] = useAxiosGet();
  const printRef = useRef();

  useEffect(() => {
    getBusinessUnitDDL_api(
      profileData?.userId,
      profileData?.accountId,
      setUnitDDL
    );
  }, [profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Legal Documentation Summary"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              {loading && <Loading />}
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="unit"
                        options={[{ value: 0, label: "All" }, ...unit]}
                        value={values?.unit}
                        label="Unit"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("unit", valueOption);
                          setFieldValue("wpGroup", "");
                          getWpGroup(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?intBusinessUnitId=${valueOption?.value}&strPartType=WorkplaceGroupIdByBusinessUnitId`
                          );
                          getUnitDetails(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?intBusinessUnitId=${valueOption?.value}&strPartType=BusinessUnitDetailsByBusinessUnitId`
                          );
                        }}
                        placeholder="Unit"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="wpGroup"
                        options={[{ value: 0, label: "All" }, ...wpGroup]}
                        value={values?.wpGroup}
                        label="Workplace Group"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("wpGroup", valueOption);
                          setFieldValue("wp", "");
                          getWp(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=WorkplaceByWorkplaceGroupId&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${valueOption?.value}`
                          );
                        }}
                        placeholder="Workplace Group"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="wp"
                        options={[{ value: 0, label: "All" }, ...wp]}
                        value={values?.wp}
                        label="Workplace"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("wp", valueOption);
                        }}
                        placeholder="Workplace"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div
                      style={{ marginTop: "19px" }}
                      className="col-lg-3 d-flex"
                    >
                      <button
                        className="btn btn-primary mr-1"
                        type="button"
                        onClick={() => {
                          getRowDto(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentRegistrationLanding&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${values?.wpGroup?.value}&intWorkplaceId=${values?.wp?.value}`
                          );
                        }}
                        disabled={
                          !values?.unit || !values?.wpGroup || !values?.wp
                        }
                      >
                        View
                      </button>
                      {rowDto?.length > 0 && (
                        <div className="printSectionNone text-right">
                          <ReactToPrint
                            trigger={() => (
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: "2px 5px" }}
                              >
                                <img
                                  style={{
                                    width: "25px",
                                    paddingRight: "5px",
                                  }}
                                  src={printIcon}
                                  alt="print-icon"
                                />
                                Print
                              </button>
                            )}
                            content={() => printRef.current}
                            pageStyle={
                              "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {loading && <Loading />}
                  {rowDto?.length > 0 && (
                    <div className="row" componentRef={printRef} ref={printRef}>
                      <div className="mx-auto mt-3">
                        <h1 className="text-center">
                          {values?.unit?.label === "All"
                            ? "All Unit"
                            : values?.unit?.label}
                        </h1>
                        <h6 className="text-center">
                          {unitDetails?.[0]?.strBusinessUnitAddress}
                        </h6>
                        <h4 className="text-center mb-4">
                          Documentation Summary
                        </h4>
                      </div>
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered table-font-size-sm">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Document Name</th>
                                <th>Document No</th>
                                <th>Renewal Type</th>
                                <th>Validity</th>
                                <th>Concern Authority</th>
                                <th>Authority Address</th>
                                <th>Documents Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.length > 0 &&
                                rowDto?.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                        style={{ width: "30px" }}
                                        className="text-center"
                                      >
                                        {index + 1}
                                      </td>
                                      <td>
                                        <span className="pl-2">
                                          {item?.strDocumentName}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="pl-2">
                                          {item?.strDocumentNo
                                            ? item?.strDocumentNo
                                            : "-"}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="pl-2">
                                          {item?.strRenualType
                                            ? item?.strRenualType
                                            : "-"}
                                        </span>
                                      </td>
                                      <td className="text-center">
                                        {_dateFormatter(item?.dteRenewalDate)} -{" "}
                                        {_dateFormatter(item?.dteExpiryDate)}
                                      </td>
                                      <td>
                                        <span className="pl-2">
                                          {item?.strAuthorName
                                            ? item?.strAuthorName
                                            : "-"}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="pl-2">
                                          {item?.strAddress
                                            ? item?.strAddress
                                            : "-"}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="pl-2">
                                          {item?.strStatus
                                            ? item?.strStatus
                                            : "-"}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

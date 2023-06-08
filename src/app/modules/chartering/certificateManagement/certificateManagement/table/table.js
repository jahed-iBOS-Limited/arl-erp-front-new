/* eslint-disable react-hooks/exhaustive-deps */
import { Chip } from "@material-ui/core";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getVesselDDL } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { getCertificateDDL, getCertificateLanding } from "../helper";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const initData = {
  vesselName: "",
  certificateName: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
};

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Certificate Type" },
  { name: "Certificate Name" },
  { name: "Issue Date", style: { minWidth: "65px" } },
  { name: "To Date", style: { minWidth: "65px" } },
  { name: "Issue Place" },
  { name: "Issuing Authority" },
  { name: "Last Survey", style: { minWidth: "65px" } },
  { name: "Remarks" },
  { name: "Status" },
  { name: "Action", style: { minWidth: "40px" } },
];

export default function CertificateManagementTable() {
  //const [pageNo, setPageNo] = useState(0);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [certificateNameDDL, setCertificateNameDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  //const [pageSize, setPageSize] = useState(15);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let certificateManagementPermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 978) {
      certificateManagementPermission = userRole[i];
    }
  }

  const gridData = (values, PageNo, PageSize) => {
    getCertificateLanding(
      setRowData,
      "VesselCertificateLanding",
      {
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intVesselId: values?.vesselName?.value || 0,
        intCertificateId: values?.certificateName?.value || 0,
        dteFromDate: values?.fromDate,
        dteToDate: values?.toDate,
        intVesselCertificateId: 0,
      },
      setLoading,
      () => {}
    );
  };

  const getCertificateNameDDL = (values) => {
    getCertificateDDL(setCertificateNameDDL, "CertificateDDL", {
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intCertificateTypeId: 0,
    });
  };

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    gridData();
    getCertificateNameDDL();
  }, [profileData, selectedBusinessUnit]);

  // const setPositionHandler = (pageNo, pageSize, values) => {
  //   getPurchaseBunkerLandingData(
  //     values?.vesselName?.value || 0,
  //     values?.voyageNo?.value || 0,
  //     pageNo,
  //     pageSize,
  //     "",
  //     setGridData,
  //     setLoading
  //   );
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values) => {}}
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
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Certificate Management</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/certificateManagement/certificateManagement/create"
                      )
                    }
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        gridData({ ...values, vesselName: valueOption });
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.certificateName || ""}
                      isSearchable={true}
                      options={certificateNameDDL || []}
                      styles={customStyles}
                      name="certificateName"
                      placeholder="Certificate Name"
                      label="Certificate Name"
                      onChange={(valueOption) => {
                        setFieldValue("certificateName", valueOption);
                        gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikInput
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        gridData({ ...values, fromDate: e.target.value });
                        setFieldValue("fromDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      label="From Date "
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikInput
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        gridData({ ...values, toDate: e.target.value });
                        setFieldValue("toDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      label="To Date "
                    />
                  </div>
                </div>
              </div>

              {loading && <Loading />}
              <ICustomTable ths={headers}>
                {rowData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.strVesselName}</td>
                    <td>{item?.strCertificateTypeName}</td>
                    <td>{item?.strCertificateName}</td>
                    <td>{_dateFormatter(item?.dteIssueDate)}</td>
                    <td>{_dateFormatter(item?.dteToDate)}</td>
                    <td>{item?.strIssuePlace}</td>
                    <td>{item?.strIssuingAuthority}</td>
                    <td>{_dateFormatter(item?.dteLastSurvey)}</td>
                    <td>{item?.strRemarks}</td>
                    <td className="text-center">
                      {item?.status === "Expire Soon" ? (
                        <Chip
                          label="Expire Soon"
                          className="bg-warning text-white"
                          size="small"
                        />
                      ) : item?.status === "Expired" ? (
                        <Chip
                          label="Expired"
                          className="bg-danger text-white"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Not Expired"
                          className="bg-success text-white"
                          size="small"
                        />
                      )}
                    </td>
                    <td style={{ width: "60px" }} className="text-center">
                      <div className="d-flex justify-content-around">
                        {item?.strAttachment !== "" && (
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">Attachment Added</Tooltip>
                            }
                          >                            
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={{
                               
                              }}
                            >
                              <i class="fa fa-paperclip" aria-hidden="true"></i>
                            </span>
                          </OverlayTrigger>
                        )}

                        {certificateManagementPermission?.isView ? (
                          <IView
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/certificateManagement/certificateManagement/view/${item?.intVesselCertificateId}`,
                              });
                            }}
                          />
                        ) : (
                          <button disabled>N/A</button>
                        )}
                        {certificateManagementPermission?.isEdit ? (
                          <IEdit
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/certificateManagement/certificateManagement/edit/${item?.intVesselCertificateId}`,
                              });
                            }}
                          />
                        ) : (
                          <button disabled>N/A</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </ICustomTable>
              {/* {gridData?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )} */}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}

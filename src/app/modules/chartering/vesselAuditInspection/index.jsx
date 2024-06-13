import { Formik } from "formik";
import React, { useState } from "react";
import { _firstDateofMonth } from "../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../_helper/_todayDate";
import Loading from "../../_helper/_loading";
import { useHistory } from "react-router-dom";
import FormikSelect from "../_chartinghelper/common/formikSelect";
import customStyles from "../../selectCustomStyle";
import FormikInput from "../_chartinghelper/common/formikInput";
import { _dateFormatter } from "../../_helper/_dateFormate";
import { OverlayTrigger } from "react-bootstrap";
import ICustomTable from "../_chartinghelper/_customTable";

const initData = {
  vesselType: "",
  vessel: "",
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

export default function VesselAuditLanding() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
                <p>Vessel Audit</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/certificateManagement/abcderf/create"
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
                      value={values?.vesselType || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="vesselType"
                      placeholder="Mother, Lighter"
                      label="Vessel Type"
                      onChange={(valueOption) => {
                        setFieldValue("vesselType", valueOption);
                        // gridData({ ...values, vesselName: valueOption });
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vessel || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="vessel"
                      placeholder="Vessel/Ligher"
                      label="Vessel/Ligher"
                      onChange={(valueOption) => {
                        setFieldValue("vessel", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
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
                        // gridData({ ...values, fromDate: e.target.value });
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
                        // gridData({ ...values, toDate: e.target.value });
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
                {[1, 2]?.map((item, index) => (
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
                    {/* <td className="text-center">
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
                            <span style={{ cursor: "pointer" }} onClick={{}}>
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
                    </td> */}
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

/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationSearch from "../../../_chartinghelper/_search";
import { getCertificateDDL, getCertificateLanding } from "../helper";

const initData = {
  certificateType: "",
};

const headers = [
  { name: "SL" },
  { name: "Certificate Type" },
  { name: "Certificate Name" },
  { name: "Action" },
];

export default function CertificateNameTable() {
  // eslint-disable-next-line no-unused-vars
  const [pageNo, setPageNo] = React.useState(0);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = React.useState(15);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let certificateCreatePermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 979) {
      certificateCreatePermission = userRole[i];
    }
  }

  const [certificateTypeDDL, setCertificateTypeDDL] = useState([]);
  const getGridData = (values, PageNo, PageSize) => {
    getCertificateLanding(
      setRowData,
      "CertificateLanding",
      {
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intVesselId: values?.vesselName?.value || 0,
        intCertificateId: values?.certificateName?.value || 0,
        intVesselCertificateId: 0,
        strCertificateName: values?.certificateName,
        intCertificateTypeId: values?.certificateType?.value || 0,
        //intVesselId: 0,
      },
      setLoading,
      () => {}
    );
  };
  useEffect(() => {
    getGridData();
    getCertificateDDL(setCertificateTypeDDL, "CertificateTypeDDL", {
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intCertificateTypeId: 0,
    });
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getCertificateLanding(
      setRowData,
      "CertificateLanding",
      {
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intVesselId: values?.vesselName?.value || 0,
        intCertificateId: values?.certificateName?.value || 0,
        intVesselCertificateId: 0,
        strCertificateName: searchValue,
        intCertificateTypeId: values?.certificateType?.value || 0,
        //intVesselId: 0,
      },
      setLoading,
      () => {}
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
                <p>Certificate Name List</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/configuration/certificate/create"
                      )
                    }
                  >
                    Create
                  </button>
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3 mt-5">
                    <PaginationSearch
                      placeholder="Search by Certificate Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.certificateType || ""}
                      isSearchable={true}
                      options={certificateTypeDDL}
                      styles={customStyles}
                      name="certificateType"
                      placeholder="Certificate Type"
                      label="Certificate Type"
                      onChange={(valueOption) => {
                        setFieldValue("certificateType", valueOption);
                        getGridData({
                          ...values,
                          certificateType: valueOption,
                        });
                      }}
                      //isDisabled={isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              {loading && <Loading />}
              <ICustomTable ths={headers}>
                {rowData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.strCertificateTypeName}</td>
                    <td>{item?.strCertificateName}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        {certificateCreatePermission?.isView ? (
                          <IView
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/configuration/certificate/view/${item?.intCertificateId}`,
                              });
                            }}
                          />
                        ) : (
                          <button disabled>N/A</button>
                        )}
                        {certificateCreatePermission?.isEdit ? (
                          <IEdit
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/configuration/certificate/edit/${item?.intCertificateId}`,
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
              {/* {rowData?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
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

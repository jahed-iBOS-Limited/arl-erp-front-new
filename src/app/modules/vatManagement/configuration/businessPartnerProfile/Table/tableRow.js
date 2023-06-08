import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import {
  GetBusinessPartnerProfilePagination,
  getPartnerTypeDDL_api,
} from "../helper";
import PaginationSearch from "../../../../_helper/_search";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
export function TableRow() {
  const history = useHistory();
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [partnerTypeDDL, SetPartnerTypeDDL] = useState("");
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const initData = {
    id: undefined,
    businessPartnerTypeId: "",
  };
  // Validation schema
  const validationSchema = Yup.object().shape({});
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const gridDataFunc = (pageNo, pageSize, searchValue, partnerType) => {
    GetBusinessPartnerProfilePagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue,
      partnerType
    );
  };
  //PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    gridDataFunc(pageNo, pageSize, null, values?.businessPartnerTypeId?.value);
  };
  // search handler
  const paginationSearchHandler = (searchValue, values) => {
    gridDataFunc(
      pageNo,
      pageSize,
      searchValue,
      values?.businessPartnerTypeId?.value
    );
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      gridDataFunc(pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    getPartnerTypeDDL_api(SetPartnerTypeDDL);
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <Form className="p-0 m-0">
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="businessPartnerTypeId"
                  options={partnerTypeDDL || []}
                  value={values?.businessPartnerTypeId}
                  label="Partner Type"
                  onChange={(valueOption) => {
                    setFieldValue("businessPartnerTypeId", valueOption);
                    gridDataFunc(pageNo, pageSize, null, valueOption?.value);
                  }}
                  placeholder="Partner Type"
                  errors={errors}
                  touched={touched}
              
                />
              </div>
            </div>
            <div className="row">
              {loading && <Loading />}
              <div className="col-lg-12 ">
                <PaginationSearch
                  placeholder="Partner Name Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
                {gridData?.data?.length >= 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table ">
                      <thead>
                        <tr>
                          <th style={{ width: "25px" }}>SL</th>
                          <th style={{ width: "70px" }}>Partner Type</th>
                          <th style={{ width: "85px" }}>
                            Business Partner Name
                          </th>
                          <th style={{ width: "282px" }}>Address</th>
                          <th style={{ width: "60px" }}>Email</th>
                          <th style={{ width: "75px" }}>Contact Number</th>
                          <th style={{ width: "70px" }}>NID Number</th>
                          <th style={{ width: "50px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td> {td.sl} </td>
                            <td className="text-right">
                              <div className="pl-2 text-left">
                                {td.businessPartnerTypeName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td.businessPartnerName}
                              </div>
                            </td>

                            <td>
                              <div className="pl-2">
                                {td.businessPartnerAddress}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td.email ? td.email : "NaN"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{td.contactNumber}</div>
                            </td>
                            <td>
                              <div className="pl-2">{td.nid} </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/mngVat/cnfg-vat/cnfg/edit/${td.businessPartnerId}`
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { useHistory } from "react-router-dom";
import IEdit from "./../../../../_helper/_helperIcons/_edit";

import { Form, Formik } from "formik";
import NewSelect from "../../../../_helper/_select";

const initData = {
  partnerType: "",
};

// const partnerTypeDDL = ;

export function PartnerTable({ saveHandler }) {

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);

  let history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [search, setSearch] = useState("")

  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const dispatchProduct = async (
    accId,
    buId,
    partnerTypeId,
    pageNo,
    pageSize,
    search
  ) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await Axios.get(
        `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerLandingPagingSearch?${searchPath}accountId=${accId}&businessUnitId=${buId}&PartnertypeId=${partnerTypeId}&status=true&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
     
      setLoading(false);
    }
  };

  const getInfoData = async () => {
    try {
      const res = await Axios.get(
        '/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList'
      )
      const list = res?.data.map((item) => {
        return {
          value: item?.businessPartnerTypeId,
          label: item?.businessPartnerTypeName,
        }
        // itemTypes.push(items)
      })
      setPartnerTypeDDL(list)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getInfoData()
  },[])

  useEffect(() => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      0,
      pageNo,
      pageSize
    );
  }, [selectedBusinessUnit, profileData, pageNo, pageSize]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      0,
      pageNo,
      pageSize,
      search
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };
  // const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
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
            <Form className="form form-label-right">
              <div className="row global-form align-items-center">
                <div className="col-lg-3">
                  <NewSelect
                    name="branch"
                    options={partnerTypeDDL || []}
                    value={values?.partnerType}
                    label="Partner Type"
                    onChange={(valueOption) => {
                      dispatchProduct(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        pageNo,
                        pageSize
                      );
                      setFieldValue("partnerType", valueOption);
                    }}
                    placeholder="Partner Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </Form>
            <PaginationSearch
              placeholder="Partner Name & Code Search"
              paginationSearchHandler={paginationSearchHandler}
              setter={setSearch}
            />
          <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "55px" }}>Code</th>
                  <th style={{ width: "120px" }}>Partner Name</th>
                  <th style={{ width: "120px" }}>Partner Type</th>
                  <th style={{ width: "120px" }}>Address</th>
                  <th style={{ width: "100px" }}>Contact Number</th>
                  <th style={{ width: "120px" }}>Email</th>
                  <th style={{ width: "70px" }}>BIN</th>
                  <th style={{ width: "120px" }}>Licence Number</th>
                  <th style={{ width: "20px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {products?.data?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {tableData?.sl} </td>
                    <td> {tableData?.businessPartnerCode} </td>
                    <td> {tableData?.businessPartnerName} </td>
                    <td> {tableData?.businessPartnerTypeName} </td>
                    <td> {tableData?.businessPartnerAddress} </td>
                    <td> {tableData?.contactNumber} </td>
                    <td> {tableData?.email} </td>
                    <td> {tableData?.bin} </td>
                    <td> {tableData?.licenseNo} </td>
                    <td>
                      <button
                        onClick={() =>
                          history.push({
                            pathname: `/config/partner-management/partner-other-info/edit/${tableData?.businessPartnerId}`,
                            state: tableData,
                          })
                        }
                        style={{ border: "none", background: "none" }}
                      >
                        <IEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            {/* Pagination Code */}
            {products?.data?.length > 0 && (
              <PaginationTable
                count={products?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}
          </>
        )}
      </Formik>
    </>
  );
}

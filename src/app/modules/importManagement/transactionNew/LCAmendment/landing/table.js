import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData, getLCAmendmentLandingPasignation } from "../helper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import IView from "./../../../../_helper/_helperIcons/_view";
import { Formik } from "formik";
import Axios from "axios";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useLocation } from "react-router-dom";
import ICustomCard from "./../../../../_helper/_customCard";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const header = [
  "SL",
  "PO Number",
  "LC Number",
  "LC Amendment Code",
  "Expire Date",
  "Tolerance",
  "PI Amount (BDT)",
  "Currency",
  "Action",
];

const LCAmendmentLanding = () => {
  const history = useHistory();
  const location = useLocation();
  // console.log("location",location);
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (location?.state?.lcnumber) {
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setIsLoading,
        pageNo,
        pageSize,
        location?.state?.lcnumber
        // values?.lcNo?.label
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.lcnumber]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize,
      // values?.lcNo?.label
      location?.state?.lcnumber
    );
  };

  // const paginationSearchHandler = (searchValue) => {
  //   setPositionHandler(pageNo, pageSize, searchValue);
  // };

  //searchable drop down in po list;
  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/LetterOfCredit/GetPOorLCNumberList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
    ).then((res) => res?.data);
  };
  // console.log("gridData",gridData)

  // const loadPartsList = (v) => {
  //   if (v?.length < 3) return [];
  //   return Axios.get(
  //     `/imp/LCAmendment/LCAmendmentLandingPasignation?search=${v}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`
  //   ).then((res) => res?.data);
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          lcNo: "",
          poNo: "",
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <ICustomCard
              title="LC Amendment"
              backHandler={() => history.goBack()}
              renderProps={() => (
                <button
                  style={{ marginLeft: "15px" }}
                  onClick={() =>
                    history.push({
                      pathname:
                        "/managementImport/transaction/lc-amendment/create",
                      state: {
                        ...location?.state,
                        lcNo: location?.state?.lcnumber,
                      },
                    })
                  }
                  className="btn btn-primary"
                  // disabled={gridData?.data?.length > 0}
                  // disabled conditioned was earlier for preventing more than one lc amendment
                >
                  Create
                </button>
              )}
            >
              <div className="row global-form">
                <div className="col-lg-3 col-md-3">
                  <label>PO No/ LC No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.poNo}
                    isSearchIcon={true}
                    paddingRight={10}
                    name='poNo'
                    handleChange={(valueOption) => {
                      setFieldValue("poNo", valueOption);
                      getLCAmendmentLandingPasignation(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        setGridData,
                        setIsLoading,
                        pageNo,
                        pageSize,
                        valueOption?.label || ''
                      );
                    }}
                    loadOptions={loadPartsList}
                  />
                </div>
              </div>
              {isloading && <Loading />}

              {/* <PaginationSearch
                  placeholder="User Reference Search"
                  paginationSearchHandler={paginationSearchHandler}
                /> */}
              <ICustomTable ths={header}>
                {gridData?.data?.length > 0 &&
                  gridData?.data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>

                        <td>{item?.ponumber}</td>
                        <td style={{ width: "150px" }}>{item?.lcnumber}</td>
                        <td>{item?.lcacode}</td>
                        <td style={{ width: "100px" }} className="text-center">
                          {_dateFormatter(item?.dteLCExpireDate)}
                        </td>
                        <td className="text-right">
                          {item?.tolarance}
                          {item?.tolarance ? "%" : ""}
                        </td>
                        <td className="text-right">
                          {numberWithCommas(item?.piAmountBDT)}
                        </td>
                        <td className="text-center">{item?.currencyName}</td>
                        <td style={{ width: "100px" }} className="text-center">
                          <div className="d-flex justify-content-center">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push({
                                    pathname: `/managementImport/transaction/lc-amendment/view/${item?.lcAmendmentId}`,
                                    state: item,
                                    type:"view"
                                  });
                                }}
                              />
                            </span>
                            {/* <span
                              className="ml-3 edit"
                              onClick={() => {
                                history.push({
                                  pathname: `/managementImport/transaction/lc-amendment/edit/${item?.lcAmendmentId}`,
                                  state: item,
                                });
                              }}
                            >
                              <IEdit />
                            </span> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </ICustomTable>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
              {/* </CardBody>
            </Card> */}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default LCAmendmentLanding;

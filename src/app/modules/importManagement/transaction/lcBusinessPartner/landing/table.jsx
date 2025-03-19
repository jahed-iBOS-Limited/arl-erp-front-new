import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import ICustomTable from "../../../../_helper/_customTable";
import { DeleteBusinessPartner, getLandingData } from "../helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IView from "../../../../_helper/_helperIcons/_view";
import IConfirmModal from "../../../../_helper/_confirmModal";
import PaginationTable from "../../../../_helper/_tablePagination";
import { Formik, Form } from "formik";
import PaginationSearch from "../../../../_helper/_search";

const header = [
  "SL",
  "Name",
  "Type",
  // "Cover Note Prefix",
  // "Policy Prefix",
  "Action",
];

const LCBusinessPartnerLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState([]);
  // const [isloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lcBusiness, setLcBusiness] = useState('');

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        "",
        pageNo,
        pageSize,
        setGridData,
        setLoading
      );
    }
  }, [profileData, selectedBusinessUnit, pageSize, pageNo]);

  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      lcBusiness,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  const paginationSearchHandlerSearch = (searchValue) => {
    setPositionHandler(0,pageSize)
  };

  const RemoveBusinessPartner = (id, poId) => {
    if (id && profileData?.accountId && selectedBusinessUnit?.value) {
      let confirmObject = {
        title: "Are you sure want to delete?",
        // message: "If you close this, it can not be undone",
        yesAlertFunc: async () => {
          // Delete Data and Fetch Grid Data
          DeleteBusinessPartner(id, () => {
            getLandingData(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              "",
              pageNo,
              pageSize,
              setGridData,
              setLoading,
              setLoading
            );
          });
        },
        noAlertFunc: () => { },
      };
      IConfirmModal(confirmObject);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={{ poDDL: "" }}>
        {({ setFieldValue, values }) => (
          <>

            <Card>
              <CardHeader title="LC Business Partner">
                <CardHeaderToolbar>
                  <button
                    onClick={() =>
                      history.push(
                        "/managementImport/transaction/lc-business-partner/create"
                      )
                    }
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row cash_journal">
                    <div className="col-lg-3">
                      <PaginationSearch
                        placeholder="Partner Name & Charge Type"
                        paginationSearchHandler={paginationSearchHandlerSearch}
                        values={values}
                        setter={(searchValue) => setLcBusiness(searchValue)}
                      />
                    </div>
                    {/* <div className="col-lg-2">
                      <button
                        onClick={()=>landingSearch() }
                        style={{ marginTop: "14px" }}
                        type="button"
                        className="btn btn-primary"
                        disabled={!poNumber}
                      >
                        Search
                      </button>
                    </div> */}
                  </div>
                </Form>
                <ICustomTable ths={header}>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {item?.sl}
                          </td>
                          <td>
                            <span className="pl-2">{item?.partnerName}</span>
                          </td>
                          <td>
                            <span className="pl-2">{item?.partnerType}</span>
                          </td>
                          {/* <td className="text-left">
                            <span className="pl-2 text-center">
                              {item?.coverNotePrefix}
                            </span>
                          </td>
                          <td>
                            <span className="pl-2">{item?.policyPrefix}</span>
                          </td> */}
                          <td
                          // style={{ width: "100px" }}
                          // className="text-center d-flex justify-content-center"
                          >
                            <div className="d-flex justify-content-around align-items-center">
                              {item?.partnerType === "Insurance Company" ||
                                item?.partnerType === "Bank" ||
                                item?.partnerType === "CnF Agency" ? (
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      history.push({
                                        pathname: `/managementImport/transaction/lc-business-partner/view/${item?.partnerType !== "Bank"
                                          ? item?.businessPartnerId
                                          : item?.bankAccIdAsSupplierId
                                          }/${item?.partnerTypeId}`,
                                        state: item,
                                      });
                                    }}
                                  />
                                </span>
                              ) : (
                                <span>
                                  <i
                                    className={`fa pointer fa-eye`}
                                    style={{ opacity: ".0" }}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              )}
                              <span
                                className="pl-2"
                                onClick={() => {
                                  RemoveBusinessPartner(item?.lcPartnerId);
                                }}
                              >
                                <IDelete />
                              </span>
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
                    paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  />
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>

    </>
  );
};

export default LCBusinessPartnerLanding;

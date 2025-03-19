/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import { Form, Formik } from "formik";
import { GetPartnerProductAllocationLcInfoLandingData } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const header = [
  "SL",
  "LC No",
  "LC Date",
  "Supplier Country",
  "Bank Name",
  "Ship Name",
  "Color",
  "Reference No",
  "Reference Date",
  "Action",
];

const initData = { fromDate: _todayDate(), toDate: _todayDate() };

const PartnerProductAllocationLcInfo = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getGrid(pageNo, pageSize);
  }, [profileData, selectedBusinessUnit]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGrid(pageNo, pageSize);
  };

  const getGrid = (pageNo, pageSize) => {
    GetPartnerProductAllocationLcInfoLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ touched, values, setFieldValue, errors }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Product Allocation LC Information">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push(
                        "/config/partner-management/prod-allocation-lcinfo/create"
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <ICustomTable ths={header}>
                    {gridData?.data?.length
                      ? gridData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.lCno}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.lCdate)}
                              </td>
                              <td>{item?.supplierCountry}</td>
                              <td>{item?.bankName}</td>
                              <td>{item?.shipName}</td>
                              <td>{item?.color}</td>
                              <td>{item?.allotmentRefNo}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.allotmentRefDate)}
                              </td>
                              <td
                                style={{ width: "70px" }}
                                className="text-center"
                              >
                                <span
                                  className="view pr-2"
                                  onClick={(e) =>
                                    history.push({
                                      pathname: `/config/partner-management/prod-allocation-lcinfo/view/${item?.autoId}`,
                                    })
                                  }
                                >
                                  <IView />
                                </span>
                                <span
                                  className="edit pr-2"
                                  onClick={(e) =>
                                    history.push({
                                      pathname: `/config/partner-management/prod-allocation-lcinfo/edit/${item?.autoId}`,
                                    })
                                  }
                                >
                                  <IEdit />
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </ICustomTable>

                  {/* Pagination Code */}
                  {gridData?.data?.length > 0 ? (
                    <PaginationTable
                      count={gridData?.totalCount}
                      values={values}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  ) : null}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerProductAllocationLcInfo;

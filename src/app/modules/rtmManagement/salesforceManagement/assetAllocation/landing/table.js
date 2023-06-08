/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { Formik } from "formik";
import NewSelect from "./../../../../_helper/_select";
import {
  getTerritoryDDL,
  getRouteDDL,
  getBeatDDL,
  updateAllocation,
} from "../helper";
import { ModalProgressBar } from "./../../../../../../_metronic/_partials/controls/ModalProgressBar";
import { getLandingData } from "../helper";
import ICheckout from "./../../../../_helper/_helperIcons/_checkout";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

const initData = {
  territory: "",
  route: "",
  beat: "",
  isAllocated: "",
};

const AssetAllocationLanding = () => {
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);

  // Pagination State
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // All DDL State
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get All DDL
  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTerritoryDDL
    );
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteDDL
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.route?.value,
      values?.beat?.value,
      values?.isAllocated?.value,
      pageNo,
      pageSize,
      setGridData,
      setIsLoading
    );
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Asset Allocation"></CardHeader>
              <CardBody>
                {isloading && <Loading />}

                {/* Form Start */}
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      options={territoryDDL}
                      value={values?.territory}
                      label="Territory Name"
                      onChange={(valueOption) => {
                        setFieldValue("territory", valueOption);
                      }}
                      placeholder="Territory Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="route"
                      options={routeDDL}
                      value={values?.route}
                      label="Route Name"
                      onChange={(valueOption) => {
                        setFieldValue("route", valueOption);
                        getBeatDDL(valueOption?.value, setBeatDDL);
                      }}
                      placeholder="Route Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="beat"
                      options={beatDDL}
                      value={values?.beat}
                      label="Market Name"
                      onChange={(valueOption) => {
                        setFieldValue("beat", valueOption);
                      }}
                      placeholder="Market Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="isAllocated"
                      options={[
                        { value: 1, label: "Allocated" },
                        { value: 2, label: "Not Allocated" },
                      ]}
                      value={values?.isAllocated}
                      label="Allocated"
                      onChange={(valueOption) => {
                        setFieldValue("isAllocated", valueOption);
                      }}
                      placeholder="Allocated"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-1 ">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: "16px" }}
                      disabled={
                        !values?.beat ||
                        !values?.route ||
                        !values?.territory ||
                        !values?.isAllocated
                      }
                      onClick={() => {
                        getLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.route?.value,
                          values?.beat?.value,
                          values?.isAllocated?.value,
                          pageNo,
                          pageSize,
                          setGridData,
                          setIsLoading
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>

                {/* Form End */}

                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Outlet Name</th>
                      <th>Address</th>
                      <th>Item Name</th>
                      <th>Request Quantity</th>
                      <th>Request Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>
                              <span className="pl-2">{item?.outletName}</span>
                            </td>
                            <td>
                              <span className="pl-2">
                                {item?.outletAddress}
                              </span>
                            </td>
                            <td>
                              <span className="pl-2">{item?.itemName}</span>
                            </td>
                            <td className="text-right">
                              <span className="pr-2">
                                {item?.assetRequestQty}
                              </span>
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.requestDate)}
                            </td>
                            {!item?.isAllocation ? (
                              <td
                                onClick={() => {
                                  const payload = {
                                    intRowId: item?.rowId,
                                    actionBy: profileData?.userId,
                                  };
                                  // Updated Allocation
                                  updateAllocation(payload, () => {
                                    getLandingData(
                                      profileData?.accountId,
                                      selectedBusinessUnit?.value,
                                      values?.route?.value,
                                      values?.beat?.value,
                                      values?.isAllocated?.value,
                                      pageNo,
                                      pageSize,
                                      setGridData,
                                      setIsLoading
                                    );
                                  });
                                }}
                                className="text-center"
                              >
                                <ICheckout title={"Allocated"} />
                              </td>
                            ) : (
                              <td className="text-center">-</td>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

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
                    values={values}
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

export default AssetAllocationLanding;

import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getVehicleGridData } from "../_redux/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router";
import { Formik } from "formik";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";

const initData = {
  shipPoint: { value: 0, label: "All" },
  ownerType: { value: 0, label: "All" },
};

export function TableRow() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.vehicleUnit?.gridData;
  }, shallowEqual);

  const getGridData = (values, _pageNo, _pageSize, searchValue = "") => {
    dispatch(
      getVehicleGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        _pageNo,
        _pageSize,
        setLoading,
        values?.shipPoint?.value,
        values?.ownerType?.value,
        searchValue
      )
    );
  };

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      // dispatch(
      //   getVehicleGridData(
      //     profileData.accountId,
      //     selectedBusinessUnit.value,
      //     pageNo,
      //     pageSize,
      //     setLoading,
      //     0,
      //     0
      //   )
      // );
      getGridData(initData, pageNo, pageSize, "");
      getShipPointDDL(
        `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize, "");
  };

  const paginationSearchHandler = (searchValue, values) => {
    getGridData(values, pageNo, pageSize, searchValue);
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            {/* <ICustomCard> */}
            <form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={
                      [{ value: 0, label: "All" }, ...shipPointDDL] || []
                    }
                    value={values?.shipPoint}
                    label="Ship Point"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="ownerType"
                    options={[
                      { value: 0, label: "All" },
                      { value: 1, label: "Company" },
                      { value: 2, label: "Rental" },
                      { value: 3, label: "Customer" },
                    ]}
                    value={values?.ownerType}
                    label="Owner Type"
                    onChange={(valueOption) => {
                      setFieldValue("ownerType", valueOption);
                    }}
                    placeholder="Owner Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <IButton
                colSize={"col-lg-3"}
                  onClick={() => {
                    getGridData(values, pageNo, pageSize, "");
                  }}
                />
              </div>
            </form>
            <div className="row cash_journal">
              <div className="col-lg-12 pr-0 pl-0">
                <PaginationSearch
                  placeholder="Vehicle No & Code"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Vehicle No</th>
                      <th>Owner Type</th>
                      <th>ShipPoint</th>
                      <th>Weight</th>
                      <th>Volume</th>
                      <th>Capacity In Bag</th>
                      <th style={{ width: "70px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => (
                        <tr>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="pl-2">{item?.vehicleNo}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.ownerType}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.shipPointName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.weight}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.volume}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.capacityInBag}</div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className="edit"
                                onClick={() => {
                                  history.push(
                                    `/transport-management/configuration/vehicle/edit/${item?.vehicleId}`
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
              </div>
            </div>
            {/* </ICustomCard> */}
          </>
        )}
      </Formik>
    </>
  );
}

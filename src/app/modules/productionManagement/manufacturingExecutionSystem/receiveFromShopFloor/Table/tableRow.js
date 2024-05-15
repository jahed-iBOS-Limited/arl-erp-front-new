import React from "react";
import { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import IView from "../../../../_helper/_helperIcons/_view";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import {
  getSBUDDL_api,
  getPlantDDL_api,
  getWareHouseDDL_api,
  getReceiveShopFloorLandingAction,
} from "./../helper";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import NewSelect from "./../../../../_helper/_select";
import { setreceiveShopFloorLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import PaginationTable from "../../../../_helper/_tablePagination";
export function TableRow() {
  const history = useHistory();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  // const [selectedPlant, setSelectedPlant] = useState("");
  const [wareHouseDDL, setWareHouseDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const dispatch = useDispatch();

  const initData = {
    sbu: "",
    plant: "",
    warehouse: "",
  };

  const receiveFromShopFloorInitData = useSelector(
    (state) => state.localStorage.receiveFromShopFloorInitData
  );

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getSBUDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuDDL
      );
      getPlantDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const viewReceiveShopFloorData = (values) => {
    getReceiveShopFloorLandingAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      values?.plant?.value,
      values?.warehouse?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoader
    );
  };

  const setPositionHandler = (pageNo, pageSize) => {
    getReceiveShopFloorLandingAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      receiveFromShopFloorInitData?.sbu?.value,
      receiveFromShopFloorInitData?.plant?.value,
      receiveFromShopFloorInitData?.warehouse?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoader
    );
  };

  // useEffect(() => {
  //   // selectedPlant && selectedf
  //   getReceiveShopFloorLandingAction(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     receiveFromShopFloorInitData?.sbu?.value,
  //     receiveFromShopFloorInitData?.plant?.value,
  //     receiveFromShopFloorInitData?.warehouse?.value,
  //     pageNo,
  //     pageSize,
  //     setGridData,
  //     setLoader
  //   );
  //   getWareHouseDDL_api(
  //     profileData?.userId,
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     receiveFromShopFloorInitData?.plant?.value,
  //     setWareHouseDDL
  //   );
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={receiveFromShopFloorInitData || initData}
        // validationSchema={transferJournal}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(initData);
          // });
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
            <ICustomCard
              title="Receive From Shop Floor"
              renderProps={() => (
                <button
                  onClick={() => {
                    history.push({
                      pathname:
                        "/production-management/mes/receivefromshopfloor/create",
                      state: values,
                    });
                    dispatch(setreceiveShopFloorLandingAction(values));
                  }}
                  className="btn btn-primary ml-3"
                  disabled={
                    !values?.sbu || !values?.plant || !values?.warehouse
                  }
                >
                  Create
                </button>
              )}
            >
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 pb-2">
                    <NewSelect
                      name="sbu"
                      options={sbuDDL}
                      value={values?.sbu}
                      onChange={(valueOption) => {
                        setFieldValue("sbu", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder="SBU"
                    />
                  </div>
                  <div className="col-lg-3 pb-2">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", "");
                        // setSelectedPlant(valueOption);
                        setFieldValue("plant", valueOption);
                        getWareHouseDDL_api(
                          profileData?.userId,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setWareHouseDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder="Plant"
                    />
                  </div>
                  <div className="col-lg-3 pb-2">
                    <NewSelect
                      name="warehouse"
                      options={wareHouseDDL}
                      value={values?.warehouse}
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder="Warehouse"
                    />
                  </div>
                  <div style={{ width: "175px" }} className="mr-4">
                    <button
                      type="button"
                      className="btn btn-primary mt-6"
                      onClick={() => {
                        viewReceiveShopFloorData(values);
                        dispatch(setreceiveShopFloorLandingAction(values));
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              {loader && <Loading />}
              <div className="row cash_journal">
                <div className="col-lg-12 pr-0 pl-0">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Transaction Code</th>
                        <th>Transaction Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.sl}</td>
                          <td>
                            <div className="text-center">
                              {item?.inventoryTransactionCode}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item?.inventoryTransactionDate)}
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push({
                                    pathname: `/production-management/mes/receivefromshopfloor/view/${item?.inventoryTransactionId}`,
                                  });
                                }}
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              </div>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}

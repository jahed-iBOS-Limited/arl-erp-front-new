import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import RowDetails from "./view";
const initData = {
  shift: "",
  mill: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

export default function MillProduction() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [
    millProductionlanding,
    getMillProductionlanding,
    loaderMillProductionlanding,
  ] = useAxiosGet();
  const [row, setRow] = useState(null);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getMillProductionlanding(
      `/mes/MSIL/GetAllMillProductionLanding?BusinessunitId=${selectedBusinessUnit?.value}&Fromdate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  useEffect(() => {
    getMillProductionlanding(
      `/mes/MSIL/GetAllMillProductionLanding?BusinessunitId=${selectedBusinessUnit?.value}&Fromdate=${initData?.fromDate}&Todate=${initData?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loaderMillProductionlanding && <Loading />}
          <IForm
            title="Mill Production"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/ACCLFactory/mill-production/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <div>
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    type="date"
                    name="fromDate"
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    type="date"
                    name="toDate"
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    disabled={!values?.fromDate || !values?.toDate}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    onClick={() => {
                      getMillProductionlanding(
                        `/mes/MSIL/GetAllMillProductionLanding?BusinessunitId=4&Fromdate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
                      );
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Date</th>
                          <th>Shift</th>
                          {/* <th>Plant</th> */}
                          <th>Mill Name</th>
                          <th>Shop Floor</th>
                          <th>Product Type </th>
                          <th>BOM</th>
                          <th>Running Hour</th>
                          <th>Quantity</th>
                          <th>ActionBy</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {millProductionlanding?.header?.length > 0 &&
                          millProductionlanding?.header?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteDate)}
                              </td>
                              <td className="text-center">
                                {item?.strShiftName}
                              </td>
                              {/* <td>{item?.plant}</td> */}
                              <td>{item?.strMillName}</td>
                              <td>{item?.strShopFloorName}</td>
                              <td>{item?.strProductTypeName}</td>
                              <td className="text-center">
                                {item?.strBomname}
                              </td>
                              <td className="text-center">
                                {item?.numRunningHour}
                              </td>
                              <td className="text-center">
                                {item?.numQuantity}
                              </td>
                              <td>{item?.strActionByName}</td>
                              <td>{item?.strRemark}</td>
                              <td className="text-center">
                                <IView
                                  title="View"
                                  clickHandler={() => {
                                    setRow(item);
                                    // history.push({
                                    //     pathname: `/production-management/ACCLFactory/mill-production/view/${item?.intMillProductionId}`,
                                    //     state: item,
                                    // });
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {millProductionlanding?.header?.length > 0 && (
                    <PaginationTable
                      count={millProductionlanding?.header?.length}
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
            </div>
          </IForm>
          <IViewModal
            show={row}
            onHide={() => {
              setRow(null);
            }}
            title="Breakdown Details View"
          >
            <RowDetails row={row} />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}

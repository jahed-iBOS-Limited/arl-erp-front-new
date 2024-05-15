import { Formik } from "formik";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import GateInByPO from "./gateInByPO";
import GateInByPoModal from "./viewModal";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const initData = {
  date: _todayDate(),
};

function GateInByPoLanding() {
  const [rowData, getRowData, lodar] = useAxiosGet();
  const [isShowModel, setIsShowModel] = useState(false);
  const [item, setItem] = useState(null);
  const [viewType, setViewType] = useState(1);
  const [date, setDate] = useState(_todayDate());
  const [searchValue, setSearchValue] = useState("");

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gate In By PO"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Key-Register/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <>
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 1}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setViewType(1);
                        }}
                      />
                      Pending Gate In
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 2}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setViewType(2);
                        }}
                      />
                      Gate In List
                    </label>
                  </div>
                </>
                {viewType === 1 ? (
                  <>
                    <div className="form-group  global-form">
                      <div className="row">
                        <div className="col-lg-3">
                          <InputField
                            value={values?.date}
                            label="Date"
                            name="date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("date", e.target.value);
                              setDate(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <button
                            style={{ marginTop: "18px" }}
                            className="btn btn-primary ml-2"
                            disabled={!values.date}
                            onClick={() => {
                              getRowData(
                                `/mes/MSIL/GetAllGateInByPOInfoByDate?intBusinessUnitId=${selectedBusinessUnit?.value}&date=${values.date}`
                              );
                            }}
                          >
                            Show
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search here..."
                            onChange={(e) => {
                              setSearchValue(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                getRowData(
                                  `/mes/MSIL/GetAllGateInByPOInfoByDate?intBusinessUnitId=${
                                    selectedBusinessUnit?.value
                                  }&date=${_todayDate()}&search=${
                                    e.target.value
                                  }`
                                );
                              }
                            }}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => {
                                getRowData(
                                  `/mes/MSIL/GetAllGateInByPOInfoByDate?intBusinessUnitId=${
                                    selectedBusinessUnit?.value
                                  }&date=${_todayDate()}&search=${searchValue}`
                                );
                              }}
                            >
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
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
                                <th>PO Number</th>
                                <th>Supplier Name</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowData?.length > 0 &&
                                rowData?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="text-center">
                                      {_dateFormatter(
                                        item?.dtePurchaseOrderDate
                                      )}
                                    </td>
                                    <td className="text-center">
                                      {item?.strPurchaseOrderNo}
                                    </td>
                                    <td className="text-center">
                                      {item?.strBusinessPartnerName}
                                    </td>
                                    <td className="text-center">
                                      <span
                                        onClick={() => {
                                          setItem(item);
                                          setIsShowModel(true);
                                        }}
                                      >
                                        <IView />
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <GateInByPO
                      item={item}
                      date={values?.date || _todayDate()}
                    />
                  </>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      {/* Create page modal*/}
      <IViewModal
        show={isShowModel}
        onHide={() => {
          setIsShowModel(false);
        }}
      >
        <GateInByPoModal
          item={item}
          setItem={setItem}
          setViewType={setViewType}
          setIsShowModel={setIsShowModel}
          date={date}
          getPendingList={getRowData}
        />
      </IViewModal>
    </>
  );
}

export default GateInByPoLanding;

import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getPlantDDL, getMaintenanceReport, getWarehouseDDL } from "../helper";
import { _dateTimeFormatter } from "./../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";

import { _todayDate } from "../../../../_helper/_todayDate";

import IViewModal from "../../../../_helper/_viewModal";
import IView from "../../../../_helper/_helperIcons/_view";
import MaintenanceDetailReport from "../report/maintenanceReportModal";
import { SetAssetReportMaintanceReportAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import Loading from "../../../../_helper/_loading";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { IInput } from "../../../../_helper/_input";
// import FormikError from "../../../../_helper/_formikError";
// import numberWithCommas from "../../../../_helper/_numberWithCommas";

const MaintenanceReportTable = () => {
  const { assetReportMaintanceReport } = useSelector(
    (state) => state?.localStorage
  );
  const reportTypelist = [
    {
      value: 1,
      label: "Top Sheet",
    },
    {
      value: 2,
      label: "Individual",
    },
  ];

  const dispatch = useDispatch();
  // const { reportBillBySupplier } = useSelector((state) => state?.localStorage);

  let initData = {
    plant: assetReportMaintanceReport?.plant || "",
    warehouse: assetReportMaintanceReport?.warehouse || "",
    reportType: assetReportMaintanceReport?.reportType || "",
    fromDate: assetReportMaintanceReport?.fromDate || _todayDate(),
    toDate: assetReportMaintanceReport?.toDate || _todayDate(),
    assetNo:assetReportMaintanceReport?.assetNo || "",
    status: assetReportMaintanceReport?.status || ""
  };

  // //paginationState

  const [loading, setLoading] = useState(false);
  const [mdalShow, setModalShow] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  const [plantDDL, setPlantDDL] = useState("");
  const [warehouseDDL, setWarehouseDDL] = useState([]);

  // landing
  const [landing, setLanding] = useState([]);

  // loading
  // const [loading, setLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // //setPositionHandler
  // const setPositionHandler = (pageNo, pageSize, values) => {
  //   getMaintenanceReport(
  //     1,
  //     selectedBusinessUnit?.value,
  //     values?.plant?.value,
  //     values?.reportType?.value,
  //     values?.fromDate,
  //     values?.toDate,
  //     0,
  //     setLoading,
  //     setLanding
  //   );
  // };

  const loadAssetList = (v, plant) => {
    if (v?.length < 3) return []
    return axios.get(
      // `/asset/DropDown/GetAssetList?PlantId=${plantId}&searchTearm=${v}`
      `/asset/DropDown/GetAssetListForWorkOrder?UnitId=${selectedBusinessUnit?.value}&PlantId=${plant?.value}&searchTearm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        value: item?.value,
        assetproName: item?.label,
        label: item?.labelCode
      }));
      return updateList;
    });
  };

  return (
    <ICustomCard title="Maintenance">
      <>
        {loading && <Loading />}
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
              <Form className="form form-label-left">
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="col-lg-2">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        if(valueOption){
                          getWarehouseDDL({
                            buId: selectedBusinessUnit?.value,
                            plantId: valueOption?.value,
                            setter: setWarehouseDDL,
                          });
                        }
                        setFieldValue("plant", valueOption);
                        dispatch(
                          SetAssetReportMaintanceReportAction({
                            ...values,
                            plant: valueOption,
                          })
                        );
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="warehouse"
                      options={warehouseDDL || []}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                        dispatch(
                          SetAssetReportMaintanceReportAction({
                            ...values,
                            warehouse: valueOption,
                          })
                        );
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <NewSelect
                      name="reportType"
                      options={reportTypelist || []}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        dispatch(
                          SetAssetReportMaintanceReportAction({
                            ...values,
                            reportType: valueOption,
                          })
                        );
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {
                    values?.reportType?.value === 2 &&
                    <div className="col-lg-2">
                      <label>Asset NO.</label>
                      <SearchAsyncSelect
                        selectedValue={values?.assetNo}
                        handleChange={(valueOption) => {
                          setFieldValue("assetNo", valueOption);
                          setFieldValue("assetName", valueOption?.assetproName);
                          setFieldValue(
                            "businessUnit",
                            valueOption?.businessUnitName
                          );
                          dispatch(
                            SetAssetReportMaintanceReportAction({
                              ...values,
                              assetNo:valueOption,
                            })
                          );
                        }}
                        placeholder={"Asset Id and Code"}
                        loadOptions={e => loadAssetList(e, values?.plant)}
                        disabled={true}
                      />
                    </div>
                  }
                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 0, label: "All" },
                        { value: "Pending", label: "Pending" },
                        { value: "Open", label: "Open" },
                        { value: "Close", label: "Close" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        dispatch(
                          SetAssetReportMaintanceReportAction({
                            ...values,
                            status: valueOption,
                          })
                        );
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <IInput
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From date"
                      label="From date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        dispatch(
                          SetAssetReportMaintanceReportAction({
                            ...values,
                            fromDate: e.target.value,
                          })
                        );
                      }}
                      />
                  </div>
                  <div className="col-lg-2">
                      <IInput
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        label="To date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          dispatch(
                            SetAssetReportMaintanceReportAction({
                              ...values,
                              toDate: e.target.value,
                            })
                          );
                        }}
                      />
                  </div>

                  <div className="col-lg-12 mt-3">
                   <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!values?.plant || !values?.warehouse || !values?.reportType}
                        onClick={() => {
                          getMaintenanceReport({
                            warehouseId: values?.warehouse?.value,
                            part: 1,
                            businessUnitId: selectedBusinessUnit?.value,
                            plantId: values?.plant?.value,
                            reportType: values?.reportType?.value,
                            status: values?.status?.value,
                            fromDate: values?.fromDate,
                            toDate: values?.toDate,
                            intReffId: values?.assetNo?.value || 0,
                            setter: setLanding,
                            setLoading: setLoading,
                          });
                        }}
                      >
                        Show
                      </button>
                      <div className="ml-2">
                       {landing?.length ? (
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary"
                            table={"table-to-xlsx"}
                            filename={"maintenanceReport"}
                            sheet={"maintenanceReport"}
                            buttonText="Export Excel"
                          />
                       ):""}
                      </div>
                   </div>
                  </div>
                </div>
              </Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
               <div className="table-responsive">
               <table id="table-to-xlsx" className="table table-striped table-bordered global-table table-font-size-sm">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Job Card</th>
                        <th style={{ width: "100px" }}>Asset Code</th>
                        <th style={{ width: "120px" }}>Name of Asset</th>
                        <th style={{ width: "100px" }}>SBU Name</th>
                        <th style={{ width: "100px" }}>Problem</th>
                        <th>Repair Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Material</th>
                        <th>Service</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {/* {loading ? (
                      <ILoader />
                    ) : ( */}
                    <tbody>
                      {landing?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.intMaintenanceNo}</td>
                          <td>{item?.strAssetCode}</td>
                          <td>{item?.strNameOfAsset}</td>
                          <td>{item?.strSbuName}</td>
                          <td>{item?.strProblem}</td>
                          <td>{item?.strRepairType}</td>
                          <td>{item?.strPriority}</td>
                          <td>{item?.strStatus}</td>
                          <td>{_dateTimeFormatter(item?.dteStart)}</td>
                          <td>{_dateTimeFormatter(item?.dteEnd)}</td>
                          <td>{item?.monMaterial}</td>
                          <td>{item?.monServiceCost}</td>
                          <td>{item?.monMaterial + item?.monServiceCost}</td>
                          <td className="text-center">
                            <IView
                              //classes="text-muted"
                              clickHandler={() => {
                                setModalShow(true);
                                setCurrentItem(item);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                        <tr>
                          <td className="text-right font-weight-bold" colSpan="11"> Total</td>
                          <td className="text-center font-weight-bold">{landing?.reduce((acc,item)=>acc+ +item?.monMaterial,0)}</td>
                          <td className="text-center font-weight-bold">{landing?.reduce((acc,item)=>acc+ +item?.monServiceCost,0)}</td>
                          <td className="text-center font-weight-bold">{landing?.reduce((acc,item)=>acc+ (+item?.monMaterial + +item?.monServiceCost),0)}</td>
                          <td>
                          </td>
                        </tr>
                    </tbody>
                    {/* )} */}
                  </table>
               </div>
                </div>
                <>
                  <IViewModal
                    show={mdalShow}
                    onHide={() => setModalShow(false)}
                  >
                    <MaintenanceDetailReport
                      item={currentItem}
                      setModalShow={setModalShow}
                      values={values}
                      selectedBusinessUnit={selectedBusinessUnit}
                      setLoading={setLoading}
                    // selectedBusinessUnit={selectedBusinessUnit}
                    />
                  </IViewModal>
                </>
              </div>
              {/* {landing?.length > 0 && (
                <PaginationTable
                  count={landing.count}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )} */}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default MaintenanceReportTable;

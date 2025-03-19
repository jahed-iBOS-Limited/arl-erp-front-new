import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import PaginationSearch from "./../../../_helper/_search";
import PaginationTable from "./../../../_helper/_tablePagination";
import GateOutDelivary from "./gateOutDelivary";
import PendingTable from "./table";
import ChallanViewModal from "./viewModal";

const initData = {
  type: { value: 1, label: "Client Vehicle" },
  businessUnit: "",
  shipPoint: "",
};

function GateOutByDeliveryChallanLanding() {
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [isShowModel, setIsShowModel] = useState(false);
  const [item, setItem] = useState(null);
  const [viewType, setViewType] = useState(1);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [type, setType] = useState(1);
  const [fromDate, setFromDate] = useState(_todayDate());
  const [toDate, setToDate] = useState(_todayDate());
  const [shipPoint, getShipPoint, shipPointLoader, setShipPoint] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const [bu, setBu] = useState();
  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [selectedBU, setSelectedBU] = useState(selectedBusinessUnit);
  const setPaginationHandler = (pageNo, pageSize, values, searchValue = "") => {
    const fDate = fromDate ? `&fromDate=${fromDate}` : "";
    const tDate = toDate ? `&toDate=${toDate}` : "";
    const url = searchValue
      ? `/mes/MSIL/VehicleGateOutLanding?intBusinessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&status=false&pageNo=${pageNo}&pageSize=${pageSize}&search=${searchValue}`
      : `/mes/MSIL/VehicleGateOutLanding?intGateOutTypeId=${type}&intBusinessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&status=false&pageNo=${pageNo}&pageSize=${pageSize}${fDate}${tDate}`;

    getRowData(url, (data) => {
      searchValue && setType(data?.gateOut?.intReferenceTypeId || 1);
    });
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPaginationHandler(pageNo, pageSize, values, searchValue);
  };

  const callAfterGateOut = () => {
    const fDate = fromDate ? `&fromDate=${fromDate}` : "";
    const tDate = toDate ? `&toDate=${toDate}` : "";
    getRowData(
      `/mes/MSIL/VehicleGateOutLanding?intGateOutTypeId=${type}&intBusinessUnitId=${selectedBU?.value
      }&shipPointId=${initData?.shipPoint?.value}&status=false&pageNo=${pageNo}&pageSize=${pageSize}${fDate}${tDate}`
    );
  };

  useEffect(() => {
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
      setBu(selectedBusinessUnit?.value);
      setLoading(true);
      getShipPoint(`/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId
        }`,
        (data) => {
          initData.shipPoint = data[0];
          setLoading(false);
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => { }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gate Out"}>
                <CardHeaderToolbar>

                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(lodar || shipPointLoader || loading) && <Loading />}
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
                      Pending
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
                      Gate Out
                    </label>
                  </div>
                </>
                {viewType === 1 ? (
                  <>
                    <div className="form-group  global-form">
                      <div className="row">
                        <div className="col-lg-2">
                          <NewSelect
                            name="businessUnit"
                            options={businessUnitDDL}
                            value={values?.businessUnit}
                            label="Business Unit"
                            onChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("shipPoint", "");
                                setFieldValue("businessUnit", valueOption);
                                getShipPoint(`/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${valueOption?.value}&AutoId=${profileData?.userId}`,
                                  (data) => {
                                    if (data === []) return toast.warn("No Ship Point Found")
                                    setFieldValue("shipPoint", data[0]);
                                  })
                                setRowData([]);
                                setBu(valueOption?.value);
                                setSelectedBU(valueOption);
                              } else {
                                setFieldValue("businessUnit", "");
                                setFieldValue("shipPoint", "");
                                setRowData([]);
                                setBu(selectedBusinessUnit?.value);
                                setSelectedBU({});
                                setShipPoint([]);
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="shipPoint"
                            options={shipPoint}
                            value={values?.shipPoint}
                            label="Ship Point"
                            onChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("shipPoint", valueOption);
                                setRowData([]);
                              } else {
                                setFieldValue("shipPoint", "");
                                setRowData([]);
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            value={fromDate}
                            label="From Date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFromDate(e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            value={toDate}
                            label="To Date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setToDate(e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            value={values?.type}
                            label="Gate Out Type"
                            name="type"
                            options={[
                              { value: 2, label: "Visitor Vehicle" },
                              { value: 3, label: "Rental Vehicle" },
                              { value: 1, label: "Client Vehicle" },
                            ]}
                            onChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("type", valueOption);
                                setType(valueOption?.value);
                                setRowData([]);
                              } else {
                                setFieldValue("type", {
                                  value: 1,
                                  label: "Client Vehicle",
                                });
                                setType(1);
                                setRowData([]);
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <button
                            style={{ marginTop: "18px" }}
                            className="btn btn-primary ml-2"
                            disabled={!values.type || !values?.businessUnit}
                            onClick={() => {
                              const fDate = fromDate
                                ? `&fromDate=${fromDate}`
                                : "";
                              const tDate = toDate ? `&toDate=${toDate}` : "";
                              getRowData(
                                `/mes/MSIL/VehicleGateOutLanding?intGateOutTypeId=${values.type?.value}&intBusinessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&status=false&pageNo=${pageNo}&pageSize=${pageSize}${fDate}${tDate}`
                              );
                            }}
                          >
                            Show
                          </button>
                          <button
                            style={{ marginTop: "18px" }}
                            className="btn btn-primary ml-2"
                            disabled={!values.type}
                            onClick={() => {
                              history.push({
                                pathname: `/production-management/msil-gate-register/Gate-Out-By-Delivery-Challan/card`,
                                state: values,
                              });
                            }}
                          >
                            Get Out By Card
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4">
                        <PaginationSearch
                          placeholder="Search"
                          paginationSearchHandler={paginationSearchHandler}
                          values={values}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <PendingTable
                          rowData={rowData}
                          type={values?.type?.value}
                          setItem={setItem}
                          setIsShowModel={setIsShowModel}
                        />
                        {rowData?.gateOut?.length > 0 && (
                          <PaginationTable
                            count={rowData?.totalCount}
                            setPositionHandler={setPaginationHandler}
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
                  </>
                ) : (
                  <>
                    <GateOutDelivary item={item} />
                  </>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      {/* Create page modal*/}
      <IViewModal
        modelSize="md"
        show={isShowModel}
        onHide={() => {
          setIsShowModel(false);
        }}
      >
        <ChallanViewModal
          item={item}
          type={type}
          callAfterGateOut={callAfterGateOut}
          businessUnit={bu}
          setIsShowModel={setIsShowModel}
        />
      </IViewModal>
    </>
  );
}

export default GateOutByDeliveryChallanLanding;

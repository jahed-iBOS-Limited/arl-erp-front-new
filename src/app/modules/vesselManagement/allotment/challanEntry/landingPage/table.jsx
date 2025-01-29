/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { BADCBCICForm } from "../../../common/components";
import { getGodownDDL } from "../../../common/helper";
import { GetShipPointDDL } from "../../loadingInformation/helper";
import { getChallanById } from "../helper";
import ChallanPrint from "./challanPrint";
import WarehouseApprove from "./warehouseApprove";

const initData = {
  type: "badc",
  shipPoint: "",
  shipToPartner: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const headers = [
  "SL",
  "Program",
  "Ghat Name",
  "Vehicle No",
  "Driver Name",
  "Driver Mobile No",
  "Ship to Partner",
  "Delivery Address",
  "Delivery Date",
  "Logistic Amount",
  "Advance Amount",
  "Due Amount",
  "Quantity",
  "Action",
  "Warehouse Approve",
];

const ChallanTable = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [challanInfo, setChallanInfo] = useState({});
  const [godownDDL, setGodownDDL] = useState([]);
  const [singleItem, setSingleItem] = useState({});
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const profile = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const { userId } = profile;

  const getData = (values, pageNo, pageSize) => {
    const url = `/tms/LigterLoadUnload/GetLighterChallanInfoPagination?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${values
      ?.shipPoint?.value || 0}&ShipToPartnerId=${values?.shipToPartner?.value ||
      0}&FromDate=${values?.fromDate}&ToDate=${
      values?.toDate
    }&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url);
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    if (buId === 94) {
      getGodownDDL(buId, 73244, setGodownDDL, setLoading);
    }
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "type":
        setFieldValue("type", currentValue);
        if (currentValue) {
          getGodownDDL(
            buId,
            currentValue === "badc" ? 73244 : 73245,
            setGodownDDL,
            setLoading
          );
        }

        break;

      case "organization":
        setFieldValue("organization", currentValue);
        if (currentValue) {
          getGodownDDL(buId, currentValue?.value, setGodownDDL, setLoading);
        }

        break;

      default:
        break;
    }
  };

  // const approveSubmitlHandler = (deliveryId, accId) => {
  //   const payload = {
  //     deliveryId: deliveryId,
  //     actionBy: userId,
  //   };
  //   StockOutFromInventoryApproval(payload, setLoading, () => {
  //     getData(initData, pageNo, pageSize);
  //   });
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Challan Entry">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        history.push({
                          pathname:
                            "/vessel-management/allotment/challanentry/entry",
                          state: values,
                        });
                      }}
                      className="btn btn-primary ml-2"
                      disabled={isLoading || loading}
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      {buId === 94 && (
                        <BADCBCICForm
                          values={values}
                          setFieldValue={setFieldValue}
                          onChange={onChangeHandler}
                        />
                      )}
                      {buId === 178 && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="organization"
                            options={organizationDDL || []}
                            value={values?.organization}
                            label="Organization"
                            onChange={(valueOption) => {
                              onChangeHandler(
                                "organization",
                                values,
                                valueOption,
                                setFieldValue
                              );
                            }}
                            placeholder="Organization"
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: "All" },
                            ...shipPointDDL,
                          ]}
                          value={values?.shipPoint}
                          label="ShipPoint"
                          onChange={(e) => {
                            setFieldValue("shipPoint", e);
                          }}
                          placeholder="ShipPoint"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipToPartner"
                          options={[{ value: 0, label: "All" }, ...godownDDL]}
                          value={values?.shipToPartner}
                          label="Ship to Partner"
                          placeholder="Ship to Partner"
                          onChange={(e) => {
                            setFieldValue("shipToPartner", e);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="From Date"
                          value={values?.fromDate}
                          name="fromDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="To Date"
                          value={values?.toDate}
                          name="toDate"
                          type="date"
                        />
                      </div>
                      <div className="col-12 text-right">
                        <button
                          className="btn btn-primary btn-sm mt-5"
                          type="button"
                          onClick={() => {
                            getData(values, pageNo, pageSize);
                          }}
                          disabled={isLoading || loading}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {rowData?.data?.length > 0 && (
                    <div className="table-responsive">
                      <table
                        id="table-to-xlsx"
                        className={
                          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                        }
                      >
                        <thead>
                          <tr className="cursor-pointer">
                            {headers?.map((th, index) => {
                              return <th key={index}> {th} </th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                style={
                                  item?.isInventoryApprove
                                    ? { backgroundColor: "#d4edda" }
                                    : { backgroundColor: "#f8d7da" }
                                }
                              >
                                <td
                                  style={{ width: "40px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>{item?.program}</td>
                                <td>{item?.shipPointName}</td>
                                <td>{item?.vehicleRegNo}</td>
                                <td>{item?.driverName}</td>
                                <td>{item?.driverPhone}</td>
                                <td>{item?.shipToPartnerName}</td>
                                <td>{item?.address}</td>
                                <td>{_dateFormatter(item?.deliveryDate)}</td>
                                <td className="text-right">
                                  {item?.totalLogsticFare}
                                </td>
                                <td className="text-right">
                                  {item?.advanceLogisticeFare}
                                </td>
                                <td className="text-right">{item?.dueFare}</td>
                                <td className="text-right">
                                  {item?.totalDeliveryQuantity}
                                </td>

                                <td
                                  style={{ width: "80px" }}
                                  className="text-center"
                                >
                                  {
                                    <div className="d-flex justify-content-around">
                                      <span>
                                        <IEdit
                                          onClick={() => {
                                            history.push({
                                              pathname: `/vessel-management/allotment/challanentry/edit/${item?.deliveryId}`,
                                              state: values,
                                            });
                                          }}
                                        />
                                      </span>

                                      <span>
                                        <ICon
                                          title="View & Print"
                                          onClick={() => {
                                            getChallanById(
                                              item?.deliveryId,
                                              setChallanInfo,
                                              setLoading,
                                              () => setShow(true)
                                            );
                                          }}
                                        >
                                          <i class="fas fa-print"></i>
                                        </ICon>
                                      </span>
                                    </div>
                                  }
                                </td>
                                <td className="text-center">
                                  {!item?.isInventoryApprove ? (
                                    <span>
                                      <IApproval
                                        title="Approve"
                                        onClick={() =>
                                          // approveSubmitlHandler(
                                          //   item?.deliveryId,
                                          //   accId
                                          // )
                                          {
                                            if (values?.shipPoint) {
                                              setSingleItem(item);
                                              setOpen(true);
                                            } else {
                                              toast.warn(
                                                "Please select a shipPoint"
                                              );
                                            }
                                          }
                                        }
                                      />
                                    </span>
                                  ) : (
                                    <span>Approved</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {rowData?.data?.length > 0 && (
                    <PaginationTable
                      count={rowData?.totalCount}
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
                </form>
              </CardBody>
            </Card>

            {/* Challan Print */}
            <IViewModal show={show} onHide={() => setShow(false)}>
              <ChallanPrint challanInfo={challanInfo} />
            </IViewModal>

            {/* Warehouse Approve */}
            <IViewModal show={open} onHide={() => setOpen(false)}>
              <WarehouseApprove
                obj={{
                  formValues: values,
                  userId,
                  getData,
                  pageNo,
                  pageSize,
                  singleItem,
                  setOpen,
                }}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default ChallanTable;

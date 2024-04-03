/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICard from "../../../../_helper/_card";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import { inactivePrintedInfo } from "../helper";
import HologramPrint from "../print/hologram";
import HologramPrintForAkijCommodities from "../print/hologramForCommodities";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  search: "",
  channel: "",
  shipPoint: "",
  type: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const headers = [
  "SL",
  "Partner Name",
  "ShipPoint Name",
  "Sales Order Code",
  "Sales Order Date",
  "Reference Type",
  "Payment Term",
  "Approvement Status",
  "Delivery Status",
  "Action",
];

const HologramPrintLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [, getRowData, isLoading] = useAxiosGet();
  const [printData, getPrintData, IsLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permitted, getPermission] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const getData = (values, pageNo, pageSize, search) => {
    const SearchTerm = search ? `searchTerm=${search}&` : "";
    const url = `/oms/OManagementReport/GetSalesOrderPaginationForPrint?${SearchTerm}AccountId=${accId}&BUnitId=${buId}&ShipPointId=${values?.shipPoint?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&ReportTypeId=${values?.type?.value}&channelid=${values?.channel?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`;

    getRowData(url, (resData) => setRowData(resData));
  };

  useEffect(() => {
    getPermission(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${userId}&BusinessUnitId=${buId}&Type=YsnHologramPrint`
    );
  }, []);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize, "");
  };

  const paginationSearchHandler = (search, values) => {
    getData(values, pageNo, pageSize, search);
  };

  const inactiveHandler = (id, values) => {
    const obj = {
      title: "Are you Sure?",
      message: "Are you sure you want to make this unprinted?",
      yesAlertFunc: () => {
        inactivePrintedInfo(id, setLoading, () => {
          getData(values, pageNo, pageSize, "");
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(obj);
  };

  // const permittedPersonsForAccountsApprove = [
  //   1023, //Md. Raihan Kabir
  //   124921, //Md. Rasel Sarder
  //   521235, // Md. Monirul Islam
  // ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard title="Hologram Print">
              {(isLoading || IsLoading || loading) && <Loading />}

              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={[
                          { value: 1, label: "Unprinted" },
                          { value: 2, label: "Printed" },
                        ]}
                        value={values?.type}
                        label="Type"
                        onChange={(e) => {
                          setFieldValue("type", e);
                          setRowData([]);
                        }}
                        placeholder="Type"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPointDDL || []}
                        value={values?.shipPoint}
                        label="Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                        }}
                        placeholder="Shippoint"
                      />
                    </div>
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        region: false,
                        area: false,
                        territory: false,
                        allElement: false,
                      }}
                    />
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <IButton
                      onClick={() => {
                        getData(values, pageNo, pageSize, "");
                      }}
                      disabled={!(values?.type && values?.shipPoint)}
                    />
                  </div>
                </div>
                <div className="col-lg-3 mt-3">
                  <PaginationSearch
                    placeholder="Sales Order"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                {rowData?.data?.length > 0 && (
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
                          <tr key={index}>
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.soldToPartnerName}</td>
                            <td>{item?.shippointName}</td>
                            <td>{item?.salesOrderCode}</td>
                            <td>{_dateFormatter(item?.salesOrderDate)}</td>
                            <td>{item?.refferenceTypeName}</td>
                            <td>{item?.paymentTermsName}</td>
                            <td>
                              {item?.approved ? "Approved" : "Not approved"}
                            </td>
                            <td>
                              {item?.isDeliver ? "Delivered" : "Not delivered"}
                            </td>
                            <td
                              style={{ width: "80px" }}
                              className="text-center"
                            >
                              <div className="d-flex justify-content-around">
                                {permitted ? (
                                  values?.type?.value === 1 ? (
                                    <span>
                                      <ICon
                                        title="Print"
                                        onClick={() => {
                                          getPrintData(
                                            `/oms/OManagementReport/GetSalesOrderPrintCopy?SalesOrderId=${item?.salesOrderId}&UserId=${userId}&BusinessUnitId=${buId}`,
                                            () => {
                                              setShow(true);
                                            }
                                          );
                                        }}
                                      >
                                        <i class="fas fa-print"></i>
                                      </ICon>
                                    </span>
                                  ) : (
                                    <ICon
                                      title={"Make Unprinted"}
                                      onClick={() => {
                                        inactiveHandler(
                                          item?.salesOrderId,
                                          values
                                        );
                                      }}
                                    >
                                      <i class="fas fa-undo-alt"></i>
                                    </ICon>
                                  )
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
              <IViewModal show={show} onHide={() => setShow(false)}>
                {buId === 144 && (
                  // Akij Essential Ltd.
                  <HologramPrint setShow={setShow} printData={printData} />
                )}
                {buId === 221 && (
                  // Akij Commodities Ltd.
                  <HologramPrintForAkijCommodities
                    setShow={setShow}
                    printData={printData}
                  />
                )}
              </IViewModal>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default HologramPrintLanding;

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
import IApproval from "../../../../_helper/_helperIcons/_approval";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const initData = {
  search: "",
  channel: "",
  shipPoint: "",
  type: { value: 1, label: "Unprinted" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const headers = [
  "SL",
  "Partner Name",
  "ShipPoint Name",
  "Sales Order Code",
  "Order Amount",
  "Sales Order Date",
  "Reference Type",
  "Payment Term",
  "Approvement Status",
  "Delivery Status",
  "Action",
];

const permittedPersonsForAccountsApprove = [
  1023, //Md. Raihan Kabir
  124921, //Md. Rasel Sarder
  521235, // Md. Monirul Islam
];

const HologramPrintLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [, getRowData, isLoading] = useAxiosGet();
  const [printData, getPrintData, IsLoading] = useAxiosPut();
  const [show, setShow] = useState(false);
  const [showMutipleModal, setShowMultipleModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permitted, getPermission] = useAxiosGet();
  const [, approveSalesOrder, loader] = useAxiosPut();

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

    getRowData(url, (resData) => {
      const modifiedData = {
        ...resData,
        data: resData?.data?.map((item) => {
          return {
            ...item,
            isSelected: false,
            isSelectedPrint: false,
          };
        }),
      };
      setRowData(modifiedData);
    });
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
        inactivePrintedInfo(id, userId, setLoading, () => {
          getData(values, pageNo, pageSize, "");
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(obj);
  };

  const approveHandler = (values, item, type) => {
    const payload =
      type === "bulk"
        ? rowData?.data
            ?.filter((element) => element?.isSelected)
            ?.map((item) => item?.salesOrderId)
        : [item?.salesOrderId];

    const obj = {
      title: "Are you Sure?",
      message: "Are you sure you want to approve for print?",
      yesAlertFunc: () => {
        approveSalesOrder(
          `/oms/OManagementReport/ApproveUnprintedPaperDO?userId=${userId}&isApprove=true`,
          payload,
          () => {
            getData(values, pageNo, pageSize, "");
          },
          true
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(obj);
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;
    setRowData({ ...rowData, data: _data });
  };

  const allSelect = (value) => {
    let _data = [...rowData?.data];
    const modify = {
      ...rowData,
      data: _data.map((item) => {
        return {
          ...item,
          isSelected: item?.isPaperDOApproved ? false : value,
        };
      }),
    };
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.filter((x) => !x?.isPaperDOApproved)?.length
      ? true
      : false;
  };

  const LOADING = isLoading || IsLoading || loading || loader;

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
              {LOADING && <Loading />}

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
                <div className="d-flex justify-content-between mt-1">
                  <div>
                    <PaginationSearch
                      placeholder="Sales Order/Partner Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  <div>
                    {permittedPersonsForAccountsApprove?.includes(userId) &&
                      values?.type?.value === 1 &&
                      rowData?.data?.length > 0 && (
                        <button
                          type="button"
                          className={"btn btn-info  "}
                          disabled={
                            rowData?.data?.filter((e) => e?.isSelected)
                              ?.length < 1
                          }
                          onClick={() => {
                            approveHandler(values, {}, "bulk");
                          }}
                        >
                          Approve
                        </button>
                      )}
                    {// check isSelectedPrint than show print button
                    rowData?.data?.filter((e) => e?.isSelectedPrint)?.length >
                      0 && (
                      <button
                        type="button"
                        className={"btn btn-primary ml-2"}
                        onClick={() => {
                          const payload = rowData?.data
                            ?.filter((element) => element?.isSelectedPrint)
                            ?.map((item) => item?.salesOrderId);
                          setShowMultipleModal(true);
                          getPrintData(
                            `/oms/OManagementReport/GetMultipleSalesOrderPrintCopy?UserId=${userId}&BusinessUnitId=${buId}`,
                            payload,
                            () => {
                              setShowMultipleModal(true);
                            },
                            true
                          );
                        }}
                      >
                        Print
                      </button>
                    )}
                  </div>
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
                        {permittedPersonsForAccountsApprove?.includes(userId) &&
                          values?.type?.value === 1 &&
                          rowData?.data?.filter((e) => !e?.isPaperDOApproved)
                            ?.length > 0 && (
                            <th
                              onClick={() => allSelect(!selectedAll(), values)}
                              style={{ minWidth: "30px" }}
                            >
                              {
                                <input
                                  type="checkbox"
                                  value={selectedAll()}
                                  checked={selectedAll()}
                                  onChange={() => {}}
                                />
                              }
                            </th>
                          )}
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            {values?.type?.value === 1 &&
                              permittedPersonsForAccountsApprove?.includes(
                                userId
                              ) &&
                              rowData?.data?.filter(
                                (e) => !e?.isPaperDOApproved
                              )?.length > 0 && (
                                <td
                                  onClick={() => {
                                    rowDataHandler(
                                      "isSelected",
                                      index,
                                      !item.isSelected
                                    );
                                  }}
                                  className="text-center"
                                >
                                  {!item?.isPaperDOApproved && (
                                    <input
                                      type="checkbox"
                                      value={item?.isSelected}
                                      checked={item?.isSelected}
                                      onChange={() => {}}
                                    />
                                  )}
                                </td>
                              )}
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.soldToPartnerName}</td>
                            <td>{item?.shippointName}</td>
                            <td>{item?.salesOrderCode}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.totalOrderValue, true)}
                            </td>
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
                                    item?.isPaperDOApproved ? (
                                      <span
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          gap: "5px",
                                        }}
                                      >
                                        <ICon
                                          title="Print"
                                          onClick={() => {
                                            // getPrintData(
                                            //   `/oms/OManagementReport/GetSalesOrderPrintCopy?SalesOrderId=${item?.salesOrderId}&UserId=${userId}&BusinessUnitId=${buId}`,
                                            //   () => {
                                            //     setShow(true);
                                            //   }
                                            // );
                                            const payload = [
                                              item?.salesOrderId,
                                            ];
                                            getPrintData(
                                              `/oms/OManagementReport/GetMultipleSalesOrderPrintCopy?UserId=${userId}&BusinessUnitId=${buId}`,
                                              payload,
                                              () => {
                                                setShow(true);
                                              },
                                              true
                                            );
                                          }}
                                        >
                                          <i class="fas fa-print"></i>
                                        </ICon>
                                        <input
                                          type="checkbox"
                                          value={item?.isSelectedPrint}
                                          checked={item?.isSelectedPrint}
                                          onChange={() => {
                                            rowDataHandler(
                                              "isSelectedPrint",
                                              index,
                                              !item.isSelectedPrint
                                            );
                                          }}
                                        />
                                      </span>
                                    ) : (
                                      permittedPersonsForAccountsApprove?.includes(
                                        userId
                                      ) &&
                                      rowData?.data?.filter(
                                        (e) => e?.isSelected
                                      )?.length < 1 && (
                                        <span>
                                          <IApproval
                                            title={
                                              "Approve Sales Order for Print"
                                            }
                                            onClick={() => {
                                              approveHandler(
                                                values,
                                                item,
                                                "single"
                                              );
                                            }}
                                          />
                                        </span>
                                      )
                                    )
                                  ) : (
                                    permittedPersonsForAccountsApprove?.includes(
                                      userId
                                    ) && (
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

              {/*  single print modal */}
              <IViewModal
                show={show}
                onHide={() => {
                  setShow(false);
                  getData(values, pageNo, pageSize, "");
                }}
              >
                <CommonPrintComp
                  buId={buId}
                  printDataList={printData ? printData : []}
                />
              </IViewModal>

              {/* mutiple print modal */}
              <IViewModal
                show={showMutipleModal}
                onHide={() => {
                  setShowMultipleModal(false);
                  getData(values, pageNo, pageSize, "");
                }}
              >
                <CommonPrintComp buId={buId} printDataList={printData} />
              </IViewModal>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default HologramPrintLanding;

const CommonPrintComp = ({ buId, printDataList }) => {
  return (
    <>
      {buId === 144 && (
        // Akij Essential Ltd.
        <HologramPrint printDataList={printDataList} />
      )}
      {buId === 221 && (
        // Akij Commodities Ltd.
        <HologramPrintForAkijCommodities printDataList={printDataList} />
      )}
    </>
  );
};

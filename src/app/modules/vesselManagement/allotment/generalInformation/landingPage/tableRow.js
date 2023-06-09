import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../../_helper/_confirmModal";
// import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import TextArea from "../../../../_helper/TextArea";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { getMotherVesselDDL } from "../../tenderInformation/helper";
import {
  DeleteLighterAllotment,
  GetDomesticPortDDL,
  GetLighterAllotmentPagination,
} from "../helper";
import { getTotal } from "../../../common/helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import AttachFile from "../../../common/attachmentUpload";

const initData = {
  status: "",
  motherVessel: "",
  loadingPort: "",
  narration: "",
  commissionRate: 0.15,
};

export function LandingTableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [, motherVesselCommissionEntry, loader] = useAxiosPost();
  const [rowData, getRowData, isLoader, setRowData] = useAxiosGet();
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImage] = useState([]);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const setLandingData = (_pageNo, _pageSize, values) => {
    if (values?.status?.value === 1) {
      GetLighterAllotmentPagination(
        accId,
        buId,
        values?.motherVessel?.value,
        values?.loadingPort?.value,
        setGridData,
        setLoading,
        _pageNo,
        _pageSize
      );
    } else if ([2, 3].includes(values?.status?.value)) {
      getRowData(
        `/tms/LigterLoadUnload/PreDataForMotherVesselCommissionEntry?accountId=${accId}&businessUnitId=${buId}&motherVesselId=${values?.motherVessel?.value}`,
        (resData) => {
          const modifyData = resData?.map((item) => {
            return {
              ...item,
              isSelected: false,
              comissionRate: 0.15,
            };
          });
          setRowData(modifyData);
        }
      );
    }
  };

  useEffect(() => {
    setLandingData(pageNo, pageSize, initData);
    // getMotherVesselDDL(accId, buId, setMotherVesselDDL);
    GetDomesticPortDDL(setDomesticPortDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const commissionEntry = (values) => {
    const selectedItems = rowData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    const billTypeId =
      values?.status?.value === 2 ? 23 : values?.status?.value === 3 ? 19 : 0;
    const payload = {
      gtogHead: {
        billTypeId: billTypeId,
        accountId: accId,
        supplierId: 11841,
        supplierName: "Bangladesh International Shipping Corporation",
        sbuId: 68,
        unitId: buId,
        unitName: buName,
        billNo: "billNo",
        billDate: _todayDate(),
        paymentDueDate: _todayDate(),
        narration: values?.narration,
        billAmount: 1,
        plantId: 0,
        warehouseId: 0,
        actionBy: userId,
      },
      gtogRow: selectedItems?.map((item) => {
        return {
          accountId: accId,
          businessUnitId: buId,
          intSbuId: item?.sbuId,
          motherVesselId: item?.motherVesselId,
          actionby: userId,
          narration: values?.narration,
          challanNo: "string",
          deliveryId: 0,
          quantity: item?.quantity,
          ammount: 1,
          billAmount: 1,
          shipmentCode: "string",
          lighterVesselId: 0,
          numFreightRateUSD: item?.freightRate || 0,
          numFreightRateBDT: item?.freightRateBDT || 0,
          numCommissionRateBDT: +item?.comissionRate || 0.15,
          directRate: 0,
          dumpDeliveryRate: 0,
          damToTruckRate: 0,
          truckToDamRate: 0,
          lighterToBolgateRate: 0,
          bolgateToDamRate: 0,
          othersCostRate: 0,
        };
      }),

      image: uploadedImages?.map((image) => {
        return {
          imageId: image?.id,
        };
      }),
    };
    motherVesselCommissionEntry(
      `/wms/GTOGTransport/PostGTOGTransportBillEntry`,
      // `/tms/LigterLoadUnload/G2GMotherVesselComissionJournalEntry`,
      payload,
      () => {
        setLandingData(pageNo, pageSize, values);
      },
      true
    );
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  let totalQty = 0;

  return (
    <>
      {/* Table Start */}
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <>
            <form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={[
                      { value: 1, label: "General Information" },
                      { value: 2, label: "Mother Vessel Commission" },
                      { value: 3, label: "Mother Vessel Revenue Generate" },
                      // { value: 4, label: "Mother Vessel Cost Generate" },
                    ]}
                    value={values?.status}
                    label="Mother Vessel Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      setGridData([]);
                      setRowData([]);
                    }}
                    placeholder="Mother Vessel Status"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="loadingPort"
                    options={domesticPortDDL || []}
                    value={values?.loadingPort}
                    label="Loading Port"
                    onChange={(valueOption) => {
                      setFieldValue("loadingPort", valueOption);
                      setFieldValue("motherVessel", "");
                      getMotherVesselDDL(
                        accId,
                        buId,
                        setMotherVesselDDL,
                        valueOption?.value
                      );
                    }}
                    placeholder="Loading Port"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={[{ value: 0, label: "All" }, ...motherVesselDDL]}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(valueOption) => {
                      setFieldValue("motherVessel", valueOption);
                    }}
                    placeholder="Mother Vessel"
                  />
                </div>

                {rowData?.length > 0 && [2, 3].includes(values?.status?.value) && (
                  <>
                    <div className="col-lg-6">
                      <label>Narration</label>
                      <TextArea
                        placeholder="Narration"
                        value={values?.narration}
                        name="narration"
                        rows={3}
                      />
                    </div>
                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                    </div>
                  </>
                )}

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setLandingData(pageNo, pageSize, values);
                    }}
                    disabled={!(values?.loadingPort && values?.motherVessel)}
                  >
                    View
                  </button>
                </div>
              </div>
            </form>
            {rowData?.length > 0 &&
              [2, 3, 4].includes(values?.status?.value) && (
                <div className="row my-3">
                  <div className="col-lg-4">
                    <h4>
                      Total Quantity:{" "}
                      {_fixedPoint(
                        getTotal(rowData, "quantity", "isSelected"),
                        true,
                        0
                      )}
                    </h4>
                  </div>
                  <div className="col-lg-4">
                    {[3].includes(values?.status?.value) && (
                      <h4>
                        Total Amount:{" "}
                        {_fixedPoint(
                          getTotal(rowData, "quantity", "isSelected") *
                            getTotal(rowData, "freightRate", "isSelected") *
                            getTotal(rowData, "freightRateBDT", "isSelected"),
                          true
                        )}
                      </h4>
                    )}
                  </div>

                  <div className="col-lg-4 text-right">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        commissionEntry(values);
                      }}
                      disabled={
                        !values?.narration ||
                        rowData?.filter((item) => item?.isSelected)?.length <
                          1 ||
                        loader ||
                        loading
                      }
                    >
                      JV Create
                    </button>
                  </div>
                </div>
              )}{" "}
            {(loading || loader || isLoader) && <Loading />}
            {gridData?.data?.length > 0 && values?.status?.value === 1 && (
              <div className="row cash_journal">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Date</th>
                        <th>Mother Vessel</th>
                        <th>Loading Port</th>
                        <th>CNF</th>
                        <th>Program No</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => {
                        totalQty += item?.surveyQnt;
                        return (
                          <tr key={index}>
                            <td> {item?.sl}</td>
                            <td>{_dateFormatter(item?.alltmentDate)}</td>
                            <td>{item?.motherVesselName}</td>
                            <td>{item?.portName}</td>
                            <td>{item?.cnfname}</td>
                            <td>{item?.program}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.surveyQnt, true)}
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="text-center">
                                  <IView
                                    clickHandler={() =>
                                      history.push({
                                        pathname: `/vessel-management/allotment/generalinformation/view/${item?.allotmentNo}`,
                                      })
                                    }
                                  />
                                </span>
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/vessel-management/allotment/generalinformation/edit/${item?.allotmentNo}`
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span>
                                <span
                                  className="mr-1"
                                  onClick={() => {
                                    let confirmObject = {
                                      title: "Are you sure?",
                                      message:
                                        "Are you sure you want to delete this information",
                                      yesAlertFunc: async () => {
                                        DeleteLighterAllotment(
                                          item?.allotmentNo,
                                          setLoading,
                                          () => {
                                            setLandingData(
                                              pageNo,
                                              pageSize,
                                              values
                                            );
                                          }
                                        );
                                      },
                                      noAlertFunc: () => {
                                        "";
                                      },
                                    };
                                    IConfirmModal(confirmObject);
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {gridData?.data?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={6}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalQty, true)}
                          </td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setLandingData}
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
            )}
            {rowData?.length > 0 && [2, 3].includes(values?.status?.value) && (
              <div className="row cash_journal">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th
                          onClick={() => allSelect(!selectedAll())}
                          style={{ width: "30px" }}
                        >
                          <input
                            type="checkbox"
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>

                        <th style={{ width: "40px" }}>SL</th>
                        <th>Mother Vessel</th>
                        <th>Quantity</th>
                        <th>Total Freight (USD)</th>
                        <th>Conversion Rate (BDT)</th>
                        {[2].includes(values?.status?.value) && (
                          <th>Commission Rate</th>
                        )}
                        {[3].includes(values?.status?.value) && (
                          <th>Total Commission Amount</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => {
                        totalQty += item?.quantity;
                        return (
                          <tr key={index}>
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  "isSelected",
                                  index,
                                  !item.isSelected
                                );
                              }}
                              className="text-center"
                              style={
                                item?.isSelected
                                  ? {
                                      backgroundColor: "#aacae3",
                                      width: "30px",
                                    }
                                  : { width: "30px" }
                              }
                            >
                              <input
                                type="checkbox"
                                value={item?.isSelected}
                                checked={item?.isSelected}
                                onChange={() => {}}
                              />
                            </td>
                            <td className="text-center"> {index + 1}</td>{" "}
                            <td>{item?.motherVesselName}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.quantity, true, 0)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.freightRate, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.freightRateBDT, true)}
                            </td>
                            {[2].includes(values?.status?.value) && (
                              <td className="text-right">
                                <InputField
                                  name="billAmount"
                                  value={item?.comissionRate || ""}
                                  onChange={(e) => {
                                    if (+e.target.value < 0) return;
                                    rowDataHandler(
                                      "comissionRate",
                                      index,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                            )}
                            {[3].includes(values?.status?.value) && (
                              <td className="text-right">
                                {_fixedPoint(
                                  item?.freightRateBDT *
                                    item?.freightRate *
                                    item?.quantity,
                                  true
                                )}
                              </td>
                            )}
                            {/* <td className="text-right">
                              {_fixedPoint(
                                item?.quantity *
                                  +item?.freightRate *
                                  +item?.freightRateBDT *
                                  +item?.comissionRate,
                                true,
                                0
                              )}
                            </td> */}
                          </tr>
                        );
                      })}
                      {rowData?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={3}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalQty, true, 0)}
                          </td>
                          <td colSpan={3}></td>
                          {/* <td></td> */}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <AttachFile
              open={open}
              setOpen={setOpen}
              setUploadedImage={setUploadedImage}
            />
          </>
        )}
      </Formik>
    </>
  );
}

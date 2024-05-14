/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
  Card,
} from "../../../../../../_metronic/_partials/controls";
import { Formik } from "formik";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  getLocalVSForeignItemBridgeLandingData,
  inActiveLocalVSForeignItemBridge,
} from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  getPlantDDL,
  getWarehouseDDL,
} from "../../../../inventoryManagement/reports/itemTransferTransit/helper";
import InputField from "../../../../_helper/_inputField";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../../_helper/_tablePagination";
import { toast } from "react-toastify";

const header = ["SL", "Lot Size", "Min Order Quantity", "MRP", "Volume"];

const initData = {
  channel: "",
  plant: "",
  salesOrg: "",
  fromDate: "",
  toDate: "",
};

const LocalAndForeignItemBridgeTable = () => {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [channelList, getChannelList] = useAxiosGet();
  const [plantList, setPlantList] = useState([]);
  const [salesOrgList, setSalesOrgList] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo = 0, pageSize = 15) => {
    getLocalVSForeignItemBridgeLandingData(
      accId,
      buId,
      values?.salesOrg?.value,
      values?.channel?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setRowData,
      setLoading
    );
  };

  useEffect(() => {
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    getPlantDDL(accId, userId, buId, setPlantList);
  }, [accId, buId, userId]);

  const rowDataHandler = (index, key, value) => {
    let _data = [...rowData?.data];
    _data[index][key] = value;
    setRowData({ ...rowData, data: _data });
  };

  const allSelect = (value) => {
    let _data = [...rowData?.data];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData({ ...rowData, data: modify });
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.length
      ? true
      : false;
  };

  const inActiveHandler = (values) => {
    const selectedData = rowData?.data?.filter((item) => item?.isSelected);
    if (selectedData?.length < 1) {
      return toast.warn("Please select at least one row");
    }
    const payload = selectedData?.map((item) => ({
      itemId: item?.itemId,
      configId: item?.configId,
    }));

    if (payload?.length > 0) {
      inActiveLocalVSForeignItemBridge(payload, setRowData, () => {
        getData(values, pageNo, pageSize);
      });
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

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
              <CardHeader title="Local and Foreign Item Bridge">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          inActiveHandler(values);
                        }}
                        disabled={
                          rowData?.length < 1 ||
                          rowData?.data?.filter((item) => item?.isSelected)
                            ?.length < 1 ||
                          loading
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={() => {
                          history.push(
                            "/config/material-management/localnforeignitembridge/create"
                          );
                        }}
                        disabled={loading}
                      >
                        Create
                      </button>
                    </>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="global-form">
                    <div className="row">
                      <div className="col-md-3">
                        <NewSelect
                          name="channel"
                          options={channelList || []}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);
                          }}
                          placeholder="Select Distribution Channel"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="plant"
                          placeholder="Plant Name"
                          label="Plant Name"
                          value={values?.plant}
                          options={plantList || []}
                          onChange={(v) => {
                            setFieldValue("plant", v);
                            setFieldValue("salesOrg", "");
                            if (v?.value) {
                              getWarehouseDDL(
                                accId,
                                userId,
                                buId,
                                v?.value,
                                setSalesOrgList
                              );
                            }
                            setRowData([]);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <NewSelect
                          name="salesOrg"
                          options={salesOrgList || []}
                          value={values?.salesOrg}
                          label="Sales Organization"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrg", valueOption);
                          }}
                          placeholder="Select Sales Organization"
                          isDisabled={!values?.plant}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.fromDate}
                          label="From Date"
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                            setRowData([]);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.toDate}
                          label="To Date"
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                            setRowData([]);
                          }}
                        />
                      </div>

                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            getData(values);
                          }}
                          disabled={
                            loading ||
                            !values?.channel ||
                            !values?.salesOrg ||
                            !values?.fromDate ||
                            !values?.toDate
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {rowData?.data?.length > 0 && (
                    <div className="table-responsive">
                      <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr
                          style={
                            selectedAll() ? { backgroundColor: "#62a4d8" } : {}
                          }
                          onClick={() => allSelect(!selectedAll())}
                          className="cursor-pointer"
                        >
                          <th style={{ width: "40px" }}>
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                          {header.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, index) => {
                          return (
                            <tr
                              className="cursor-pointer"
                              key={index}
                              onClick={() => {
                                rowDataHandler(
                                  index,
                                  "isSelected",
                                  !item.isSelected
                                );
                              }}
                              style={
                                item?.isSelected
                                  ? { backgroundColor: "#aacae3" }
                                  : {}
                              }
                            >
                              <td
                                className="text-center"
                                style={{ width: "40px" }}
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isSelected}
                                  checked={item?.isSelected}
                                  onChange={() => {}}
                                />
                              </td>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.lotSize}</td>
                              <td>{item?.minOrderQuantity}</td>
                              <td>{item?.mrp}</td>
                              <td>{item?.volume}</td>
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
          </>
        )}
      </Formik>
    </>
  );
};

export default LocalAndForeignItemBridgeTable;

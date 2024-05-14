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
  createLocalAndForeignItemBridge,
  getItemVSForeignSaleOffice,
} from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  getPlantDDL,
  getWarehouseDDL,
} from "../../../../inventoryManagement/reports/itemTransferTransit/helper";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const header = ["SL", "Item Type", "Item Name"];

const initData = {
  channel: "",
  plant: "",
  salesOrg: "",
};

const LocalAndForeignItemBridgeForm = () => {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [channelList, getChannelList] = useAxiosGet();
  const [plantList, setPlantList] = useState([]);
  const [salesOrgList, setSalesOrgList] = useState([]);
  const history = useHistory();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values) => {
    getItemVSForeignSaleOffice(
      values?.channel?.value,
      values?.salesOrg?.value,
      buId,
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

  const createItemVsForeignSalesOffice = (values) => {
    const selectedRows = rowData?.filter((itm) => itm?.isSelected);
    if (selectedRows?.length === 0) {
      return toast.warn("Please select at least one row");
    }
    const payload = selectedRows?.map((item) => ({
      accountId: accId,
      businessUnitId: buId,
      salesOrganizationId: values?.salesOrg?.value,
      distributionChannel: values?.channel?.value,
      profitCenterId: item?.intProfitCenterId,
      productDivisionId: item?.intProductdivisionid,
      itemId: item?.intitemid,
      salesDescription: "",
      minOrderQuantity: item?.minOrderQuantity,
      lotSize: item?.declotSize,
      cogsglid: item?.intCogsglid,
      accruedCogsglid: item?.intAccruedCogsglid,
      revenueGlid: item?.intRevenueGlid,
      actionBy: userId,
      volume: item?.decVolume,
      taxItemId: item?.inttaxItemId,
      isActive: true,
      mrp: 1,
    }));
    createLocalAndForeignItemBridge(payload, setLoading, () => {
      getData(values);
    });
  };

  const rowDataHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
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
                        type="button"
                        onClick={() => {
                          history.goBack();
                        }}
                        className="btn btn-light"
                        disabled={loading}
                      >
                        <i className="fa fa-arrow-left"></i>
                        Back
                      </button>
                      <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={() => {
                          createItemVsForeignSalesOffice(values);
                        }}
                        disabled={
                          rowData?.filter((item) => item?.isSelected)?.length <
                            1 || loading
                        }
                      >
                        Submit
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

                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            getData(values);
                          }}
                          disabled={
                            loading || !values?.channel || !values?.salesOrg
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {rowData?.length > 0 && (
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
                        {rowData?.map((item, index) => {
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
                              <td>{item?.strItemType}</td>
                              <td>{item?.stritemname}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                   </div>
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

export default LocalAndForeignItemBridgeForm;

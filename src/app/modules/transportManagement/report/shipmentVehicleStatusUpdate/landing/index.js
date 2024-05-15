import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import IButton from "../../../../_helper/iButton";
import {
  CreatePurchasePartner,
  GetSupplierAndVehicleInfo_api,
  GetSupplierListDDL,
  UpdateBalance,
  getDistributionChannelDDL_api,
  getSalesOrderDetailInfo,
  productTypeUpdate,
} from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";

const initData = {
  customer: "",
  shipPointCode: "",
  shipPoint: "",
  remarks: "",
  distributionChannel: "",
  soCode: "",
  productType: "",
  reason: "",
  supplier: "",
  fuelStationName: "",
};

function ShipmentVehicleStatusUpdate() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
    GetSupplierListDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSupplierList
    );
  }, [selectedBusinessUnit, profileData]);

  const commonGridFunc = (values, type, isUpdateMassage) => {
    GetSupplierAndVehicleInfo_api(
      type,
      selectedBusinessUnit?.value,
      values?.shipPointCode,
      values?.shipPoint?.value,
      values?.customer?.value,
      profileData?.userId,
      values?.transportZone?.value || 0,
      values?.remarks || "",
      setGridData,
      setLoading,
      isUpdateMassage
    );
  };

  const getData = (values) => {
    getSalesOrderDetailInfo(
      values?.reportType?.value,
      selectedBusinessUnit?.value,
      values?.soCode,
      values?.shipPoint?.value || 0,
      values?.productType?.value,
      profileData?.userId,
      values?.reason || "no reason",
      values?.customer?.value,
      setGridData,
      setLoading
    );
  };

  const UpdateFuelStation = (values) => {
    const payload = {
      intId: 0,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intPartnerId: values?.supplier?.value,
      strPartnerShippointName: values?.fuelStationName,
      sl: 0,
    };
    CreatePurchasePartner(payload, setLoading);
  };

  const updateProductType = (values) => {
    const payload = [
      {
        deliverySummeryId: 0,
        businessUnitId: selectedBusinessUnit?.value,
        deliveryId: 0,
        deliveryCode: "",
        salesOrderNumber: values?.soCode,
        supplierId: 0,
        actionBy: profileData?.userId,
        qnt: 0,
        customerName: values?.customer?.label,
        delvAddress: "",
        delvDate: "2022-10-20T09:27:39.148Z",
        supportTypeId: 1,
        strProductType: values?.productType?.value,
        // process: true,
        process: false, // changed according to monirul islam vai
      },
    ];
    productTypeUpdate(payload, setLoading, () => {
      getData(values);
    });
  };

  // const rowDataHandler = (name, index, value) => {
  //   let _data = [...gridData];
  //   _data[index][name] = value;
  //   setGridData(_data);
  // };

  // const allSelect = (value) => {
  //   let _data = [...gridData];
  //   const modify = _data.map((item) => {
  //     return {
  //       ...item,
  //       isSelected: value,
  //     };
  //   });
  //   setGridData(modify);
  // };

  // const selectedAll = () => {
  //   return gridData?.length > 0 &&
  //     gridData?.filter((item) => item?.isSelected)?.length === gridData?.length
  //     ? true
  //     : false;
  // };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ ...initData }}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Shipment Vehicle Status Update"}>
                  <CardHeaderToolbar>
                    {[2, 3].includes(values?.reportType?.value) && (
                      <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={(e) => {
                          commonGridFunc(values, 2, true);
                        }}
                        disabled={!gridData?.length > 0}
                      >
                        Save
                      </button>
                    )}
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 2, label: "Vehicle Has To Out First" },
                          { value: 3, label: "Not Show In Bill Register" },
                          { value: 4, label: "Unbuild Amount Update" },
                          { value: 5, label: "Balance Update" },
                          { value: 6, label: "Sales Order Detail Info" },
                          {
                            value: 7,
                            label: "Sales Order Not Show In Dropdown",
                          },
                          { value: 8, label: "ShipPoint Change" },
                          { value: 9, label: "Product Type Change" },
                          { value: 10, label: "Fuel Station Tagging" },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("reportType", valueOption);
                          setFieldValue("customer", "");
                          setGridData([]);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.reportType?.value === 10 && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="supplier"
                            options={supplierList || []}
                            value={values?.supplier}
                            label="Supplier"
                            onChange={(valueOption) => {
                              setFieldValue("supplier", valueOption);
                              setFieldValue(
                                "fuelStationName",
                                valueOption?.label
                              );
                            }}
                            placeholder="Supplier"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            label="Fuel Station Name"
                            value={values?.fuelStationName}
                            name="fuelStationName"
                            placeholder="Fuel Station Name"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "fuelStationName",
                                e?.target?.value
                              );
                            }}
                          />
                        </div>
                      </>
                    )}
                    {values?.reportType?.value !== 10 && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="distributionChannel"
                            options={distributionChannelDDL}
                            value={values?.distributionChannel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
                              setFieldValue("distributionChannel", valueOption);
                              setFieldValue("customer", "");
                              setGridData([]);
                            }}
                            placeholder="Distribution Channel"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-3">
                          <div>
                            <label>Customer</label>
                            <SearchAsyncSelect
                              // isDisabled={!values?.distributionChannel}
                              selectedValue={values?.customer}
                              handleChange={(valueOption) => {
                                setFieldValue("customer", valueOption);
                                setGridData([]);
                              }}
                              placeholder="Search Customer"
                              loadOptions={(v) => {
                                const searchValue = v.trim();
                                if (searchValue?.length < 3) return [];
                                return axios
                                  .get(
                                    `/partner/PManagementCommonDDL/CustomerDDLByChannelId?SearchTerm=${searchValue}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${values?.distributionChannel?.value}`
                                    // `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${values?.distributionChannel?.value}`
                                  )
                                  .then((res) => res?.data);
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {[6, 7, 8, 9].includes(values?.reportType?.value) && (
                      <div className="col-lg-3">
                        <label>Sales Order Code</label>
                        <InputField
                          value={values?.soCode}
                          name="soCode"
                          placeholder="Sales Order Code"
                          type="text"
                        />
                      </div>
                    )}

                    {![4, 5, 6, 10].includes(values?.reportType?.value) && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipPoint"
                            options={shipPointDDL || []}
                            value={values?.shipPoint}
                            label="Shippoint"
                            onChange={(valueOption) => {
                              setFieldValue("shipPoint", valueOption);
                              setGridData([]);
                            }}
                            placeholder="Shippoint"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {[2, 3].includes(values?.reportType?.value) && (
                          <div className="col-lg-3">
                            <label>
                              {values?.reportType?.value === 3
                                ? "Challan Number"
                                : "Shippoint code"}
                            </label>
                            <InputField
                              value={values?.shipPointCode}
                              name="shipPointCode"
                              placeholder={
                                values?.reportType?.value === 3
                                  ? "Challan Number"
                                  : "Shippoint code"
                              }
                              type="text"
                              onChange={(e) => {
                                setFieldValue("shipPointCode", e.target.value);
                                setGridData([]);
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                    {[7, 8, 9].includes(values?.reportType?.value) && (
                      <div className="col-lg-3">
                        <label>Reason</label>
                        <InputField
                          value={values?.reason}
                          name="reason"
                          placeholder="Reason"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("reason", e.target.value);
                            setGridData([]);
                          }}
                        />
                      </div>
                    )}
                    {values?.reportType?.value === 9 && gridData?.length > 0 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="productType"
                          options={[
                            { value: "Bend", label: "Bend" },
                            { value: "Straight", label: "Straight" },
                          ]}
                          value={values?.productType}
                          label="Product Type"
                          onChange={(valueOption) => {
                            setFieldValue("productType", valueOption);
                            // setGridData([]);
                          }}
                          placeholder="Product Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}

                    {values?.reportType?.value !== 10 && (
                      <div className="col d-flex  align-items-end">
                        <button
                          type="button"
                          className="btn btn-primary mt-2"
                          onClick={() => {
                            setGridData([]);
                            if ([4, 5].includes(values?.reportType?.value)) {
                              UpdateBalance(
                                values?.customer?.value,
                                values?.reportType?.value,
                                setGridData,
                                setLoading
                              );
                            } else if (
                              [6, 7, 8, 9].includes(values?.reportType?.value)
                            ) {
                              getData(values);
                            } else {
                              commonGridFunc(values, 1);
                            }
                          }}
                          disabled={
                            !values?.customer ||
                            ([2, 3].includes(values?.reportType?.value) &&
                              !values?.shipPointCode)
                          }
                        >
                          View
                        </button>
                      </div>
                    )}
                    {[9, 10].includes(values?.reportType?.value) && (
                      <IButton
                        onClick={() => {
                          if (values?.reportType?.value === 10) {
                            UpdateFuelStation(values);
                          } else if (values?.reportType?.value === 9) {
                            updateProductType(values);
                          }
                        }}
                        disabled={
                          (values?.reportType?.value === 10 &&
                            (!values?.supplier || !values?.fuelStationName)) ||
                          (values?.reportType?.value === 9 &&
                            !values?.productType)
                        }
                      >
                        Save
                      </IButton>
                    )}
                    {/* <div className="col-lg-12">
                      <hr className="mb-0 mt-2" />
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="transportZone"
                        options={transportZoneDDL || []}
                        value={values?.transportZone}
                        label="Transport Zone"
                        onChange={(valueOption) => {
                          setFieldValue("transportZone", valueOption);
                        }}
                        placeholder="Transport Zone"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4">
                      <label>Remarks</label>
                      <InputField
                        value={values?.remarks}
                        name="remarks"
                        placeholder="Remarks"
                        type="text"
                      />
                    </div> */}
                  </div>

                  {gridData?.length > 0 ? (
                    [4, 5].includes(values?.reportType?.value) ? (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Partner ID</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Ledger Balance</th>
                            {values?.reportType?.value === 5 && (
                              <th>Difference Amount</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td> {item?.partnerid}</td>
                              <td> {item?.strBusinessPartnerCode}</td>
                              <td> {item?.strBusinessPartnerName}</td>
                              <td> {item?.amount} </td>
                              <td> {item?.Ledgerbalance}</td>
                              {values?.reportType?.value === 5 && (
                                <td> {item?.Ledgerbalance + item?.amount}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    ) : [2].includes(values?.reportType?.value) ? (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Status</th>
                            <th>Is Close</th>
                            <th>Is Active</th>
                            <th>Is Bill Submitted</th>
                            <th>Shipment Code</th>
                            <th>Shipment Date</th>
                            <th>Vehicle No.</th>
                            <th>Solution Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td> {item?.strStatus ? "True" : "False"}</td>
                              <td> {item?.isClose ? "True" : "False"}</td>
                              <td> {item?.isActive ? "True" : "False"}</td>
                              <td>
                                {" "}
                                {item?.isBillSubmited ? "True" : "False"}
                              </td>
                              <td> {item?.strShipmentCode}</td>
                              <td> {_dateFormatter(item?.dteShipmentDate)}</td>
                              <td> {item?.strVehicleNo}</td>
                              <td> {item?.strSolnFor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    ) : [3].includes(values?.reportType?.value) ? (
                      <div className="table-responsive">
                          <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Delivery Code</th>
                            <th>Delivery Date</th>
                            <th>ShipPoint Name</th>
                            {/* <th>Transport Zone Name</th> */}
                            <th>SoldToPartner Name</th>
                            <th>ShipToPartner Address</th>
                            <th>Supplier Name</th>
                            <th>Transport Zone Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td> {item?.strDeliveryCode}</td>
                              <td> {_dateFormatter(item?.dteDeliveryDate)}</td>
                              <td> {item?.strShipPointName}</td>
                              {/* <td> {item?.strTransportZoneName}</td> */}
                              <td> {item?.strSoldToPartnerName}</td>
                              <td> {item?.strShipToPartnerAddress}</td>
                              <td> {item?.strSupplierName}</td>
                              <td className="text-right">
                                {item?.numTransportZoneRate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    ) : (
                      <div className="table-responsive">
                         <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            {/* {values?.reportType?.value && (
                              <th
                                onClick={() => allSelect(!selectedAll())}
                                style={{ width: "40px" }}
                              >
                                <input
                                  type="checkbox"
                                  value={selectedAll()}
                                  checked={selectedAll()}
                                  onChange={() => {}}
                                />
                              </th>
                            )} */}
                            <th>SL</th>
                            <th>Product Type</th>
                            <th>Is Completed</th>
                            <th>Is Active</th>
                            <th>Is Approved</th>
                            <th>Un_Delivery Qty</th>
                            <th>Status</th>
                            <th>ShipPoint Name</th>
                            <th>Order Qty</th>
                            <th>Delivery Qty</th>
                            <th>Item Name</th>
                            <th>Sold To Partner Name</th>
                            <th>Sold To Partner Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              {/* {values?.reportType?.value && (
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
                                          width: "40px",
                                        }
                                      : { width: "40px" }
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    value={item?.isSelected}
                                    checked={item?.isSelected}
                                    onChange={() => {}}
                                  />
                                </td>
                              )} */}
                              <td style={{ width: "30px" }}> {index + 1}</td>
                              <td>
                                {/* {values?.reportType?.value === 9 ? (
                                  <NewSelect
                                    isClearable={false}
                                    name="productType"
                                    options={[
                                      { value: "Bend", label: "Bend" },
                                      { value: "Straight", label: "Straight" },
                                    ]}
                                    value={item?.productType}
                                    onChange={(e) => {
                                      rowDataHandler("productType", index, e);
                                    }}
                                  />
                                ) : (
                                  )} */}
                                {item?.strProductType}
                              </td>
                              <td> {item?.hIsCompleted ? "True" : "False"}</td>
                              <td> {item?.hisActive ? "True" : "False"}</td>
                              <td> {item?.hisApproved ? "True" : "False"}</td>
                              <td className="text-right">
                                {item?.rnumUndeliveryQuantity}
                              </td>
                              <td> {item?.statuses}</td>
                              <td> {item?.hstrShippointName}</td>
                              <td className="text-right">
                                {item?.rnumOrderQuantity}
                              </td>
                              <td className="text-right">
                                {item?.rnumDeliveredQuantity}
                              </td>
                              <td>{item?.rstrItemName}</td>
                              <td>{item?.hstrSoldToPartnerName}</td>
                              <td>{item?.hstrSoldToPartnerAddress}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    )
                  ) : null}
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default ShipmentVehicleStatusUpdate;

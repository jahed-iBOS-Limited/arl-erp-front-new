/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { getSBUDDL } from "../../../../transportManagement/report/productWiseShipmentReport/helper";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import TextArea from "../../../../_helper/TextArea";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  createJV,
  createTradeCommissionJV,
  getCommissionReport,
  getTradeCommissionData,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import IButton from "../../../../_helper/iButton";
import AttachFile from "../../../../_helper/commonInputFieldsGroups/attachemntUpload";

const header = (buId, values) => {
  const typeId = values?.type?.value;
  const H_one = [
    "SL",
    "Customer ID",
    "Customer Code",
    "Customer Name",
    "Address",
    "Region",
    "Area",
    "Territory",
    "Target Qty",
    "Delivery Quantity",
    "Achievement",
    "Commission",
  ];

  const H_two = [
    "SL",
    "Customer ID",
    "Customer Code",
    "Customer Name",
    "Address",
    "Party Status",
    "Payment Type",
    "Region",
    "Area",
    "Territory",
    "Target Qty",
    "Delivery Quantity",
    "Achievement",
    "Commission",
  ];

  if (buId === 144) {
    return H_one;
  } else if (typeId !== 8) {
    return H_two;
  } else if (typeId === 8) {
    return H_two.toSpliced(13, 0, "Commission Rate"); // here will work after namaz
  }
};

const initData = {
  type: "",
  month: "",
  year: "",
  commissionRate: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: "",
  channel: "",
  region: "",
  area: "",
  transactionHead: "",
  narration: "",
};

// Government subsidy ids for six business units - (bongo, batayon, arl traders, direct trading, daily trading, eureshia)
const ids = [8, 9, 10, 11, 12, 13];

const CommissionReportAndJVTable = () => {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [reportTypes, getReportTypes] = useAxiosGet([]);
  const [transactionHeads, getTransactionHeads] = useAxiosGet([]);
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, departmentId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getSBUDDL(accId, buId, setSbuDDL);
    getReportTypes(
      `/wms/WmsReport/GetCommissionTypeDDL?businessUnitId=${buId}`
    );
    getTransactionHeads(
      `/wms/WmsReport/GetBusinessTransactionDDL?businessUnitId=${buId}`
    );
  }, [accId, buId]);

  const getData = (values) => {
    const typeId = ids.includes(values?.type?.value) ? 8 : values?.type?.value;
    if ([5, 3, 6, 7, ...ids].includes(values?.type?.value)) {
      getTradeCommissionData(
        // values?.type?.value,
        typeId,
        accId,
        buId,
        values?.channel?.value,
        values?.region?.value || 0,
        values?.area?.value || 0,
        values?.fromDate,
        values?.toDate,
        userId,
        values?.commissionRate || 0,
        setRowData,
        setLoading
      );
    } else {
      getCommissionReport(
        accId,
        buId,
        values?.month?.value,
        values?.year?.value,
        values?.type?.value,
        userId,
        setRowData,
        setLoading
      );
    }
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

  // let totalQty = 0,
  //   totalCommission = 0,
  //   totalTargetQty = 0,
  //   totalAchievement = 0;

  const JVCrate = (values) => {
    if ([5, 7, ...ids].includes(values?.type?.value)) {
      const selectedItems = rowData?.filter((item) => item?.isSelected);
      const totalAmount = selectedItems?.reduce(
        (a, b) => a + +b?.commissiontaka,
        0
      );
      const commissionTypeId = ids.includes(values?.type?.value)
        ? 8
        : values?.type?.value;
      const payload = {
        header: {
          accountId: accId,
          unitId: buId,
          unitName: buName,
          sbuId: values?.sbu?.value,
          commissionId: values?.transactionHead?.value,
          commissionName: values?.transactionHead?.label,
          fromDate: values?.fromDate,
          toDate: values?.toDate,
          narration: values?.narration,
          totalAmmount: totalAmount,
          actionBy: userId,
          // commissionTypeId: values?.type?.value,
          commissionTypeId: commissionTypeId,
          commissionTypeName: values?.type?.label,
        },
        row: selectedItems?.map((item) => ({
          ...item,
          ammount: item?.commissiontaka,
          rowNaration: item?.rowNarration || "",
          isProcess: false,
        })),
        img: {
          imageId: uploadedImage[0]?.id,
        },
      };

      createTradeCommissionJV(payload, setLoading);
    } else {
      const payload = rowData?.filter((item) => item?.isSelected);
      createJV(
        payload,
        accId,
        buId,
        values?.month?.value,
        values?.year?.value,
        values?.type?.value === 1 ? 2 : 4,
        userId,
        setLoading,
        () => {}
      );
    }
  };

  const editCommission = (index, item, type) => {
    if (type === "cancel") {
      rowDataHandler(index, "isEdit", false);
      rowDataHandler(index, "commissiontaka", item?.tempCom);
    } else {
      rowDataHandler(index, "isEdit", false);
      rowDataHandler(index, "tempCom", item?.commissiontaka);
    }
  };

  const dateSetter = (values, setFieldValue) => {
    setFieldValue(
      "fromDate",
      _dateFormatter(new Date(values?.year?.value, values?.month?.value - 1, 1))
    );
    setFieldValue(
      "toDate",
      _dateFormatter(new Date(values?.year?.value, values?.month?.value, 0))
    );
  };

  const isDisabled = (values) => {
    return (
      loading ||
      (![5, ...ids].includes(values?.type?.value) &&
        !(values?.month?.value && values?.year?.value)) ||
      !values?.type ||
      (values?.type?.value === 5 && !values?.commissionRate)
    );
  };

  // department ids for creating journal vouchers
  const departmentIds = [299, 5, 3, 11, 357];

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
              <CardHeader title="Commission report and JV">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    {departmentIds.includes(departmentId) && (
                      <>
                        <button
                          className="btn btn-primary "
                          type="button"
                          onClick={() => {
                            JVCrate(values);
                          }}
                          disabled={
                            rowData?.filter((item) => item?.isSelected)
                              ?.length < 1 ||
                            loading ||
                            ([5, 7].includes(values?.type?.value) &&
                              !(
                                values?.sbu &&
                                values?.transactionHead &&
                                values?.fromDate &&
                                values?.toDate
                              )) ||
                            values?.type?.value === 6
                          }
                        >
                          JV Create
                        </button>
                      </>
                    )}
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
                          name="type"
                          options={reportTypes?.data}
                          value={values?.type}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("type", valueOption);
                            setRowData([]);
                            setFieldValue("month", "");
                            setFieldValue("year", "");
                          }}
                          placeholder="Select Report Type"
                        />
                      </div>
                      {[1, 3, 6, 7].includes(values?.type?.value) && (
                        <YearMonthForm
                          obj={{
                            values,
                            setFieldValue,
                            onChange: (allValues) => {
                              if (
                                values?.type?.value === 3 &&
                                allValues?.month &&
                                allValues?.year
                              ) {
                                dateSetter(allValues, setFieldValue);
                              }
                            },
                          }}
                        />
                      )}

                      {[5, 3, 6, 7, ...ids].includes(values?.type?.value) && (
                        <>
                          <RATForm
                            obj={{
                              setFieldValue,
                              values,
                              region: !ids.includes(values?.type?.value),
                              area: !ids.includes(values?.type?.value),
                              territory: false,
                            }}
                          />
                          <FromDateToDateForm
                            obj={{
                              values,
                              setFieldValue,
                              disabled: [3].includes(values?.type?.value),
                            }}
                          />
                          {[5, 3].includes(values?.type?.value) && (
                            <div className="col-lg-3">
                              <InputField
                                name="commissionRate"
                                label={`${
                                  values?.type?.value === 5 ? "Trade" : "Cash"
                                } Commission Rate`}
                                placeholder={`${
                                  values?.type?.value === 5 ? "Trade" : "Cash"
                                } Commission Rate`}
                                value={values?.commissionRate}
                              />
                            </div>
                          )}
                          {rowData?.length > 0 && values?.type?.value !== 6 && (
                            <>
                              <div className="col-md-3">
                                <NewSelect
                                  name="sbu"
                                  options={sbuDDL || []}
                                  value={values?.sbu}
                                  label="SBU"
                                  onChange={(valueOption) => {
                                    setFieldValue("sbu", valueOption);
                                  }}
                                  placeholder="Select SBU"
                                />
                              </div>
                              {!ids.includes(values?.type?.value) && (
                                <div className="col-md-3">
                                  <NewSelect
                                    name="transactionHead"
                                    options={transactionHeads?.data || []}
                                    value={values?.transactionHead}
                                    label="Transaction Head"
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        "transactionHead",
                                        valueOption
                                      );
                                    }}
                                    placeholder="Select Transaction Head"
                                  />
                                </div>
                              )}

                              <div className="col-lg-3">
                                <label>Narration</label>
                                <TextArea
                                  name="narration"
                                  placeholder="Narration"
                                  value={values?.narration}
                                  type="text"
                                />
                              </div>
                              <IButton
                                colSize={"col-lg-3"}
                                onClick={() => setOpen(true)}
                              >
                                Attach File
                              </IButton>
                              <AttachFile
                                obj={{
                                  open,
                                  setOpen,
                                  setUploadedImage,
                                }}
                              />
                            </>
                          )}
                        </>
                      )}
                      <div className="col-lg-3 text-right mt-5">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            getData(values);
                          }}
                          disabled={isDisabled(values)}
                        >
                          View
                        </button>
                      </div>
                      <div className="col-12"></div>
                      <div className="col-lg-4 mt-5">
                        <h6>
                          Selected party count:{" "}
                          {_fixedPoint(
                            rowData?.filter((item) => item?.isSelected)?.length,
                            true,
                            0
                          )}
                        </h6>
                      </div>
                      <div className="col-lg-4 mt-5">
                        <h6>
                          Total Delivery Qty (selected party):{" "}
                          {_fixedPoint(
                            rowData
                              ?.filter((item) => item?.isSelected)
                              ?.reduce((acc, cur) => acc + cur?.deliveryQty, 0),
                            true
                          )}
                        </h6>
                      </div>
                      <div className="col-lg-4 mt-5">
                        <h6>
                          Total Commission (selected party):{" "}
                          {_fixedPoint(
                            rowData
                              ?.filter((item) => item?.isSelected)
                              ?.reduce(
                                (acc, cur) => acc + cur?.commissiontaka,
                                0
                              ),
                            true
                          )}
                        </h6>
                      </div>
                    </div>
                  </div>
                </form>
                {rowData?.length > 0 && (
                  <table
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr
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
                        {header(buId, values).map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                        {values?.type?.value === 5 && (
                          <>
                            {/* <th>Narration</th> */}
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => {
                        // totalQty += item?.deliveryQty;
                        // totalCommission += item?.commissiontaka;
                        // totalTargetQty += item?.targetQty;
                        // totalAchievement += item?.achievement;

                        return (
                          <tr className="cursor-pointer" key={index}>
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  index,
                                  "isSelected",
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
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.customerId}</td>
                            <td>{item?.customerCode}</td>
                            <td>{item?.customerName}</td>
                            <td>{item?.customerAddress}</td>
                            {buId !== 144 && (
                              <>
                                <td>{item?.partyStatus}</td>
                                <td>{item?.paymentType}</td>
                              </>
                            )}

                            <td>{item?.region}</td>
                            <td>{item?.area}</td>
                            <td>{item?.territory}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.targetQty, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.deliveryQty, true, 4)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.achievement, true)}
                            </td>
                            {values?.type?.value === 8 && (
                              <td className="text-right">
                                {_fixedPoint(item?.commissionRate, true, 4)}
                              </td>
                            )}

                            <td
                              className="text-right"
                              style={{ width: "150px" }}
                            >
                              {item?.isEdit ? (
                                <InputField
                                  name="commissiontaka"
                                  value={item?.commissiontaka}
                                  type="number"
                                  onChange={(e) => {
                                    if (item?.constCom < e?.target?.value) {
                                      toast.warn(
                                        "You can't increase the value!"
                                      );
                                    } else {
                                      rowDataHandler(
                                        index,
                                        "commissiontaka",
                                        +e?.target?.value
                                      );
                                    }
                                  }}
                                />
                              ) : (
                                _fixedPoint(item?.commissiontaka, true, 4)
                              )}
                            </td>

                            {values?.type?.value === 5 && (
                              <>
                                {/* <td style={{ width: "100px" }}>
                                    <TextArea
                                      name="rowNarration"
                                      value={item?.rowNarration}
                                      type="text"
                                      onChange={(e) => {
                                        rowDataHandler(
                                          index,
                                          "rowNarration",
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  </td> */}
                                <td style={{ width: "40px" }}>
                                  <div className="d-flex justify-content-around">
                                    {!item?.isEdit ? (
                                      <span
                                        onClick={() => {
                                          rowDataHandler(index, "isEdit", true);
                                        }}
                                      >
                                        <IEdit title="Edit Commission Amount" />
                                      </span>
                                    ) : (
                                      <>
                                        <span
                                          onClick={() => {
                                            editCommission(index, item, "done");
                                          }}
                                        >
                                          <IApproval title="Done" />
                                        </span>
                                        <span
                                          onClick={() => {
                                            editCommission(
                                              index,
                                              item,
                                              "cancel"
                                            );
                                          }}
                                        >
                                          <ICon title="Cancel">
                                            <i class="fas fa-times-circle"></i>{" "}
                                          </ICon>
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                        <td
                          colSpan={buId === 144 ? 9 : 11}
                          className="text-right"
                        >
                          Total
                        </td>
                        <td>
                          {_fixedPoint(
                            rowData?.reduce(
                              (acc, cur) => acc + cur?.targetQty,
                              0
                            ),
                            true
                          )}
                        </td>
                        <td>
                          {_fixedPoint(
                            rowData?.reduce(
                              (acc, cur) => acc + cur?.deliveryQty,
                              0
                            ),
                            true
                          )}
                        </td>
                        <td>
                          {_fixedPoint(
                            rowData?.reduce(
                              (acc, cur) => acc + cur?.achievement,
                              0
                            ),
                            true
                          )}
                        </td>
                        {values?.type?.value === 8 && <td></td>}
                        <td>
                          {_fixedPoint(
                            rowData?.reduce(
                              (acc, cur) => acc + cur?.commissiontaka,
                              0
                            ),
                            true
                          )}
                        </td>
                        {values?.type?.value === 5 && <td></td>}
                      </tr>
                    </tbody>
                  </table>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default CommissionReportAndJVTable;

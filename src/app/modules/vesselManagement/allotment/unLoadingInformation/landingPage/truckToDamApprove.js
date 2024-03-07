/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  supplier: "",
  unloadedQty: "",
  dumpDeliveryRate: "",
  dumpDeliveryQty: "",
  directRate: "",
  directQty: "",
  deliveryOn: "",
  truckToDamQty: "",
  truckToDamRate: "",
  othersCostRate: "",
  date: _todayDate(),
};

const headers = [
  "SL",
  "Date",
  "Delivery On",
  "Truck to Damp Qty (ton)",
  "Truck to Damp Rate",
  "Amount",
  "Other Cost",
  "Total",
  "Action",
];

export default function TruckToDamApproveForm({
  getData,
  preValues,
  singleItem,
  pageNo,
  pageSize,
  setShow,
  levelOfApprove,
}) {
  const [rates, getRates, loading] = useAxiosGet();
  const [rows, setRows] = useState([]);
  const [, postData, loader] = useAxiosPost();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };

  useEffect(() => {
    const URLThree = `/tms/LigterLoadUnload/GetLighterLoadUnloadBillDetails?voyageId=${singleItem?.voyageNo}&lighterVesselId=${singleItem?.lighterVesselId}&shipPointId=${singleItem?.shipPointId}`;

    const URL = URLThree;

    getRates(URL, (resData) => {});
  }, []);

  const addRow = (values) => {
    const newRow = {
      rowId: 0,
      voyageNo: singleItem?.voyageNo,
      lighterVesselId: singleItem?.lighterVesselId,
      supplierId: values?.supplier?.value,
      billTypeId: 31,
      dumpQnt: values?.dumpDeliveryQty,
      dumpToTruckQnt: values?.dumpDeliveryQty,
      isActive: true,

      shipPointId: singleItem?.shipPointId,
      dumpToTruckRate: 0,
      dailyLaborAmount: 0,
      actionBy: userId,
      billRegisterId: 0,
      otherLaborPerson: 0,
      otherLaborRate: 0,
      othersCostRate: +values?.othersCostRate,
      truckToDumpQnt: +values?.truckToDamQty,
      truckToDumpRate: +values?.truckToDamRate,
      isDeliveryOnDay: values?.deliveryOn?.value,
      amount: +values?.truckToDamRate * +values?.truckToDamQty,
      total:
        +values?.truckToDamRate * +values?.truckToDamQty +
        +values?.othersCostRate,
      transactionDate: values?.date,
    };

    setRows([...rows, newRow]);
  };

  const removeRow = (index) => {
    rows.splice(index, 1);
    setRows([...rows]);
  };

  const approveSubmitHandler = () => {
    postData(
      `/tms/LigterLoadUnload/CreatTruckToDumpBill`,
      rows,
      () => {},
      true
    );
  };

  const getInitData = () => {
    const dataSetThree = {
      ...initData,
      ...rates,
      supplier: {
        value: rates?.supplierId,
        label: rates?.supplierName,
      },
      unloadedQty: _fixedPoint(singleItem?.receiveQnt, false, 2),
      dumpDeliveryRate: rates?.dumpRate,
      dumpDeliveryQty: rates?.dumpQnt,
      directRate: rates?.directRate,
      directQty: rates?.directQnt,
      othersCostRate: "",
    };

    return dataSetThree;
  };

  const title = `Truck to Dam Delivery Approve > ${singleItem?.shipPointName} -- ${singleItem?.lighterVesselName}`;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={getInitData()}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {(loading || loader) && <Loading />}
            <Card>
              <ModalProgressBar />
              <CardHeader title={title}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        approveSubmitHandler(values);
                      }}
                      className="btn btn-info"
                      disabled={!values?.supplier}
                    >
                      Approve
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <label>Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values?.supplier}
                          handleChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          loadOptions={loadOptions}
                          // isDisabled={levelOfApprove === "third" ? true : false}
                        />
                        <FormikError
                          errors={errors}
                          name="supplier"
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Unloaded Quantity"
                          placeholder="Unloaded Quantity"
                          value={values?.unloadedQty}
                          name="unloadedQty"
                          type="number"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Damp Rate"
                          placeholder="Damp Rate"
                          value={values?.dumpDeliveryRate}
                          name="dumpDeliveryRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("dumpDeliveryRate", e?.target?.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Damp Qty"
                          placeholder="Damp Qty"
                          value={values?.dumpDeliveryQty}
                          name="dumpDeliveryQty"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("dumpDeliveryQty", e?.target?.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Direct Rate"
                          placeholder="Direct Rate"
                          value={values?.directRate}
                          name="directRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("directRate", e?.target?.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Direct Qty (ton)"
                          placeholder="Direct Qty"
                          value={values?.directQty}
                          name="directQty"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("directQty", e?.target?.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className="col-lg-12"></div>
                      <div className="col-lg-3">
                        <InputField
                          label="Date"
                          placeholder="Date"
                          value={values?.date}
                          name="date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("date", e?.target?.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="deliveryOn"
                          options={[
                            { value: true, label: "Day" },
                            { value: false, label: "Night" },
                          ]}
                          value={values?.deliveryOn}
                          label="Delivery On"
                          onChange={(valueOption) => {
                            setFieldValue("deliveryOn", valueOption);
                          }}
                          placeholder="Delivery On"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Truck to Dam Qty (ton)"
                          placeholder="Truck to Dam Qty (ton)"
                          value={values?.truckToDamQty}
                          name="truckToDamQty"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("truckToDamQty", e?.target?.value);
                          }}
                        />
                      </div>{" "}
                      <div className="col-lg-3">
                        <InputField
                          label="Truck to Dam Rate"
                          placeholder="Truck to Dam Rate"
                          value={values?.truckToDamRate}
                          name="truckToDamRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("truckToDamRate", e?.target?.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Others Cost"
                          placeholder="Others Cost"
                          value={values?.othersCostRate}
                          name="othersCostRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("othersCostRate", e?.target?.value);
                          }}
                        />
                      </div>
                      <IButton
                        onClick={() => {
                          addRow(values);
                        }}
                      >
                        Add
                      </IButton>
                    </div>
                  </div>
                </form>
                <ICustomTable ths={headers}>
                  {rows?.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{_dateFormatter(item?.transactionDate)}</td>
                        <td>{item?.isDeliveryOnDay ? "Day" : "Night"}</td>
                        <td className="text-right">{item?.truckToDumpQnt}</td>
                        <td className="text-right">{item?.truckToDumpRate}</td>
                        <td className="text-right">{item?.amount}</td>
                        <td className="text-right">{item?.othersCostRate}</td>
                        <td className="text-right">{item?.total}</td>
                        <td className="text-center">
                          <IDelete remover={removeRow} id={index} />
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                    <td colSpan={3}>Total</td>
                    <td>
                      {rows?.reduce((a, b) => (a += +b?.truckToDumpQnt), 0)}
                    </td>
                    <td> </td>
                    <td>{rows?.reduce((a, b) => (a += +b?.amount), 0)}</td>
                    <td>
                      {rows?.reduce((a, b) => (a += +b?.othersCostRate), 0)}
                    </td>
                    <td> {rows?.reduce((a, b) => (a += +b?.total), 0)} </td>

                    <td></td>
                  </tr>
                </ICustomTable>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

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
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import AttachFile from "../../../common/attachmentUpload";
import { validationSchema } from "../helper";
import TextArea from "../../../../_helper/TextArea";
import { StockInToInventoryApproval } from "../../challanEntry/helper";

const initData = {
  supplier: "",
  unloadedQty: "",
  dumpDeliveryRate: "",
  directRate: "",
  bolgateToDamRate: "",
  damToTruckRate: "",
  lighterToBolgateRate: "",
  truckToDamRate: "",
  othersCostRate: "",
  totalBillAmount: "",
};

export default function WarehouseApproveFrom({
  getData,
  preValues,
  singleItem,
  pageNo,
  pageSize,
  setShow,
}) {
  const [rates, getRates, loading] = useAxiosGet();
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImage] = useState([]);
  const [, ghatBillFromWarehouseApprove, loader] = useAxiosPost();
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
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
    const param = `&shippointId=${singleItem?.shipPointId}`;
    // type === 1
    //   ? `&shippointId=${singleItem?.shipPointId}`
    //   : type === 2
    //   ? `&godownId=${values?.godown?.value}`
    //   : "";
    getRates(
      `/tms/LigterLoadUnload/GetGodownNOtherLabourRate?type=${1}&businessUnitId=${buId}${param}`,
      (resData) => {}
    );
  }, []);

  const approveSubmitHandler = (values) => {
    const payload = {
      gtogHead: {
        billTypeId: 22,
        accountId: accId,
        supplierId: values?.supplier?.value,
        supplierName: values?.supplier?.label,
        sbuId: 68,
        unitId: buId,
        unitName: buName,
        billNo: "billNo",
        billDate: _todayDate(),
        paymentDueDate: _todayDate(),
        narration: values?.narration,
        billAmount: +values?.totalBillAmount,
        plantId: 0,
        warehouseId: rates?.shippointId,
        actionBy: userId,
      },
      gtogRow: {
        voyageNo: singleItem?.voyageNo,
        challanNo: "string",
        deliveryId: singleItem?.rowId,
        quantity: +values?.unloadedQty,
        ammount: +values?.totalBillAmount,
        billAmount: +values?.totalBillAmount,
        shipmentCode: "string",
        motherVesselId: singleItem?.motherVesselId,
        lighterVesselId: singleItem?.lighterVesselId,
        numFreightRateUSD: 0,
        numFreightRateBDT: 0,
        numCommissionRateBDT: 0,
        directRate: +values?.directRate,
        dumpDeliveryRate: +values?.dumpDeliveryRate,
        damToTruckRate: +values?.damToTruckRate,
        truckToDamRate: +values?.truckToDamRate,
        lighterToBolgateRate: +values?.lighterToBolgateRate,
        bolgateToDamRate: +values?.bolgateToDamRate,
        othersCostRate: +values?.othersCostRate,
      },

      image: {
        imageId: uploadedImages[0]?.id,
      },
    };

    // ghatBillFromWarehouseApprove(
    //   `tms/LigterLoadUnload/StockInToInventoryApproval`,
    //   // `/wms/GTOGTransport/PostGTOGTransportBillEntry`,
    //   payload,
    //   () => {
    //     setShow(false);
    //     getData(preValues, pageNo, pageSize);
    //   },
    //   true
    // );

    // const payload = {
    //   voyageNo: singleItem?.voyageNo,
    //   lighterVesselId: singleItem?.lighterVesselId,
    //   actionBy: userId,
    //   motherVesselId: singleItem?.motherVesselId,
    //   ghatLabourSupplierId: values?.supplier?.value,
    //   ghatLabourSupplierName: values?.supplier?.label,
    //   ghatLabourRate: 0,
    // };
    StockInToInventoryApproval(payload, () => {
      setShow(false);
      getData(preValues, pageNo, pageSize);
    });
  };

  const setTotalAmount = (values, setFieldValue) => {
    const totalRates =
      +values?.directRate +
      +values?.dumpDeliveryRate +
      +values?.bolgateToDamRate +
      +values?.damToTruckRate +
      +values?.lighterToBolgateRate +
      +values?.truckToDamRate +
      +values?.othersCostRate;
    const totalAmount = +values?.unloadedQty * +totalRates;
    setFieldValue("totalBillAmount", totalAmount);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={{
          ...initData,
          supplier: {
            value: rates?.supplierId,
            label: rates?.supplierName,
          },
          unloadedQty: _fixedPoint(singleItem?.receiveQnt, true, 0),
          directRate: rates?.directRate,
          dumpDeliveryRate: rates?.dumpDeliveryRate,
          bolgateToDamRate: rates?.bolgateToDamRate,
          damToTruckRate: rates?.damToTruckRate,
          lighterToBolgateRate: rates?.lighterToBolgateRate,
          truckToDamRate: rates?.truckToDamRate,
          othersCostRate: rates?.othersCostRate,
        }}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {(loading || loader) && <Loading />}
            <Card>
              <ModalProgressBar />
              <CardHeader title={`Warehouse Approve (Unloading Information)`}>
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
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Damp Rate"
                          placeholder="Damp Rate"
                          value={values?.dumpDeliveryRate || ""}
                          name="dumpDeliveryRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("dumpDeliveryRate", e?.target?.value);
                            setTotalAmount(
                              { ...values, dumpDeliveryRate: e?.target?.value },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Direct Rate"
                          placeholder="Direct Rate"
                          value={values?.directRate || ""}
                          name="directRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("directRate", e?.target?.value);
                            setTotalAmount(
                              { ...values, directRate: e?.target?.value },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Bolgate to Dam Rate"
                          placeholder="Bolgate to Dam Rate"
                          value={values?.bolgateToDamRate || ""}
                          name="bolgateToDamRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("bolgateToDamRate", e?.target?.value);
                            setTotalAmount(
                              { ...values, bolgateToDamRate: e?.target?.value },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Dam to Truck Rate"
                          placeholder="Dam to Truck Rate"
                          value={values?.damToTruckRate || ""}
                          name="damToTruckRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("damToTruckRate", e?.target?.value);
                            setTotalAmount(
                              { ...values, damToTruckRate: e?.target?.value },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Lighter to Bolgate Rate"
                          placeholder="Lighter to Bolgate Rate"
                          value={values?.lighterToBolgateRate || ""}
                          name="lighterToBolgateRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "lighterToBolgateRate",
                              e?.target?.value
                            );
                            setTotalAmount(
                              {
                                ...values,
                                lighterToBolgateRate: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Truck to Dam Rate"
                          placeholder="Truck to Dam Rate"
                          value={values?.truckToDamRate || ""}
                          name="truckToDamRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("truckToDamRate", e?.target?.value);
                            setTotalAmount(
                              { ...values, truckToDamRate: e?.target?.value },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Others Cost Rate"
                          placeholder="Others Cost Rate"
                          value={values?.othersCostRate || ""}
                          name="othersCostRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("othersCostRate", e?.target?.value);
                            setTotalAmount(
                              { ...values, othersCostRate: e?.target?.value },
                              setFieldValue
                            );
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Total Bill Amount"
                          placeholder="Total Bill Amount"
                          value={values?.totalBillAmount}
                          name="totalBillAmount"
                          type="number"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
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
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
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

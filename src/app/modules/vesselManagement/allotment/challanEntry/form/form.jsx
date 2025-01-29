/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { BADCBCICForm, PortAndMotherVessel } from "../../../common/components";
import { getG2GMotherVesselLocalRevenueApi, validationSchema } from "../helper";
import AddVehicleNameModal from "./addVehicleNameModal";
import RestQtyModal from "./restQtyModal";
import RowSection from "./rowSection";

export default function _Form({
  buId,
  accId,
  addRow,
  rowData,
  viewType,
  initData,
  itemList,
  // godownDDL,
  deleteRow,
  lighterDDL,
  vehicleDDL,
  setRowData,
  saveHandler,
  shipPointDDL,
  setVehicleDDL,
  destinationDDL,
  motherVesselDDL,
  onChangeHandler,
  isTransportBill,
  organizationDDL,
}) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isRestQtyModalShow, setIsResetModalShow] = useState(false);
  const [logisticId, setLogisticId] = useState(null);
  // const [portDDL, getPortDDL] = useAxiosGet();
  const [altSuppliers, getaltSuppliers] = useAxiosGet();
  const [, getRates, loader] = useAxiosGet();
  const [restQty, getRestQty, restQtyLoader] = useAxiosGet();

  const { state } = useLocation();
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    // getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    getaltSuppliers(
      `/wms/TransportMode/GetTransportMode?intParid=2&intBusinessUnitId=${buId}`
    );
  }, []);

  const GetGodownAndOtherLabourRates = (type, values, setFieldValue) => {
    const param =
      type === 1
        ? `&shippointId=${values?.shipPoint?.value}`
        : type === 2
        ? `&godownId=${values?.godown?.value}`
        : "";
    getRates(
      `/tms/LigterLoadUnload/GetGodownNOtherLabourRate?type=${type}&businessUnitId=${buId}${param}`,
      (resData) => {
        if (type === 1) {
          setFieldValue("directRate", resData?.directRate);
          setFieldValue("dumpDeliveryRate", resData?.dumpDeliveryRate);
          // setFieldValue("transportRate", resData?.transportRate);
        } else if (type === 2) {
          setFieldValue("goDownUnloadLabourRate", resData?.unLoadLabourRate);
        }
      }
    );
  };

  const disableHandler = () => {
    return viewType === "view";
  };

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

  const commonItemPriceSet = (values, setFieldValue) => {
    const motherVesselId = values?.motherVessel?.value || 0;
    const portId = values?.port?.value || 0;
    const godownId = values?.godown?.value || 0;

    const partnerId =
      buId === 94
        ? values?.type === "badc"
          ? 73244
          : 73245
        : values?.organization?.value;
    console.log({ partnerId });
    getG2GMotherVesselLocalRevenueApi(
      accId,
      buId,
      partnerId,
      motherVesselId,
      portId,
      godownId,
      (data) => {
        setFieldValue("itemPrice", data?.itemRate || 0);
        setFieldValue("localRevenueRate", data?.localRevenueRate || 0);
        setFieldValue(
          "internationalRevenueRate",
          data?.motherVesselRevenueRate || 0
        );
        setFieldValue("transportRevenueRate", data?.transportRevenueRate || 0);
        setFieldValue("mothervasselFreightRate", data?.freightInBDT || 0);
      }
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={{ ...initData, ...state }}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {(loader || restQtyLoader) && <Loading />}
            <Card>
              <ModalProgressBar />
              <CardHeader title={id ? "Edit Challan" : "Challan Entry"}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    {viewType !== "view" && (
                      <button
                        type="reset"
                        onClick={() => {
                          resetForm(initData);
                          setRowData([]);
                        }}
                        className="btn btn-light ml-2"
                        disabled={viewType === "view"}
                      >
                        <i className="fa fa-redo"></i>
                        Reset
                      </button>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                      disabled={rowData?.length < 1}
                    >
                      Save 
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <h3
                    className="text-center mb-0 py-2"
                    style={{ backgroundColor: "#ffff8d" }}
                  >
                    Selected Mother Vessel: {values?.motherVessel?.label}
                  </h3>
                  <div className="global-form mt-0">
                    <div className="row">
                      {buId === 94 && (
                        <BADCBCICForm
                          values={{ ...values }}
                          setFieldValue={setFieldValue}
                          disabled={state?.type}
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
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={shipPointDDL}
                          value={values?.shipPoint}
                          label="ShipPoint"
                          onChange={(e) => {
                            onChangeHandler(
                              "shipPoint",
                              values,
                              e,
                              setFieldValue
                            );
                            GetGodownAndOtherLabourRates(
                              1,
                              { ...values, shipPoint: e },
                              setFieldValue
                            );
                          }}
                          placeholder="ShipPoint"
                          errors={errors}
                          touched={touched}
                          // isDisabled={disableHandler() || id}
                          isDisabled={disableHandler()}
                        />
                      </div>
                      <PortAndMotherVessel
                        obj={{
                          values,
                          setFieldValue,
                          allElement: false,
                          onChange: (fieldName, allValues) => {
                            onChangeHandler(
                              fieldName,
                              values,
                              allValues?.[fieldName],
                              setFieldValue
                            );
                          },
                        }}
                      />
                      {/* <div className="col-lg-3">
                        <NewSelect
                          name="port"
                          options={portDDL || []}
                          value={values?.port}
                          label="Port"
                          onChange={(e) => {
                            onChangeHandler("port", values, e, setFieldValue);
                          }}
                          placeholder="Port"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler()}
                          // isDisabled={disableHandler() || id}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="motherVessel"
                          options={motherVesselDDL || []}
                          value={values?.motherVessel}
                          label="Mother Vessel"
                          onChange={(e) => {
                            onChangeHandler(
                              "motherVessel",
                              values,
                              e,
                              setFieldValue
                            );
                            // if (values?.godown) {
                            //   commonItemPriceSet(
                            //     {
                            //       ...values,
                            //       motherVessel: e,
                            //     },
                            //     setFieldValue
                            //   );
                            // }
                          }}
                          placeholder="Mother Vessel"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler()}
                          // isDisabled={disableHandler() || id}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <InputField
                          label="Program No"
                          value={values?.programNo}
                          name="programNo"
                          type="text"
                          placeholder="Program No"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="lighterVessel"
                          options={lighterDDL}
                          value={values?.lighterVessel}
                          label="Lighter Vessel"
                          onChange={(e) => {
                            onChangeHandler(
                              "lighterVessel",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Lighter"
                          errors={errors}
                          touched={touched}
                          // isDisabled={disableHandler() || id}
                          isDisabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="logisticBy"
                          options={[
                            { value: 1, label: "Company" },
                            { value: 3, label: "Customer" },
                            { value: 2, label: "Supplier" },
                          ]}
                          value={values?.logisticBy}
                          label="Logistic By"
                          onChange={(e) => {
                            onChangeHandler(
                              "logisticBy",
                              values,
                              e,
                              setFieldValue
                            );
                            setLogisticId(e?.value);
                          }}
                          placeholder="Logistic By"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            disableHandler()
                            // || !isTransportBill?.hasTransport
                          }
                        />
                      </div>
                      {values?.logisticBy?.value === 1 && (
                        <div className="col-lg-3">
                          <label>Supplier Name</label>
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
                      )}
                      {[2, 3].includes(values?.logisticBy?.value) && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="supplier"
                            options={altSuppliers}
                            value={values?.supplier}
                            label="Supplier Name"
                            onChange={(e) => {
                              onChangeHandler(
                                "supplier",
                                values,
                                e,
                                setFieldValue
                              );
                            }}
                            placeholder="Supplier Name"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              disableHandler()
                              //  || !isTransportBill?.hasTransport ||
                              //   values?.logisticBy?.value === 3
                            }
                          />
                        </div>
                      )}
                      <div className="col-lg-3 d-flex">
                        <div style={{ width: "202px" }}>
                          <NewSelect
                            name="vehicle"
                            options={vehicleDDL}
                            value={values?.vehicle}
                            label="Vehicle Name"
                            onChange={(e) => {
                              onChangeHandler(
                                "vehicle",
                                values,
                                e,
                                setFieldValue
                              );
                            }}
                            placeholder="Vehicle Name"
                            errors={errors}
                            touched={touched}
                            isDisabled={disableHandler()}
                          />
                        </div>

                        <div
                          className="mt-7 pl-2"
                          onClick={() => {
                            setIsShowModal(true);
                          }}
                        >
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#3699FF",
                            }}
                            className="fa pointer fa-plus-circle"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Driver Name"
                          value={values?.driver}
                          name="driver"
                          type="text"
                          placeholder="Driver Name"
                          disabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Mobile No (Driver)"
                          value={values?.mobileNo}
                          name="mobileNo"
                          type="text"
                          placeholder="Mobile No"
                          disabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="godown"
                          // options={godownDDL || []}
                          options={destinationDDL || []}
                          value={values?.godown}
                          label="Destination/Godown Name"
                          placeholder="Destination/Godown Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler() || !values?.motherVessel}
                          onChange={(e) => {
                            onChangeHandler("godown", values, e, setFieldValue);
                            const partnerId =
                              buId === 94
                                ? state?.type === "badc"
                                  ? 73244
                                  : 73245
                                : values?.organization?.value;
                            if (e) {
                              getRestQty(
                                `/tms/LigterLoadUnload/GetTotalQuantityForChallan?businessUnitId=${buId}&businessPartnerId=${partnerId}&shipToPartnerId=${e?.value}&motherVesselId=${values?.motherVessel?.value}&portId=${values?.port?.value}`
                              );
                              GetGodownAndOtherLabourRates(
                                2,
                                { ...values, godown: e },
                                setFieldValue
                              );
                              if (values?.motherVessel) {
                                commonItemPriceSet(
                                  {
                                    ...values,
                                    godown: e,
                                  },
                                  setFieldValue
                                );
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="deliveryType"
                          options={[
                            { value: true, label: "Direct" },
                            { value: false, label: "Dump" },
                          ]}
                          value={values?.deliveryType}
                          label="Delivery Type"
                          placeholder="Delivery Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler()}
                          onChange={(e) => {
                            setFieldValue("deliveryType", e);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Delivery Address"
                          value={values?.address}
                          name="address"
                          type="text"
                          placeholder="Delivery Address"
                          disabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Delivery Date"
                          value={values?.deliveryDate}
                          name="deliveryDate"
                          type="date"
                          disabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Shipping challan no"
                          value={values?.shippingChallanNo}
                          name="shippingChallanNo"
                          type="text"
                          disabled={disableHandler()}
                          placeholder="Shipping challan no"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Transport Rate"
                          value={values?.transportRate}
                          name="transportRate"
                          type="number"
                          disabled={
                            disableHandler() || !isTransportBill?.hasTransport
                          }
                          placeholder="Transport Rate"
                        />
                      </div>{" "}
                      <div className="col-lg-3">
                        <InputField
                          label="GoDown Unload Labour Rate"
                          value={values?.goDownUnloadLabourRate}
                          name="goDownUnloadLabourRate"
                          type="number"
                          disabled={true}
                          placeholder="GoDown Unload Labour Rate"
                        />
                      </div>
                      {[1].includes(values?.logisticBy?.value) && (
                        <>
                          <div className="col-lg-3">
                            <InputField
                              label="Logistic Amount"
                              placeholder="Logistic Amount"
                              value={values?.logisticAmount}
                              name="logisticAmount"
                              type="number"
                              disabled={disableHandler()}
                              onChange={(e) => {
                                onChangeHandler(
                                  "logisticAmount",
                                  values,
                                  e,
                                  setFieldValue
                                );
                              }}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Advance Amount"
                              placeholder="Advance Amount"
                              value={values?.advanceAmount || 0}
                              name="advanceAmount"
                              type="number"
                              disabled={disableHandler()}
                              onChange={(e) => {
                                onChangeHandler(
                                  "advanceAmount",
                                  values,
                                  e,
                                  setFieldValue
                                );
                              }}
                            />
                          </div>

                          <div className="col-lg-3">
                            <InputField
                              label="Due Amount"
                              placeholder="Due Amount"
                              value={values?.dueAmount}
                              name="dueAmount"
                              type="number"
                              disabled={true}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-12"></div>
                      <div className="col-lg-4 mt-4">
                        <h5>
                          Rest Allotment Qty (Ton):{" "}
                          {restQty?.restAllotmentQntTon || 0}
                        </h5>
                        <h5>
                          Rest Allotment Qty (Bag):{" "}
                          {restQty?.restAllotmentQntBag || 0}
                        </h5>
                      </div>
                      <div className="col-lg-4 mt-4">
                        <h5>
                          Rest Vessel Program Qty (Ton):{" "}
                          {restQty?.restMVesselProgramQntTon || 0}
                        </h5>
                        <h5>
                          Rest Vessel Program Qty (Bag):{" "}
                          {restQty?.restMVesselProgramQntBag || 0}
                        </h5>
                      </div>
                      <div className="col-lg-4 mt-4">
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled={
                            !values?.port ||
                            !values?.motherVessel ||
                            !values?.godown
                          }
                          onClick={() => {
                            const partnerId =
                              buId === 94
                                ? state?.type === "badc"
                                  ? 73244
                                  : 73245
                                : values?.organization?.value;
                            getRestQty(
                              `/tms/LigterLoadUnload/GetTotalQuantityForChallan?businessUnitId=${buId}&businessPartnerId=${partnerId}&shipToPartnerId=${values?.godown?.value}&motherVesselId=${values?.motherVessel?.value}&portId=${values?.port?.value}`,
                              () => {
                                setIsResetModalShow(true);
                              }
                            );
                          }}
                        >
                          View Other Qty
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>

                <RowSection
                  obj={{
                    itemList,
                    values,
                    errors,
                    touched,
                    onChangeHandler,
                    setFieldValue,
                    disableHandler,
                    id,
                    rowData,
                    addRow,
                    state,
                    setRowData,
                    deleteRow,
                  }}
                />
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      <div>
        <IViewModal
          show={isShowModal}
          onHide={() => {
            setIsShowModal(false);
          }}
        >
          <AddVehicleNameModal
            setIsShowModal={setIsShowModal}
            logisticId={logisticId}
            setVehicleDDL={setVehicleDDL}
          />
        </IViewModal>

        <IViewModal
          show={isRestQtyModalShow && restQty}
          onHide={() => {
            setIsResetModalShow(false);
          }}
        >
          {<RestQtyModal restQty={restQty} />}
        </IViewModal>
      </div>
    </>
  );
}

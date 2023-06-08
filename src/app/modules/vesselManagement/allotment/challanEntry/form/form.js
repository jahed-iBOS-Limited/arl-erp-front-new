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
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import { BADCBCICForm } from "../../../common/components";
import { validationSchema } from "../helper";
import AddVehicleNameModal from "./addVehicleNameModal";
import Loading from "../../../../_helper/_loading";

const headers = ["SL", "Item Name", "Product Qty (Bag)", "Action"];

export default function _Form({
  buId,
  accId,
  addRow,
  rowData,
  viewType,
  initData,
  itemList,
  godownDDL,
  deleteRow,
  lighterDDL,
  vehicleDDL,
  setRowData,
  saveHandler,
  shipPointDDL,
  motherVesselDDL,
  onChangeHandler,
  setVehicleDDL,
}) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [logisticId, setLogisticId] = useState(null);
  const [portDDL, getPortDDL] = useAxiosGet();
  const [altSuppliers, getaltSuppliers] = useAxiosGet();
  const [, getRates, loader] = useAxiosGet();
  const { state } = useLocation();
  const { id } = useParams();

  const history = useHistory();
  useEffect(() => {
    getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
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
          setFieldValue("transportRate", resData?.transportRate);
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
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
            {loader && <Loading />}
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
                  <div className="global-form">
                    <div className="row">
                      <BADCBCICForm
                        values={{ ...values, ...state }}
                        setFieldValue={setFieldValue}
                        disabled={state?.type}
                        onChange={onChangeHandler}
                      />
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
                          isDisabled={disableHandler() || id}
                        />
                      </div>
                      <div className="col-lg-3">
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
                          isDisabled={disableHandler() || id}
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
                          }}
                          placeholder="Mother Vessel"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler() || id}
                        />
                      </div>
                      {/* <div className="col-lg-3">
                        <NewSelect
                          name="program"
                          options={allotmentDDL}
                          value={values?.program}
                          label="Program"
                          onChange={(e) => {
                            onChangeHandler(
                              "program",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Program"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler()}
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
                          isDisabled={disableHandler() || id}
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
                          isDisabled={disableHandler()}
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
                            isDisabled={disableHandler()}
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
                            style={{ fontSize: "15px", color: "#3699FF" }}
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
                          options={godownDDL || []}
                          value={values?.godown}
                          label="Destination/Godown Name"
                          placeholder="Destination/Godown Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler()}
                          onChange={(e) => {
                            onChangeHandler("godown", values, e, setFieldValue);
                            GetGodownAndOtherLabourRates(
                              2,
                              { ...values, godown: e },
                              setFieldValue
                            );
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
                          disabled={disableHandler()}
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
                      {/* {values?.deliveryType?.label && (
                        <div className="col-lg-3">
                          <InputField
                            label={`${values?.deliveryType?.label} Labour Rate`}
                            value={
                              values?.deliveryType?.label === "Direct"
                                ? values?.directRate
                                : values?.dumpDeliveryRate
                            }
                            name="labourRate"
                            type="number"
                            disabled={true}
                            placeholder={`${values?.deliveryType?.label} Labour Rate`}
                          />
                        </div>
                      )} */}
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
                    </div>
                  </div>
                </Form>
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-2">
                        <NewSelect
                          name="item"
                          options={itemList || []}
                          value={values?.item}
                          label="Item Name"
                          placeholder="Item Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                          onChange={(e) => {
                            onChangeHandler("item", values, e, setFieldValue);
                          }}
                        />
                      </div>

                      <div className="col-lg-2">
                        <InputField
                          label="Product Quantity (Bag)"
                          placeholder="Product Quantity (Bag)"
                          value={values?.quantity || 0}
                          name="quantity"
                          onChange={(e) => {
                            // setFieldValue("quantity", e?.target?.value);
                            onChangeHandler(
                              "quantity",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          type="text"
                          disabled={disableHandler() || id}
                        />
                      </div>

                      <div className="col-lg-4"></div>
                      <div className="col-lg-2">
                        <InputField
                          label="Empty Bag"
                          placeholder="Empty Bag"
                          value={values?.emptyBag || 0}
                          name="emptyBag"
                          type="text"
                          disabled={disableHandler()}
                          onChange={(e) => {
                            onChangeHandler(
                              "emptyBag",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-2 mt-5">
                        <h5>
                          Total Bag:{" "}
                          {rowData?.reduce((a, b) => (a += +b?.quantity), 0)}
                        </h5>
                      </div>

                      <div className="col-md-2 mt-5"></div>
                      <div className="col-md-2 mt-5  text-right">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            addRow(values, (rows) => {
                              // setFieldValue("item", "");
                              setFieldValue("quantity", "");
                              setFieldValue(
                                "emptyBag",
                                rows?.reduce((a, b) => (a += b?.emptyBag), 0)
                              );
                            });
                          }}
                          disabled={!values?.item || !values?.quantity || id}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-md-6">
                    {rowData?.length > 0 && (
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
                          {rowData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td
                                  style={{ width: "40px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>{item?.itemName}</td>
                                <td className="text-right" width="130px">
                                  {id ? (
                                    <InputField
                                      placeholder="Product QTY (Bag)"
                                      value={item?.quantity}
                                      name="quantity"
                                      onChange={(e) => {
                                        const value = e?.target?.value;
                                        const data = [...rowData];
                                        data[index].quantity = value;
                                        setRowData(data);
                                      }}
                                      type="number"
                                      style={{ textAlign: "right" }}
                                    />
                                  ) : (
                                    item?.quantity
                                  )}
                                </td>

                                {!id && (
                                  <td
                                    style={{ width: "80px" }}
                                    className="text-center"
                                  >
                                    {
                                      <div className="d-flex justify-content-around">
                                        <span
                                          onClick={() => {
                                            deleteRow(index, (rows) => {
                                              setFieldValue(
                                                "emptyBag",
                                                rows?.reduce(
                                                  (a, b) => (a += b?.emptyBag),
                                                  0
                                                )
                                              );
                                            });
                                          }}
                                        >
                                          <IDelete />
                                        </span>
                                      </div>
                                    }
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
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
      </div>
    </>
  );
}

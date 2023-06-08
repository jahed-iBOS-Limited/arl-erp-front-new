import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomTable from "../../../../_helper/_customTable";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { shipmentInfoUpdate, UpdateManualChallanInfo } from "../helper";

const ths = [
  "Ship To Party",
  "Address",
  "Challan No",
  "Manual Challan No",
  "Reason",
  "Sales Order No",
  "Item Code",
  "Product Name",
  "UoM Name",
  "Qty",
];

const AddManualChallanNo = ({ rowData, setOpen, type }) => {
  const [rows, setRows] = useState(rowData);
  const [loading, setLoading] = useState(false);
  const [vehicleDDL, getVehicleDDL] = useAxiosGet();

  const {
    profileData: { userId, accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (type === "update") {
      getVehicleDDL(
        `/tms/Vehicle/GetAvailableVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const rowDataHandler = (name, index, value) => {
    const newRows = [...rowData];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const saveHandler = (values) => {
    if (type === "challan") {
      const payload = rows?.map((item, i) => {
        return {
          userId: userId,
          deliveryId: item?.deliveryId,
          intBusinessUnitId: buId,
          manualChallanNo: item?.manualChallanNo,
          updatedBy: userId,
          updateDate: _todayDate(),
          reasson: item?.reason,
        };
      });
      UpdateManualChallanInfo(payload, setLoading, () => {
        setOpen(false);
      });
    } else {
      const payload = {
        shipmentId: rowData?.shipmentId,
        vehicleId: values?.vehicle?.veichleId,
        vehicleName: values?.vehicle?.label,
        laborSupplierId: [1].includes(values?.ownerType?.value)
          ? values?.laborSupplier?.value
          : 0,
        laborSupplierName: [1].includes(values?.ownerType?.value)
          ? values?.laborSupplier?.label
          : "",
        supplierId: [2].includes(values?.ownerType?.value)
          ? values?.supplier?.value
          : 0,
        supplierName: [2].includes(values?.ownerType?.value)
          ? values?.supplier?.label
          : "",
      };
      shipmentInfoUpdate(payload, setLoading, () => {
        setOpen(false);
      });
    }
  };

  let totalQuantity = 0;

  return (
    <>
      {loading && <Loading />}
      <div className="text-right mt-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            saveHandler({});
          }}
        >
          Done
        </button>
      </div>
      {type === "update" && (
        <Formik
          enableReinitialize={true}
          initialValues={{
            ownerType: {
              value: rowData?.intOwnerType,
              label: rowData?.strOwnerType,
            },
            vehicle: { value: rowData?.vehicleId, label: rowData?.vehicleName },
            supplier: {
              value: rowData?.supplierId,
              label: rowData?.supplierName,
            },
            laborSupplier: {
              value: rowData?.laborSupplierId,
              label: rowData?.laborSupplierName,
            },
          }}
        >
          {({ values, setFieldValue }) => (
            <>
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="ownerType"
                        options={[
                          { value: 1, label: "Company" },
                          { value: 2, label: "Rental" },
                          { value: 3, label: "Customer" },
                        ]}
                        value={values?.ownerType}
                        label="Owner Type"
                        onChange={(e) => {
                          setFieldValue("ownerType", e);
                        }}
                        placeholder="Owner Type"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="vehicle"
                        options={vehicleDDL || []}
                        value={values?.vehicle}
                        label="Vehicle"
                        onChange={(e) => {
                          setFieldValue("vehicle", e);
                        }}
                        placeholder="Vehicle"
                      />
                    </div>

                    {[2].includes(values?.ownerType?.value) && (
                      <div className="col-lg-3">
                        <label>Vehicle Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values?.supplier}
                          handleChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          placeholder={"Supplier"}
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 2) return [];
                            return axios
                              .get(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                    )}

                    {[1].includes(values?.ownerType?.value) && (
                      <div className="col-lg-3">
                        <label>Labor Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values.laborSupplier}
                          handleChange={(valueOption) => {
                            setFieldValue("laborSupplier", valueOption);
                          }}
                          loadOptions={(v) => {
                            if (v.length < 3) return [];
                            return axios
                              .get(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
                              )
                              .then((res) => {
                                const updateList = res?.data.map((item) => ({
                                  ...item,
                                }));
                                return updateList;
                              });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      )}

      {type === "challan" && (
        <ICustomTable ths={ths}>
          {rows?.map((itm, i) => {
            totalQuantity += itm?.quantity;
            return (
              <tr key={i}>
                <td>
                  <div className="text-left">{itm?.customerName} </div>
                </td>
                <td> {itm?.customerAddress}</td>
                <td> {itm?.deliveryCode}</td>
                <td>
                  <InputField
                    name={itm?.manualChallanNo}
                    placeholder="Manual Challan No"
                    value={itm?.manualChallanNo}
                    onChange={(e) => {
                      rowDataHandler("manualChallanNo", i, e?.target?.value);
                    }}
                  />
                </td>
                <td>
                  <InputField
                    name="reason"
                    placeholder="Reason"
                    value={itm?.reason}
                    onChange={(e) => {
                      rowDataHandler("reason", i, e?.target?.value);
                    }}
                  />
                </td>
                <td> {itm?.salesOrderCode}</td>
                <td className="text-center"> {itm?.itemCode}</td>
                <td>
                  {[144, 188, 189].includes(buId)
                    ? itm?.itemSalesName
                    : itm?.itemName}
                </td>
                <td>{itm?.uomName}</td>
                <td className="text-center">{itm?.quantity}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="9" className="text-left">
              <p className="text-left m-0 ml-1">
                <b>Total Quantity:</b>
              </p>
            </td>
            <td className="text-center">
              <b>{totalQuantity}</b>
            </td>
          </tr>
        </ICustomTable>
      )}
    </>
  );
};

export default AddManualChallanNo;

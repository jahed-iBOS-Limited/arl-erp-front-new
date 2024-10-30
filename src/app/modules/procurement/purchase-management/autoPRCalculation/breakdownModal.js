/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {
  supplierName: "",
  supplierContactNo: "",
  supplierEmail: "",
};
export default function BreakDownModal({ singleRowData }) {
  const [objProps, setObjprops] = useState({});
  const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
  const [
    warehouseListDDL,
    getWarehouseListDDL,
    warehouseListDDLloader,
  ] = useAxiosGet();
  const [rowData, setRowData] = useState([]);

  const [, saveRowData] = useAxiosPost();
  const [
    detailsData,
    getDetailsData,
    loader,
    setGetDetailsData,
  ] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getPlantListDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${
        profileData?.userId
      }&AccId=${profileData?.accountId}&BusinessUnitId=${4}&OrgUnitTypeId=7`
    );
    if (singleRowData?.prCalculationHeaderId) {
      getDetailsData(
        `/procurement/AutoPurchase/GetPRCalculationRowLanding?PrcalculationHeaderId=${singleRowData?.prCalculationHeaderId}`,
        (data) => {
          setRowData(data);
        }
      );
    }
  }, []);
  const addHandler = (values, setFieldValue) => {
    const closingBlance = Math.abs(
      singleRowData?.availableStock - singleRowData?.firstMonthQty
    );

    if (!values?.plant) {
      toast.warn("Plant is Required");
      return;
    }
    if (!values?.warehouse) {
      toast.warn("Warehouse is Required");
      return;
    }
    if (!values?.purchaseRequestDate) {
      toast.warn("Schedule Date is Required");
      return;
    }
    if (!values?.quantity) {
      toast.warn("Breakdown Quantity is Required");
      return;
    }

    const exists = rowData?.some(
      (item) =>
        item?.itemId === singleRowData?.itemId && // Check for itemId
        item?.plantId === values.plant?.value &&
        item?.warehouseId === values.warehouse?.value &&
        _dateFormatter(item?.purchaseRequestDate) ===
          values?.purchaseRequestDate
    );
    if (exists) {
      toast.warn(
        "Item with the same Plant, Warehouse and Schedule Date already exists"
      );
      return;
    }

    const data = {
      prcalculationHeaderId: singleRowData?.prCalculationHeaderId,
      purchaseRequestDate: values?.purchaseRequestDate,
      itemId: singleRowData?.itemId,
      itemCode: singleRowData?.itemCode || "",
      itemName: singleRowData?.itemName,
      itemCategoryId: singleRowData?.itemCategoryId,
      itemSubCategoryId: singleRowData?.itemSubCategoryId,
      uoMid: singleRowData?.uoMId,
      requestQuantity: +values?.quantity,
      plantId: values?.plant?.value,
      plantName: values?.plant?.label,
      warehouseId: values?.warehouse?.value,
      warehouseName: values?.warehouse?.label,
      actionBy: profileData?.userId,
      narration: values?.narration || "",
    };
    const totalClosingBalance =
      rowData?.reduce((acc, itm) => acc + itm?.requestQuantity, 0) +
      +values?.quantity;
    if (totalClosingBalance > closingBlance) {
      toast.warn(`You don not add Grater then ${closingBlance}`);
      return;
    }
    setRowData([data, ...rowData]);
    setFieldValue("quantity", "");
    setFieldValue("narration", "");
  };

  const removeHandler = (index) => {
    let newRowData = rowData.filter((item, i) => index !== i);
    setRowData(newRowData);
  };

  const saveHandler = (values, cb) => {
    if (rowData?.length < 1) {
      toast.warn("Please add atleast 1 row");
      return;
    }
    const payload = rowData?.map((itm) => {
      return {
        ...itm,
      };
    });
    saveRowData(
      `/procurement/AutoPurchase/CreatePRCalculationRow`,
      payload,
      () => {
        getDetailsData(
          `/procurement/AutoPurchase/GetPRCalculationRowLanding?PrcalculationHeaderId=${singleRowData?.prCalculationHeaderId}`,
          (data) => {
            setRowData(data);
          }
        );
      },
      true
    );
  };

  const calculateRemainingBalance = (singleRowData, rowData, values) => {
    const closingBalance =
      singleRowData?.availableStock - singleRowData?.firstMonthQty || 0;

    const totalRequestedQuantity = rowData?.reduce(
      (acc, item) => acc + (item?.requestQuantity || 0),
      0
    );

    const newRequestedQuantity = +values?.quantity || 0;

    const remainingBalance =
      closingBalance - (totalRequestedQuantity + newRequestedQuantity);

    return remainingBalance > 0 ? remainingBalance?.toFixed(2) : 0;
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(plantListDDLloader || warehouseListDDLloader || loader) && (
            <Loading />
          )}
          <IForm
            isHiddenBack
            isHiddenReset
            customTitle="Break Down"
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantListDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(v) => {
                      if (v) {
                        setFieldValue("plant", v);
                        getWarehouseListDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${singleRowData?.businessUnitId}&PlantId=${v?.value}&OrgUnitTypeId=8`
                        );
                      } else {
                        setFieldValue("plant", "");
                      }
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseListDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(v) => {
                      setFieldValue("warehouse", v);
                    }}
                    placeholder="Warehouse"
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Schedule Date"
                    value={values?.purchaseRequestDate}
                    name="purchaseRequestDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    label="Breakdown Quantity"
                    name="quantity"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value > 0) {
                        setFieldValue("quantity", e.target.value);
                      } else {
                        setFieldValue("quantity", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    name="narration"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("narration", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop: "18px",
                      marginLeft: "5px",
                    }}
                    onClick={() => {
                      addHandler(values, setFieldValue);
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="col-lg-12 d-flex">
                  <p
                    style={{
                      fontSize: "14px",
                      marginTop: "8px",
                    }}
                  >
                    Item:{" "}
                    {`${singleRowData?.itemName}[${singleRowData?.itemCode}], ` ||
                      ""}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      marginTop: "8px",
                      marginLeft: "4px",
                    }}
                  >
                    Remaining Quantity:{" "}
                    {calculateRemainingBalance(singleRowData, rowData, values)}
                  </p>
                </div>
              </div>
              <div>
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Schedule Date</th>
                        <th>Breakdown Quantity</th>
                        <th>Narration</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.plantName}</td>
                            <td>{item?.warehouseName}</td>
                            <td className="text-center">
                              {item?.purchaseRequestDate
                                ? _dateFormatter(item?.purchaseRequestDate)
                                : ""}
                            </td>
                            <td className="text-center">
                              {item?.requestQuantity}
                            </td>
                            <td className="text-center">
                              {item?.narration || ""}
                            </td>

                            <td>
                              {!item?.prcalculationRowId && (
                                <IDelete remover={removeHandler} id={index} />
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

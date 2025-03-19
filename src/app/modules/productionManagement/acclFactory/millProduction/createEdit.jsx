import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import TextArea from "../../../_helper/TextArea";
import IClose from "../../../_helper/_helperIcons/_close";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";

const initData = {
  dteDate: _todayDate(),
  shift: "",
  plant: "",
  shopFloor: "",
  mill: "",
  productType: "",
  strUomname: "",
  numRunningHour: "",
  numQuantity: "",
  strRemarks: "",
  breakdownType: "",
  bom: "",
};

export default function MillProductionCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  const [plant, getPlant, plantLoader] = useAxiosGet();
  const [shopFloor, getShopFloor, shopFloorLoader] = useAxiosGet();
  const [mill, getMill, millLoader] = useAxiosGet();
  const [itemDDL, getItemDDL, itemDDLLoader, setItemDDL] = useAxiosGet();
  const [shiftDDL, getShiftDDL, shiftDDLLoader] = useAxiosGet();
  const [
    materialIssueDetails,
    getMaterialIssueDetails,
    materialIssueDetailsLoader,
    setMaterialIssueDetails,
  ] = useAxiosGet();
  const [bom, getBom, bomLoader] = useAxiosGet();
  const [, postData, dataLoader] = useAxiosPost();
  const { id } = useParams();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { userId, accountId } = profileData;

  const getRemainingBreakdown = (values) => {
    return rowData?.reduce((acc, curr) => {
      return acc + curr?.numBreakdownHour;
    }, 0);
  };
  useEffect(() => {
    getPlant(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );

    getShiftDDL(
      `/mes/MesDDL/GetProductionShiftDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, accountId, selectedBusinessUnit?.value]);
  const saveHandler = (values, cb) => {
    const payload = {
      sl: 0,
      intMillProductionId: 0,
      intAccountId: accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      dteDate: values?.dteDate,
      intShiftId: values?.shift?.value || 0,
      strShiftName: values?.shift?.label || "",
      intPlantId: values?.plant?.value,
      strPlantName: values?.plant?.label,
      intMillId: values?.mill?.value,
      strMillName: values?.mill?.label,
      intShopFloorId: values?.shopFloor?.value,
      strShopFloorName: values?.shopFloor?.label,
      intProductTypeId: values?.productType?.value,
      strProductTypeName: values?.productType?.label,
      intBomid: values?.bom?.value,
      strBomname: values?.bom?.label,
      numRunningHour: +values?.numRunningHour,
      numQuantity: +values?.numQuantity,
      strRemark: values?.strRemarks,
      intActionBy: userId,
      intUomid: values?.intUomid,
      strUomName: values?.strUomname,
      row: rowData,
    };
    postData(`/mes/MSIL/CreateAndEditMillProduction`, payload, cb, true);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setRowData([]);
          setMaterialIssueDetails([]);
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
          {(plantLoader ||
            shopFloorLoader ||
            millLoader ||
            dataLoader ||
            itemDDLLoader ||
            bomLoader ||
            shiftDDLLoader ||
            materialIssueDetailsLoader) && <Loading />}
          <IForm
            title={id ? "Edit Mill Production" : "Create Mill Production"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-2">
                  <NewSelect
                    name="shift"
                    options={shiftDDL || []}
                    value={values?.shift}
                    label="shift"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shift", valueOption);
                      }
                    }}
                    isDisabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="Date"
                    value={values?.dteDate}
                    name="dteDate"
                    type="date"
                    disabled={id || rowData?.length > 0 ? true : false}
                    onChange={(e) => {
                      setFieldValue("dteDate", e?.target?.value);
                    }}
                  />
                </div>
                {/* changes from ahsan kabir bhai (factory) */}
                {/* <div className="col-lg-2">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: 1, label: "A" },
                      { value: 2, label: "B" },
                      { value: 3, label: "C" }
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shift", valueOption);
                        setFieldValue("plant", "");
                        setFieldValue("shopFloor", "");
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      } else {
                        setFieldValue("shift", "");
                        setFieldValue("plant", "");
                        setFieldValue("shopFloor", "");
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      }
                    }}
                    isDisabled={(id || rowData?.length > 0) ? true : false}
                  />
                </div> */}
                <div className="col-lg-2">
                  <NewSelect
                    name="plant"
                    options={plant}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("plant", valueOption);
                        setFieldValue("shopFloor", "");
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                        getShopFloor(
                          `/mes/MesDDL/GetShopfloorDDL?AccountId=${accountId}&BusinessUnitid=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("plant", "");
                        setFieldValue("shopFloor", "");
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      }
                    }}
                    isDisabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>

                <div className="col-lg-2">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloor}
                    value={values?.shopFloor}
                    label="Shop Floor"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shopFloor", valueOption);
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                        getMill(
                          `/mes/MesDDL/GetWorkCenterDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&ShopFloorId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("shopFloor", "");
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      }
                    }}
                    isDisabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="mill"
                    options={mill}
                    value={values?.mill}
                    label="Mill Name"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("mill", valueOption);
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                        getItemDDL(
                          `/mes/MesDDL/GetItemListForBackCalculation?accountId=${accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${values?.plant?.value}&shopFloorId=${values?.shopFloor?.value}&workCenterId=${valueOption?.value}`,
                          (data) => {
                            const res = data?.map((itm) => {
                              return {
                                ...itm,
                                value: itm?.itemId,
                                label: itm?.itemName,
                              };
                            });
                            setItemDDL(res);
                          }
                        );
                      } else {
                        setFieldValue("mill", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      }
                    }}
                    isDisabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="productType"
                    options={itemDDL}
                    value={values?.productType}
                    label="Product Type"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("productType", valueOption);
                        setFieldValue("intUomid", valueOption?.uoMId);
                        setFieldValue("strUomname", valueOption?.uoMName);
                        setFieldValue("bom", "");
                        getBom(
                          `/mes/MesDDL/GetRoutingToBOMDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ItemId=${valueOption?.value}&WorkCenterId=${values?.mill?.value}`
                        );
                      } else {
                        setFieldValue("bom", "");
                        setFieldValue("productType", "");
                        setFieldValue("strUomname", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      }
                    }}
                    isDisabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="Uom Name"
                    value={values?.strUomname}
                    name="strUomname"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="bom"
                    options={bom}
                    value={values?.bom}
                    label="BOM Name"
                    isDisabled={id || rowData?.length > 0 ? true : false}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("bom", valueOption);
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      } else {
                        setFieldValue("bom", "");
                        setFieldValue("numRunningHour", "");
                        setFieldValue("numQuantity", "");
                        setFieldValue("strRemarks", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="Running Hour"
                    value={values?.numRunningHour}
                    name="numRunningHour"
                    type="number"
                    disabled={id || rowData?.length > 0 ? true : false}
                    onChange={(e) => {
                      if (+e.target.value > 24 || +e.target.value < 0) {
                        setFieldValue("breakdownHour", "");
                        return toast.warn(
                          "Running hour must be in between 0 to 24"
                        );
                      } else {
                        setFieldValue("breakdownHour", "");
                        setFieldValue("numRunningHour", e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="Prod. Quantity"
                    value={values?.numQuantity}
                    name="numQuantity"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0)
                        toast.warn("Quantity must be greater than 0");
                      else {
                        setFieldValue("numQuantity", e.target.value);
                        // setTimeout(() => {
                        getMaterialIssueDetails(
                          `/mes/MSIL/GetMaterialIssueByBOM?BusinessUnitId=${
                            selectedBusinessUnit?.value
                          }&BillOfMaterialId=${values?.bom?.value}&Quantity=${+e
                            .target.value || 0}&Date=${values?.dteDate}`
                        );
                        // }, 1000);
                      }
                    }}
                    disabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="Remarks"
                    value={values?.strRemarks}
                    name="strRemarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("strRemarks", e.target.value);
                    }}
                    disabled={id || rowData?.length > 0 ? true : false}
                  />
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 mt-3">
                      <h4>Material Issue Details by BOM</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Raw Materials</th>
                          <th>UoM</th>
                          <th>QTY(%)</th>
                          <th>Moisture(%)</th>
                          {/* <th>Process Loss(%)</th>
                        <th>Bom Version</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {materialIssueDetails?.data?.length > 0 &&
                          materialIssueDetails?.data?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-left">
                                  {item.strItemName}
                                </td>
                                <td className="text-center">
                                  {item.strUomName}
                                </td>
                                <td className="text-center">
                                  {item.numQuantity}
                                </td>
                                <td className="text-center">
                                  {item.numMoisturQuantity}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="form-group  global-form row">
                <div className="col-lg-12">
                  <h4>Breakdown Details</h4>
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="breakdownType"
                    options={[
                      { value: 1, label: "Process" },
                      { value: 2, label: "Mechanical" },
                      { value: 3, label: "Electrical" },
                      { value: 4, label: "Power" },
                      { value: 5, label: "Schedule Maintanence" },
                      { value: 6, label: "Silo Full" },
                      { value: 7, label: "Others" },
                    ]}
                    value={values?.breakdownType}
                    label="Breakdown Type"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("breakdownType", valueOption);
                      } else {
                        setFieldValue("breakdownType", "");
                      }
                    }}
                    isDisabled={
                      !values?.dteDate ||
                      !values?.plant ||
                      !values?.shopFloor ||
                      !values?.mill ||
                      !values?.productType ||
                      !values?.numQuantity ||
                      !values?.numRunningHour
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="Breakdown Hour"
                    value={values?.breakdownHour}
                    name="breakdownHour"
                    type="number"
                    onChange={(e) => {
                      if (
                        (+e.target.value || 0) + +values?.numRunningHour > 24 ||
                        +e.target.value < 0
                      ) {
                        return toast.warn(
                          "Sum of Runnig Hour and Breakdown Hour cannot be greater than 24 hours and Breakdown Hour cannot be less than 0"
                        );
                      } else {
                        setFieldValue("breakdownHour", e.target.value);
                      }
                    }}
                    disabled={
                      !values?.breakdownType ||
                      !values?.dteDate ||
                      !values?.plant ||
                      !values?.shopFloor ||
                      !values?.mill ||
                      !values?.productType ||
                      !values?.numQuantity ||
                      !values?.numRunningHour
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <label>Breakdown Details</label>
                  <TextArea
                    value={values?.breakdownDetails}
                    name="breakdownDetails"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("breakdownDetails", e.target.value);
                    }}
                    disabled={
                      !values?.breakdownType ||
                      !values?.breakdownHour ||
                      !values?.dteDate ||
                      !values?.plant ||
                      !values?.shopFloor ||
                      !values?.mill ||
                      !values?.productType ||
                      !values?.numQuantity ||
                      !values?.numRunningHour
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      if (
                        +getRemainingBreakdown(values) +
                          +values?.breakdownHour +
                          +values?.numRunningHour >
                        24
                      ) {
                        return toast.warning(
                          "Total Breakdown Hour cannot be greater than 24"
                        );
                      }
                      setRowData([
                        ...rowData,
                        {
                          intRowId: 0,
                          intMillProductionId: 0,
                          intBreakDownTypeId: values?.breakdownType?.value,
                          strBreakDownTypeName: values?.breakdownType?.label,
                          numBreakdownHour: +values?.breakdownHour,
                          strBreakdownDetails: values?.breakdownDetails,
                        },
                      ]);
                      setFieldValue("breakdownType", "");
                      setFieldValue("breakdownDetails", "");
                      setFieldValue("breakdownHour", "");
                    }}
                    disabled={
                      !values?.breakdownType ||
                      !values?.breakdownDetails ||
                      !values?.breakdownHour
                        ? true
                        : false
                    }
                  >
                    Add
                  </button>
                </div>
                <div className="col-lg-3">
                  <h4 className="bold">Total Hour: 24</h4>
                  <h4 className="bold">
                    Running Hour: {values?.numRunningHour || 0}{" "}
                  </h4>
                  <h4
                    className="bold"
                    style={{
                      color:
                        getRemainingBreakdown(values) > values?.numRunningHour
                          ? "red"
                          : "green",
                    }}
                  >
                    Breakdown Hour: {getRemainingBreakdown(values)}
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                <div className="table-responsive">
  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Breakdown Type</th>
                        <th>Breakdown Details</th>
                        <th>Breakdown Hour</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {item.strBreakDownTypeName}
                              </td>
                              <td>{item.strBreakdownDetails}</td>
                              <td className="text-center">
                                {item.numBreakdownHour}
                              </td>
                              <td className="text-center">
                                <IClose
                                  closer={() => {
                                    let data = rowData.filter(
                                      (x, i) => i !== index
                                    );
                                    setRowData(data);
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
</div>
                
                </div>
              </div>
              <button
                type="button"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onClick={() => handleSubmit()}
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

import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  sbu: "",
  partner: "",
  plant: "",
  warehouse: "",
  toBusinessUnit: "",
  reference: "",
  item: "",
  uom: "",
  quantity: "",
  remarks: "",
  itemRate: "",
};

export default function InternalLoan({ loanType }) {
  const [objProps, setObjprops] = useState({});
  const [transactionType, setTransactionType] = useState(1);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [, getItemRate] = useAxiosGet();
  const [
    businessUnitDDL,
    getBusinessUnitDDL,
    businessUnitDDLloader,
  ] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [, getSbuDDL, sbuDDLloader] = useAxiosGet();
  const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL, warehouseDDLloader] = useAxiosGet();
  const [partnerDDL, getpartnerDDl, partnerDDLloader] = useAxiosGet();
  const [referenceDDl, getReferenceDDL, referenceDDLloader] = useAxiosGet();
  const [availableStock, getAvailableStock] = useAxiosGet();

  const saveHandler = (values, cb) => {
    if (transactionType === 1) {
      if (!values?.partner) {
        return toast.warn("Partner is required");
      }
      if (!values?.plant) {
        return toast.warn("Plant is required");
      }
      if (!values?.warehouse) {
        return toast.warn("Warehouse is required");
      }
      if (!values?.toBusinessUnit) {
        return toast.warn("To Business Unit is required");
      }
      if (!values?.item) {
        return toast.warn("Item is required");
      }
      if (!values?.quantity) {
        return toast.warn("Quantity is required");
      }
      if (!availableStock || availableStock <= 0) {
        return toast.warn("Stock is unavailable!");
      }
      const payload = {
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intPlantId: values?.plant?.value,
        intSbuId: values?.sbu?.value,
        intBusinessPartnerId: values?.partner?.value,
        strBusinessPartnerName: values?.partner?.label,
        intLoanTypeId: loanType,
        intLoanTypeName: loanType === 1 ? "Internal Loan" : "External Loan",
        intTransTypeId: transactionType,
        strTransTypeName: transactionType === 1 ? "Issue" : "Receive",
        intWareHouseId: values?.warehouse?.value,
        strWareHouseName: values?.warehouse?.label,
        intLcid: 0,
        strLcnumber: "",
        intShipmentId: 0,
        strShipmentName: "",
        strSurveyReportNo: "",
        intLighterVesselId: 0,
        strLighterVesselName: "",
        intMotherVesselId: 0,
        strMotherVesselName: "",
        dteTransDate: _todayDate(),
        intItemId: values?.item?.value,
        strItemName: values?.item?.label,
        strItemCode: values?.item?.code,
        strUomName: values?.uom?.label,
        numItemQty: +values?.quantity,
        numItemRate: +values?.itemRate || 0,
        numItemAmount: +values?.itemRate * +values?.quantity || 0,
        strNarration: values?.remarks,
        intActionBy: profileData?.userId,
        intFromOrToBusinessUnitId: values?.toBusinessUnit?.value,
        strFromOrToBusinessUnitName: values?.toBusinessUnit?.label,
        intLoanId: 0,
      };
      saveData(`/wms/InventoryLoan/CreateLoan`, payload, cb, true);
      console.log("transactionType 1 => payload", payload);
    } else if (transactionType === 2) {
      if (!values?.plant) {
        return toast.warn("Plant is required");
      }
      if (!values?.warehouse) {
        return toast.warn("Warehouse is required");
      }
      if (!values?.toBusinessUnit) {
        return toast.warn("From Business Unit is required");
      }
      if (!values?.reference) {
        return toast.warn("Reference is required");
      }
      if (!values?.partner) {
        return toast.warn("Partner is required");
      }
      if (!values?.item) {
        return toast.warn("Item is required");
      }
      const payload = {
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intPlantId: values?.plant?.value,
        intSbuId: values?.sbu?.value,
        intBusinessPartnerId: values?.partner?.value,
        strBusinessPartnerName: values?.partner?.label,
        intLoanTypeId: loanType,
        intLoanTypeName: loanType === 1 ? "Internal Loan" : "External Loan",
        intTransTypeId: transactionType,
        strTransTypeName: transactionType === 1 ? "Issue" : "Receive",
        intWareHouseId: values?.warehouse?.value,
        strWareHouseName: values?.warehouse?.label,
        intLcid: 0,
        strLcnumber: "",
        intShipmentId: 0,
        strShipmentName: "",
        strSurveyReportNo: "",
        intLighterVesselId: 0,
        strLighterVesselName: "",
        intMotherVesselId: 0,
        strMotherVesselName: "",
        dteTransDate: _todayDate(),
        intItemId: values?.item?.value,
        strItemName: values?.item?.label,
        strItemCode: values?.item?.code,
        strUomName: values?.uom?.label,
        numItemQty: +values?.quantity,
        numItemRate: values?.reference?.itemRate,
        numItemAmount: Math?.abs(values?.reference?.itemAmount),
        strNarration: values?.remarks,
        intActionBy: profileData?.userId,
        intFromOrToBusinessUnitId: values?.toBusinessUnit?.value,
        strFromOrToBusinessUnitName: values?.toBusinessUnit?.label,
        intLoanId: values?.reference?.loanId,
      };
      saveData(`/wms/InventoryLoan/CreateInvItemloan`, payload, cb, true);
      console.log("transactionType 2 => payload", payload);
    } else {
    }
  };

  useEffect(() => {
    getpartnerDDl(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=4`
    );
    getSbuDDL(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`,
      (data) => {
        if (data && data[0]?.value) {
          initData.sbu = data[0];
        }
      }
    );
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=1&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {(plantDDLloader ||
            warehouseDDLloader ||
            saveDataLoader ||
            sbuDDLloader ||
            partnerDDLloader ||
            referenceDDLloader ||
            businessUnitDDLloader) && <Loading />}
          <IForm title="Create Internal Loan" getProps={setObjprops}>
            <Form>
              <>
                <div className="col-lg-4 mb-2 mt-5">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="transactionType"
                      checked={transactionType === 1}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(valueOption) => {
                        setTransactionType(1);
                        resetForm(initData);
                      }}
                    />
                    Loan Type (Issue)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="transactionType"
                      checked={transactionType === 2}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setTransactionType(2);
                        resetForm(initData);
                      }}
                    />
                    Loan Type (Receive)
                  </label>
                </div>
              </>
              {transactionType === 1 ? (
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("plant", valueOption);
                          setFieldValue("warehouse", "");
                          setFieldValue("item", "");
                          setFieldValue("uom", "");
                          getWarehouseDDL(
                            `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("plant", "");
                          setFieldValue("warehouse", "");
                          setFieldValue("item", "");
                          setFieldValue("uom", "");
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={warehouseDDL || []}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("warehouse", valueOption);
                          setFieldValue("item", "");
                          setFieldValue("uom", "");
                        } else {
                          setFieldValue("warehouse", "");
                          setFieldValue("item", "");
                          setFieldValue("uom", "");
                        }
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.plant}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="toBusinessUnit"
                      options={
                        businessUnitDDL?.filter(
                          (itm) => itm.value !== selectedBusinessUnit?.value
                        ) || []
                      }
                      value={values?.toBusinessUnit}
                      label="To Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("toBusinessUnit", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDL || []}
                      value={values?.partner}
                      label="To Business Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                      }}
                      placeholder="Business Partner"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Item Name</label>
                    <span style={{ marginTop: "8px" }}>
                      {values?.itemRate
                        ? `Rate: ${values?.itemRate || ""}`
                        : ""}
                    </span>
                    <SearchAsyncSelect
                      selectedValue={values?.item}
                      handleChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("item", valueOption);
                          setFieldValue("uom", {
                            value: valueOption?.uomId,
                            label: valueOption?.uomName,
                          });
                          getItemRate(
                            `/wms/InventoryTransaction/sprRuningRate?businessUnitId=${
                              selectedBusinessUnit?.value
                            }&whId=${values?.warehouse?.value || 0}&itemId=${
                              valueOption?.value
                            }`,
                            (data) => setFieldValue("itemRate", data)
                          );
                          getAvailableStock(
                            `/wms/InventoryTransaction/sprRuningQty?businessUnitId=${selectedBusinessUnit?.value}&whId=${values?.warehouse?.value}&itemId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("item", "");
                          setFieldValue("uom", "");
                        }
                      }}
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        return Axios.get(
                          `/item/ItemSales/GetItemDDLForInventoryLoan?AccountId=${
                            profileData?.accountId
                          }&BUnitId=${
                            selectedBusinessUnit?.value
                          }&WareHouseId=${values?.warehouse?.value ||
                            0}&Search=${v}`
                        ).then((res) => res?.data);
                      }}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="Uom"
                      options={[]}
                      value={values?.uom}
                      label="Uom"
                      onChange={(valueOption) => {}}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.quantity}
                      label="Quantity"
                      name="quantity"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.remarks}
                      label="Remarks"
                      name="remarks"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                    />
                  </div>
                </div>
              ) : transactionType === 2 ? (
                <>
                  <div className="form-group  global-form row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantDDL || []}
                        value={values?.plant}
                        label="Receive Plant"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("plant", valueOption);
                            setFieldValue("warehouse", "");
                            setFieldValue("item", "");
                            getWarehouseDDL(
                              `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                            );
                          } else {
                            setFieldValue("plant", "");
                            setFieldValue("warehouse", "");
                            setFieldValue("item", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={warehouseDDL || []}
                        value={values?.warehouse}
                        label="Receive Warehouse"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("warehouse", valueOption);
                            setFieldValue("item", "");
                          } else {
                            setFieldValue("warehouse", "");
                            setFieldValue("item", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="toBusinessUnit"
                        options={
                          businessUnitDDL?.filter(
                            (itm) => itm.value !== selectedBusinessUnit?.value
                          ) || []
                        }
                        value={values?.toBusinessUnit}
                        label="From Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("toBusinessUnit", valueOption);
                            getReferenceDDL(
                              `/wms/InventoryLoan/GetItemLoanReferenceDDL?accountId=${profileData?.accountId}&fromBusinessUnitId=${valueOption?.value}&tobBusinessUnitId=${selectedBusinessUnit?.value}`
                            );
                          } else {
                            setFieldValue("toBusinessUnit", "");
                            setFieldValue("reference", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="reference"
                        options={referenceDDl || []}
                        value={values?.reference}
                        label="Reference"
                        onChange={(valueOption) => {
                          console.log("valueOption", valueOption);
                          setFieldValue("reference", valueOption);
                          setFieldValue(
                            "quantity",
                            Math.abs(valueOption?.itemQty)
                          );
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.toBusinessUnit}
                      />
                    </div>
                    <div className="col-lg-12">
                      {values?.reference && (
                        <p className="mt-5">
                          <b>Item Name:</b> {values?.reference?.itemName}{" "}
                          <b>Uom:</b> {values?.reference?.strUomName}{" "}
                          <b>Quantity:</b>{" "}
                          {Math.abs(values?.reference?.itemQty)}{" "}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="partner"
                        options={partnerDDL || []}
                        value={values?.partner}
                        label="From Business Partner"
                        onChange={(valueOption) => {
                          setFieldValue("partner", valueOption);
                        }}
                        placeholder="Business Partner"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Item Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.item}
                        handleChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("item", valueOption);
                            setFieldValue("uom", {
                              value: valueOption?.uomId,
                              label: valueOption?.uomName,
                            });
                          } else {
                            setFieldValue("item", "");
                            setFieldValue("uom", "");
                          }
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return Axios.get(
                            `/item/ItemSales/GetItemDDLForInventoryLoan?AccountId=${
                              profileData?.accountId
                            }&BUnitId=${
                              selectedBusinessUnit?.value
                            }&WareHouseId=${values?.warehouse?.value ||
                              0}&Search=${v}`
                          ).then((res) => res?.data);
                        }}
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Remarks"
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>Item Code</th>
                              <th>Item Name</th>
                              <th>UOM</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {values?.item ? (
                              <tr>
                                <td>1</td>
                                <td className="text-center">
                                  {values?.item?.code}
                                </td>
                                <td>{values?.item?.label}</td>
                                <td>{values?.item?.uomName}</td>
                                <td>{values?.quantity || ""}</td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

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

/* eslint-disable react/style-prop-object */
import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  SaveInventoryLoanValidationSchema,
  getBusinessPartnerDDL,
  getSBUListDDL_api,
  getShipmentDDL,
} from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  getAvailableStock,
}) {
  const [shipmentDDL, setShipmentDDL] = useState([]);
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [sbuDDL, setsbuDDL] = useState([]);
  const [, getItemRate, itemRateLoader] = useAxiosGet();
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL, , setWarehouseDDL] = useAxiosGet();

  const polcList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };

  useEffect(() => {
    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerDDL
    );
    getSBUListDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setsbuDDL
    );
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=1&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={SaveInventoryLoanValidationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
          setValues,
        }) => (
          <>
            {itemRateLoader && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row mb-2">
                  <div className="col-lg-3 d-flex align-items-center">
                    <input
                      type="radio"
                      name="createType"
                      checked={values?.createType === 1}
                      onChange={() => {
                        setValues({ ...initData, createType: 1 });
                      }}
                    />
                    <label className="mx-2">Issue</label>
                    <input
                      type="radio"
                      name="createType"
                      checked={values?.createType === 2}
                      onChange={() => {
                        setValues({ ...initData, createType: 2 });
                      }}
                    />
                    <label className="mx-2">Receive</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="sbu"
                      options={sbuDDL}
                      value={values?.sbu}
                      label="Select SBU"
                      onChange={(valueOption) => {
                        setFieldValue("sbu", valueOption);
                      }}
                      placeholder="Select SBU"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDL}
                      value={values?.partner}
                      label={
                        values?.createType === 1
                          ? `To Business Partner`
                          : `From Business Partner`
                      }
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                      }}
                      placeholder="Business Partner"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {values?.createType === 1 ? (
                    <div className="col-lg-3">
                      <NewSelect
                        name="issueFrom"
                        options={[
                          { value: 1, label: "Warehouse" },
                          { value: 2, label: "Shipment" },
                        ]}
                        value={values?.issueFrom}
                        label="Issue From"
                        onChange={(valueOption) => {
                          setFieldValue("issueFrom", valueOption);
                        }}
                        placeholder="Issue From"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
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
                          getWarehouseDDL(
                            `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("plant", "");
                          setFieldValue("warehouse", "");
                          setWarehouseDDL([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.issueFrom?.value !== 2 ? (
                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={warehouseDDL}
                        value={values?.warehouse}
                        label={
                          values?.createType === 1
                            ? `From Warehouse`
                            : `Warehouse`
                        }
                        onChange={(valueOption) => {
                          setFieldValue("item", "");
                          setFieldValue("lcNo", "");
                          setFieldValue("shipment", "");
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  {values?.createType === 1 &&
                  values?.issueFrom?.value === 2 ? (
                    <>
                      <div className="col-lg-3">
                        <label>LC No</label>
                        <SearchAsyncSelect
                          selectedValue={values?.lcNo}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            setFieldValue("lcNo", valueOption);
                            getShipmentDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.label,
                              setShipmentDDL
                            );
                          }}
                          loadOptions={polcList}
                          placeholder="Search by LC No"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipment"
                          options={shipmentDDL}
                          value={values?.shipment}
                          label="Shipment"
                          onChange={(valueOption) => {
                            setFieldValue("shipment", valueOption);
                          }}
                          placeholder="Shipment"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="col-lg-3">
                    <label>Lighter Vessel</label>
                    <InputField
                      value={values?.lighterVessel}
                      name="lighterVessel"
                      onChange={(e) => {
                        setFieldValue("lighterVessel", e.target.value);
                      }}
                      placeholder="Lighter Vessel"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Mother Vessel</label>
                    <InputField
                      value={values?.motherVessel}
                      name="motherVessel"
                      onChange={(e) => {
                        setFieldValue("motherVessel", e.target.value);
                      }}
                      placeholder="Mother Vessel"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Survey Report No</label>
                    <InputField
                      value={values?.surveyReportNo}
                      name="surveyReportNo"
                      onChange={(e) => {
                        setFieldValue("surveyReportNo", e.target.value);
                      }}
                      placeholder="Survey Report No"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label>Item Name</label>
                      <span style={{ marginTop: "8px" }}>
                        {values?.itemRate
                          ? `Rate: ${values?.itemRate || ""}`
                          : ""}
                      </span>
                    </div>
                    <SearchAsyncSelect
                      selectedValue={values?.item}
                      handleChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                        if (valueOption) {
                          // getItemRate(
                          //   `/wms/InventoryTransaction/sprRuningRate?businessUnitId=${
                          //     selectedBusinessUnit?.value
                          //   }&whId=${values?.warehouse?.value || 0}&itemId=${
                          //     valueOption?.value
                          //   }`,
                          //   (data) => setFieldValue("itemRate", data)
                          // );
                          getItemRate(
                            `/wms/InventoryLoan/GetItemRate?ItemId=${valueOption?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`,
                            (data) => setFieldValue("itemRate", data)
                          );
                          getAvailableStock(`/wms/InventoryTransaction/sprRuningQty?businessUnitId=${selectedBusinessUnit?.value}&whId=${values?.warehouse?.value}&itemId=${valueOption?.value}`)
                        } else {
                          setFieldValue("itemRate", "");
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
                    />
                    <FormikError
                      errors={errors}
                      name="item"
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Quantity</label>
                    <InputField
                      value={values?.quantity}
                      name="quantity"
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                      placeholder="Quantity"
                      type="number"
                    />
                  </div>
                  {values?.createType === 2 && values?.item && (
                    <div className="col-lg-3">
                      <label>Item Rate</label>
                      <InputField
                        value={+values?.itemRate}
                        name="itemRate"
                        onChange={(e) => {
                          setFieldValue("itemRate", +e.target.value);
                        }}
                        placeholder="itemRate"
                        type="number"
                      />
                    </div>
                  )}
                  {values?.createType === 2 &&
                    values?.itemRate && values?.quantity && (
                      <div className="col-lg-3">
                        <label>Total Amount</label>
                        <InputField
                          value={+values?.itemRate * +values?.quantity}
                          name="total Amount"
                          type="number"
                          disabled={true}
                        />
                      </div>
                    )}
                  <div className="col-lg-3">
                    <label>Narration</label>
                    <InputField
                      value={values?.narration}
                      name="narration"
                      onChange={(e) => {
                        setFieldValue("narration", e.target.value);
                      }}
                      placeholder="Narration"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

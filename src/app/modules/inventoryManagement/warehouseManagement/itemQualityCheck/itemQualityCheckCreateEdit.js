import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  po: "",
  poType: "",
  plant: "",
  warehouse: "",
  poNo: "",
};



export default function ItemQualityCheckCreateAndEditForm() {
    const {
        profileData: { accountId: accId },
        selectedBusinessUnit: { value: buId },
      } = useSelector((state) => state?.authData, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const [poDDL, getPoDDL] = useAxiosGet();
  const [poTypeDDL, getPoTypeDDL] = useAxiosGet();
  
  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    
    getPoTypeDDL(
        `/procurement/PurchaseOrder/GetOrderTypeListDDL`
    )
    getPoDDL(
        `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId,buId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
    //   validationSchema={validationSchema}
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
            {false && <Loading />}
            <IForm title="Create Item Quality Check" getProps={setObjprops}>
             <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="po"
                    options={poDDL || []}
                    value={values?.po}
                    label="Purchase Organization"
                    onChange={(valueOption) => {
                      setFieldValue("po", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="poType"
                    options={poTypeDDL || []}
                    value={values?.poType}
                    label="PO Type"
                    onChange={(valueOption) => {
                      setFieldValue("poType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                        setFieldValue("warehouse","")
                      setFieldValue("plant", valueOption);
                      if(!valueOption) return
                      getWarehouseDDL(
                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=${valueOption?.value}`
                      )
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
                      setFieldValue("warehouse", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                <label>PO No</label>
                <SearchAsyncSelect
                  selectedValue={values?.poNo}
                  handleChange={(valueOption) => {
                    setFieldValue("poNo", valueOption);
                  }}
                  placeholder="Search PO No"
                  loadOptions={
                    (v) => {
                        if (v?.length < 3) return [];
                        return axios
                          .get(
                            `/mes/QCTest/GetPendingQCPurchaseOrder?businessUnitId=${buId}&purchaseOrganizationId=${values?.po?.value}&purchaseOrderType=${values?.poType?.value}&plantId=${values?.plant.value}&warehouseId=${values?.warehouse?.value}&search=${v}`
                          )
                          .then((res) => res?.data);
                      }
                  }
                />
              </div>
              <div className="col-lg-3" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                     
                    }}
                    disabled={!values?.plant || !values?.warehouse}
                  >
                    View
                  </button>
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
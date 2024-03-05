
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
    businessUnit:"",
    plant:"",
    shopFloor:"",
    fromDate:_monthFirstDate(),
    toDate:_monthLastDate(),
};
export default function OeeProductionSummary() {
  const saveHandler = (values, cb) => {};
  const [rowData,getRowData,loadingRowData] = useAxiosGet()
  const [plantDDL, getPlantDDL, plantDDLLloader, setPlantDDL] = useAxiosGet();
  const [
    shopFloorDDL,
    getShopFloorDDL,
    shopFloorDDLLoader,
    setShopFloorDDL,
  ] = useAxiosGet();
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );
  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        businessUnit: {
            value: selectedBusinessUnit?.value,
            label: selectedBusinessUnit?.label,
          }, 
      }}
      // validationSchema={{}}
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
            {(loadingRowData || plantDDLLloader || shopFloorDDLLoader) && <Loading />}
            <IForm
              title="OEE Production Summary Report"
              isHiddenReset
              isHiddenBack
              isHiddenSave
              
            >
              <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      setFieldValue("plant", "");
                      setFieldValue("shopFloor", "");
                      setPlantDDL([]);
                      setShopFloorDDL([]);
                      if(!valueOption) return;
                      getPlantDDL(
                        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}&OrgUnitTypeId=7`
                      );
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
                      setFieldValue("plant", valueOption);
                      setFieldValue("shopFloor", "");
                      setShopFloorDDL([]);
                      if(!valueOption) return;
                      getShopFloorDDL(
                        `/mes/MesDDL/GetShopfloorDDL?AccountId=${profileData?.accountId}&BusinessUnitid=${values?.businessUnit?.value}&PlantId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloorDDL || []}
                    value={values?.shopFloor}
                    label="Shopfloor"
                    onChange={(valueOption) => {
                      setFieldValue("shopFloor", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    disabled={
                      !values?.businessUnit ||
                      !values?.plant ||
                      !values?.shopFloor||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    onClick={() => {
                      alert("need api")
                    }}
                    className="btn btn-primary mt-5 ml-4"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="table-responsive mt-5">
                <table className="table table-striped table-bordered global-table mt-0">
                  <thead>
                    <tr>
                      <th style={{maxWidth:"60px"}}>SL</th>
                      <th >Section</th>
                      <th style={{maxWidth:"120px"}}>UOM</th>
                      <th style={{maxWidth:"120px"}}>Target</th>
                      <th style={{maxWidth:"120px"}}>Production</th>
                      <th style={{maxWidth:"120px"}}>Achieve %</th>
                      <th style={{maxWidth:"120px"}}>Good Production</th>
                      <th style={{maxWidth:"120px"}}>Wastage %</th>
                      <th>OEE %</th>
                      <th>NPT %</th>
                      <th style={{maxWidth:"120px"}}>Unplanned Downtime</th>
                      <th style={{maxWidth:"120px"}}>Planned Downtime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        // t body will be here
                    }
                  </tbody>
                </table>
              </div>
              </Form>
            </IForm>
        </>
      )}
    </Formik>
  );
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import ILoader from "../../../../../_helper/loader/_loader";
import { getPurchaseOrgDDLAction, getSbuDDLAction } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import { getOrderTypeListDDLAction, getPlantListDDLAction } from "../../../purchaseOrderShipping/_redux/Actions";
import { getWarehouseDDL_ShippingCS } from "../helper";
import GridData from "./grid";

const initData = {
  sbu: "",
  purchaseOrg: "",
  plant: "",
  warehouse: "",
}
// Validation schema
const validationSchema = Yup.object().shape({});

// const statusData = [
//   { label: "Open", value: "Open" },
//   { label: "Not Started", value: "Not Started" },
//   { label: "Closed", value: "Closed" },
// ];

export default function HeaderForm() {
  let [wareHouseDDL, setWarehouseDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [landingData, getLandingData, getLoading, setLandingData] = useAxiosGet()
  //paginationState
  // eslint-disable-next-line no-unused-vars
  const [pageNo, setPageNo] = React.useState(0);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = React.useState(20);

  const sbuDDL = useSelector((state) => state.commonDDL.sbuDDL);
  const purchaseOrgDDL = useSelector((state) => state.commonDDL.purchaseOrgDDL);
  const plantDDL = useSelector((state) => state.purchaseOrder.plantDDL);
  //const wareHouseDDL = useSelector((state) => state.purchaseOrder.wareHouseDDL);

  const purchaseOrgModifyDDL =  purchaseOrgDDL.filter((item) => [11].includes(item.value))

  
  const history = useHistory();
  // get user profile data from store
  const profileData = useSelector(
    (state) => state.authData.profileData,
    shallowEqual
  );

  // get selected business unit from store
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit,
    shallowEqual
  );

  // loading
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getPurchaseOrgDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getPlantListDDLAction(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value
      )
    );
    dispatch(getOrderTypeListDDLAction());
  }, [profileData, selectedBusinessUnit]);

  // useEffect(() => {
  //   if(plantDDL){
  //     getWarehouseDDL_ShippingCS(
  //       profileData?.userId,
  //       profileData?.accountId,
  //       selectedBusinessUnit?.value,
  //       91,
  //       setWarehouseDDL,     
  //       )
  //   }
  // },[])

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(`/procurement/ShipRequestForQuotation/GetRequestForQuotationShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&RequestTypeId=1&SBUId=${values?.sbu?.value}&PurchaseOrganizationId=${values?.purchaseOrg?.value}&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value}&status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`)
  };


  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          sbu: {value:sbuDDL[0]?.value, label:sbuDDL[0]?.label},
          purchaseOrg: {value:purchaseOrgModifyDDL[0]?.value,label:purchaseOrgModifyDDL[0]?.label},
          // plant: {value: plantDDL[0]?.value, label:plantDDL[0]?.label},
          // warehouse: {value: wareHouseDDL[0]?.value, label: wareHouseDDL[0]?.label}
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <div
              style={{ transform: "translateY(-40px)" }}
              className="text-right"
            >
              <button
                disabled={
                  !values?.sbu ||
                  !values?.purchaseOrg ||
                  !values?.plant ||
                  !values?.warehouse 
                }
                type="button"
                className="btn btn-primary ml-3"
                onClick={() => {
                  history.push({
                    pathname: `/mngProcurement/comparative-statement/shipping-rfq/create`,
                    state: values,
                  });
                }}
              >
                Create
              </button>
            </div>
            <div
              style={{ transform: "translateY(-34px)" }}
              className="global-form"
            >
              <Form className="form form-label-right">
                <div className="form-group row">
                  {/* {controlls.map((itm, idx) => {
                    return (
                      <div className="col-lg-3" key={idx}>
                        <ISelect
                          dependencyFunc={itm.dependencyFunc}
                          label={itm.label}
                          placeholder={itm.label}
                          options={itm.options || []}
                          value={values[itm.name]}
                          name={itm.name}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          values={values}
                          disabledFields={itm.isDisabled || []}
                          touched={touched}
                        />
                      </div>
                    );
                  })} */}
                  <div className="col-lg-2">
                       <NewSelect
                         name="sbu"
                         options={sbuDDL}
                         value={values?.sbu}
                         label="SBU"
                         onChange={(valueOption) => {
                           setFieldValue("sbu", valueOption);
                         }}
                         placeholder="SBU"
                         errors={errors}
                         touched={touched}
                       />
                    </div>
                  <div className="col-lg-2">
                       <NewSelect
                         name="purchaseOrg"
                         options={purchaseOrgModifyDDL}
                         value={values?.purchaseOrg}
                         label="Purchase Org"
                         onChange={(valueOption) => {
                           setFieldValue("purchaseOrg", valueOption);
                         }}
                         placeholder="Purchase Org"
                         errors={errors}
                         touched={touched}
                       />
                    </div>
                  <div className="col-lg-2">
                       <NewSelect
                         name="plant"
                         options={plantDDL}
                         value={values?.plant}
                         label="Vessel"
                         onChange={(valueOption) => {
                           setFieldValue("plant", valueOption);
                           getWarehouseDDL_ShippingCS(profileData?.userId,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setWarehouseDDL,
                            setFieldValue
                            )
                            if(!valueOption){
                              setFieldValue("warehouse","")
                            }
                         }}
                         placeholder="Vessel"
                         errors={errors}
                         touched={touched}
                       />
                    </div>
                  <div className="col-lg-2">
                       <NewSelect
                         name="warehouse"
                         options={wareHouseDDL}
                         value={values?.warehouse}
                         label="Warehouse"
                         onChange={(valueOption) => {
                           setFieldValue("warehouse", valueOption);  
                           setLandingData([])                         
                         }}
                         placeholder="Warehouse"
                         errors={errors}
                         touched={touched}
                         //isDisabled={true}
                       />
                    </div>
                  {/* <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={statusData || []}
                      value={values?.status}
                      label="Status"
                      onChange={(v) => {
                        setFieldValue("status", v);
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-2" style={{marginTop:"22px"}}>
                    <button
                      disabled={
                        !values?.warehouse ||
                        !values?.plant ||
                        !values?.purchaseOrg ||
                        !values?.sbu
                      }
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => {
                        getLandingData(`/procurement/ShipRequestForQuotation/GetRequestForQuotationShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&RequestTypeId=1&SBUId=${values?.sbu?.value}&PurchaseOrganizationId=${values?.purchaseOrg?.value}&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value}&status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`)
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
            </div>

            {loading ? (
              <ILoader />
            ) : (
              <div className="pagination_disable_relative">
                <GridData
                  values={values}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  setPositionHandler={setPositionHandler}
                  paginationSearchHandler={paginationSearchHandler}
                  history={history}
                  selectedBusinessUnit={selectedBusinessUnit}
                  profileData={profileData}
                  landingData={landingData}
                  getLandingData={getLandingData}
                />
              </div>
            )}
          </>
        )}
      </Formik>
    </>
  );
}

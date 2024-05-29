import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  plant: "",
  fromDate: "",
  toDate: "",
};

function ShippingComparativeStatement() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();

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
  const plantDDL = useSelector((state) => state.purchaseOrder.plantDDL);
  
  useEffect(()=>{
    getRowData(      
      `/procurement/ShipRequestForQuotation/GetRFQCSLandingShipPagination?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=80&RequestTypeId=1&PurchaseOrganizationId=11&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}&PlantId=${0}`
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[profileData, selectedBusinessUnit])

  const setPositionHandler = (pageNo, pageSize, values) => {

    let fromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : ""
    let toDate = values?.toDate ? `&ToDate=${values?.toDate}` : ""
    let search = values?.search ? `&Search=${values?.search}` : ""

    getRowData(      
      `/procurement/ShipRequestForQuotation/GetRFQCSLandingShipPagination?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=80&RequestTypeId=1&PurchaseOrganizationId=11&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}&PlantId=${values?.plant?.value || 0}${fromDate}${toDate}${search}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          plant:{value:0,label:"All"}
        }}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Comparative Statement"}>
                <CardHeaderToolbar>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">                                        
                     <div className="col-lg-2">
                       <NewSelect
                         name="plant"
                         options={[{value:0,label:"All"},...plantDDL]}
                         value={values?.plant}
                         label="Vessel"
                         onChange={(valueOption) => {
                           setFieldValue("plant", valueOption);
                           setRowData([]);
                         }}
                         placeholder="Vessel"
                         errors={errors}
                         touched={touched}
                       />
                     </div>
                     <div className="col-lg-2">
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
                     <div className="col-lg-2">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        min={values?.fromDate}
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary"
                        disabled={!values?.plant}
                        onClick={() => {
                          let fromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : ""
                          let toDate = values?.toDate ? `&ToDate=${values?.toDate}` : ""
                          let search = values?.search ? `&Search=${values?.search}` : ""
                        
                          getRowData(
                            `/procurement/ShipRequestForQuotation/GetRFQCSLandingShipPagination?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=80&RequestTypeId=1&PurchaseOrganizationId=11&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}&PlantId=${values?.plant?.value || 0}${fromDate}${toDate}${search}`
                            );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>RFQ Code</th>
                          <th>RFQ Date</th>
                          <th>Vessel</th>
                          <th>Currency</th>
                          <th>Quotation Start Date</th>
                          <th>Quotation End Date</th>
                          <th style={{ width: "100px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.objHead?.length > 0 &&
                          rowData?.objHead?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>                             
                              <td>{item?.strRequestForQuotationCode}</td>
                              <td>{_dateFormatter(item.dteRfqdate)}</td>
                              <td>{item?.strPlantName}</td>
                              <td>{item?.strCurrencyCode}</td>
                              <td>{`${item?.quotationStartDateTime?.split("T")[0]} / ${item?.quotationStartDateTime?.split("T")[1]}`}</td>
                              <td>{`${item?.quotationEndDateTime?.split("T")[0]} / ${item?.quotationEndDateTime?.split("T")[1]}`}</td>
                              <td className="text-center">
                                {<IView
                                  clickHandler={() =>
                                    history.push({
                                      pathname: `/mngProcurement/comparative-statement/shipping-cs/cs-details`,
                                      state: { ...item },
                                    })
                                  }
                                />}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    </div>
                    {/* <IViewModal
                      show={isNegotiationDetails}
                      onHide={() => setNegotiationDetails(false)}
                      title=" Supplier List for Negotiation"
                    >
                      <NegotiationSupplierDetails
                        currentItem={currentItem}
                        isHiddenBackBtn={true}
                      />
                    </IViewModal> */}
                    {rowData?.objHead?.length > 0 && (
                      <PaginationTable
                        count={rowData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                        values={values}
                        rowsPerPageOptions={[15, 25, 50, 100, 200, 300, 400, 500]}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default ShippingComparativeStatement;

import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { Logout } from "../../../../Auth/_redux/Auth_Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { clearLocalStorageAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getPurchaseOrgDDLAction, getSbuDDLAction } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import { getOrderTypeListDDLAction, getPlantListDDLAction, getWareHouseDDLAction } from "../../purchaseOrderShipping/_redux/Actions";
import ChangeSupplierPassword from "./modal/changeSupplierPassword";
import { NegotiationSupplierDetails } from "./modal/negotiationSupplierList";
import { QuotationEntryDetails } from "./modal/quotationEntryDetails";

const initData = {
  sbu: "",
  purchaseOrg: "",
  plant: "",
  rfqType: "",
  fromDate: "",
  toDate: "",
};

function ShippingQuotationEntry() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowDto] = useAxiosGet();
  const [isNegotiationDetails, setNegotiationDetails] = useState(false);
  const [isQuotationEntryView, setQuotationEntryView] = useState(false);
  const [currentItem, setCurrentItem] = useState(false);
  const [isChangePassModal, setIsChangePassModal] = useState(false);

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

  const sbuDDL = useSelector((state) => state.commonDDL.sbuDDL);
  const purchaseOrgDDL = useSelector((state) => state.commonDDL.purchaseOrgDDL.filter((item) => [11].includes(item.value)));
  const plantDDL = useSelector((state) => state.purchaseOrder.plantDDL);
  //const wareHouseDDL = useSelector((state) => state.purchaseOrder.wareHouseDDL);

  //purchaseOrgDDL.filter((item) => [11].includes(item.value))

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // Get warehouse ddl on plant ddl onChange
  const getWarehouseDDL = (param) => {
   dispatch(
     getWareHouseDDLAction(
       profileData?.userId,
       profileData?.accountId,
       selectedBusinessUnit?.value,
       param
     )
   );
 };

 useEffect(() => {
  if(profileData?.userTypeId === 2 ){
    getRowData(
      `/procurement/ShipRequestForQuotation/GetRFQEntryLandingShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&SBUId=${80}&RfqTypeId=1&PurchaseOrganizationId=${11}&PlantId=${0}&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}&Search=${""}&UserId=${profileData?.userId}`
    );
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[profileData, selectedBusinessUnit])

  const setPositionHandler = (pageNo, pageSize, values) => {
    let fromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : ""
    let toDate = values?.toDate ? `&ToDate=${values?.toDate}` : ""
    getRowData(
      `/procurement/ShipRequestForQuotation/GetRFQEntryLandingShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&SBUId=${values?.sbu?.value}&RfqTypeId=1&PurchaseOrganizationId=${values?.purchaseOrg?.value}&PlantId=${values?.plant?.value}&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}${fromDate}${toDate}&Search=${""}&UserId=${profileData?.userId}`
    );
  };

  const logoutClick = () => {
    dispatch(Logout());
    dispatch(clearLocalStorageAction())
    history.push("/logout");
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
         ...initData,
         sbu:{value: sbuDDL[0]?.value, label:sbuDDL[0]?.label},
         purchaseOrg:{value: purchaseOrgDDL[0]?.value, label:purchaseOrgDDL[0]?.label},
         rfqType:{value:1, label: "Standard RFQ"},
         plant: {value:0,label:"All"},
      }}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Quotation Entry"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/mngProcurement/comparative-statement/shipping-quotation-entry/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                     {profileData?.userTypeId !== 2 && 
                     <>
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
                          options={purchaseOrgDDL}
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
                          options={[{value:0,label:"All"},...plantDDL]}
                          value={values?.plant}
                          label="Vessel"
                          onChange={(valueOption) => {
                            setFieldValue("plant", valueOption);
                            getWarehouseDDL(valueOption?.value)
                            setRowDto([])
                          }}
                          placeholder="Vessel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          name="rfqType"
                          options={[{value:1, label: "Standard RFQ"}]}
                          value={values?.rfqType}
                          label="RFQ Type"
                          onChange={(valueOption) => {
                            setFieldValue("rfqType", valueOption);
                          }}
                          placeholder="RFQ Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                     </>
                     }
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
                        disabled={ profileData?.userTypeId !==2 ? !values?.plant : false}
                        onClick={() => {
                          let fromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : ""
                          let toDate = values?.toDate ? `&ToDate=${values?.toDate}` : ""
                          if(profileData?.userTypeId === 2){
                            getRowData(
                              `/procurement/ShipRequestForQuotation/GetRFQEntryLandingShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&SBUId=${80}&RfqTypeId=1&PurchaseOrganizationId=${11}&PlantId=${0}&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}${fromDate}${toDate}&Search=${""}&UserId=${profileData?.userId}`
                              );
                          }else{
                            getRowData(
                              `/procurement/ShipRequestForQuotation/GetRFQEntryLandingShipPagination?AccountId=${profileData.accountId}&UnitId=${selectedBusinessUnit.value}&SBUId=${values?.sbu?.value}&RfqTypeId=1&PurchaseOrganizationId=${values?.purchaseOrg?.value}&PlantId=${values?.plant?.value}&Status=true&ViewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}${fromDate}${toDate}&Search=${""}&UserId=${profileData?.userId}`
                              );
                          }
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {profileData?.userTypeId === 2 && 
                      <div className="col-lg-2">
                        <button
                          style={{ marginTop: "18px" }}
                          className="btn btn-primary"
                          onClick={() => {
                            setIsChangePassModal(true);
                          }}
                        >
                          Change Password
                        </button>
                    </div>
                    }
                    
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Vessel</th>
                          <th>RFQ Type</th>
                          <th>RFQ Code</th>
                          <th>RFQ Date</th>
                          <th>Currency</th>
                          <th>Quotation Start Date</th>
                          <th>Quotation End Date</th>
                          <th style={{ width: "100px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.length > 0 &&
                          rowData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {item?.plantName}
                              </td>
                              <td>{item?.rfqTypeName}</td>
                              <td>{item?.strRequestForQuotationCode}</td>
                              <td>{_dateFormatter(item.rfqdate)}</td>
                              <td>{item?.currencyCode}</td>
                              <td>{`${item?.startDate?.split("T")[0]} / ${item?.startDate?.split("T")[1]}`}</td>
                              <td>{`${item?.endDate?.split("T")[0]} / ${item?.endDate?.split("T")[1]}`}</td>
                              <td className="text-center">
                                {profileData?.userTypeId === 2 ? 
                                  <span
                                  onClick={(e) => {
                                    setCurrentItem(item);
                                    setQuotationEntryView(true)
                                  }}
                                >
                                  <OverlayTrigger overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}>
                                    <span>
                                      <i className="fa pointer fa-eye ml-3"></i>
                                    </span>
                                  </OverlayTrigger>
                                </span> : 
                                <span
                                onClick={(e) => {
                                  history.push({
                                    pathname: `/mngProcurement/comparative-statement/shipping-cs/cs-details`,
                                    state: { ...item },
                                  })
                                }}
                              >
                                <OverlayTrigger overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}>
                                  <span>
                                    <i className="fa pointer fa-eye ml-3"></i>
                                  </span>
                                </OverlayTrigger>
                              </span>
                                }
                                 { !item?.isCreated &&
                                    <span
                                      onClick={(e) => {
                                         history.push({
                                            pathname: `/mngProcurement/comparative-statement/shipping-quotation-entry/create`,
                                            state: values,
                                            rowDetails: {...item}
                                          });
                                         }}
                                      >
                                      <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Create"}</Tooltip>}>
                                         <span>
                                            <i className="fa fa-plus pointer ml-3"></i>
                                         </span>
                                      </OverlayTrigger>
                                    </span>
                                 }
                                 {item?.isNegotiable && <span
                                    onClick={(e) => {
                                      setCurrentItem(item);
                                      setNegotiationDetails(true)
                                     }}
                                     >
                                    <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Negotiation"}</Tooltip>}>
                                       <span>
                                          <i className="fa fa-handshake-o pointer ml-3"></i>
                                       </span>
                                    </OverlayTrigger>
                                 </span>}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    </div>
                    <IViewModal
                      show={isNegotiationDetails}
                      onHide={() => setNegotiationDetails(false)}
                      title=" Supplier List for Negotiation"
                    >
                      <NegotiationSupplierDetails
                        currentItem={currentItem}
                        isHiddenBackBtn={true}
                      />
                    </IViewModal>
                    <IViewModal
                      show={isQuotationEntryView}
                      onHide={() => setQuotationEntryView(false)}
                      title="Item List For Quotation Entry"
                    >
                      <QuotationEntryDetails
                        currentItem={currentItem}
                        isHiddenBackBtn={true}
                      />
                    </IViewModal>

                    <IViewModal
                      show={isChangePassModal}
                      onHide={() => setIsChangePassModal(false)}
                      title="Change Supplier Password"
                    >
                      <ChangeSupplierPassword
                      isChangePassModal={isChangePassModal}
                      setIsChangePassModal={setIsChangePassModal}
                      logoutClick={logoutClick}
                      />
                    </IViewModal>
                    {rowData?.data?.length > 0 && (
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

export default ShippingQuotationEntry;

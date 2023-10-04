import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import ViewJournal from "./viewJournal";
const initData = {
  sbu: "",
  salesOrg: "",
  shipPoint: "",
  distributionChannel: "",
  soldToParty: "",
  fromDate: _todayDate(),
  toDate: _monthLastDate(),
};
export default function ExportFreightInfo() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [journalId,setJournalId] = useState()
  const [journalViewModal, setJournalViewModal] = useState(false);
  const [sbuDDL, getSbuDDL, sbuLoading] = useAxiosGet();
  const [
    salesOrgDDL,
    getSalesOrgDDL,
    salesOrgLoading,
    setSalesOrgDDL,
  ] = useAxiosGet();
  const [
    shipPointDDL,
    getShipPointDDL,
    shipPointLoading,
    setShipPointDDL,
  ] = useAxiosGet();
  const [
    distributionChannelDDL,
    getDistributionChannelDDL,
    distributionChannelLoading,
    setDistributionChannelDDL,
  ] = useAxiosGet();
  const [soldToPartyDDL, getSoldToPartyDDL, soldToPartyLoading] = useAxiosGet();
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getSbuDDL(
      `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getSalesOrgDDL(
      `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${36}`,
      (data) => {
        // filter data as per requirement
        const filterSalesOrderDDL = data?.filter((d) => d?.value === 7);
        setSalesOrgDDL(filterSalesOrderDDL);
      }
    );
    getShipPointDDL(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        setShipPointDDL(
          data?.map((data) => {
            return {
              value: data?.organizationUnitReffId,
              label: data?.organizationUnitReffName,
              address: data?.address,
            };
          })
        );
      }
    );
    getDistributionChannelDDL(
      `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${36}`,
      (data) => {
        // filtering data as per requirement
        const modifedDistributionChannel = data?.filter(
          (data) => data?.value === 96
        );
        setDistributionChannelDDL(modifedDistributionChannel);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {(sbuLoading ||
            salesOrgLoading ||
            shipPointLoading ||
            distributionChannelLoading ||
            rowDataLoader ||
            soldToPartyLoading) && <Loading />}
          <IForm
            title="Export Freight Info"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled
                    onClick={() => {
                      //   history.push(
                      //     `/managementExport/exptransaction/salesorder/create`,
                      //     { landingData: values }
                      //   );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL}
                    value={values?.sbu}
                    label="SBU"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("sbu", valueOption);
                        setFieldValue("distributionChannel", "");
                      } else {
                        setFieldValue("sbu", "");
                        setFieldValue("distributionChannel", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOrg"
                    isDisabled={!values?.sbu?.value}
                    options={salesOrgDDL}
                    value={values?.salesOrg}
                    label="Sales Org"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("salesOrg", valueOption);
                      } else {
                        setFieldValue("salesOrg", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    isDisabled={!values?.salesOrg?.value}
                    options={shipPointDDL}
                    value={values?.shipPoint}
                    label="ShipPoint"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shipPoint", valueOption);
                      } else {
                        setFieldValue("shipPoint", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    isDisabled={!values?.shipPoint?.value}
                    options={distributionChannelDDL}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("distributionChannel", valueOption);
                        getSoldToPartyDDL(
                          `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerForSalesOrderDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&Sbuid=${values?.sbu?.value}&SalesOrg=${values?.salesOrg?.value}&ShipPoint=${values?.shipPoint?.value}&DistributionChannel=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("distributionChannel", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="soldToParty"
                    isDisabled={!values?.distributionChannel?.value}
                    options={soldToPartyDDL}
                    value={values?.soldToParty}
                    label="Sold To Party"
                    onChange={(valueOption) => {
                      setFieldValue("soldToParty", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    name="fromDate"
                    value={values?.fromDate}
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    name="toDate"
                    value={values?.toDate}
                    placeholder="To Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: "17px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getRowData(
                        `/oms/SalesOrder/GetSalesOrderJournalInfo?businessUnitId=${selectedBusinessUnit?.value}&distributionChannelId=${values?.distributionChannel?.value}&businessPartnerId=${values?.soldToParty?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                      );
                    }}
                    disabled={false}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 table-responsive">
                  <table className="table table-striped table-bordered global-table sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "90px" }}>Sales Order Code</th>
                        <th style={{ width: "90px" }}>Journal Code</th>
                        <th>Narration</th>
                        <th>Ledger Name</th>
                        <th>Business Partner Name</th>
                        <th>Amount</th>
                        <th>Transaction Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {td?.salesOrderCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.accountingJournalCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.narration}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.generalLedgerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.businessPartnerName}
                              </div>
                            </td>
                            <td>
                                <div>{td?.freightAmount}</div>
                                </td>
                            <td>{_dateFormatter(td?.transactionDate)}</td>
                            <td>
                                <div>
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      setJournalId(td?.accountingJournalId);
                                      setJournalViewModal(true);
                                    }}
                                  />
                                </span>
                                </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                 <IViewModal
                  title="View Journal"
                  show={journalViewModal}
                  onHide={() => {
                    setJournalViewModal(false);
                    setJournalId(null);
                  }}
                 >
                   <ViewJournal journalId={journalId}/>
                 </IViewModal>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

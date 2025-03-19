/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { updateMRRStatus } from "../helper";
import GridView from "./table";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  type: { value: 0, label: "All" },
  channel: "",
  region: "",
  area: "",
  territory: "",
  bank: { value: 0, label: "All" },
};

const PartnerChequeInfo = () => {
  const [loader, setLoader] = useState(false);
  const [rowData, getRowData, isLoading, setRowData] = useAxiosGet();
  const [customerDDL, getCustomerDDL] = useAxiosGet();
  const [bankDDL, getBankDDL] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getBankDDL(`/costmgmt/BankAccount/GETBankDDl`);
  }, []);

  const getData = (values) => {
    const typeId = values?.type?.value || 0;
    const fromDate = values?.fromDate || _todayDate();
    const toDate = values?.toDate || _todayDate();
    const channelId = values?.channel?.value || 0;
    const regionId = values?.region?.value || 0;
    const areaId = values?.area?.value || 0;
    const territoryId = values?.territory?.value || 0;
    const bankId = values?.bank?.value || 0;
    const customerId = values?.customer?.value;

    const url = `/oms/SalesInformation/CustomerChecqueInfo?Partid=1&FromDate=${fromDate}&ToDate=${toDate}&intCustomerId=${customerId}&UnitId=${buId}&ChannelID=${channelId}&RegionId=${regionId}&AreaId=${areaId}&TerritoryId=${territoryId}&BankId=${bankId}&StatusId=${typeId}`;
    getRowData(url, (resData) =>
      setRowData(resData?.map((item) => ({ ...item, isSelected: false })))
    );
  };

  const changeMRRStatus = (values) => {
    const payload = rowData
      ?.filter((item) => item?.isSelected)
      ?.map((item) => ({
        mrrAutoId: item?.intDepositEntryPKId,
        isMRRComplete: values?.type?.value === 2,
        updateBy: userId,
      }));
    updateMRRStatus(payload, setLoader, () => {
      getData(values);
    });
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard title="Partner Cheque Info">
              {(isLoading || loader) && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <NewSelect
                        name="type"
                        options={[
                          { value: 0, label: "All" },
                          { value: 1, label: "Completed" },
                          { value: 2, label: "Pending" },
                        ]}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          setRowData([]);
                        }}
                        placeholder="Select Type"
                      />
                    </div>
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        onChange: (allValues, fieldName) => {
                          if (fieldName === "channel") {
                            setFieldValue("customer", "");
                            getCustomerDDL(
                              `/partner/BusinessPartnerBasicInfo/GetCustomerDDlByDistribution?AccountId=${accId}&BusienssUnitId=${buId}&DistributionId=${allValues?.channel?.value}`
                            );
                          }
                        },
                      }}
                    />
                    <div className="col-md-3">
                      <NewSelect
                        name="customer"
                        options={[{ value: 0, label: "All" }, ...customerDDL]}
                        value={values?.customer}
                        label="Customer"
                        onChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                        }}
                        placeholder="Select Customer"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="bank"
                        options={[{ value: 0, label: "All" }, ...bankDDL]}
                        value={values?.bank}
                        label="Bank Name"
                        onChange={(valueOption) => {
                          setFieldValue("bank", valueOption);
                        }}
                        placeholder="Select Bank Name"
                      />
                    </div>
                    <IButton
                      onClick={() => {
                        getData(values);
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  {rowData?.length > 0 && [1, 2].includes(values?.type?.value) && (
                    <button
                      className={`btn btn-${
                        values?.type?.value === 1 ? "danger" : "primary"
                      }`}
                      type="button"
                      onClick={() => {
                        changeMRRStatus(values);
                      }}
                      disabled={
                        rowData?.filter((item) => item?.isSelected)?.length < 1
                      }
                    >
                      {`MRR ${
                        values?.type?.value === 1 ? "Role Back" : "Completed"
                      }`}
                    </button>
                  )}
                </div>
                <GridView
                  rowData={rowData}
                  setRowData={setRowData}
                  values={values}
                />
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerChequeInfo;

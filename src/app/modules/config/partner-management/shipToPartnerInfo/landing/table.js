import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getChannelDDL } from "../../../../salesManagement/configuration/territoryInfo/helper";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import ICard from "../../../../_helper/_card";
import {
  getRegionAreaTerritoryDDL,
  getShipToPartnerInformation,
  getTransportZoneDDL,
  getBusinessPartnerByEmployeeId,
  getOperationalZoneInfo,
  shiptopartnerOperationalZoneSave,
  GetEmployeeLoginInfo_api,
} from "../helper";
import {
  getCustomerNameDDL,
  GetSalesOrganizationDDL_api,
  getShipToParty,
} from "../../../../salesManagement/report/shipToPartyDelivery/helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import Update from "./update";
import IConfirmModal from "../../../../_helper/_confirmModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  channel: "",
  reportType: { value: 2, label: "Sold To Partner Base" },
  shipToPartner: "",
  soldToPartner: "",
  territory: "",
  area: "",
  region: "",
  zone: "",
};

const reportTypeDDL = [
  { value: 1, label: "Ship To Partner Base" },
  { value: 2, label: "Sold To Partner Base" },
  { value: 3, label: "Territory Base" },
  { value: 4, label: "Area Base" },
  { value: 5, label: "Region Base" },
  { value: 6, label: "Channel Base" },
  { value: 7, label: "Unit Base" },
];

export function ShipToPartnerInfoTable() {
  const [channelDDL, setChannelDDL] = useState([]);
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState({});
  const [zoneDDL, setZoneDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regionAreaTerritoryDDL, setRegionAreaTerritoryDDL] = useState([]);
  const [shipToPartyDDL, setShipToPartyDDL] = useState([]);
  const [salesOrgDDL, setSalesOrgDDL] = useState([]);
  const [soldToPartnerDDL, setSoldToPartnerDDL] = useState([]);
  const [transportZoneDDL, setTransportZoneDDL] = useState([]);
  const [show, setShow] = useState(false);
  const [singleRow, setSingleRow] = useState({});
  const [, getSoldToPartners, isLoading] = useAxiosGet();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelDDL
    );
    GetSalesOrganizationDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSalesOrgDDL
    );
    getTransportZoneDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTransportZoneDDL
    );
    GetEmployeeLoginInfo_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setEmployeeLoginInfo
    );
  }, [profileData, selectedBusinessUnit]);

  const getTerritory = (typeId) => {
    let id = typeId;
    id = typeId === 3 ? 73 : typeId === 4 ? 72 : typeId === 5 ? 71 : "";
    if (id) {
      getRegionAreaTerritoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        id,
        setRegionAreaTerritoryDDL,
        setLoading
      );
    }
  };

  const getGridData = (values) => {
    getShipToPartnerInformation(
      values?.reportType?.value,
      values?.shipToPartner?.value || 0,
      values?.soldToPartner?.value || 0,
      values?.territory?.value || 0,
      values?.area?.value || 0,
      values?.region?.value || 0,
      values?.channel?.value || 0,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading
    );
  };

  // if default reportType Sold To Partner Base select
  useEffect(() => {
    getTerritory(reportTypeDDL?.[0]?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const soldToPartnerHandle = (valueOption, values) => {
    // reportType Sold To Partner Base select
    if (values?.reportType?.value === 2) {
      // if user Corporate
      if (profileData?.workPlaceName.includes("Corporate")) {
        if ([521235, 57933].includes(profileData?.userId)) {
          getSoldToPartners(
            `/partner/BusinessPartnerSales/BusinessPartnerByEmployeeIdForHeadOffice?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&EmployeeId=${profileData?.userId}`,
            (resData) => {
              setSoldToPartnerDDL(
                resData?.map((item) => ({
                  ...item,
                  value: item?.businessPartnerId,
                  label: item?.businessPartnerName,
                }))
              );
            }
          );
        } else {
          getCustomerNameDDL(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            valueOption?.value,
            setSoldToPartnerDDL
          );
        }
      } else {
        // if user not Corporate
        getBusinessPartnerByEmployeeId(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          profileData?.employeeId,
          setSoldToPartnerDDL
        );
      }
    } else {
      getCustomerNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        valueOption?.value,
        setSoldToPartnerDDL
      );
    }
  };

  // one item select
  const itemSlectedHandler = (index) => {
    const copyRowDto = [...gridData];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setGridData(copyRowDto);
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setGridData(modifyGridData);
  };
  const isSelect = gridData?.some((itm) => itm?.itemCheck);

  return (
    <>
      <ICard
        title="Ship To Partner Information"
        isPrint={true}
        isExcelBtn={true}
        excelFileNameWillbe="shipToPartnerInfo"
      >
        <Formik
          initialValues={initData}
          enableReinitialize={true}
          onSubmit={(values) => {
            getGridData(values);
          }}
        >
          {({ values, setFieldValue, handleSubmit, setValues }) => (
            <>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    label="Report Type"
                    placeholder="Report Type"
                    options={reportTypeDDL}
                    value={values?.reportType}
                    onChange={(valueOption) => {
                      getTerritory(valueOption?.value);
                      setValues({ ...initData, reportType: valueOption });
                    }}
                    isDisabled={
                      employeeLoginInfo?.empLevelId === 0 ? false : true
                    }
                  />
                </div>
                {[1, 2]?.includes(values?.reportType?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrg"
                        options={salesOrgDDL || []}
                        value={values?.salesOrg}
                        label="Sales Org"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrg", valueOption);
                          setFieldValue("customerNameDDL", "");
                          setSoldToPartnerDDL([]);
                          if (valueOption) {
                            soldToPartnerHandle(valueOption, values);
                          }
                        }}
                        isDisabled={!values?.reportType}
                        placeholder="Sales Org"
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="soldToPartner"
                        options={soldToPartnerDDL || []}
                        value={values?.soldToPartner}
                        label="Sold To Partner"
                        onChange={(valueOption) => {
                          setFieldValue("soldToPartner", valueOption);
                          setFieldValue("shipToParty", "");
                          setFieldValue("territory", "");
                          setShipToPartyDDL([]);
                          setZoneDDL([]);
                          getShipToParty(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setShipToPartyDDL
                          );
                          getOperationalZoneInfo(
                            valueOption?.value,
                            setZoneDDL
                          );
                        }}
                        placeholder="Sold To Partner"
                        isDisabled={!values?.reportType || !values?.salesOrg}
                      />
                    </div>
                    {values?.reportType?.value === 1 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipToPartner"
                          options={shipToPartyDDL || []}
                          value={values?.shipToPartner}
                          label="Ship To Partner"
                          onChange={(valueOption) => {
                            setFieldValue("shipToPartner", valueOption);
                          }}
                          placeholder="Ship To Partner"
                          isDisabled={!values?.reportType}
                        />
                      </div>
                    )}
                  </>
                )}
                {values?.reportType?.value === 3 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      placeholder="Territory"
                      value={values?.territory}
                      label="Territory"
                      onChange={(valueOption) => {
                        setFieldValue("territory", valueOption);
                        setGridData([]);
                      }}
                      options={regionAreaTerritoryDDL || []}
                    />
                  </div>
                )}
                {values?.reportType?.value === 4 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      placeholder="Area"
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setFieldValue("area", valueOption);
                        setGridData([]);
                      }}
                      options={regionAreaTerritoryDDL || []}
                    />
                  </div>
                )}
                {values?.reportType?.value === 5 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="region"
                      placeholder="Region"
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        setFieldValue("region", valueOption);
                        setGridData([]);
                      }}
                      options={regionAreaTerritoryDDL || []}
                    />
                  </div>
                )}
                {values?.reportType?.value === 6 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      placeholder="Distribution Channel"
                      value={values?.channel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setFieldValue("channel", valueOption);
                        setGridData([]);
                      }}
                      options={channelDDL}
                    />
                  </div>
                )}
                {values?.reportType?.value === 2 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="zone"
                      placeholder="Zone"
                      value={values?.zone}
                      label="Zone"
                      onChange={(valueOption) => {
                        setFieldValue("zone", valueOption);
                        // setGridData([]);
                      }}
                      options={zoneDDL || []}
                    />
                  </div>
                )}
                <div className="col mt-5 d-flex justify-content-end">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!values?.reportType}
                  >
                    Show
                  </button>
                  {values?.reportType?.value === 2 && (
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={() => {
                        let confirmObject = {
                          title: `Are you sure for zone name "${values?.zone?.label}"?`,
                          closeOnClickOutside: false,
                          yesAlertFunc: () => {
                            const partnerList = gridData
                              .filter((itm) => itm?.itemCheck)
                              .map((itm) => itm?.intShiptoPartnerId);

                            const isCheckList = gridData.filter(
                              (itm) => itm?.itemCheck
                            );

                            const payload = {
                              configId: 0,
                              accountId: profileData?.accountId,
                              businessUnitId: selectedBusinessUnit?.value,
                              territoryId: isCheckList?.[0]?.l7 || 0,
                              l8Id: values?.zone?.value,
                              businessPartnerId: values?.soldToPartner?.value,
                              shiptoPartnerId: 0,
                              actionBy: profileData?.userId,
                              active: true,
                              partnerList: partnerList,
                              zonename: values?.zone?.label,
                            };

                            shiptopartnerOperationalZoneSave(
                              payload,
                              setLoading,
                              () => {
                                getGridData(values);
                              }
                            );
                          },
                          noAlertFunc: () => {},
                        };
                        IConfirmModal(confirmObject);
                      }}
                      disabled={
                        !values?.reportType ||
                        !values?.zone ||
                        !values?.soldToPartner ||
                        !isSelect
                      }
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              {(loading || isLoading) && <Loading />}
              {values?.reportType?.value === 2 && gridData?.length > 0 && (
                <p className="text-right p-0 m-0">
                  <span className="pr-3">
                    Total Shop:
                    <b>{gridData?.length}</b>
                  </span>
                  <span>
                    Select Total Shop:
                    <b>{gridData?.filter((itm) => itm.itemCheck).length}</b>
                  </span>
                </p>
              )}

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table
                    className="table table-striped table-bordered global-table"
                    id="table-to-xlsx"
                  >
                    <thead>
                      <tr>
                        {values?.reportType?.value === 2 && (
                          <th style={{ width: "25px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                        )}
                        <th>SL</th>
                        <th>Ship To Partner Id</th>
                        <th>Ship To Partner Name</th>
                        <th>Business Partner Id</th>
                        <th>Business Partner Name</th>
                        <th>Business Partner Address</th>
                        <th>Shipping Address</th>
                        <th>Shipping Contact</th>
                        <th>Distribution Channel</th>
                        <th>Transport Zone Name</th>
                        <th>Region</th>
                        <th>Area</th>
                        <th>Territory</th>
                        <th>Zone</th>
                        <th>Creation Date</th>
                        {profileData?.workPlaceName.includes("Corporate") && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          {values?.reportType?.value === 2 && (
                            <td>
                              <input
                                id="itemCheck"
                                type="checkbox"
                                className=""
                                value={item?.itemCheck}
                                checked={item?.itemCheck}
                                name={item?.itemCheck}
                                onChange={(e) => {
                                  itemSlectedHandler(index);
                                }}
                              />
                            </td>
                          )}

                          <td> {index + 1}</td>
                          <td>{item?.intShiptoPartnerId}</td>
                          <td>{item?.strPartnerShippingName}</td>
                          <td>{item?.intBusinessPartnerId}</td>
                          <td>{item?.strBusinessPartnerName}</td>
                          <td>{item?.strBusinessPartnerAddress}</td>
                          <td>{item?.strPartnerShippingAddress}</td>
                          <td>{item?.strPartnerShippingContact}</td>
                          <td>{item?.strDistributionChannelName}</td>
                          <td>{item?.strTransportZoneName}</td>
                          <td>{item?.nl5}</td>
                          <td>{item?.nl6}</td>
                          <td>{item?.nl7}</td>
                          <td>{item?.nl8}</td>
                          <td>{_dateFormatter(item?.dteServerDateTimesa)}</td>
                          {profileData?.workPlaceName.includes("Corporate") && (
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary px-1"
                                onClick={() => {
                                  setSingleRow(item);
                                  setShow(true);
                                }}
                              >
                                Update
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <IViewModal
                show={show}
                onHide={() => setShow(false)}
                modelSize="md"
                isModalFooterActive={false}
              >
                <Update
                  transportZoneDDL={transportZoneDDL}
                  singleRow={singleRow}
                  setShow={setShow}
                  profileData={profileData}
                  getGridData={getGridData}
                  values={values}
                />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
}

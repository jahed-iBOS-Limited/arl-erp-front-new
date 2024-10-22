import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import {
  getShipToPartnerInfo,
  getTransportZoneDDL,
  shipToPartnerInfoUpdate,
  shipToPartnerTransfer_api,
  shipToTransferZone_api,
} from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import NationalIdViewModal from "./modals/NationalIdViewModal";
import TradeLicenceModal from "./modals/TradeLicenceModal";

const initData = {
  channel: "",
  preCustomer: "",
  nextCustomer: "",
  type: "",
  transportZone: "",
  region: "",
  area: "",
  territory: "",
  status: { value: 0, label: "All" },
};

export function ShipToPartnerTransfer() {
  const [transportZoneDDL, setTransportZOneDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [showNIDModal, setShowNIDModal] = useState(false);
  const [showTradeLicenceModal, setShowTradeLicenceModal] = useState(false);
  const [nidImg, setNidImg] = useState("");
  const [transactionImg, setTransactionImg] = useState("");

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getTransportZoneDDL(accId, buId, setTransportZOneDDL);
  }, [accId, buId]);

  const getGridData = (values) => {
    getShipToPartnerInfo(
      values?.preCustomer?.value,
      values?.channel?.value,
      values?.region?.value,
      values?.area?.value,
      values?.territory?.value,
      values?.status?.value,
      setGridData,
      setTempData,
      setLoading
    );
  };

  const shipToPartnerTransfer = (values) => {
    const allGridCheckList = gridData?.filter((itm) => itm?.itemCheck);

    if (allGridCheckList?.length === 0)
      return toast.warning("You must have to select atleast one item");
    const payload = {
      currentPartnerId: values?.preCustomer?.value,
      updatedPartnerId: values?.nextCustomer?.value,
      actionById: userId,
      partnerList: allGridCheckList?.map((item) => item?.shipToPartnerId),
    };
    shipToPartnerTransfer_api(payload, setLoading);
  };

  const shipToTransferZone = (values) => {
    const allGridCheckList = gridData?.filter((itm) => itm?.itemCheck);

    if (allGridCheckList?.length === 0)
      return toast.warning("You must have to select atleast one item");

    const payload = allGridCheckList?.map((data) => {
      return {
        empUserId: userId,
        shipToPartnerId: data?.shipToPartnerId,
        transportZoneId: values?.transportZone?.value,
      };
    });
    shipToTransferZone_api(payload, setLoading, () => {
      getGridData(values);
    });
  };

  const updateHandler = () => {
    const selectedItems = gridData?.filter((item) => item?.itemCheck);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one item!");
    }

    const payload = selectedItems?.map((element) => ({
      empUserId: userId,
      shiptoPartnerId: element?.shipToPartnerId,
      accountId: accId,
      businessUnitId: buId,
      businessPartnerId: element?.businessPartnerId,
      partnerShippingAddress: element?.shipToPartnerAddress,
      partnerShippingContact: element?.shipToPartnerContact,
      updateBy: userId,
      remarks: "",
      active:element?.isActive
    }));
    shipToPartnerInfoUpdate(payload, setLoading);
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...gridData];
    _data[index][name] = value;
    setGridData(_data);
  };

  const allSelect = (value) => {
    let _data = [...gridData];
    const modify = _data.map((item) => {
      return {
        ...item,
        itemCheck: value,
      };
    });
    setGridData(modify);
  };

  const selectedAll = () => {
    return gridData?.length > 0 &&
      gridData?.filter((item) => item?.itemCheck)?.length === gridData?.length
      ? true
      : false;
  };

  return (
    <>
      <ICard
        title="Ship To Partner Transfer"
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
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <>
              <div className="row global-form">
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: (allValues, fieldName) => {
                      if (fieldName === "channel") {
                        setFieldValue("preCustomer", "");
                        setFieldValue("nextCustomer", "");
                        setGridData([]);
                      }
                    },
                  }}
                />

                <div className="col-lg-3">
                  <div>
                    <label>Customer (Previous)</label>
                    <SearchAsyncSelect
                      selectedValue={values?.preCustomer}
                      handleChange={(valueOption) => {
                        setFieldValue("preCustomer", valueOption);
                        setFieldValue("nextCustomer", "");
                        setGridData([]);
                      }}
                      isDisabled={!values?.channel}
                      placeholder="Search Customer"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/partner/PManagementCommonDDL/CustomerDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={[
                      { value: 0, label: "All" },
                      { value: 1, label: "Pending" },
                      { value: 2, label: "Approve" },
                    ]}
                    value={values?.status}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                    }}
                    placeholder="Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!values?.preCustomer}
                  >
                    Show
                  </button>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Shop Transfer" },
                      { value: 2, label: "Transport Zone Change" },
                      { value: 3, label: "Update Ship to Partner Info" },
                    ]}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setGridData([...tempData]);
                      setFieldValue("type", valueOption);
                    }}
                    placeholder="Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={!gridData?.length}
                  />
                </div>

                {values?.type?.value === 1 ? (
                  <>
                    <div className="col-lg-3">
                      <div>
                        <label>Customer (Next)</label>
                        <SearchAsyncSelect
                          selectedValue={values?.nextCustomer}
                          handleChange={(valueOption) => {
                            setFieldValue("nextCustomer", valueOption);
                          }}
                          isDisabled={!values?.channel}
                          placeholder="Search Customer"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/CustomerDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          shipToPartnerTransfer(values);
                        }}
                        disabled={!values?.nextCustomer}
                      >
                        Transfer
                      </button>
                    </div>
                  </>
                ) : values?.type?.value === 2 ? (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="transportZone"
                        options={transportZoneDDL}
                        value={values?.transportZone}
                        label="Transport Zone"
                        onChange={(valueOption) => {
                          setFieldValue("transportZone", valueOption);
                        }}
                        placeholder="Transport Zone"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-info"
                        type="button"
                        onClick={() => {
                          shipToTransferZone(values);
                        }}
                        disabled={!values?.transportZone}
                      >
                        Transfer Transport Zone
                      </button>
                    </div>
                  </>
                ) : values?.type?.value === 3 ? (
                  <IButton
                    colSize={"col-lg-3"}
                    onClick={() => {
                      updateHandler();
                    }}
                  >
                    Update
                  </IButton>
                ) : (
                  <></>
                )}
              </div>
              {loading && <Loading />}

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table
                    className="table table-striped table-bordered global-table"
                    id="table-to-xlsx"
                  >
                    <thead>
                      <tr>
                        <th
                          style={{ width: "25px" }}
                          onClick={() => allSelect(!selectedAll())}
                        >
                          <input
                            type="checkbox"
                            id="parent"
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>
                        <th>SL</th>
                        <th>Business Partner Name</th>
                        <th>Business Partner Address</th>
                        <th>Ship To Partner Id</th>
                        <th>Ship To Partner Name</th>
                        <th>Active</th>
                        <th>Ship To Partner Address</th>
                        <th>Ship To Partner Contact No</th>
                        <th>Transport Zone Name</th>
                        <th>National ID</th>
                        <th>Facebook </th>
                        <th>Trade Licence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td
                            onClick={() => {
                              rowDataHandler(
                                "itemCheck",
                                index,
                                !item.itemCheck
                              );
                            }}
                            style={
                              item?.itemCheck
                                ? {
                                    backgroundColor: "#aacae3",
                                    width: "30px",
                                  }
                                : { width: "30px" }
                            }
                          >
                            <input
                              id="itemCheck"
                              type="checkbox"
                              value={item.itemCheck}
                              checked={item.itemCheck}
                              onChange={(e) => {}}
                            />
                          </td>
                          <td> {index + 1}</td>
                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.businessPartnerAddress}</td>
                          <td>{item?.shipToPartnerId}</td>
                          <td>{item?.shipToPartnerName}</td>
                          <td
                            onClick={() => {
                              const data = [...gridData];
                              data[index]["isActive"] = !item?.isActive;
                              setGridData(data);
                            }}
                          >
                            <input
                              id="itemCheck"
                              type="checkbox"
                              value={item.isActive}
                              checked={item.isActive}
                              onChange={(e) => {}}
                            />
                          </td>
                          <td>
                            {values?.type?.value === 3 ? (
                              <InputField
                                name="shipToPartnerAddress"
                                value={item?.shipToPartnerAddress}
                                onChange={(e) => {
                                  rowDataHandler(
                                    "shipToPartnerAddress",
                                    index,
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              item?.shipToPartnerAddress
                            )}
                          </td>
                          <td>
                            {values?.type?.value === 3 ? (
                              <InputField
                                name="shipToPartnerContact"
                                value={item?.shipToPartnerContact}
                                onChange={(e) => {
                                  rowDataHandler(
                                    "shipToPartnerContact",
                                    index,
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              item?.shipToPartnerContact
                            )}
                          </td>
                          <td>{item?.transportZoneName}</td>
                          <td
                            className="text-center"
                            onClick={() => {
                              setShowNIDModal(true);
                              setNidImg(item?.nationalId);
                            }}
                          >
                            {" "}
                            <IView />{" "}
                          </td>
                          <td className="text-center">
                            {/* <a href={item?.facebookLink}  target="_blank"> <InsertLinkIcon /> </a> */}
                            <i class="fa fa-link" aria-hidden="true"></i>
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => {
                              setShowTradeLicenceModal(true);
                              setTransactionImg(item?.tradeLicenseImg);
                            }}
                          >
                            {" "}
                            <IView />{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <NationalIdViewModal
                    show={showNIDModal}
                    onHide={() => setShowNIDModal(false)}
                    nationalIdImg={nidImg}
                  />
                  <TradeLicenceModal
                    show={showTradeLicenceModal}
                    onHide={() => setShowTradeLicenceModal(false)}
                    transactionImg={transactionImg}
                  />
                </div>
              )}
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
}

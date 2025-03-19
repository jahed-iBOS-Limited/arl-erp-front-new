/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import TextArea from "../../../../_helper/TextArea";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IButton from "../../../../_helper/iButton";
import {
  GetDomesticPortDDL,
  // GetLighterAllotmentPagination,
  getMotherVesselDDL,
} from "../../generalInformation/helper";
import AttachFile from "../../../../_helper/commonInputFieldsGroups/attachemntUpload";

const initData = {
  port: "",
  motherVessel: "",
  carrierName: "",
  jvDate: _todayDate(),
  narration: "",
  billRef: "",
};
const headers = [
  "SL",
  "Mother Vessel",
  "Lighter Vessel",
  "Program No",
  "Carrier Agent",
  "Survey Quantity",
  "Carrier Rate",
  "Bill Amount",
  // "Action",
];

const VesselRevenueLanding = () => {
  const [portDDL, setPortDDL] = useState([]);
  const [gridData, getGridData, loader, setGridData] = useAxiosGet();
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterCarrierDDL, getLighterCarrierDDL] = useAxiosGet();
  const [, postJV, loading] = useAxiosPost();
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImage] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const setLandingData = (values, searchValue = "") => {
    const search = searchValue ? `&SearchTerm=${searchValue}` : "";
    getGridData(
      `/tms/LigterLoadUnload/PreDataForLighterVesselCarrierBillG2G?AccountId=${accId}&BusinessUnitId=${buId}&MotherVesselId=${values?.motherVessel?.value}&CarrierAgentId=${values?.carrierName?.value}${search}`,
      (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            ...item,
            isSelected: false,
          };
        });
        setGridData(modifyData);
      }
    );

    // previous API calling function
    // GetLighterAllotmentPagination(
    //   accId,
    //   buId,
    //   values?.motherVessel?.value,
    //   values?.port?.value,
    //   setGridData,
    //   setLoading,
    //   _pageNo,
    //   _pageSize
    // );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setLandingData(values, searchValue);
  };

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const createJV = (values) => {
    const payload = gridData
      ?.filter((item) => item?.isSelected)
      ?.map((element) => {
        return {
          accountId: accId,
          businessUnitId: buId,
          sbuId: element?.sbuId,
          lighterVesselId: element?.lighterVesselId,
          carrierAmount: element?.carrierTotalAmount || 0,
          narration: values?.narration,

          billTypeId: 17,

          dteDate: values?.jvDate,
          confirmBy: userId,
          remarks: values?.narration,
          supplierId: values?.carrierName?.value,
          supplierName: values?.carrierName?.label,
          billRef: values?.billRef,
          imageId: uploadedImages[0]?.id,
        };
      });
    postJV(
      `/tms/LigterLoadUnload/G2GLighterVesselCarrierBillJV?JVType=G2G%20Lighter%20Vessel%20Carrier%20Bill&ActionBy=${userId}&JVDate=${values?.jvDate}`,
      payload,
      () => {
        setLandingData(values, "");
      },
      true
    );
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
        isSelected: value,
      };
    });
    setGridData(modify);
  };

  const selectedAll = () => {
    return gridData?.length > 0 &&
      gridData?.filter((item) => item?.isSelected)?.length === gridData?.length
      ? true
      : false;
  };

  const getTotal = (key) => {
    const total = gridData
      ?.filter((item) => item?.isSelected)
      ?.reduce((a, b) => (a += +b?.[key]), 0);
    return total;
  };

  let totalQty = 0;
  let totalAmount = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard title="Lighter Carrier Bill">
              {(loader || loading) && <Loading />}

              <form className="form form-label-right">
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="port"
                      options={portDDL || []}
                      value={values?.port}
                      label="Port"
                      onChange={(valueOption) => {
                        setFieldValue("port", valueOption);
                        setFieldValue("motherVessel", "");
                        getMotherVesselDDL(
                          accId,
                          buId,
                          setMotherVesselDDL,
                          valueOption?.value
                        );
                        getLighterCarrierDDL(
                          `/wms/FertilizerOperation/GetLighterCarrierDDL?BusinessUnitId=${buId}&PortId=${valueOption?.value}`
                        );
                      }}
                      placeholder="Port"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="motherVessel"
                      options={motherVesselDDL}
                      value={values?.motherVessel}
                      label="Mother Vessel"
                      onChange={(valueOption) => {
                        setFieldValue("motherVessel", valueOption);
                      }}
                      placeholder="Mother Vessel"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      label="Carrier Name"
                      placeholder="Carrier Name"
                      value={values?.carrierName}
                      name="carrierName"
                      options={
                        lighterCarrierDDL?.map((itm) => ({
                          ...itm,
                          value: itm?.carrierId,
                          label: itm?.carrierName,
                        })) || []
                      }
                      onChange={(e) => {
                        setFieldValue("carrierName", e);
                      }}
                      isDisabled={false}
                    />
                  </div>
                  {gridData?.length > 0 && (
                    <>
                      <div className="col-lg-3">
                        <InputField
                          label="JV Date"
                          placeholder="JV Date"
                          value={values?.jvDate}
                          name="jvDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Bill Ref"
                          placeholder="Bill Ref"
                          value={values?.billRef}
                          name="billRef"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label>Narration</label>
                        <TextArea
                          placeholder="Narration"
                          value={values?.narration}
                          name="narration"
                          rows={3}
                        />
                      </div>
                      <div className="col-lg-2">
                        <button
                          className="btn btn-primary mr-2 mt-5"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          Attachment
                        </button>
                      </div>
                      {/* )} */}
                    </>
                  )}

                  <IButton
                    onClick={() => {
                      setLandingData(values);
                    }}
                  />
                </div>
              </form>
              <div className="mt-5">
                <PaginationSearch
                  placeholder="Program No"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              {gridData?.length > 0 && (
                <div className="row my-3">
                  <div className="col-lg-4">
                    <h4>Total Quantity: {getTotal("surveyQuantity")}</h4>
                  </div>
                  <div className="col-lg-4">
                    <h4>Total Amount: {getTotal("carrierTotalAmount")}</h4>
                  </div>

                  <div className="col-lg-4 text-right">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        createJV(values);
                      }}
                      disabled={
                        !values?.narration ||
                        !values?.billRef ||
                        gridData?.filter((item) => item?.isSelected)?.length <
                          1 ||
                        loader ||
                        loading
                      }
                    >
                      Create JV
                    </button>
                  </div>
                </div>
              )}
              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table
                    id="table-to-xlsx"
                    className={
                      "table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        <th
                          onClick={() => allSelect(!selectedAll())}
                          style={{ width: "30px" }}
                        >
                          <input
                            type="checkbox"
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => {
                        totalQty += item?.surveyQuantity;
                        totalAmount += item?.carrierTotalAmount;
                        return (
                          <tr key={index}>
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  "isSelected",
                                  index,
                                  !item.isSelected
                                );
                              }}
                              className="text-center"
                              style={
                                item?.isSelected
                                  ? {
                                      backgroundColor: "#aacae3",
                                      width: "30px",
                                    }
                                  : { width: "30px" }
                              }
                            >
                              <input
                                type="checkbox"
                                value={item?.isSelected}
                                checked={item?.isSelected}
                                onChange={() => {}}
                              />
                            </td>
                            <td> {index + 1}</td>
                            <td>{item?.motherVesselName}</td>
                            <td>{item?.lighterVesselName}</td>
                            <td>{item?.program}</td>
                            <td>{item?.carrierAgentName}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.surveyQuantity, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.carrierRate, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.carrierTotalAmount, true)}
                            </td>
                          </tr>
                        );
                      })}
                      {gridData?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={6}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalQty, true)}
                          </td>
                          <td></td>{" "}
                          <td className="text-right">
                            {_fixedPoint(totalAmount, true)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </ICustomCard>
            <AttachFile obj={{ open, setOpen, setUploadedImage }} />
          </>
        )}
      </Formik>
    </>
  );
};

export default VesselRevenueLanding;

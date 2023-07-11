import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import IConfirmModal from "../../../../_helper/_confirmModal";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import TextArea from "../../../../_helper/TextArea";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost"; 
import { getTotal } from "../../../common/helper";
import { getMotherVesselDDL } from "../../tenderInformation/helper";
import {
  GetDomesticPortDDL,
  GetLighterAllotmentPagination,
  updateCNFInfo,
} from "../helper";
import CommissionRevenueCostTable from "./comRevCostTable";
import GeneralInfoTable from "./generalInfoTable";
import CNFTable from "./cnfTable";
import AttachFile from "../../../../_helper/commonInputFieldsGroups/attachemntUpload";

const initData = {
  status: "",
  motherVessel: "",
  loadingPort: "",
  narration: "",
  commissionRate: 0.15,
};

const statusDDL = [
  { value: 1, label: "General Information" },
  { value: 2, label: "Mother Vessel Commission" },
  { value: 3, label: "Mother Vessel Revenue Generate" },
  { value: 4, label: "Mother Vessel Cost Generate" },
  { value: 5, label: "CNF Bill Configure" },
];

export function LandingTableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [, motherVesselCommissionEntry, loader] = useAxiosPost();
  const [rowData, getRowData, isLoader, setRowData] = useAxiosGet();
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImage] = useState([]);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const setLandingData = (_pageNo, _pageSize, values) => {
    if (values?.status?.value === 1) {
      GetLighterAllotmentPagination(
        accId,
        buId,
        values?.motherVessel?.value,
        values?.loadingPort?.value,
        setGridData,
        setLoading,
        _pageNo,
        _pageSize
      );
    } else if ([2, 3, 4, 5].includes(values?.status?.value)) {
      const statusId = values?.status?.value;

      const commissionURL = `/tms/LigterLoadUnload/PreDataForMotherVesselCommissionEntry?accountId=${accId}&businessUnitId=${buId}&motherVesselId=${values?.motherVessel?.value}`;

      const costURL = `/tms/LigterLoadUnload/GetGTOGProgramInfoForLocalCost?AccountId=${accId}&BusinessUnitId=${buId}&MotherVesselId=${values?.motherVessel?.value}`;

      const revenueURL = `/tms/LigterLoadUnload/PreDataForMotherVesselRevenueGenerate?accountId=${accId}&businessUnitId=${buId}&motherVesselId=${values?.motherVessel?.value}`;

      const URL = [2].includes(statusId)
        ? commissionURL
        : [3].includes(statusId)
        ? revenueURL
        : [4, 5].includes(statusId)
        ? costURL
        : "";

      getRowData(URL, (resData) => {
        const modifyData = resData?.map((item) => {
          const revenueAmount =
            item?.quantity * item?.freightRate * item?.freightRateBDT;

          const costAmount =
            item?.quantity *
            (item?.cnfrate + item?.serveyorRate + item?.stevdorRate);

          const billAmount = [3].includes(statusId)
            ? revenueAmount
            : [4].includes(statusId)
            ? costAmount
            : 0;
          return {
            ...item,
            isSelected: false,
            commissionRate: 0.15,
            billAmount,
            vatOnCnf: item?.vatonCnf,
            incomeTaxOnCnf: item?.incomeTaxonCnf,
            // riverDueRate: "",
            lcRate: item?.lcrate,
            vatRate: item?.vatrate,
            commission: "",
            others: item?.òthersAmount,
            total: "",
          };
        });
        setRowData(modifyData);
      });
    }
  };

  useEffect(() => {
    setLandingData(pageNo, pageSize, initData);
    // getMotherVesselDDL(accId, buId, setMotherVesselDDL);
    GetDomesticPortDDL(setDomesticPortDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const commissionEntry = (values) => {
    const statusId = values?.status?.value;
    const selectedItems = rowData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    const billTypeId =
      statusId === 2 ? 23 : statusId === 3 ? 19 : statusId === 4 ? 24 : 0;

    const totalBill = getTotal(rowData, "billAmount", "isSelected");

    const payload = {
      gtogHead: {
        billTypeId: billTypeId,
        accountId: accId,
        supplierId: 11841,
        supplierName: "Bangladesh International Shipping Corporation",
        sbuId: 68,
        unitId: buId,
        unitName: buName,
        billNo: "billNo",
        billDate: _todayDate(),
        paymentDueDate: _todayDate(),
        narration: values?.narration,
        billAmount: totalBill || 0,
        plantId: 0,
        warehouseId: 0,
        actionBy: userId,
      },
      gtogRow: selectedItems?.map((item) => {
        return {
          accountId: accId,
          businessUnitId: buId,
          intSbuId: item?.sbuId,
          motherVesselId: item?.motherVesselId,
          actionby: userId,
          narration: values?.narration || "",
          challanNo: "",
          deliveryId: 0,
          quantity: item?.quantity,
          ammount: 1,
          billAmount: item?.billAmount || 0,
          shipmentCode: "",
          lighterVesselId: 0,
          numFreightRateUSD: item?.freightRate || 0,
          numFreightRateBDT: item?.freightRateBDT || 0,
          numCommissionRateBDT: +item?.commissionRate || 0.15,
          damToTruckRate: 0,
          truckToDamRate: 0,
          bolgateToDamRate: 0,
          othersCostRate: 0,
          directRate: item?.cnfrate || 0,
          dumpDeliveryRate: item?.stevdorRate || 0,
          lighterToBolgateRate: item?.serveyorRate || 0,
        };
      }),

      image: uploadedImages?.map((image) => {
        return {
          imageId: image?.id,
        };
      }),
    };
    motherVesselCommissionEntry(
      `/wms/GTOGTransport/PostGTOGTransportBillEntry`,
      // `/tms/LigterLoadUnload/G2GMotherVesselComissionJournalEntry`,
      payload,
      () => {
        setLandingData(pageNo, pageSize, values);
      },
      true
    );
  };

  const cnfInfoUpdate = (values) => {
    const selectedItems = rowData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    const payload = selectedItems?.map((item) => {
      const riverDueAmount = +item?.programQnt * +item?.riverDueRate;
      const lcAmount = +item?.programQnt * +item?.lcRate;
      const total = riverDueAmount + lcAmount;
      const vatAmount = (total / 100) * +item?.vatRate;
      // const commissionAmount = +item?.programQnt * +item?.commission;
      const totalAmount = total + vatAmount + +item?.others;
      return {
        programId: item?.programId,
        accountId: accId,
        businessUnitId: buId,
        vatonCnf: +item?.vatOnCnf,
        incomeTaxonCnf: +item?.incomeTaxOnCnf,
        riverDueRate: +item?.riverDueRate,
        lcrate: +item?.lcRate,
        vatrate: +item?.vatRate,
        totalVatamount: vatAmount,
        òthersAmount: +item?.others,
        totalAmount: totalAmount,
      };
    });
    updateCNFInfo(payload, setLoading, () => {
      setLandingData(pageNo, pageSize, values);
    });
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  return (
    <>
      {/* Table Start */}
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <>
            <form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={statusDDL}
                    value={values?.status}
                    label="Mother Vessel Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      setGridData([]);
                      setRowData([]);
                    }}
                    placeholder="Mother Vessel Status"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="loadingPort"
                    options={domesticPortDDL || []}
                    value={values?.loadingPort}
                    label="Loading Port"
                    onChange={(valueOption) => {
                      setFieldValue("loadingPort", valueOption);
                      setFieldValue("motherVessel", "");
                      getMotherVesselDDL(
                        accId,
                        buId,
                        setMotherVesselDDL,
                        valueOption?.value
                      );
                    }}
                    placeholder="Loading Port"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={[{ value: 0, label: "All" }, ...motherVesselDDL]}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(valueOption) => {
                      setFieldValue("motherVessel", valueOption);
                    }}
                    placeholder="Mother Vessel"
                  />
                </div>

                {rowData?.length > 0 &&
                  [2, 3, 4].includes(values?.status?.value) && (
                    <>
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
                    </>
                  )}

                <div className="col-lg-1">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setLandingData(pageNo, pageSize, values);
                    }}
                    disabled={!(values?.loadingPort && values?.motherVessel)}
                  >
                    View
                  </button>
                </div>
                {[5].includes(values?.status?.value) && rowData?.length > 0 && (
                  <div className="col-lg-1">
                    <button
                      className="btn btn-info mt-5"
                      type="button"
                      onClick={() => {
                        cnfInfoUpdate(values);
                      }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </form>
            {rowData?.length > 0 &&
              [2, 3, 4].includes(values?.status?.value) && (
                <div className="row my-3">
                  <div className="col-lg-4">
                    <h4>
                      Total Quantity:{" "}
                      {_fixedPoint(
                        getTotal(rowData, "quantity", "isSelected"),
                        true,
                        0
                      )}
                    </h4>
                  </div>
                  <div className="col-lg-4">
                    {[3, 4].includes(values?.status?.value) && (
                      <h4>
                        Total Amount:{" "}
                        {_fixedPoint(
                          getTotal(rowData, "billAmount", "isSelected"),
                          true
                        )}
                      </h4>
                    )}
                  </div>

                  <div className="col-lg-4 text-right">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        commissionEntry(values);
                      }}
                      disabled={
                        !values?.narration ||
                        rowData?.filter((item) => item?.isSelected)?.length <
                          1 ||
                        loader ||
                        loading
                      }
                    >
                      JV Create
                    </button>
                  </div>
                </div>
              )}{" "}
            {(loading || loader || isLoader) && <Loading />}
            <GeneralInfoTable
              gridData={gridData}
              values={values}
              history={history}
              setLandingData={setLandingData}
              pageNo={pageNo}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setPageNo={setPageNo}
              setLoading={setLoading}
            />
            <CommissionRevenueCostTable
              rowData={rowData}
              values={values}
              selectedAll={selectedAll}
              allSelect={allSelect}
              rowDataHandler={rowDataHandler}
            />
            {[5].includes(values?.status?.value) && (
              <CNFTable
                obj={{
                  rowData,
                  values,
                  selectedAll,
                  allSelect,
                  rowDataHandler,
                }}
              />
            )}
            <AttachFile obj={{ open, setOpen, setUploadedImage }} />
          </>
        )}
      </Formik>
    </>
  );
}

/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import Loading from "../../../../../../_helper/_loading";
import {
  EditShipment,
  GetCNFAgencyDDL,
  createShipment,
  getCurrencyDDL,
  getShipByDDL,
  getShipmentDataById,
  getShipmentInfo,
  getShipmentItemDDL,
  getTollarence,
} from "../helper";
import Form from "./form";

const initData = {
  shipBy: "",
  blAwbTrNo: "",
  blAwbTrDate: _dateFormatter(new Date()),
  dueDate: _dateFormatter(new Date()),
  currency: "",
  invoiceNumber: "",
  invoiceAmount: "",
  invoiceDate: _dateFormatter(new Date()),
  docReceiveByBank: "",
  packingCharge: "",
  freightCharge: "",
  cnfProvider: "",
  vasselName: "",
  etaDate: "",
  ataDate: "",
  numberOfContainer: "",
};

export default function InsurancePolicyForm({ type, id, lcNumber, poNumber }) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);
  const [shipByDDL, setShipByDDL] = useState([]);
  const [shipmentItemDDL, setShipmentItemDDL] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [cnfAgency, setCnfAgencyDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [index, setIndex] = useState("");
  const [shippedQuantity, setShippedQuantity] = useState("");
  // const [poNumber, setPoNumber] = useState("");
  // const [lcNumber, setLcNumber] = useState("");
  const [tollerence, setTollerence] = useState(0);
  const [totalPoAmount, setTotalPoAmount] = useState(0);
  const [totalShippedAmount, setTotalShippedAmount] = useState(0);
  const [totalAddedAmount, setTotalAddedAmount] = useState(0);
  const [initFormData, setInitFormData] = useState(initData);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [initialInvoiceAmount, setInitialInvoiceAmount] = useState(0);

  const params = useParams();
  const { shipmentId } = params;

  // const resetBtnRef = useRef();

  const location = useLocation();
  const { state } = location;


  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // const poNumber = localStorage.getItem("poNumber");
    if (selectedBusinessUnit?.value && profileData.accountId) {
      getShipByDDL(setShipByDDL);
      getCurrencyDDL(setCurrencyDDL);
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value)
      GetCNFAgencyDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCnfAgencyDDL
      );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (shipmentId || id) {
      getShipmentDataById(
        shipmentId || id,
        setSingleData,
        setRowDto,
        setTollerence
      );
    }
  }, [shipmentId || id]);

  //Item which has shipment quantity
  const getQuantityItem = () => {
    const poId = state?.values?.poDDL?.poId;
    const allItem = [...rowDto].map((item) => ({ ...item, poId }));
    if (allItem?.length) {
      const itemData = [];
      for (let i = 0; i < allItem.length; i++) {
        if (allItem[i].shippedQuantity) {
          itemData.push(allItem[i]);
        }
      }
      return itemData;
    } else {
      return toast.warn("Please add at least one item");
    }
  };

  const InitialInvoiceAmountHandler = (data) =>{
    const result = data.reduce((acc, item) => {
      return Number(
        (acc + Number(item["poquantity"]) * Number(item["rate"])).toFixed(2)
      );
    }, 0);

    setInitialInvoiceAmount(result);
  }

  useEffect(() => {
    if (state?.values?.poDDL?.poNumber && state?.values?.poDDL?.lcNumber) {
      getTollarence(
        profileData.accountId,
        selectedBusinessUnit?.value,
        // localStorage.getItem("poNumber"),
        state?.values?.poDDL?.poNumber,
        setTollerence
      );
      if (!shipmentId || !id) {
        getShipmentInfo(
          profileData.accountId,
          selectedBusinessUnit?.value,
          state?.values?.poDDL?.poNumber,
          initFormData,
          setInitFormData
        );
      }

      if (state?.routeState === "create") {
        getShipmentItemDDL(
          profileData.accountId,
          selectedBusinessUnit?.value,
          state?.values?.poDDL?.poNumber,
          setRowDto,
          InitialInvoiceAmountHandler
        );
      }
    }
  }, [state?.values?.poDDL?.poNumber, state?.values?.poDDL?.lcNumber]);

  const getTotalAmount = (data, key) => {
    return data.reduce((acc, item) => {
      return Number(
        (acc + Number(item[key]) * Number(item["rate"])).toFixed(2)
      );
    }, 0);
  };


  const getTotalShippedAmount = (data, values, key) => {
    let packingCharge = Number(values?.packingCharge);
    let freightCharge = +values?.freightCharge;

    return (
      data.reduce((acc, item) => {
        return Number(
          (acc + Number(item[key]) * Number(item["rate"])).toFixed(2)
        );
      }, 0) +
      packingCharge +
      freightCharge
    );
  };

  const saveHandler = async (values, cb) => {
    // const poNumber = localStorage.getItem("poNumber");
    // const lcNumber = localStorage.getItem("lcNumber");
    // const currencyId = localStorage.getItem("currencyId");
    if (shipmentId || id) {
      const payload = {
        objHeader: {
          shipmentId: shipmentId || id,
          shipById: values?.shipById,
          shipByName: values?.shipByName,
          shipByNumber: values?.blAwbTrNo,
          shippingDate: values?.blAwbTrDate,
          invoiceNumber: values?.invoiceNumber,
          invoiceDate: values?.invoiceDate,
          vasselName: values?.vasselName,
          docReceiveByBank: values?.docReceiveByBank ? values?.docReceiveByBank : "",
          shipmentDocumentId: uploadImage[0]?.id || "",
          lastActionBy: profileData?.userId,
          dueDate: values?.dueDate,
          cnfPartnerId: values?.cnfProvider?.value,
          cnfPartnerName: values?.cnfProvider?.label,
          numberOfContainer: +values?.numberOfContainer || 0,
          dteEta: values?.etaDate,
          dteAta: values?.ataDate,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          poId: state?.values?.poDDL?.poId,
          lcId: state?.values?.poDDL?.lcId,
          sbuId: state?.values?.poDDL?.sbuId,
          plantId: state?.values?.poDDL?.plantId,
          poNumber: state?.values?.poDDL?.poNumber,
          lcNumber: state?.values?.poDDL?.lcNumber,
          invoiceAmount: values?.invoiceAmount,
          currencyId: state?.values?.poDDL?.currencyId,
          packingCharge: values?.packingCharge || 0,
          freightCharge: values?.freightCharge || 0,
          cnFPartnerId: values?.cnfProvider?.value,
          cnFPartnerName: values?.cnfProvider?.label,
        },
        // objRow: rowDto,
      };
      EditShipment(payload, setDisabled);
    } else {
      if (index && shippedQuantity) {
        setter();
      }
      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          poId: state?.values?.poDDL?.poId,
          lcId: state?.values?.poDDL?.lcId,
          sbuId: state?.values?.poDDL?.sbuId,
          plantId: state?.values?.poDDL?.plantId,
          poNumber: state?.values?.poDDL?.poNumber,
          lcNumber: state?.values?.poDDL?.lcNumber,
          shipById: values?.shipById,
          shipByName: values?.shipByName,
          shipByNumber: values?.blAwbTrNo,
          shippingDate: values?.blAwbTrDate,
          invoiceNumber: values?.invoiceNumber,
          invoiceDate: values?.invoiceDate,
          vasselName: values?.vasselName,
          docReceiveByBank: values?.docReceiveByBank
            ? values?.docReceiveByBank
            : "",
          invoiceAmount: values?.invoiceAmount,
          currencyId: state?.values?.poDDL?.currencyId,
          packingCharge: values?.packingCharge || 0,
          freightCharge: values?.freightCharge || 0,
          shipmentDocumentId: uploadImage[0]?.id || "",
          lastActionBy: profileData?.userId,
          dueDate: values?.dueDate,
          cnFPartnerId: values?.cnfProvider?.value,
          cnFPartnerName: values?.cnfProvider?.label,
          dteEta: values?.etaDate,
          dteAta: values?.ataDate,
          numberOfContainer: +values?.numberOfContainer || 0,
        },
        objRow: await getQuantityItem(),
      };
      await createShipment(payload, cb, setDisabled);
    }
  };

  const setter = () => {
    const allItem = [...rowDto];
    let poAmount = totalPoAmount;
    let shippedAmount = totalShippedAmount;
    let addedAmount = totalAddedAmount;
    if (index && shippedQuantity) {
      allItem[index - 1].shippedQuantity = shippedQuantity;
      allItem[index - 1].totalQuantity =
        parseInt(shippedQuantity) + parseInt(allItem[index - 1].addedQuantity);
      poAmount = parseInt(poAmount) + parseInt(allItem[index - 1].poquantity);
      addedAmount =
        parseInt(addedAmount) + parseInt(allItem[index - 1].addedQuantity);
      shippedAmount = parseInt(shippedAmount) + parseInt(shippedQuantity);
      setTotalPoAmount(poAmount);
      setTotalAddedAmount(addedAmount);
      setTotalShippedAmount(shippedAmount);
      setRowDto(allItem);
      setIndex("");
      setShippedQuantity("");
    }
  };

  const remover = (index, setFieldValue) => {
    const filterArr = rowDto.filter((item, ind) => ind !== index);
    const invoiceAmount = filterArr.reduce((acc, item) => {
      return Number(
        (acc + Number(item["poquantity"]) * Number(item["rate"])).toFixed(2)
      );
    }, 0);
    setFieldValue("invoiceAmount", invoiceAmount)
    setRowDto(filterArr);
  };

  return (
    <>
      {isDisabled && <Loading />}
      {/* {data && ( */}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={
            shipmentId || id
              ? singleData
              : {
                  ...initFormData,
                  currency: state?.values?.poDDL?.currencyName,
                  invoiceAmount: initialInvoiceAmount,
                }
          }
          saveHandler={saveHandler}
          profileData={profileData}
          accountId={profileData?.accountId}
          businessUnitId={selectedBusinessUnit?.value}
          setter={setter}
          remover={remover}
          rowDto={rowDto}
          setRowDto={setRowDto}
          setEdit={setEdit}
          isDisabled={isDisabled}
          shipByDDL={shipByDDL}
          shipmentItemDDL={shipmentItemDDL}
          currencyDDL={currencyDDL}
          setIndex={setIndex}
          setShippedQuantity={setShippedQuantity}
          poNumber={state?.values?.poDDL?.poNumber || poNumber}
          lcNumber={state?.values?.poDDL?.lcNumber || lcNumber}
          totalPoAmount={totalPoAmount}
          totalAddedAmount={totalAddedAmount}
          totalShippedAmount={totalShippedAmount}
          tollerence={tollerence}
          open={open}
          setOpen={setOpen}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setUploadImage={setUploadImage}
          type={type}
          cnfAgency={cnfAgency}
          getTotalAmount={getTotalAmount}
          shipmentId={id}
          getTotalShippedAmount={getTotalShippedAmount}
        />
      </div>
      {/* )} */}
    </>
  );
}

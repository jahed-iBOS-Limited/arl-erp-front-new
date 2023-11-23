/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import { useLocation } from "react-router-dom";
import Form from "./form";
import { toast } from "react-toastify";
import Loading from "../../../../../../_helper/_loading";
import {
  createPacking,
  getPackingTypeDDL,
  getPackingListByShipmentId,
  deletePackingById,
} from "../helper";

const initData = {
  packingType: "",
  quantity: "",
  insideDescription: "",
  blno: "",
  bldate: _dateFormatter(new Date()),
  dueDate: _dateFormatter(new Date()),
};

export default function PackingForm({ shipmentId }) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);
  // const [shipmentNoDDL, setShipmentItemDDL] = useState([]);
  const [packingTypeDDL, setPackingTypeDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  // const [poNumber, setPoNumber] = useState("");
  // const [lcNumber, setLcNumber] = useState("");
  const [shipmentCode, setShipmentCode] = useState("");

  // const history = useHistory();
  const location = useLocation();
  // console.log("location", location?.state?.item?.blNo);
  const saveBtnRef = useRef();
  const resetBtnRef = useRef();

  // console.log(location?.state?.item?.sbuId, "location");

  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPackingTypeDDL(setPackingTypeDDL);
  }, []);

  useEffect(() => {
    if (shipmentId) {
      getPackingListByShipmentId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        shipmentId,
        setGridData
      );
    }
  }, [shipmentId]);

  // useEffect(() => {
  //   if (localStorage.getItem("poNumber") && localStorage.getItem("lcNumber")) {
  //     setPoNumber(localStorage.getItem("poNumber"));
  //     setLcNumber(localStorage.getItem("lcNumber"));
  //   }
  // }, [localStorage.getItem("poNumber"), localStorage.getItem("lcNumber")]);
  useEffect(() => {
    // console.log(location?.state);
    if (location?.state?.item?.shipmentCode) {
      setShipmentCode(location?.state?.item?.shipmentCode);
    }
  }, [location?.state?.item?.shipmentCode]);

  const totalQuantity = rowDto.reduce((acc, cur) => acc + cur.quantity, 0);

  const setter = (values, successCB) => {
    if (!shipmentId) {
      return toast.warn("Please Select Shipment No");
    } else {
      // successCB();
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        sbuId: location?.state?.item?.sbuId,
        plantId: location?.state?.item?.plantId,
        shipmentId: shipmentId,
        blno: values?.blno,
        bldate: values?.bldate,
        packType: values?.packingType?.value,
        packTypeName: values?.packingType?.label,
        quantity: values?.quantity,
        insideDescription: values?.insideDescription,
        actionBy: profileData?.userId,
        dueDate: values?.dueDate,
        poId: location?.state?.item?.poId,
        lcId: location?.state?.item?.lcId,
      };
      // setRowDto([...rowDto, payload]);
      console.log('gridData: ', gridData);
      console.log('totalQuantity: ', totalQuantity + values?.quantity)

      var totalGridQuantity = 0;
      for (let i = 0; i < gridData.length; i++) {
        totalGridQuantity = totalGridQuantity + gridData[i].quantity
      }
      console.log('total', totalGridQuantity)

      if (
        location?.state?.item?.shippedQty >=
        +totalQuantity + +values?.quantity + totalGridQuantity
      ) {
        return setRowDto([...rowDto, payload]);
      } else {
        return toast.warn("Quantity Can Not Greater Than Remaining Quantity");
      }
    }
  };

  const saveHandler = async (values, cb) => {
    if (rowDto?.length > 0) {
      const payload = rowDto;
      await createPacking(payload, cb);
      await getPackingListByShipmentId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        shipmentId,
        setGridData
      );
    } else {
      toast.warn("Packing Data is Empty");
    }
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  const deletePacking = async (packingId) => {
    await deletePackingById(packingId);
    await getPackingListByShipmentId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      shipmentId,
      setGridData
    );
  };

  return (
    <>
      {isDisabled && <Loading />}
      {/* {data && ( */}
      <div className='mt-0'>
        <Form
          {...objProps}
          initData={{ ...initData, blno: location?.state?.item?.blNo }}
          saveHandler={saveHandler}
          // disableHandler={disableHandler}
          profileData={profileData}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          setter={setter}
          remover={remover}
          rowDto={rowDto}
          setRowDto={setRowDto}
          setEdit={setEdit}
          isDisabled={isDisabled}
          // shipmentNoDDL={shipmentNoDDL}
          packingTypeDDL={packingTypeDDL}
          gridData={gridData}
          deletePacking={deletePacking}
          poNumber={location?.state?.item?.ponumber}
          lcNumber={location?.state?.item?.lcnumber}
          shipmentCode={location?.state?.item?.shipmentCode}
          shippedQuantity={location?.state?.item?.shippedQty}
        />
      </div>
    </>
  );
}

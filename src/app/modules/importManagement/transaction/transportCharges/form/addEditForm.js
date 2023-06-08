/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import moment from "moment";
import Form from "./form";
import Loading from "../../../../_helper/_loading";
import { useHistory } from "react-router";
import { 
  createTransportCharge,
  getShipmentDDL,
  getTransportTypeDDL,
  getTransportProviderDDL,
  getTransportChargeByProvider
} from '../helper'

const initData = {
  shipment: "",
  transportProvider: "",
  transportType: "",
  route: "",
  quantity: "",
  billNumber: "",
  serviceDate: "",
  receiveDate: "",
  paymentDate: "",
  transportCost: "",
  vat: "",
};

export default function TransportChargesForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);
  const [shipmentDDL, setShipmentDDL] = useState([])
  const [transportTypeDDL, setTransportTypeDDL] = useState([])
  const [transportProviderDDL, setTransportProviderDDL] = useState([])
  const [shipment, setShipment] = useState({})
  const [providerId, setProviderId] = useState('')
  const [gridData, setGridData] = useState([])
  const [totalQty, setTotalQty] = useState('')
  const [totalAmountBDT, setTotalAvmountBDT] = useState('')

  const saveBtnRef = useRef();
  const resetBtnRef = useRef();

  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    var currentDate = new Date();
    var firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var fromDate = moment(firstDate).format('YYYY-MM-DD')
    var toDate = moment(currentDate).format('YYYY-MM-DD')
    if(providerId && profileData?.accountId && selectedBusinessUnit?.value){
      getTransportChargeByProvider(
        providerId, 
        profileData?.accountId, 
        selectedBusinessUnit?.value, 
        fromDate,
        toDate,
        setGridData,
        setTotalQty,
        setTotalAvmountBDT
      )
    }
  }, [providerId, profileData, selectedBusinessUnit])

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getShipmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShipmentDDL
      )
      getTransportTypeDDL(setTransportTypeDDL)
      getTransportProviderDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTransportProviderDDL
      )
    }
  }, [profileData, selectedBusinessUnit])

  const saveHandler = async (values, cb) => {
    const payload={
      "accountId": profileData?.accountId,
      "businessUnitId": selectedBusinessUnit?.value,
      "lcnumber": values?.shipment?.lcNumber,
      "ponumber": values?.shipment?.poNumber,
      "shipmentId": values?.shipment?.value,
      "transportProvider": values?.transportProvider?.value,
      "transportTypeId": values?.transportType?.value,
      "routeName": values?.route,
      "qty": values?.quantity,
      "serviceDate": values?.serviceDate,
      "receiveDate": values?.receiveDate,
      "paymentDate": values?.paymentDate,
      "billNumber": values?.billNumber,
      "transportAmount": values?.transportCost,
      "vatamount": values?.vat
    }
    console.log(payload)
    await createTransportCharge(payload)
    cb()
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  const history = useHistory();

  const backHandler = () => {
    history.goBack();
  };

  console.log(shipment);

  return (
    <>
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          profileData={profileData}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          setter={setter}
          remover={remover}
          rowDto={rowDto}
          setRowDto={setRowDto}
          setEdit={setEdit}
          isDisabled={isDisabled}
          shipmentDDL={shipmentDDL}
          transportTypeDDL={transportTypeDDL}
          transportProviderDDL={transportProviderDDL}
          setShipment={setShipment}
          shipment={shipment}
          backHandler={backHandler}
          setProviderId={setProviderId}
          gridData={gridData}
          totalQty={totalQty}
          totalAmountBDT={totalAmountBDT}
        />
      </div>
    </>  
  );
}

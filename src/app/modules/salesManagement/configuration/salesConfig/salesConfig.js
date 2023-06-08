import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import Form from "./form";
import { getSalesConfigPagination, saveSalesConfigItem } from "./helper";

const initData = {
  isUse: false,
  partnerBalanceCheckOnOrder: false,
  partnerBalanceCheckOnDelivery: false,
  balanceBlockDuringOrder: false,
  balanceBlockDuringDelivery: false,
  stockCheckOnOrder: false,
  stockCheckOnDelivery: false,
  stockBlockOnOrder: false,
  stockBlockOnDelivery: false,
  pgitoAccountPosting: false,
  inventory: false,
  isSouseOnProductionOrder: false,
  autoInvoice: false,
};

export default function SalesConfig() {
  const [rowDto, setRowDto] = useState([]);
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getSalesConfigPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveBusTaxConfig = async (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      const newRowDto = rowDto.map((itm, index) => {
        return {
          ...itm,
          accountId: accountId,
          businessUnitId: businessunitid,
          isUse: itm?.isUse,
          salesOrderTypeId: itm?.salesOrderTypeId,
          salesOrderTypeName: itm?.salesOrderTypeName,
          partnerBalanceCheckOnOrder: itm?.partnerBalanceCheckOnOrder,
          partnerBalanceCheckOnDelivery: itm?.partnerBalanceCheckOnDelivery,
          balanceBlockDuringOrder: itm?.balanceBlockDuringOrder,
          balanceBlockDuringDelivery: itm?.balanceBlockDuringDelivery,
          deliveryTypeId: itm?.deliveryTypeId,
          stockCheckOnOrder: itm?.stockCheckOnOrder,
          stockCheckOnDelivery: itm?.stockCheckOnDelivery,
          stockBlockOnOrder: itm?.stockBlockOnOrder,
          stockBlockOnDelivery: itm?.stockBlockOnDelivery,
          pgitoAccountPosting: itm?.pgitoAccountPosting,
          inventory: itm?.inventory,
          isSouseOnProductionOrder: itm?.isSouseOnProductionOrder,
          stockCheckOnShipment: itm?.isStockCheckOnShipment,
          autoInvoice: itm?.autoInvoice||false,
          actionBy,
        };
      });
      saveSalesConfigItem({ data: newRowDto, cb }, setDisabled);
    } else {
      console.log(values);
    }
  };

  // Set and get value in rowdto
  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  // itemRowSlectedHandler
  const itemRowSlectedHandler = (status, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].isUse = status;
    setRowDto(copyRowDto);
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Sales Configuration">
          <CardHeaderToolbar>
            <button
              type="reset"
              onClick={ResetProductClick}
              ref={resetBtnRef}
              className="btn btn-light ml-2"
            >
              <i className="fa fa-redo"></i>
              Reset
            </button>
            {`  `}
            <button
              type="submit"
              className="btn btn-primary ml-2"
              onClick={saveBtnClicker}
              ref={btnRef}
              disabled={isDisabled}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isDisabled && <Loading />}
          <div className="mt-0">
            <Form
              initData={initData}
              btnRef={btnRef}
              saveBtnClicker={saveBtnClicker}
              resetBtnRef={resetBtnRef}
              //disableHandler={disableHandler}
              saveBusTaxConfig={saveBusTaxConfig}
              accountId={profileData.accountId}
              actionBy={profileData.userId}
              profileData={profileData}
              selectedBusinessUnit={selectedBusinessUnit}
              rowDto={rowDto}
              itemSelectHandler={itemSelectHandler}
              itemRowSlectedHandler={itemRowSlectedHandler}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

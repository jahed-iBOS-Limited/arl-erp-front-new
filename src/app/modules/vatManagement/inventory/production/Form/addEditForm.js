// /* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation } from "react-router";
import IForm from "../../../../_helper/_form";
import {
  getItemNameDDL_api,
  GetProductionView,
  getTaxBranchDDL_api,
  getTransactionTypeDDL_api,
  saveEditedProduction,
  saveProduction,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";

const initData = {
  branchName: "",
  branchAddress: "",
  transactionType: "",
  referanceNo: "",
  referenceDate: _todayDate(),
  itemName: "",
  quantity: "",
};

export default function ProductionForm({ viewClick }) {
  const {id} = useParams();
  let taxPurId = id || viewClick?.taxPurchaseId;
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [taxBranchDDL, setTaxBranchDDL] = useState("");
  const [transactionType, setTransactionType] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState("");
  const [rowDto, setRowDto] = useState([]);


  const [total, setTotal] = useState({ totalAmount: 0 });
  const { state: landingData } = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
      getTransactionTypeDDL_api(setTransactionType);
      getItemNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //SingleData to view
  const [singleData, setSingleData] = useState("");
  useEffect(() => {
    if (taxPurId) {
      GetProductionView(taxPurId, setSingleData, setRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxPurId]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (taxPurId) {
        const editRowDto = rowDto.map((itm, index) => ({
          rowId: itm?.rowId || 0,
          taxPurchaseHeaderId: 0,
          taxItemGroupId: itm?.itemId,
          taxItemGroupName: itm?.itemName,
          uomid: +itm?.uomId,
          uomname: itm?.uomName,
          quantity: +itm?.quantity,
          invoicePrice: itm?.basePrice,
          sd: +itm?.sd,
          vat: +itm?.vat,
          grandTotal: itm?.totalAmount,
          rebateTotal: 0,
          surchargeTotal: +itm?.surcharge,
        }));
        const payload = {
          objHeader: {
            taxPurchaseId: taxPurId,
          },
          objRow: editRowDto,
        };

        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          saveEditedProduction(payload, setDisabled);
        }
      } else {
        const newRowDto = rowDto.map((itm, index) => ({
          taxItemGroupId: itm?.itemId,
          taxItemGroupName: itm?.itemName,
          uomid: +itm?.uomId,
          uomname: itm?.uomName,
          quantity: +itm?.quantity,
          invoicePrice: itm?.basePrice,
          sd: +itm?.sd,
          vat: +itm?.vat,
          grandTotal: +itm?.totalAmount,
          rebateTotal: 0,
          surchargeTotal: +itm?.surcharge,
        }));
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            taxBranchId: values?.branchName?.value,
            taxBranchName: values?.branchName?.label,
            taxBranchAddress: values?.branchAddress,
            referanceNo: values?.referanceNo || "",
            referanceDate: values?.referenceDate,
            actionBy: profileData?.userId,
          },
          objRow: newRowDto,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          saveProduction(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
      console.log(values);
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  //total amount calculation
  // useEffect(() => {
  //   let totalAmount = 0
  //   let totalQR = 1
  //   let total = 0
  //   if (rowDto?.length) {
  //     for (let i = 0; i < rowDto?.length; i++) {
  //       totalQR = +rowDto[i].quantity * +rowDto[i].basePrice
  //       total =
  //         totalQR +
  //         +rowDto[i].sdpercentage +
  //         +rowDto[i].vatamount +
  //         +rowDto[i].surchargePercentage
  //       totalAmount += total
  //     }
  //   }
  //   setTotal({ totalAmount })
  // }, [rowDto])

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;

    if (rowDto?.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalAmount += +rowDto[i].totalAmount || +rowDto[i].grandTotal;
      }
    }
    setTotal({ totalAmount });
  }, [rowDto]);

  return (
    <IForm
      title="Create Production"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={viewClick?.isView}
      isHiddenBack={viewClick?.isView}
      isHiddenSave={viewClick?.isView}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={taxPurId ? singleData?.objHeader : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit?.value}
        taxBranchDDL={taxBranchDDL}
        transactionType={transactionType}
        itemNameDDL={itemNameDDL}
        isEdit={taxPurId || false}
        total={total}
        rowDto={rowDto}
        remover={remover}
        setRowDto={setRowDto}
        setDisabled={setDisabled}
        landingData={landingData}
        isView={viewClick?.isView}
      />
    </IForm>
  );
}

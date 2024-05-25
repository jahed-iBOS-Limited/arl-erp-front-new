/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getTaxItemNameDDLAction,
  getMatItemNameDDLAction,
  getValueAdditionDDLAction,
  saveTaxPriceSetup,
  saveEditedTaxPriceSetupData,
  getSupplyTypeDDL_Action,
} from "../_redux/Actions";
import Axios from "axios";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";
import { getCopyFromItemsDDL } from "../helper";

const initData = {
  id: undefined,
  taxItemName: "",
  uom: "",
  uomId: "",
  validFrom: _todayDate(),
  validTo: _todayDate(),
  basePrice: "",
  taxPrice: "",
  sdpercentage: 0,
  vatpercentage: 0,
  surchargePercentage: 0,
  isOnQty: false,
  isPriceIncludingTax: false,
  priceDeclare: false,
  isManualAuto: false,
  matItemName: "",
  matItemUom: "",
  quantity: "",
  westageQty: "",
  rate: "",
  valueAdditionName: "",
  valueAmount: "",
  taxSupplyType: "",
};

export default function PricesetupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(false);
  const [totalTaxPrice, setTotalTaxPrice] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [matRowDto, setMatRowDto] = useState([]);
  const [valueAddRowDto, setValueAddRowDto] = useState([]);
  const [headerTaxData, setHeaderTaxData] = useState("");
  const [copyFromItems, setCopyFromItems] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get itemCategory ddl from store
  const itemCategoryDDL = useSelector((state) => {
    return state?.taxPriceSetup?.itemCategoryDDL;
  }, shallowEqual);

  // get mat item name ddl from store
  const matItemNameDDL = useSelector((state) => {
    return state?.taxPriceSetup?.matItemNameDDL;
  }, shallowEqual);

  // get valueAddition ddl from store
  const valueAdditionDDL = useSelector((state) => {
    return state?.taxPriceSetup?.valueAdditionDDL;
  }, shallowEqual);

  // get supplyTypeDDL ddl from store
  const supplyTypeDDL = useSelector((state) => {
    return state?.taxPriceSetup?.supplyTypeDDL;
  }, shallowEqual);

  //Dispatch Get vehiclelist action for get vehiclelist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getTaxItemNameDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getMatItemNameDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getValueAdditionDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(getSupplyTypeDDL_Action());
      getCopyFromItemsDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCopyFromItems
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      getTaxPriceById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getTaxPriceById = async (id) => {
    try {
      const res = await Axios.get(
        `/vat/TaxPriceSetup/GetTaxPriceSetupById?taxPricingId=${id}`
      );
      const { data, status } = res;
      if (status === 200 && data) {
        const item = res?.data;
        const getByIdHeader = item?.getByIdHeader;
        const getByIdRowMaterial = item?.getByIdRowMaterial;
        const getByIdRowValueAddition = item?.getByIdRowValueAddition;

        const singleData = {
          taxItemName: {
            value: getByIdHeader?.taxItemGroupId,
            label: getByIdHeader?.taxItemGroupName,
          },
          uom: getByIdHeader?.uomName,
          validFrom: _dateFormatter(getByIdHeader?.dteValidFrom),
          validTo: _dateFormatter(getByIdHeader?.dteValidTo),
          basePrice: getByIdHeader?.basePrice,
          taxPrice: getByIdHeader?.taxPrice,
          sdpercentage: getByIdHeader?.sdpercentage,
          vatpercentage: getByIdHeader?.vatpercentage,
          surchargePercentage: getByIdHeader?.surchargePercentage,
          isOnQty: getByIdHeader?.isOnQty || getByIdHeader?.isFixedRated || false,
          isManualAuto: getByIdHeader?.isManualAuto || false,
          priceDeclare:
            getByIdRowMaterial?.length > 0 ||
            getByIdRowValueAddition?.length > 0
              ? true
              : false,
          isPriceIncludingTax: getByIdHeader?.isPriceIncludingTax,
          rowId: getByIdHeader?.rowId || 0
        };

        setHeaderTaxData(singleData);
        setMatRowDto(getByIdRowMaterial);
        setValueAddRowDto(getByIdRowValueAddition);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      if (id) {
        const objEditMatRow = matRowDto.map((itm) => {
          return {
            rowId: itm?.rowId || 0,
            taxItemGroupIdMat: itm.intTaxItemGroupIdMat,
            totalQuantity: +itm.numTotalQuantity || 0,
            rate: itm.numRate,
            wastageQuantity: +itm.numWastageQuantity || 0,
            wastagePercentage: +itm.numWastagePercentage || 0,
          };
        });
        const objEditValueAddRow = valueAddRowDto.map((itm) => {
          return {
            rowId: itm?.rowId || 0,
            valueAdditionId: itm.intValueAdditionId,
            valueAdditionName: itm.strValueAdditionName,
            totalValue: itm.numTotalValue,
          };
        });
        const payload = {
          editHeader: {
            taxPricingId: +id,
            taxItemGroupId: values?.taxItemName?.value,
            accoutId: accountId,
            businessUnitId: businessunitid,
            basePrice: values?.basePrice,
            vatAmount: vatAmount,
            taxPrice: parseFloat(totalTaxPrice?.toFixed(2)),
            rowId: +headerTaxData?.rowId || 0,
            actionBy: profileData?.userId,
            sdPercentage: +values?.sdpercentage || 0,
            vatPercentage: +values?.vatpercentage || 0,
            surchargePercentage: +values?.surchargePercentage || 0,
            isFixedRated: values?.isOnQty || false,
          },
          editRowMaterial: objEditMatRow,
          editRowValueAddition: objEditValueAddRow,
        };
        dispatch(saveEditedTaxPriceSetupData(payload, setDisabled));
      } else {
        const objMatRow = matRowDto.map((itm) => {
          return {
            taxItemGroupIdMat: itm.intTaxItemGroupIdMat,
            totalQuantity: +itm.numTotalQuantity || 0,
            rate: itm.numRate,
            wastageQuantity: +itm.numWastageQuantity || 0,
            wastagePercentage: +itm.numWastagePercentage || 0,
          };
        });
        const objValueAddRow = valueAddRowDto.map((itm) => {
          return {
            valueAdditionId: itm.intValueAdditionId,
            valueAdditionName: itm.strValueAdditionName,
            totalValue: itm.numTotalValue,
          };
        });
        const payload = {
          taxPriceSetupHeader: {
            accountId: accountId,
            businessUnitId: businessunitid,
            taxItemGroupId: values?.taxItemName?.value,
            taxPrice: parseFloat(totalTaxPrice?.toFixed(2)),
            isPriceIncludingTax: values?.isPriceIncludingTax,
            validFrom: _dateFormatter(values?.validFrom),
            validTo: _dateFormatter(values?.validTo),
            actionBy,
            uomId: values?.uomId,
            isFixedRated: values?.isOnQty || false,

          },
          taxOutputTaxRate: {
            basePrice: values?.basePrice,
            sdPercentage: +values?.sdpercentage || 0,
            vatPercentage: +values?.vatpercentage || 0,
            vatAmount: vatAmount,
            surchargePercentage: +values?.surchargePercentage || 0,
            isOnQty: values?.isOnQty,
          },
          taxPriceSetupMaterialRow: objMatRow,
          taxPriceValueAdditionRow: objValueAddRow,
        };
        dispatch(saveTaxPriceSetup(payload, cb, setDisabled));
      }
    } else {
      setDisabled(false);
    }
  };

  // matRowDto add
  const matSetter = (payload) => {
    if (
      isUniq("intTaxItemGroupIdMat", payload.intTaxItemGroupIdMat, matRowDto)
    ) {
      setMatRowDto([payload, ...matRowDto]);
    }
  };
  // matRowDto remove
  const matRemover = (payload) => {
    const filterArr = matRowDto.filter(
      (itm) => itm.intTaxItemGroupIdMat !== payload
    );
    setMatRowDto(filterArr);
  };

  // valueAddRowDto add
  const valueAddSetter = (payload) => {
    if (
      isUniq("intValueAdditionId", payload.intValueAdditionId, valueAddRowDto)
    ) {
      setValueAddRowDto([payload, ...valueAddRowDto]);
    }
  };
  // valueAddRowDto remove
  const valueAddRemover = (payload) => {
    const filterArr = valueAddRowDto.filter(
      (itm) => itm.intValueAdditionId !== payload
    );
    setValueAddRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Price Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={headerTaxData || initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        totalTaxPrice={totalTaxPrice}
        setTotalTaxPrice={setTotalTaxPrice}
        setVatAmount={setVatAmount}
        matItemNameDDL={matItemNameDDL}
        matRowDto={matRowDto}
        matSetter={matSetter}
        matRemover={matRemover}
        valueAdditionDDL={valueAdditionDDL}
        valueAddRowDto={valueAddRowDto}
        valueAddSetter={valueAddSetter}
        valueAddRemover={valueAddRemover}
        isEdit={id || false}
        supplyTypeDDL={supplyTypeDDL}
        copyFromItems={copyFromItems}
        setMatRowDto={setMatRowDto}
        setValueAddRowDto={setValueAddRowDto}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}

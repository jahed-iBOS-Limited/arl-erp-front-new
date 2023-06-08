/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import { IQueryParser } from "../../../../_helper/_queryParser";
import { getUomDDLAction } from "../../../../_helper/_redux/Actions";
import {
  getCurrencyDDLAction,
  getIncoTermsListDDLAction,
  getPaymentTermsListDDLAction,
  getPOReferenceNoDDLAction,
  getSupplierNameDDLAction,
  savePurchaseOrderForAssetStandardService
} from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
import AssetPOCreateForm from "./assetPoForm/createForm";
import AssetStandardPOCreateForm from "./assetStandardPo/createForm";
import PurchaseContractCreateForm from "./purchaseContract/CreateForm";
import ReturnPOCreateForm from "./returnPO/createForm";
import ServicePO from "./servicePO/CreateForm";
import StockTransferPOCreateForm from "./stockTransfer/createForm";
import SubContractPO from "./subcontractPO/CreateForm";

// id 1 = purchase contract
// id 2 = request
// id 3 = without reference
// id 4 = po reference

export function POFormByOrderTypeShipping() {
  const [isDisabled, setDisabled] = useState(false);
  const [title, setTitle] = useState(null);
  const [poForm, setPoForm] = useState(<></>);
  const dispatch = useDispatch();

  const potype = IQueryParser("potype");
  const location = useLocation();

  // redux store data
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  }, shallowEqual);

  const lastPo = useSelector(
    (state) => state?.localStorage?.lastPOData?.split("No")[1]
  );

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      location?.state?.sbu?.value
    ) {
      dispatch(
        getSupplierNameDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          location?.state?.sbu?.value
        )
      );
      dispatch(
        getUomDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        getCurrencyDDLAction(
          profileData?.accountId,
          location?.state?.purchaseOrg?.value,
          selectedBusinessUnit?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (location?.state?.refType?.value) {
      dispatch(
        getPOReferenceNoDDLAction(
          location?.state?.refType?.value,
          location?.state?.warehouse?.value,
          location?.state?.orderType?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    dispatch(getPaymentTermsListDDLAction());
    dispatch(getIncoTermsListDDLAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const saveHandler = async (values, rowDto, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // for asset , standard, service PO, subcontract PO, stock transfer, return PO
      if (
        location?.state?.orderType?.value === 1 ||
        location?.state?.orderType?.value === 5 ||
        location?.state?.orderType?.value === 6 ||
        location?.state?.orderType?.value === 3 ||
        location?.state?.orderType?.value === 4 ||
        location?.state?.orderType?.value === 8
      ) {
        // check atleast one row item quantity should be greater than 0
        // we will save only those field , where order qty is greater than 0
        const foundArr = rowDto?.filter((item) => item?.orderQty > 0);
        if (foundArr.length === 0) return toast.warn("Enter quantity");

        //check basic price is greater then 0
        //if(location?.state?.orderType?.value === 6){
        const foundBasicPrice = rowDto
          ?.filter((item) => item?.orderQty > 0)
          .filter((item) => item?.basicPrice === 0);
        if (foundBasicPrice.length > 0)
          return toast.warn("Basic price must be greater then 0");
        // }

        setDisabled(true);

        const objRowListDTO = foundArr?.map((item, index) => ({
          referenceId: +item?.referenceNo?.value || 0,
          referenceCode: item?.referenceNo?.label || "",
          referenceQty: +item?.item?.refQty || 0,
          itemId: +item?.item?.value || 0,
          itemName: item?.item?.itemName || "",
          uoMid: +item?.selectedUom?.value || 0,
          uoMname: item?.selectedUom?.label || "",
          controllingUnitId: +item?.controllingUnit?.value || 0,
          bomId: 0,
          controllingUnitName: item?.controllingUnit?.label || "",
          costCenterId: +item?.costCenter?.value || 0,
          costCenterName: item?.costCenter?.label || "" ,
          costElementId: +item?.costElement?.value || 0,
          costElementName: item?.costElement?.label || "",
          purchaseDescription: item?.desc || "",
          orderQty: +item?.orderQty || 0,
          basePrice: +item?.basicPrice || 0,
          finalPrice: +(item?.orderQty * item?.basicPrice) || 0,
          totalValue: +item?.netValue || 0,
          actionBy: +profileData?.userId || 0,
          lastActionDateTime: "2020-11-10T08:52:28.574Z",
          vatPercentage: +item?.vat || 0,
          vatAmount: +item?.vatAmount || 0,
          baseVatAmount: +item?.userGivenVatAmount || 0,
          discount: 0,
          profitCenterId: item?.profitCenter?.value|| 0,
          // objPriceRowListDTO:
          //   item?.priceStructure?.map((item2, index) => ({
          //     rowId: 0,
          //     priceStructureId: item2?.priceStructureId || 0,
          //     priceStructureName: item2?.priceStructureName || "",
          //     priceComponentId: item2?.priceComponentId || 0,
          //     priceComponentCode: item2?.priceComponentCode || "",
          //     priceComponentName: item2?.priceComponentName || "",
          //     valueType: item2?.valueType || "",
          //     value: +item2?.value || 0,
          //     amount: +item2?.amount || 0,
          //     baseComponentId: item2?.baseComponentId || 0,
          //     serialNo: item2?.serialNo || 0,
          //     sumFromSerial: item2?.sumFromSerial,
          //     sumToSerial: item2?.sumToSerial,
          //     mannual: item2?.mannual,
          //     factor: item2?.factor,
          //   })) || [],
        }));
        const payload = {
          objHeaderDTO: {
            // purchaseOrderNo: "string",
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value || 0,
            sbuId: +location?.state?.sbu?.value,
            plantId: +location?.state?.plant?.value,
            priceStructureId: 0,
            plantName: location?.state?.plant?.label,
            warehouseId: +location?.state?.warehouse?.value,
            warehouseName: location?.state?.warehouse?.label,
            supplyingWarehouseId: values?.supplyingWh?.value || 0,
            supplyingWarehouseName: values?.supplyingWh?.label || "",
            purchaseOrganizationId: +location?.state?.purchaseOrg?.value,
            businessPartnerId: +values?.supplierName?.value || 0,
            purchaseOrderDate: values?.orderDate || "2020-11-10T08:52:28.574Z",
            purchaseOrderTypeId: +location?.state?.orderType?.value,
            incotermsId: 0,
            currencyId: +values?.currency?.value || 0,
            // currencyCode: values?.currency?.label || "",
            supplierReference: "",
            returnDate: values?.returnDate || "2020-12-06T09:35:19.200Z",
            referenceDate: null,
            referenceTypeId: +location?.state?.refType?.value,
            paymentTerms: +values?.paymentTerms?.value || 0,
            creditPercent: 0,
            cashOrAdvancePercent: 0,
            otherTerms: values?.otherTerms || "",
            poValidityDate: values?.validity || "2020-11-10T08:52:28.574Z",
            lastShipmentDate:
              values?.lastShipmentDate || "2020-11-10T08:52:28.574Z",
            paymentDaysAfterDelivery: +values.payDays || 0,
            deliveryAddress: values?.deliveryAddress || "",
            actionBy: +profileData?.userId,
            grossDiscount: +values?.discount || 0,
            freight: +values?.freight || 0,
            commission: 0,
            othersCharge: +values?.othersCharge || 0,
            transferBusinessUnitId: values?.isTransfer ?  values?.transferBusinessUnit?.value || 0 : 0,
            transferCostElementId: values?.isTransfer ? values?.costElement?.value || 0 : 0,
            transferCostCenterId: values?.isTransfer ? values?.costCenter?.value || 0 : 0,
            profitCenterId: values?.isTransfer ? values?.profitCenter?.value || 0 : 0,
            originOfSparesShip: values?.originOfSparesShip || "",
            descriptionShip: values?.descriptionShip || "",
            supplyLocationShip: values?.supplyLocationShip || "",
            leadDay:values?.leadTimeDays || 0,
            intTransferUnitPartnerId: values?.isTransfer ? values?.transferBusinessUnitSupplier?.value || 0 : 0,
            strTransferUnitPartnerName: values?.isTransfer ? values?.transferBusinessUnitSupplier?.label || "" : "",
          },
          objRowListDTO,
        };
        dispatch(
          savePurchaseOrderForAssetStandardService({
            data: payload,
            cb,
            setDisabled,
            IConfirmModal,
          })
        );
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});
  useEffect(() => {
    switch (+potype) {
      case 1:
        {
          setPoForm(
            <AssetStandardPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle(
            `Create Purchase Order (Standard PO) ${lastPo ? lastPo : ""}`
          );
        }
        break;
      case 2:
        {
          setPoForm(
            <PurchaseContractCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle("Create Purchase Order (Purchase Contract PO)");
        }
        break;
      case 3:
        {
          setPoForm(
            <SubContractPO
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle("Create Purchase Order (Subcontracting PO)");
        }
        break;
      case 4:
        {
          setPoForm(
            <StockTransferPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle("Create Purchase Order (Stock Transfer PO)");
        }
        break;
      case 5:
        {
          setPoForm(
            <ServicePO
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle(
            `Create Purchase Order (Service PO) ${lastPo ? lastPo : ""}`
          );
        }
        break;
      case 6:
        {
          setPoForm(
            <AssetPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle(`Create Purchase Order (Asset PO) ${lastPo ? lastPo : ""}`);
        }
        break;
      case 8:
        {
          setPoForm(
            <ReturnPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              {...objProps}
            />
          );
          setTitle("Create Purchase Order (Return PO)");
        }
        break;
      default:
        setPoForm(
          <AssetStandardPOCreateForm
            disableHandler={disableHandler}
            saveHandler={saveHandler}
            {...objProps}
          />
        );
        setTitle("Create Purchase Order (Asset PO)");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potype, objProps, lastPo]);

  return (
    <IForm title={title} getProps={setObjprops} isDisabled={isDisabled}>
      {isDisabled && <Loading />}
      {poForm}
    </IForm>
  );
}

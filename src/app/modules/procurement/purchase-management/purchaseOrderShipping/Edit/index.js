/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import IForm from "../../../../_helper/_form";
import PurchaseContractCreateForm from "./purchaseContract/CreateForm";
import SubContractPO from "./subcontractPO/CreateForm";
import ServicePO from "./servicePO/CreateForm";
import AssetStandardPOCreateForm from "./assetStandardPo/createForm";
import {
  getCurrencyDDLAction,
  getIncoTermsListDDLAction,
  getPaymentTermsListDDLAction,
  getPOReferenceNoDDLAction,
  getSupplierNameDDLAction,
  editPurchaseOrderForAssetStandardService,
  editCreateDataForPurchaseContractAction,
  getSingleDataAction,
  getSingleDataForReturnAction,
} from "../_redux/Actions";
import { useParams } from "react-router-dom";
import { getUomDDLAction } from "../../../../_helper/_redux/Actions";
import StockTransferPOCreateForm from "./stockTransfer/createForm";
import ReturnPOCreateForm from "./returnPO/createForm";
import { toast } from "react-toastify";
import Loading from "./../../../../_helper/_loading";
import { useLocation } from "react-router-dom";
import AssetPOEditForm from "./assetPo/createForm";

// id 1 = purchase contract
// id 2 = request
// id 3 = without reference
// id 4 = po reference

export function POEditFormByOrderTypeShipping() {
  const [isDisabled, setDisabled] = useState(false);
  const [title, setTitle] = useState(null);
  const [poForm, setPoForm] = useState(<></>);
  const dispatch = useDispatch();
  const { state: viewPage } = useLocation();

  const params = useParams();

  // redux store data
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      singleData: state?.purchaseOrder?.singleData,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, singleData } = storeData;

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      singleData?.objHeaderDTO?.sbuId
    ) {
      dispatch(
        getSupplierNameDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          singleData?.objHeaderDTO?.sbuId
        )
      );
      dispatch(
        getUomDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        getCurrencyDDLAction(
          profileData?.accountId,
          singleData?.objHeaderDTO?.purchaseOrganizationId,
          selectedBusinessUnit?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, singleData]);

  useEffect(() => {
    if (singleData?.objHeaderDTO?.warehouseId) {
      dispatch(
        getPOReferenceNoDDLAction(
          singleData?.objHeaderDTO?.referenceTypeId,
          singleData?.objHeaderDTO?.warehouseId,
          singleData?.objHeaderDTO?.purchaseOrderTypeId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    dispatch(getPaymentTermsListDDLAction());
    dispatch(getIncoTermsListDDLAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (+params?.poType === 8) {
      singlereturnCB();
    } else {
      if (params?.poId) {
        dispatch(getSingleDataAction(params?.poId, params?.poType));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let singlereturnCB = () => {
    dispatch(getSingleDataForReturnAction(params?.poId));
  };

  let singleCB = () => {
    dispatch(getSingleDataAction(params?.poId, params?.poType));
  };

  const saveHandler = async (values, rowDto, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // for asset , standard, service PO, subcontract PO, return po,
      if (
        singleData?.objHeaderDTO?.purchaseOrderTypeId === 1 ||
        singleData?.objHeaderDTO?.purchaseOrderTypeId === 5 ||
        singleData?.objHeaderDTO?.purchaseOrderTypeId === 6 ||
        singleData?.objHeaderDTO?.purchaseOrderTypeId === 3 ||
        singleData?.objHeaderDTO?.purchaseOrderTypeId === 4 ||
        singleData?.objHeaderDTO?.purchaseOrderTypeId === 8
      ) {
        // check atleast one row item quantity should be greater than 0
        // we will save only those field , where order qty is greater than 0
        const foundArr = rowDto?.filter((item) => item?.orderQty > 0);
        if (foundArr.length === 0) {
          return toast.warn("Enter quantity");
        }

        const objRowListDTO = foundArr?.map((item, index) => ({
          referenceId: +item?.referenceNo?.value || 0,
          referenceCode: item?.referenceNo?.label || "",
          referenceQty: +item?.item?.refQty || 0,
          itemId: +item?.item?.value || 0,
          itemName: item?.item?.itemName || "",
          uoMid: +item?.selectedUom?.value || 0,
          rowId: item?.rowId || 0,
          uoMname: item?.selectedUom?.label || "",
          controllingUnitId: +item?.controllingUnit?.value || 0,
          controllingUnitName: item?.controllingUnit?.label || "",
          costCenterId: values?.isTransfer
            ? +item?.costCenter?.value || 0
            : +item?.costCenterTwo?.value || 0,
          costCenterName: values?.isTransfer
            ? item?.costCenter?.label
            : item?.costCenterTwo?.label || "",
          costElementId: values?.isTransfer
            ? +item?.costElement?.value || 0
            : +item?.costElementTwo?.value || 0,
          costElementName: values?.isTransfer
            ? item?.costElement?.label
            : item?.costElementTwo?.label || "",
          purchaseDescription: item?.desc || "",
          orderQty: +item?.orderQty || 0,
          basePrice: +item?.basicPrice || 0,
          finalPrice: +(item?.orderQty * item?.basicPrice) || 0,
          totalValue: +item?.netValue || 0,
          vatPercentage: +item?.vat || 0,
          vatAmount: +item?.vatAmount || 0,
          baseVatAmount: +item?.userGivenVatAmount || 0,
          discount: 0,
          profitCenterId: values?.isTransfer
            ? item?.profitCenter?.value || 0
            : item?.profitCenterTwo?.value || 0,
          originOfSparesShip: values?.originOfSparesShip || "",
          descriptionShip: values?.descriptionShip || "",
          supplyLocationShip: values?.supplyLocationShip || "",
          // objPriceRowListDTO:
          //   item?.priceStructure?.map((item2, index) => ({
          //     rowId: item2?.rowId || 0,
          //     priceStructureId: item2?.priceStructureId || 0,
          //     priceStructureName: item2?.priceStructureName || '',
          //     priceComponentId: item2?.priceComponentId || 0,
          //     priceComponentCode: item2?.priceComponentCode || '',
          //     priceComponentName: item2?.priceComponentName || '',
          //     valueType: item2?.valueType || '',
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
            purchaseOrderId: +params?.poId,
            purchaseOrderNo: "string",
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value || 0,
            sbuId: +singleData?.objHeaderDTO?.sbuId,
            plantId: +singleData?.objHeaderDTO?.plantId,
            priceStructureId: 0,
            plantName: singleData?.objHeaderDTO?.plantName,
            warehouseId: +singleData?.objHeaderDTO?.warehouseId,
            warehouseName: singleData?.objHeaderDTO?.warehouseName,
            supplyingWarehouseId: values?.supplyingWh?.value || 0,
            supplyingWarehouseName: values?.supplyingWh?.label || "",
            purchaseOrganizationId: +singleData?.objHeaderDTO
              ?.purchaseOrganizationId,
            businessPartnerId: +values?.supplierName?.value || 0,
            purchaseOrderDate: values?.orderDate || "2020-11-10T08:52:28.574Z",
            purchaseOrderTypeId: +singleData?.objHeaderDTO?.purchaseOrderTypeId,
            incotermsId: +values?.incoterms?.value || 0,
            returnDate: values?.returnDate || "2020-12-06T09:35:19.200Z",
            currencyId: +values?.currency?.value || 0,
            currencyCode: values?.currency?.label || "",
            supplierReference: values?.supplierReference || "",
            referenceDate: values?.referenceDate || "2020-11-10T08:52:28.574Z",
            referenceTypeId: +singleData?.objHeaderDTO?.referenceTypeId,
            paymentTerms: +values?.paymentTerms?.value || 0,
            creditPercent: 0,
            cashOrAdvancePercent: parseFloat(values?.cash) || 0,
            otherTerms: values?.otherTerms || "",
            poValidityDate: values?.validity || "2020-11-10T08:52:28.574Z",
            lastShipmentDate:
              values?.lastShipmentDate || "2020-11-10T08:52:28.574Z",
            paymentDaysAfterDelivery: +values.payDays || 0,
            deliveryAddress: values?.deliveryAddress || "",
            actionBy: +profileData?.userId,
            grossDiscount: +values?.discount || 0,
            freight: +values?.freight || 0,
            commission: +values?.commission || 0,
            othersCharge: +values?.othersCharge || 0,
            transferBusinessUnitId: values?.transferBusinessUnit?.value || 0,
            businesstransactionId: values?.businessTransaction?.value || 0,
            transferCostElementId: values?.costElement?.value || 0,
            transferCostCenterId: values?.costCenter?.value || 0,
            profitCenterId: values?.profitCenter?.value || 0,
            originOfSparesShip: values?.originOfSparesShip || "",
            descriptionShip: values?.descriptionShip || "",
            supplyLocationShip: values?.supplyLocationShip || "",
            leadDay: values?.leadTimeDays || 0,
            intTransferUnitPartnerId: values?.transferBusinessUnitSupplier?.value || 0,
            strTransferUnitPartnerName: values?.transferBusinessUnitSupplier?.label || "",
          },
          objRowListDTO,
          objImageListDTO: [],
        };
        setDisabled(true);
        dispatch(
          editPurchaseOrderForAssetStandardService({
            data: payload,
            cb,
            setDisabled,
            singleCB,
          })
        );
      }

      // for purchase contract
      if (singleData?.objHeaderDTO?.purchaseOrderTypeId === 2) {
        // check atleast one row item quantity should be greater than 0
        // we will save only those field , where order qty is greater than 0
        const foundArr = rowDto?.filter((item) => item?.orderQty > 0);
        if (foundArr.length === 0) return toast.warn("Enter quantity");

        const rowListDTO = foundArr?.map((item, index) => ({
          referenceId: +item?.referenceNo?.value || 0,
          referenceCode: item?.referenceNo?.label || "",
          itemId: +item?.item?.value || 0,
          itemName: item?.item?.label || "",
          uoMid: +item?.selectedUom?.value || 0,
          active: true,
          rowId: item?.rowId || 0,
          serverDateTime: "2020-12-06T11:24:20.983Z",
          uoMname: item?.selectedUom?.label || "",
          purchaseDescription: item?.desc || "",
          referenceQty: +item?.item?.refQty || 0,
          basePrice: +item?.basicPrice || 0,
          finalPrice: +(item?.orderQty * item?.basicPrice) || 0,
          totalValue: +item?.netValue || 0,
          actionBy: +profileData?.userId || 0,
          lastActionDateTime: "2020-11-10T08:52:28.574Z",
          deliveryDateTime: item?.deliveryDate || "2020-12-06T11:17:58.990Z",
          purchaseContractId: 0,
          contractQty: +item?.orderQty || 0,
          // objListCPCPriceingDetailsDTO:
          //   item?.priceStructure?.map((item2, index) => ({
          //     rowId: item2?.rowId || 0,
          //     priceStructureId: item2?.priceStructureId || 0,
          //     priceStructureName: item2?.priceStructureName || '',
          //     priceComponentId: item2?.priceComponentId || 0,
          //     priceComponentCode: item2?.priceComponentCode || '',
          //     priceComponentName: item2?.priceComponentName || '',
          //     valueType: item2?.valueType || '',
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
          headerDTO: {
            purchaseContractId: +params?.poId,
            priceStructureId: 0,
            sbuId: +singleData?.objHeaderDTO?.sbuId,
            serverDateTime: "2020-12-06T11:24:20.983Z",
            active: true,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value || 0,
            plantId: +singleData?.objHeaderDTO?.plantId,
            plantName: singleData?.objHeaderDTO?.plantName,
            warehouseId: +singleData?.objHeaderDTO?.warehouseId,
            warehouseName: singleData?.objHeaderDTO?.warehouseName,
            purchaseOrganizationId: +singleData?.objHeaderDTO?.purchaseOrgId,
            businessPartnerId: +values?.supplierName?.value || 0,
            currencyId: +values?.currency?.value || 0,
            currencyCode: values?.currency?.label || "",
            referenceTypeId: +singleData?.objHeaderDTO?.referenceTypeId,
            paymentTerms: +values?.paymentTerms?.value || 0,
            creditPercent: 0,
            cashOrAdvancePercent: parseFloat(values?.cash) || 0,
            incotermsId: +values?.incoterms?.value || 0,
            supplierReference: values?.supplierReference || "",
            referenceDate: values?.referenceDate || "2020-11-10T08:52:28.574Z",
            otherTerms: values?.otherTerms || "",
            lastShipmentDate:
              values?.lastShipmentDate || "2020-11-10T08:52:28.574Z",
            paymentDaysAfterDelivery: +values.payDays || 0,
            deliveryAddress: values?.deliveryAddress || "",
            actionBy: +profileData?.userId,
            purchaseContractNo: "string",
            purchaseContractDate:
              values?.orderDate || "2020-11-10T08:52:28.574Z",
            itemGroupName: values?.itemGroup?.label,
            contractType: values?.contractType?.label,
            pcvalidityDate: values?.validity || "2020-11-10T08:52:28.574Z",
            approveBy: 0,
            approveDatetime: "2020-11-21T08:40:39.980Z",
            lastActionDateTime: "2020-11-21T08:40:39.980Z",
            leadDay: values?.leadTimeDays || 0,
            intTransferUnitPartnerId: values?.transferBusinessUnitSupplier?.value || 0,
            strTransferUnitPartnerName: values?.transferBusinessUnitSupplier?.label || "",
          },
          rowListDTO,
        };
        setDisabled(true);
        dispatch(
          editCreateDataForPurchaseContractAction({
            data: payload,
            cb,
            setDisabled,
          })
        );
      }

      // others
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});
  const pagetitle = viewPage ? "View" : "Edit";

  useEffect(() => {
    switch (+singleData?.objHeaderDTO?.purchaseOrderTypeId) {
      case 1:
        {
          setPoForm(
            <AssetStandardPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              isEdit={params?.poId}
              singleData={singleData}
              {...objProps}
              viewPage={viewPage}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Standard PO) code-${singleData?.objHeaderDTO?.purchaseOrderNo}`
          );
        }
        break;
      case 2:
        {
          setPoForm(
            <PurchaseContractCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              singleData={singleData}
              isEdit={params?.poId}
              id={params?.poId}
              {...objProps}
              viewPage={viewPage}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Purchase Contract PO) code-${singleData?.objHeaderDTO?.purchaseContractNo}`
          );
        }
        break;
      case 3:
        {
          setPoForm(
            <SubContractPO
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              singleData={singleData}
              isEdit={params?.poId}
              {...objProps}
              viewPage={viewPage}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Subcontracting PO) code-${singleData?.objHeaderDTO?.purchaseOrderNo}`
          );
        }
        break;
      case 4:
        {
          setPoForm(
            <StockTransferPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              singleData={singleData}
              {...objProps}
              isEdit={params?.poId}
              viewPage={viewPage}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Stock Transfer PO) code-${singleData?.objHeaderDTO?.purchaseOrderNo}`
          );
        }
        break;
      case 5:
        {
          setPoForm(
            <ServicePO
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              singleData={singleData}
              isEdit={params?.poId}
              {...objProps}
              viewPage={viewPage}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Service PO) code-${singleData?.objHeaderDTO?.purchaseOrderNo}`
          );
        }
        break;
      case 6:
        {
          setPoForm(
            <AssetPOEditForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              singleData={singleData}
              isEdit={params?.poId}
              {...objProps}
              viewPage={viewPage}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Asset PO) code-${singleData?.objHeaderDTO?.purchaseOrderNo}`
          );
        }
        break;
      case 8:
        {
          setPoForm(
            <ReturnPOCreateForm
              disableHandler={disableHandler}
              saveHandler={saveHandler}
              singleData={singleData}
              poIds={+params?.poId}
              isEdit={params?.poId}
              {...objProps}
              viewPage={viewPage}
              singlereturnCB={singlereturnCB}
            />
          );
          setTitle(
            `${pagetitle} Purchase Order (Return PO) code-${singleData?.objHeaderDTO?.purchaseOrderNo}`
          );
        }
        break;
      default:
        setPoForm(<Loading />);
        setTitle("");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData, objProps]);

  return (
    <IForm
      title={title}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={viewPage}
      isHiddenSave={viewPage}
    >
      {isDisabled && <Loading />}
      {poForm}
    </IForm>
  );
}

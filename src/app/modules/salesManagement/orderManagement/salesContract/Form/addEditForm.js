/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveSalesContact,
  getSalesContactById,
  getSalesOfficeDDLAction,
  getSoldToPDDLAction,
  getBUsalesOrgIncotermDDLAction,
  getPaymentTermsDDLAction,
  setSalesContactSingleEmpty,
  saveEditedSalesContact,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import {
  getPlantDDLAction,
  getDistributionChannelDDLAction,
  getItemSaleDDLAction,
  getUomDDLItemId_Action,
} from "../../../../_helper/_redux/Actions";
import { isUniq } from "../../../../_helper/uniqChecker";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { getSalesOrgDDLAction } from "../_redux/Actions";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

const initData = {
  id: undefined,
  plant: "",
  salesOrg: "",
  distributionChannel: "",
  salesOffice: "",
  soldToParty: "",
  itemSale: "",
  partnerReffNo: "",
  pricingDate: _todayDate(),
  startDate: _todayDate(),
  endDate: _todayDate(),
  BUsalesOrgIncoterm: "",
  paymentTerms: "",
  partialShipment: false,
  unlimited: false,
  offerInclude: false,
  deliveryAddress: "",
  vehicleBy: "",
  quantity: "",
  price: "",
  salesContactCode: "",
  uom: "",
  remark: "",
  itemLists: [],
};

export default function SalesContactForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  /*====================== Get All DDL start ======================*/
  const plantDDL = useSelector((state) => {
    return state?.commonDDL?.plantDDL;
  }, shallowEqual);
  const salesOrgDDL = useSelector((state) => {
    return state?.salesContact?.salesOrgDDL;
  }, shallowEqual);

  const distributionChannelDDL = useSelector((state) => {
    return state?.commonDDL?.distributionChannelDDL;
  }, shallowEqual);
  const itemSaleDDL = useSelector((state) => {
    return state?.commonDDL?.itemSaleDDL;
  }, shallowEqual);

  const salesOfficeDDL = useSelector((state) => {
    return state?.salesContact?.salesOfficeDDL;
  }, shallowEqual);

  const soldToPartyDDL = useSelector((state) => {
    return state?.salesContact?.soldToPartyDDL;
  }, shallowEqual);
  const BUsalesOrgIncotermDDL = useSelector((state) => {
    return state?.salesContact?.BUsalesOrgIncotermDDL;
  }, shallowEqual);
  const paymentTermsDDL = useSelector((state) => {
    return state?.salesContact?.paymentTermsDDL;
  }, shallowEqual);

  // get single sales contact  unit from store
  const singleData = useSelector((state) => {
    return state.salesContact?.singleData;
  }, shallowEqual);

  // item uom ddl
  const uomDDL = useSelector((state) => {
    return state.commonDDL?.uomDDL;
  }, shallowEqual);

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(
        getSalesContactById(
          profileData?.accountId,
          selectedBusinessUnit.value,
          id
        )
      );
    } else {
      dispatch(setSalesContactSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get PlantDDL & SalesOrgDDL & DistributionChannelDDL & SoldToPPId
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getPlantDDLAction(
          profileData.userId,
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getDistributionChannelDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getSoldToPDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(getPaymentTermsDDLAction());
      dispatch(
        getItemSaleDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getSalesOrgDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    const totalAmount = values?.itemLists?.reduce(
      (acc, cur) => acc + +cur?.contactValue,
      0
    );
    const totalQty = values?.itemLists?.reduce(
      (acc, cur) => acc + +cur?.contactQuantity,
      0
    );
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const objListRowDTO = values?.itemLists?.map((itm) => {
          return {
            rowId: itm.rowid ? itm.rowid : 0,
            itemId: itm.itemId,
            itemCode: itm.itemCode,
            itemName: itm.itemName,
            contactQuantity: +itm.contactQuantity,
            itemPrice: +itm.itemPrice,
            contactValue: itm.contactValue,
            uomId: itm.uomId,
            uomName: itm.uomName,
          };
        });
        const payload = {
          objHeaderDTO: {
            salesContactId: singleData.objHeaderDTO.salesContactId || 0,
            plantId: values.plant.value,
            plantName: values.plant.label,
            salesOfficeId: values.salesOffice.value,
            salesOfficeName: values.salesOffice.label,
            paymentTermId: values.paymentTerms.value,
            paymentTermsName: values.paymentTerms.label,
            dteEnddate: values.endDate,
            unlimited: values.unlimited,
            offerInclude: values.offerInclude,
            partialShipment: values.partialShipment,
            deliveryAddress: values.deliveryAddress,
            vehicleBy: values.vehicleBy.label,
            partnerReffNo: values.partnerReffNo,
          },
          objListRowDTO: objListRowDTO,
        };
        if (objListRowDTO?.length > 0) {
          dispatch(saveEditedSalesContact(payload, setDisabled));
        } else {
          toast.warning("You must have to add atleast one item");
        }
      } else {
        const objListRowDTO = values?.itemLists.map((itm) => {
          return {
            itemId: itm.itemId,
            itemCode: itm.itemCode,
            itemName: itm.itemName,
            contactQuantity: +itm.contactQuantity,
            itemPrice: +itm.itemPrice,
            contactValue: itm.contactValue,
            uomId: itm.uomId,
            uomName: itm.uomName,
          };
        });
        const payload = {
          objHeaderDTO: {
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            plantId: values.plant.value,
            plantName: values.plant.label,
            salesOrganizationId: values.salesOrg.value,
            salesOrganizationName: values.salesOrg.label,
            salesOfficeId: values.salesOffice.value,
            salesOfficeName: values.salesOffice.label,
            distributionChannelId: values.distributionChannel.value,
            distributionChannelName: values.distributionChannel.label,
            pricingDate: values.pricingDate,
            soldToPartnerId: values.soldToParty.value,
            soldToPartnerName: values.soldToParty.label,
            partnerReffNo: values.partnerReffNo,
            partialShipment: values.partialShipment,
            incotermId: 1,
            incotermsCode: "CFR",
            incotermsName: "CFR (Cost And Freight)",
            paymentTermId: values.paymentTerms.value,
            paymentTermsName: values.paymentTerms.label,
            totalContactValue: +totalAmount,
            totalContactQty: +totalQty,
            dteStartdate: values.startDate,
            dteEnddate: values.endDate,
            unlimited: values.unlimited,
            offerInclude: values.offerInclude,
            vehicleBy: values.vehicleBy.label,
            deliveryAddress: values.deliveryAddress,
            actionBy: profileData.userId,
            active: true,
            remark: values?.remark || "",
          },
          objListRowDTO: objListRowDTO,
        };
        // setDisabled(false);
        if (objListRowDTO?.length > 0) {
          dispatch(saveSalesContact({ data: payload, cb, setDisabled }));
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    }
  };

  //Sales Organization onChange dispatch salesOfficeDDLDispatcher
  const salesOfficeDDLDispatcher = (SalesOrgId) => {
    dispatch(
      getSalesOfficeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        SalesOrgId
      )
    );
    dispatch(
      getBUsalesOrgIncotermDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        SalesOrgId
      )
    );
  };
  //addBtnHandler
  const addBtnHandler = (values, setFieldValue) => {
    const newData = [
      {
        itemId: values.itemSale.value,
        itemName: values.itemSale.label,
        contactQuantity: values.quantity,
        itemPrice: +values.price,
        contactValue: +values.price * +values.quantity,
        itemCode: values.itemSale.code,
        uomId: values?.uom?.value,
        uomName: values?.uom?.label,
      },
    ];
    if (isUniq("itemId", values.itemSale.value, values?.itemLists)) {
      setFieldValue("itemLists", [...values?.itemLists, ...newData]);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSalesContactSingleEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //onChange itemListHandelar
  const itemListHandelar = (currentValue, setFieldValue) => {
    dispatch(
      getUomDDLItemId_Action(
        profileData.accountId,
        selectedBusinessUnit.value,
        currentValue,
        setFieldValue
      )
    );
  };

  return (
    <IForm
      title={id ? "Edit Sales Contract" : "Create Sales Contract"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}

      <Form
        {...objProps}
        initData={singleData.objHeaderDTO || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        plantDDL={plantDDL}
        isEdit={id || false}
        salesOrgDDL={salesOrgDDL}
        distributionChannelDDL={distributionChannelDDL}
        salesOfficeDDL={salesOfficeDDL}
        soldToPartyDDL={soldToPartyDDL}
        BUsalesOrgIncotermDDL={BUsalesOrgIncotermDDL}
        paymentTermsDDL={paymentTermsDDL}
        itemSaleDDL={itemSaleDDL}
        salesOfficeDDLDispatcher={salesOfficeDDLDispatcher}
        addBtnHandler={addBtnHandler}
        uomDDL={uomDDL}
        itemListHandelar={itemListHandelar}
      />
    </IForm>
  );
}

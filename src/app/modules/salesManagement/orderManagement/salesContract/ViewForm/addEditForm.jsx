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
} from "../../../../_helper/_redux/Actions";
import { isUniq } from "../../../../_helper/uniqChecker";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { getSalesOrgDDLAction } from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";

const initData = {
  view: undefined,
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
};

export default function SalesContactViewForm({
  history,
  match: {
    params: { view },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [total, setTotal] = useState({ totalQty: 0, totalAmount: 0 });

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  /*======================
  get All DDL start*/
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

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (view) {
      dispatch(
        getSalesContactById(
          profileData?.accountId,
          selectedBusinessUnit.value,
          view
        )
      );
    } else {
      dispatch(setSalesContactSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

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
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (view) {
        const objListRowDTO = rowDto.map((itm) => {
          return {
            rowId: itm.rowview ? itm.rowview : 0,
            itemId: itm.itemId,
            itemCode: itm.itemCode,
            itemName: itm.itemName,
            contactQuantity: itm.contactQuantity,
            itemPrice: itm.itemPrice,
            contactValue: itm.contactValue,
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
        dispatch(saveEditedSalesContact(payload));
      } else {
        const objListRowDTO = rowDto.map((itm) => {
          return {
            itemId: itm.itemId,
            itemCode: itm.itemCode,
            itemName: itm.itemName,
            contactQuantity: itm.contactQuantity,
            itemPrice: itm.itemPrice,
            contactValue: itm.contactValue,
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
            // incotermId: values.BUsalesOrgIncoterm.value,
            // incotermsCode: values.BUsalesOrgIncoterm.code,
            // incotermsName: values.BUsalesOrgIncoterm.label,
            incotermId: 1,
            incotermsCode: "CFR",
            incotermsName: "CFR (Cost And Freight)",
            paymentTermId: values.paymentTerms.value,
            paymentTermsName: values.paymentTerms.label,
            totalContactValue: total.totalAmount,
            totalContactQty: total.totalQty,
            dteStartdate: values.startDate,
            dteEnddate: values.endDate,
            unlimited: values.unlimited,
            offerInclude: values.offerInclude,
            vehicleBy: values.vehicleBy.label,
            deliveryAddress: values.deliveryAddress,
            actionBy: profileData.userId,
            active: true,
          },
          objListRowDTO: objListRowDTO,
        };
        setDisabled(false);
        dispatch(saveSalesContact({ data: payload, cb }));
        setRowDto([]);
      }
    } else {
      setDisabled(false);
      console.log(values);
    }
  };
  const disableHandler = (cond) => {
    setDisabled(cond);
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
  const addBtnHandler = (values) => {
    const newData = [
      {
        itemId: values.itemSale.value,
        itemName: values.itemSale.label,
        contactQuantity: values.quantity,
        itemPrice: values.price,
        contactValue: values.quantity * values.price,
        itemCode: values.itemSale.code,
      },
    ];
    if (isUniq("itemId", values.itemSale.value, rowDto)) {
      setRowDto([...rowDto, ...newData]);
    }
  };
  // row remove
  const remover = (view) => {
    let ccdata = rowDto.filter((itm) => itm.itemId !== view);
    setRowDto(ccdata);
  };
  // rowDto singleData set
  useEffect(() => {
    if (view) {
      const objListRowDTO = singleData?.objListRowDTO;
      if (objListRowDTO) {
        setRowDto(objListRowDTO);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  //Total Qty & Total Amount calculation
  useEffect(() => {
    let totalQty = 0;
    let totalAmount = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalQty += +rowDto[i].contactQuantity;
        totalAmount += +rowDto[i].contactValue;
      }
    }
    setTotal({ totalQty, totalAmount });
  }, [rowDto]);

  useEffect(() => {
    return () => {
      dispatch(setSalesContactSingleEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <IForm
      title={"View Sales Contract"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={true}
      isHiddenReset={true}
    >
      {rowDto?.length > 0 ? "" : <Loading />}
      <Form
        {...objProps}
        initData={singleData.objHeaderDTO || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        plantDDL={plantDDL}
        isEdit={view || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        salesOrgDDL={salesOrgDDL}
        distributionChannelDDL={distributionChannelDDL}
        salesOfficeDDL={salesOfficeDDL}
        soldToPartyDDL={soldToPartyDDL}
        BUsalesOrgIncotermDDL={BUsalesOrgIncotermDDL}
        paymentTermsDDL={paymentTermsDDL}
        itemSaleDDL={itemSaleDDL}
        salesOfficeDDLDispatcher={salesOfficeDDLDispatcher}
        addBtnHandler={addBtnHandler}
        total={total}
        remover={remover}
      />
    </IForm>
  );
}

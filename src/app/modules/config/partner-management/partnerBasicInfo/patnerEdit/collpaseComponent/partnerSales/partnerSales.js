import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../../_metronic/_partials/controls";
import Form from "./form";
import Axios from "axios";
import shortid from "shortid";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { isUniq } from "../../../../../../_helper/uniqChecker";
import { toast } from "react-toastify";
import {
  getSbuDDLAction,
  getSalesOrganaizationDDLAction,
  getDistributionChannelDDLAction,
  getTransportZoneDDLAction,
  getSoldToPartyDDLAction,
  getShippingPointDDLAction,
  GeneralLedgerDDLAction,
  getPriceStructureDDLAction,
  AlternateGeneraleDDLAction,
  getAlternateShippingPointDDLAction,
} from "./_redux/Actions";
import { _todayDate } from "../../../../../../_helper/_todayDate";
import Loading from "./../../../../../../_helper/_loading";
import { EditBPShippingAddressDefaultById_api } from "../../../helper";
import { getBusinessPartnerSalesByPartnerId } from "./helper";
import useAxiosGet from "../../../../../../_helper/customHooks/useAxiosGet";

const initProduct = {
  sbu: "",
  salesOrganaization: "",
  distributionChannel: "",
  salesTerriory: "",
  transportZone: "",
  reconGeneralLedger: "",
  alternetGeneralLedger: "",
  soldToParty: "",
  shippingPoint: "",
  multipleShippingPoint: false,
  priceStructure: "",
  alternateShippingPoint: "",
  distanceKm: "",
  defaultDistanceKm: "",
  creditLimitAmount: "",
  daysCreditLimitAmount: "",
  creditValidFrom: _todayDate(),
  creditValidTo: _todayDate(),
  morgazeType: "",
  morgazeAmount: "",
  morgazeNarration: "",
  customerType: "",
  shipToParner: "",
  address: "",
  collectionDays: "",
  bankName: "",
  branchName: "",
  refNo: "",
  limitType: "",
  numberOfDays: "",
  isTaxOnDeliveryAmount: false,
  priceIncludingTax: false,
  isManualAuto: false,
  paymentMode: "",
  exclusivity: "",
  partyStatusType: "",
  customerCategory: "",
  expireDate: "",
  operationalZone: "",
  issueDate: "",
  agConcern: "",
};

export default function PartnerSales() {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  // get user data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData
  );

  const [salesData, setSalesData] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([]);
  const [creditRowDto, setCreditRowDto] = useState([]);
  const [morgazeRowDto, setMorgazeRowDto] = useState([]);
  const [isPartnerSales, setIsPartnerSale] = useState(false);
  const [defaultConfigId, setDefaultConfigId] = useState(null);
  const [filterAdvanceReceiveGL, setFilterAdvanceReceiveGL] = useState([]);
  const [operationalZones, getOperationalZones] = useAxiosGet();
  const [AGConcernDDL, getAGConcernDDL] = useAxiosGet();

  // get sbu ddl from store
  const sbuDDL = useSelector((state) => {
    return state?.partnerSales?.sbuDDL;
  }, shallowEqual);
  //Dispatch Get sbuDDL action for get sbu ddl
  useEffect(() => {
    getAGConcernDDL(`/partner/BusinessPartnerBasicInfo/GetAGConcernUnitDDL`);
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  // get salesOrganaization ddl from store
  const salesOrganaizationDDL = useSelector((state) => {
    return state?.partnerSales?.salesOrganaizationDDL;
  }, shallowEqual);
  // call salesOrganaization action
  const getSalesOrganaizationDDL = (sbuId) => {
    dispatch(
      getSalesOrganaizationDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        sbuId
      )
    );
  };
  // get distributionChannel ddl from store
  const distributionChannelDDL = useSelector((state) => {
    return state?.partnerSales?.distributionChannelDDL;
  }, shallowEqual);
  // Dispatch Get distributionChannel action for get distributionChannel ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getDistributionChannelDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  // get salesTerriory ddl from store
  const salesTerrioryDDL = useSelector((state) => {
    return state?.partnerSales?.salesTerrioryDDL;
  }, shallowEqual);

  // get transportZoneDDL ddl from store
  const transportZoneDDL = useSelector((state) => {
    return state?.partnerSales?.transportZoneDDL;
  }, shallowEqual);

  const getOperationalZoneDDL = (values) => {
    getOperationalZones(
      `/partner/BusinessPartnerSales/GetOperationalZoneByTerritory?TerritoryId=${values?.salesTerriory?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  };
  // Dispatch Get transportZone action for get transportZone ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getTransportZoneDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  // recon gl ddl and alternante gl ddl
  const GeneralLedgerDDL = useSelector((state) => {
    return state?.partnerSales?.GeneralLedgerDDL;
  }, shallowEqual);
  const alternateGenerale = useSelector((state) => {
    return state?.partnerSales?.alternateGenerale;
  }, shallowEqual);

  // get soldToPartyDDL ddl from store
  const soldToPartyDDL = useSelector((state) => {
    return state?.partnerSales?.soldToPartyDDL;
  }, shallowEqual);

  // Dispatch Get soldToPartyDDL action for get soldToParty ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSoldToPartyDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // get shippingPointDDL ddl from store
  const shippingPointDDL = useSelector((state) => {
    return state?.partnerSales?.shippingPointDDL;
  }, shallowEqual);

  // Dispatch Get shippingPointDDL action for get shippingPointDDL ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getShippingPointDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // get alternateShippingPointDDL ddl from store
  const alternateShippingPointDDL = useSelector((state) => {
    return state?.partnerSales?.alternateShippingPointDDL;
  }, shallowEqual);

  // Dispatch Get alternateShippingPointDDL action for get alternateShippingPointDDL ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        GeneralLedgerDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          4
        )
      );
      dispatch(
        AlternateGeneraleDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          10
        )
      );
      dispatch(
        getAlternateShippingPointDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // get priceStructureDDL ddl from store
  const priceStructureDDL = useSelector((state) => {
    return state?.partnerSales?.priceStructureDDL;
  }, shallowEqual);

  // Dispatch Get priceStructureDDL action for get priceStructureDDL ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getPriceStructureDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getDataById = () => {
    getBusinessPartnerSalesByPartnerId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      id,
      setIsPartnerSale,
      setSalesData,
      setRowDto,
      setCreditRowDto,
      setMorgazeRowDto,
      setRowDtoTwo,
      setDefaultConfigId,
      (resData) => {
        const values = {
          salesTerriory: {
            value: resData?.objGetDTO?.territoryId,
            label: resData?.objGetDTO?.territoryName,
          },
        };
        getOperationalZoneDDL(values);
      }
    );
  };

  useEffect(() => {
    getDataById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // submit handle
  const savePartnerSales = async (values, cb) => {
    // common all RowDto  modifiedRowDto===============
    if (!values?.limitType) {
      toast.warn(
        "Please select one of the limit types from credit limit, days limit, and bot"
      );
    }
    const { accountId, userId: actionBy } = profileData;
    const { value: businessunitid } = selectedBusinessUnit;
    const objRow = rowDto?.map((itm) => {
      return {
        ...itm,
        accountId,
        businessUnitId: businessunitid,
        businessPartnerId: +id,
        shipPointId: +itm?.shipPointId,
        isDefaultShippoint: itm.isDefaultShippoint,
        distanceKm: 0,
        actionBy,
      };
    });
    const objMortgageRow = morgazeRowDto?.map((itm) => {
      return {
        ...itm,
        mortgageTypeId: itm?.mortgageTypeId,
        numMortgageAmount: itm?.numMortgageAmount,
        narration: itm?.narration,
      };
    });
    const objCreditRow = creditRowDto?.map((itm) => {
      return {
        ...itm,
        creditLimit: itm?.creditLimit,
        fromDate: itm?.fromDate,
        toDate: itm?.toDate,
      };
    });

    if (values && selectedBusinessUnit && profileData) {
      // edit api call
      if (isPartnerSales === true) {
        const salesEditData = {
          objEditDTO: {
            configId: defaultConfigId || 0,
            accountId: accountId,
            businessUnitId: businessunitid,
            sbuid: values?.sbu.value,
            businessPartnerId: +id,
            priceStructureId: values?.priceStructure.value,
            salesOrganizationId: values?.salesOrganaization.value,
            creditLimit: values?.creditLimit,
            balanceCheckTypeId: 0,
            generalLederId: values?.reconGeneralLedger?.value,
            alternateGlid: values?.alternetGeneralLedger?.value,
            soldToPartnerShipToPartnerID: values?.soldToParty?.value,
            soldToPartnerShipToPartnerName: values?.soldToParty?.label,
            transportZoneId: values?.transportZone?.value,
            territoryId: values?.salesTerriory?.value,
            distributionChannelId: values?.distributionChannel?.value,
            actionBy: actionBy,
            customerType: values?.customerType?.label,
            collectionDays: values?.collectionDays || 0,
            isTaxOnDeliveryAmount: values?.isTaxOnDeliveryAmount || false,
            isBackCalculation: values?.priceIncludingTax || false,
            isManualAuto: values?.isManualAuto || false,
            isExclusive: values?.exclusivity?.value,
            creditFacilityTypeId: values?.paymentMode?.value,
            creditFacilityTypeName: values?.paymentMode?.label,
            partyStatusType: values?.partyStatusType?.value,
            strCustomerCategory: values?.customerCategory?.value,
            akigGroupSisterConcernId: values?.agConcern?.value, //new
            akigGroupSisterConcernName: values?.agConcern?.label, //new
          },
          objListEditDTO: rowDto,
          objListEditCr: creditRowDto,
          objListEditMortgage: morgazeRowDto,
          objListEditBPAddrss: rowDtoTwo,
        };
        try {
          if (objRow?.length > 0) {
            if (rowDtoTwo?.length > 0) {
              //code write
              setDisabled(true);
              const res = await Axios.put(
                "/partner/BusinessPartnerSales/EditBusinessPartnerSales",
                salesEditData
              );
              toast.success(res.data?.message || "Submitted successfully", {
                toastId: shortid(),
              });
              getDataById();
              setDisabled(false);
            } else {
              toast.warning("Please add at least one (Add Shipping Address)");
            }
          } else {
            toast.warning("Please add at least one (Assign Shipping Point)");
          }
        } catch (error) {
          toast.error(error?.response?.data?.message, {
            toastId: shortid(),
          });
          setDisabled(false);
        }
      } else {
        const payload = {
          objSasles: {
            accountId: accountId,
            businessUnitId: businessunitid,
            sbuid: values?.sbu.value,
            businessPartnerId: +id,
            priceStructureId: values?.priceStructure.value,
            salesOrganizationId: values?.salesOrganaization.value,
            ledgerBalance: 0,
            unbilledAmount: 0,
            creditLimit: 0,
            balanceCheckTypeId: 0,
            generalLederId: values?.reconGeneralLedger?.value,
            alternateGlid: values?.alternetGeneralLedger?.value,
            territoryId: values?.salesTerriory?.value,
            distributionChannelId: values?.distributionChannel?.value,
            actionBy: actionBy,
            customerType: values?.customerType?.label,
            collectionDays: values?.collectionDays || 0,
            isTaxOnDeliveryAmount: values?.isTaxOnDeliveryAmount || false,
            isBackCalculation: values?.priceIncludingTax || false,

            isExclusive: values?.exclusivity?.value,
            creditFacilityTypeId: values?.paymentMode?.value,
            creditFacilityTypeName: values?.paymentMode?.label,
            partyStatusType: values?.partyStatusType?.value,
            strCustomerCategory: values?.customerCategory?.value,
            isManualAuto: values?.isManualAuto || false,
          },
          objListShipPoint: objRow,
          objListMortgage: objMortgageRow,
          objListCrLimit: objCreditRow,
          objListBPShippingAddr: rowDtoTwo,
        };

        try {
          if (objRow?.length > 0) {
            if (rowDtoTwo?.length > 0) {
              setDisabled(true);
              const res = await Axios.post(
                "/partner/BusinessPartnerSales/CreateBusinessPartnerSales",
                payload
              );
              if (res.status === 200) {
                setRowDto([]);
                setRowDtoTwo([]);
              }
              // cb(initProduct)
              toast.success(res.data?.message || "Submitted successfully", {
                toastId: shortid(),
              });
              getDataById();
              setDisabled(false);
            } else {
              toast.warning("Please add at least one (Add Shipping Address)");
            }
          } else {
            toast.warning("Please add at least one (Assign Shipping Point)");
          }
        } catch (error) {
          toast.error(error?.response?.data?.message, {
            toastId: shortid(),
          });
          setDisabled(false);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (payload) => {
    if (isUniq("shipPointId", payload.shipPointId, rowDto)) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      setRowDto([
        ...rowDto,
        {
          configId: 0,
          accountId: accountId,
          businessUnitId: businessunitid,
          businessPartnerId: +id,
          actionBy: actionBy,
          ...payload,
        },
      ]);
    }
  };

  const setterTwo = (values) => {
    const { accountId, userId: actionBy } = profileData;
    const { value: businessunitid } = selectedBusinessUnit;
    const obj = {
      partnerShippingName: values?.shipToParner.trim(),
      partnerShippingAddress: values?.address,
      partnerShippingContact: values?.contact,
      transportZoneName: values?.transportZone?.label,
      transportZoneId: values?.transportZone?.value,
      shiptoPartnerId: 0,
      setUpZoneId: businessunitid === 4 ? values?.operationalZone?.value : 0,
      setUpZoneName: businessunitid === 4 ? values?.operationalZone?.label : 0,
    };

    if (
      !rowDtoTwo?.some(
        (item) => item?.partnerShippingName === values?.shipToParner.trim()
      )
    ) {
      console.log("here");
      setRowDtoTwo((prev) => [
        ...(prev?.length > 0 ? prev : []),
        {
          configId: 0,
          accountId: accountId,
          businessUnitId: businessunitid,
          businessPartnerId: +id,
          actionBy: actionBy,
          ...obj,
          isDefaultAddress: rowDtoTwo?.length > 0 ? false : true,
        },
      ]);
    } else {
      toast.warn("Can't add duplicate ship to partner name");
    }
  };

  const defaultSetter = (payload) => {
    if (isUniq("shipPointId", payload.shipPointId, rowDto)) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;

      setRowDto([
        ...rowDto,
        {
          configId: 0,
          accountId: accountId,
          businessUnitId: businessunitid,
          businessPartnerId: +id,
          actionBy: actionBy,
          ...payload,
          isDefaultShippoint: rowDto?.length > 0 ? false : true,
        },
      ]);
    }
  };

  const remover = (payload, isDefaultShippoint) => {
    if (isDefaultShippoint) {
      return;
    } else {
      const filterArr = rowDto.filter((itm) => itm.shipPointId !== payload);
      setRowDto(filterArr);
    }
  };
  const removerTwo = (payload, isDefaultAddress) => {
    if (isDefaultAddress) {
      return;
    } else {
      const filterArr = rowDtoTwo.filter((itm, inx) => inx !== payload);
      setRowDtoTwo(filterArr);
    }
  };

  // credit limit
  const creditLimitSetter = (payload) => {
    setCreditRowDto([...creditRowDto, payload]);
  };
  const creditRemover = (payload) => {
    const filterArr = creditRowDto.filter((itm, idx) => idx !== payload);
    setCreditRowDto(filterArr);
  };
  const setCreditLimitAmount = (sl, value) => {
    const cloneArr = creditRowDto;
    cloneArr[sl].creditLimit = +value;
    setCreditRowDto([...cloneArr]);
  };

  // morgaze
  const morgazeSetter = (payload) => {
    if (isUniq("mortgageTypeId", payload.mortgageTypeId, morgazeRowDto)) {
      setMorgazeRowDto([...morgazeRowDto, payload]);
    }
  };
  const morgazeRemover = (payload) => {
    const filterArr = morgazeRowDto.filter(
      (itm) => itm?.mortgageTypeId !== payload
    );
    setMorgazeRowDto(filterArr);
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

  // one item select itemSlectedHandler
  const itemSlectedHandler = (value, index) => {
    const modifiedRowDto = rowDto?.map((itm) => ({
      ...itm,
      isDefaultShippoint: false,
    }));
    const copyRowDto = [...modifiedRowDto];
    copyRowDto[index].isDefaultShippoint = !copyRowDto[index]
      .isDefaultShippoint;
    setRowDto(copyRowDto);
  };
  // one item select itemSlectedHandlerTwo
  const itemSlectedHandlerTwo = (value, index) => {
    const modifiedRowDto = rowDtoTwo?.map((itm) => ({
      ...itm,
      isDefaultAddress: false,
    }));
    const copyRowDto = [...modifiedRowDto];
    copyRowDto[index].isDefaultAddress = !copyRowDto[index].isDefaultAddress;
    setRowDtoTwo(copyRowDto);
  };

  useEffect(() => {
    const rowDtoTwomodified = rowDtoTwo?.filter(
      (itm) => itm?.shiptoPartnerId !== 0
    );
    const copyRowDto = rowDtoTwomodified?.map((itm) => ({
      shiptoPartnerId: itm?.shiptoPartnerId,
      isDefaultAddress: itm?.isDefaultAddress,
      intActionBy: itm?.actionBy,
    }));
    EditBPShippingAddressDefaultById_api(copyRowDto, setDisabled);
  }, [rowDtoTwo]);
  // const numberOfDaysChangeHandler = (values) => {
  //   if (values.limitType === "dayesLimit" && values?.numberOfDays > 0) {
  //     let obj = {
  //       creditLimit: +values?.creditLimit || 0,
  //       fromDate: _todayDate(),
  //       toDate: _todayDate(),
  //       configId: creditRowDto?.[0]?.configId || 0,
  //       strLimitStatus: "Life Time",
  //       isDayLimit: true,
  //       limitDays: +values?.numberOfDays,
  //       uploadFile: "",
  //     };
  //     setCreditRowDto([obj]);
  //   } else {
  //     setCreditRowDto([]);
  //   }
  // };

  const numberOfDaysChangeHandler = (values) => {
    if (values.limitType === "dayesLimit" || values.limitType === "both") {
      const copy = [...creditRowDto];
      const findIndex = copy?.findIndex((itm) => itm?.limitDays);
      let obj = {
        creditLimit: +values?.daysCreditLimitAmount || 0,
        fromDate: _todayDate(),
        toDate: _todayDate(),
        configId: copy[findIndex]?.configId || 0,
        strLimitStatus: "Life Time",
        isDayLimit: true,
        limitDays: +values?.numberOfDays,
        uploadFile: "",
      };
      if (findIndex === -1 && values?.numberOfDays > 0) {
        copy.push(obj);
        setCreditRowDto(copy);
      } else {
        if (values?.numberOfDays > 0) {
          //Days Limit data change
          copy[findIndex] = obj;
          setCreditRowDto(copy);
        } else {
          if (findIndex !== -1) {
            // remove Limit data
            copy.splice(findIndex, 1);
            setCreditRowDto(copy);
          }
        }
      }
    } else {
      setCreditRowDto([]);
    }
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (alternateGenerale?.length > 0) {
        // Unearned Revenue
        const findData = alternateGenerale.find((i) => i?.value === 85);
        setFilterAdvanceReceiveGL(findData ? [findData] : "");
      } else {
        setFilterAdvanceReceiveGL([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, alternateGenerale, id]);

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Partner Sales Info">
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
        <div className="mt-0">
          {isDisabled && <Loading />}
          <Form
            // product={initProduct}
            product={
              salesData || {
                ...initProduct,
                alternetGeneralLedger: filterAdvanceReceiveGL?.[0] || "",
                priceIncludingTax: [171, 224].includes(
                  selectedBusinessUnit?.value
                ),
                isTaxOnDeliveryAmount: [171, 224].includes(
                  selectedBusinessUnit?.value
                ),
              }
            }
            btnRef={btnRef}
            savePartnerSales={savePartnerSales}
            resetBtnRef={resetBtnRef}
            selectedBusinessUnit={selectedBusinessUnit}
            accountId={profileData.accountId}
            profileData={profileData}
            rowDto={rowDto}
            sbuDDL={sbuDDL}
            getSalesOrganaizationDDL={getSalesOrganaizationDDL}
            salesOrganaizationDDL={salesOrganaizationDDL}
            distributionChannelDDL={distributionChannelDDL}
            salesTerrioryDDL={salesTerrioryDDL}
            transportZoneDDL={transportZoneDDL}
            alternateGLDDL={alternateGenerale}
            reconGLDDL={GeneralLedgerDDL}
            soldToPartyDDL={soldToPartyDDL}
            shippingPointDDL={shippingPointDDL}
            alternateShippingPointDDL={alternateShippingPointDDL}
            priceStructureDDL={priceStructureDDL}
            setter={setter}
            defaultSetter={defaultSetter}
            remover={remover}
            creditLimitSetter={creditLimitSetter}
            creditRemover={creditRemover}
            creditRowDto={creditRowDto}
            setCreditLimitAmount={setCreditLimitAmount}
            morgazeSetter={morgazeSetter}
            morgazeRemover={morgazeRemover}
            morgazeRowDto={morgazeRowDto}
            setMorgazeRowDto={setMorgazeRowDto}
            itemSlectedHandler={itemSlectedHandler}
            setterTwo={setterTwo}
            itemSlectedHandlerTwo={itemSlectedHandlerTwo}
            rowDtoTwo={rowDtoTwo}
            removerTwo={removerTwo}
            id={id}
            numberOfDaysChangeHandler={numberOfDaysChangeHandler}
            setCreditRowDto={setCreditRowDto}
            isPartnerSales={isPartnerSales}
            filterAdvanceReceiveGL={filterAdvanceReceiveGL}
            operationalZones={operationalZones}
            getOperationalZoneDDL={getOperationalZoneDDL}
            AGConcernDDL={AGConcernDDL}
          />
        </div>
      </CardBody>
    </Card>
  );
}

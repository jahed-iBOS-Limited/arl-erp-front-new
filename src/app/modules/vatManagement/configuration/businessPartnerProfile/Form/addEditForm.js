/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
// import { toast } from "react-toastify";
import {
  GetBusinessPartnerProfileView,
  getCountryDDL_api,
  getDivisionDDL_api,
  getPartnerTypeDDL_api,
  getTaxBracketDDL_api,
  saveBusinessPartnerProfile,
  saveEditedBusinessPartnerProfile,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

const initData = {
  businessPartnerName: "",
  businessPartnerAddress: "",
  contactNumber: "",
  email: "",
  nid: "",
  businessPartnerTypeId: "",
  businessPartnerCode: "",
  country: "",
  state: "",
  city: "",
  policeStation: "",
  postCode: "",
  taxBracket: "",
  bin: "",
  licenseNo: "",
  addShipToParty: false,
};

export default function BusinessPartnerProfileForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [taxBracketDDL, setTaxBracketDDL] = useState("");
  const [countryDDL, setCountryDDL] = useState("");
  const [divisionDDL, setDivisionDDL] = useState("");
  const [partnerTypeDDL, SetPartnerTypeDDL] = useState("");
  const [districtDDL, SetDistrictDDL] = useState("");
  const [postCodeDDL, setPostCodeDDL] = useState("");
  const [policeStationDDL, SetPoliceStationDDL] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();

  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getTaxBracketDDL_api(setTaxBracketDDL);
    getCountryDDL_api(setCountryDDL);
    getPartnerTypeDDL_api(SetPartnerTypeDDL);
  }, []);

  // Get Division DDL Initialy For Bangladesh
  useEffect(() => {
    getDivisionDDL_api(18, setDivisionDDL); // 18 is for Bangladesh
  }, [countryDDL]);

  // get singleData
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    if (params?.id) {
      GetBusinessPartnerProfileView(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.id,
        setSingleData,
        setDisabled
      );
    }
  }, [profileData, selectedBusinessUnit, params]);

  // Show when in edit mode, rowData
  useEffect(() => {
    const newData = singleData?.row?.map((item) => ({
      businessPartnerId: item?.businessPartnerId || 0,
      partnerName: item?.partnerName,
      contactNumber: item?.contactNumber,
      address: item?.address,
      shiptoPartnerId: item?.shiptoPartnerId,
    }));

    if (params?.id) {
      setRowDto(newData);
    } else {
      setRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (+id) {
        //edit api call
        const editRowDto = rowDto.map((itm, index) => ({
          shiptoPartnerId: itm?.shiptoPartnerId || 0,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessPartnerId: +id || 0,
          partnerShippingName: itm?.partnerName || "",
          partnerShippingAddress: itm?.address || "",
          partnerShippingContact: itm?.contactNumber || "",
          transportZoneId: 0,
          isDefaultAddress: true,
        }));
        const payload = {
          objBP: {
            businessPartnerId: +id,
            businessPartnerName: values?.businessPartnerName,
            businessPartnerAddress: values?.businessPartnerAddress,
            businessPartnerCode: values?.businessPartnerCode || "",
            contactNumber: `${values?.contactNumber}`,
            taxBracketId: values?.taxBracket?.value || 0,
            email: `${values?.email}`,
            nid: `${values?.nid}`,
            actionBy: profileData?.userId,
            binNo: values?.bin || "",
            licenseNo: values?.licenseNo || "",
          },
          objListBP: editRowDto,
        };
        saveEditedBusinessPartnerProfile(
          values?.businessPartnerTypeId?.value,
          editRowDto.length > 0 ? 1 : 0,
          payload,
          setDisabled
        );
      } else {
        //create api call
        if (values?.addShipToParty && rowDto?.length === 0) {
          toast.warning("Please add ship to party infomation");
        } else {
          const newRowDto = rowDto.map((itm, index) => ({
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessPartnerCode: values?.businessPartnerCode || "",
            businessPartnerId: +itm?.businessPartnerId || 0,
            businessPartnerName: `${itm?.partnerName}`,
            businessPartnerAddress: `${itm?.address}`,
            contactNumber: `${itm?.contactNumber}`,
            email: values?.email,
            nid: `${values?.nid}`,
            businessPartnerTypeId: +values?.businessPartnerTypeId?.value,
            partnerSalesType: values?.businessPartnerTypeId?.label,
            taxBracket: values?.taxBracket?.value,
            actionBy: profileData?.userId,
          }));
          const payload = {
            objBP: {
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
              businessPartnerCode: values?.businessPartnerCode,
              businessPartnerName: values?.businessPartnerName,
              businessPartnerAddress: `${values?.businessPartnerAddress},  ${values?.policeStation?.label}, ${values?.city?.label}, ${values?.state?.label}, ${values?.country?.label} `,
              contactNumber: `${values?.contactNumber}`,
              email: values?.email,
              nid: `${values?.nid}`,
              businessPartnerTypeId: +values?.businessPartnerTypeId?.value,
              partnerSalesType: values?.businessPartnerTypeId?.label,
              taxBracket: values?.taxBracket?.value,
              bin: values?.bin,
              actionBy: profileData?.userId,
            },
            objListBP: newRowDto,
          };
          saveBusinessPartnerProfile(
            values?.businessPartnerTypeId?.value,
            newRowDto.length > 0 ? 1 : 0,
            values?.bin,
            values?.licenseNo,
            payload,
            cb,
            setDisabled
          );
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title={id ? "Edit  Partner Profile" : "Create  Partner Profile"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          id
            ? singleData
            : {
                ...initData,
                country: {
                  value: 18,
                  label: "Bangladesh",
                },
              }
        }
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        taxBracketDDL={taxBracketDDL}
        countryDDL={countryDDL}
        divisionDDL={divisionDDL}
        partnerTypeDDL={partnerTypeDDL}
        districtDDL={districtDDL}
        SetDistrictDDL={SetDistrictDDL}
        postCodeDDL={postCodeDDL}
        policeStationDDL={policeStationDDL}
        SetPoliceStationDDL={SetPoliceStationDDL}
        setPostCodeDDL={setPostCodeDDL}
        setter={setter}
        isEdit={id || false}
        remover={remover}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setDivisionDDL={setDivisionDDL}
      />
    </IForm>
  );
}

import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import { isUniq } from "../../../../../_helper/uniqChecker";
import IForm from "../../../../../_helper/_form";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getItemNoDDLForRFQ, getRefNoDDLForRFQ, getSingleData, getSupplierNameDDLAction, getUniQueItems, updateRFQ } from "../helper";
import RowDtoTable from "./createItemRowTable";
import SupplierRowTable from "./supplierRowTable";

const initData = {
  rfqType: "",
  currency: "",
  paymentTerms: "",
  vatAit: "",
  transportCost: "",
  quotationStartDate: _todayDate(),
  quotationEndDate: _todayDate(),
  deliveryAddress: "",
  referenceType: "",
  referenceNo: "",
  itemName: "",
  requestQuantity: "",
  uom: "",
  supplierName: "",
  supplierContactNo: "",
  supplierEmail: "",
  comment: "",
};
export default function ShippingRFQCreate() {
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rfqItemDDL, setRfqItemDDL] = useState([]);
  const [, saveData, saveLoading] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);
  const [referenceNoDDL, setReferenceNoDDL] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([])
  const [supplierNameDDL, setsupplierNameDDL] = useState([])
  //const [attachmentItemList, setAttachmentItemList] = useState([])

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRefNoDDLForRFQ(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.sbu?.value,
      location?.state?.purchaseOrg?.value,
      location?.state?.plant?.value,
      location?.state?.warehouse?.value,
      setReferenceNoDDL
      )
      getSupplierNameDDLAction(profileData?.accountId, selectedBusinessUnit?.value, location?.state?.sbu?.value, setsupplierNameDDL)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value, ]);

  useEffect(() => {
    if (id) {
      getSingleData(id, setModifyData, setRowDto, setRowDtoTwo, setRfqItemDDL, setLoading, location?.rfqSingleData?.referenceCode, profileData?.accountId, selectedBusinessUnit?.value)
    }
  }, [id, location, profileData, selectedBusinessUnit]);


  const saveHandler = async (values, cb) => {

    if(rowDto?.length < 1) return toast.warn("Please add Item")
    if(rowDtoTwo?.length < 1) return toast.warn("Please add Supplier name")
    
      if (id) {
        const objRow = rowDto.map((itm) => {
          return {
              intRowId: +itm?.intRowId,
              intRequestForQuotationId: +itm?.intRequestForQuotationId,
              strRequestForQuotationCode: itm?.strRequestForQuotationCode,
              strPrreferenceCode: itm?.strPrreferenceCode || "",
              intItemId: +itm?.intItemId,
              strItemCode: itm?.strItemCode,
              strItemName: itm?.strItemName,
              strItemTypeName: itm?.strItemTypeName,
              intUoMid: +itm?.intUoMid || 0,
              strUoMname: itm?.strUoMname || "",
              numRfqquantity: +itm?.numRfqquantity,
              intReferenceId: +itm?.intReferenceId || 0,
              strReferenceCode: itm?.strPrreferenceCode || "",
              numReferenceQuantity: itm?.numReferenceQuantity,
              strDescription: itm?.strDescription,
              isActive: true
          }
        })

        const supplierRow = rowDtoTwo.map((itm) => {
          return {
            businessPartnerId: +itm?.intBusinessPartnerId,
            businessPartnerName: itm?.strBusinessPartnerName,
            businessPartnerAddress: itm?.strBusinessPartnerAddress,
            email: itm?.strEmail,
            contactNumber: itm?.strContactNumber,
            isEmailSend: false,
          }
        })

        let payload = {
          objHeader: {
            intRequestForQuotationId: +id,
            strRequestForQuotationCode: "",
            dteRfqdate: _todayDate(),
            intAccountId: +profileData?.accountId,
            strAccountName: profileData?.accountName,
            intBusinessUnitId: +selectedBusinessUnit?.value,
            strBusinessUnitName: selectedBusinessUnit?.label,
            intSbuid: location?.state?.sbu?.value || 0,
            strSbuname: location?.state?.sbu?.label || "",
            intPurchaseOrganizationId: location?.state?.purchaseOrg?.value || 0,
            strPurchaseOrganizationName: location?.state?.purchaseOrg?.label || "",
            intPlantId:  location?.state?.plant?.value || 0,
            strPlantName:  location?.state?.plant?.label || "",
            intWarehouseId: location?.state?.warehouse?.value || 0,
            strWarehouseName: location?.state?.warehouse?.label || "",
            intRfqTypeId: values?.rfqType?.value || 0,
            strRfqTypeName: values?.rfqType?.label || "",
            intRequestTypeId: 1, //qus ase
            strRequestTypeName: "Request for quotation", //qus ase
            strReferenceTypeName: values?.referenceType?.label || "",
            intCurrencyId: values?.currency?.value || 0,
            strCurrencyCode: values?.currency?.label || "",
            dteValidTillDate: "",
            isApproved: true,
            intApprovedBy: 0,
            strApprovedBy: "",
            dteApprovedDateTime: "",
            intActionBy: +profileData.userId,
            dteLastActionDateTime: _todayDate(),
            dteServerDateTime: _todayDate(),
            isActive: true,
            strDeliveryAddress: values?.deliveryAddress || "",
            strVatAti: values?.vatAit?.label || "",
            strTransportCost: values?.transportCost?.label || "",
            quotationStartDateTime: values?.quotationStartDate || "",
            quotationEndDateTime: values?.quotationEndDate || "",
            termsAndConditions: "",
            intPaymentTermsId: values?.paymentTerms?.value || 0,
            strPaymentTermsName: values?.paymentTerms?.label || "",
            strAttachment: ""
          },
          objRow: objRow,
          supplierRow: supplierRow,
        }

        updateRFQ(payload, modifyData?.strStatus, id ? "" : cb, setLoading)
        
      } else {
        const objRow = rowDto.map((itm) => {
          return {
               intRowId: 0,
               intRequestForQuotationId: 0,
               strRequestForQuotationCode: "",
               strPrreferenceCode: itm?.strPrreferenceCode || "",
               intItemId: +itm?.intItemId,
               strItemCode: itm?.strItemCode,
               strItemName: itm?.strItemName,
               strItemTypeName: itm?.strItemTypeName,
               intUoMid: +itm?.intUoMid || 0,
               strUoMname: itm?.strUoMname || "",
               numRfqquantity: +itm?.numRfqquantity,
               intReferenceId: +itm?.intReferenceId || 0,
               strReferenceCode: itm?.strPrreferenceCode || "",
               numReferenceQuantity: itm?.numReferenceQuantity,
               strDescription: itm?.strDescription || "",
               isActive: true
          }
        })

        const supplierRow = rowDtoTwo.map((itm) => {
          return {
            businessPartnerId: +itm?.intBusinessPartnerId,
            businessPartnerName: itm?.strBusinessPartnerName,
            businessPartnerAddress: itm?.strBusinessPartnerAddress,
            email: itm?.strEmail,
            contactNumber: itm?.strContactNumber,
            isEmailSend: false,
            numTransportCost: 0,
            numOthersCost: 0,
            numDiscountPercentage:0
          }
        })

        let payload = {
          objHeader: {
            intRequestForQuotationId: 0,
            strRequestForQuotationCode: "",
            dteRfqdate: _todayDate(),
            intAccountId: +profileData?.accountId,
            strAccountName: profileData?.accountName,
            intBusinessUnitId: +selectedBusinessUnit?.value,
            strBusinessUnitName: selectedBusinessUnit?.label,
            intSbuid: location?.state?.sbu?.value || 0,
            strSbuname: location?.state?.sbu?.label || "",
            intPurchaseOrganizationId: location?.state?.purchaseOrg?.value || 0,
            strPurchaseOrganizationName: location?.state?.purchaseOrg?.label || "",
            intPlantId:  location?.state?.plant?.value || 0,
            strPlantName:  location?.state?.plant?.label || "",
            intWarehouseId: location?.state?.warehouse?.value || 0,
            strWarehouseName: location?.state?.warehouse?.label || "",
            intRfqTypeId: values?.rfqType?.value || 0,
            strRfqTypeName: values?.rfqType?.label || "",
            intRequestTypeId: 1, //qus ase
            strRequestTypeName: "Request for quotation", //qus ase
            strReferenceTypeName: values?.referenceType?.label || "",
            intCurrencyId: values?.currency?.value || 0,
            strCurrencyCode: values?.currency?.label || "",
            dteValidTillDate: "",
            isApproved: true,
            intApprovedBy: 0,
            strApprovedBy: "",
            dteApprovedDateTime: "",
            intActionBy: +profileData.userId,
            dteLastActionDateTime: _todayDate(),
            dteServerDateTime: _todayDate(),
            isActive: true,
            strDeliveryAddress: values?.deliveryAddress || "",
            strVatAti: "",
            strTransportCost: "",
            quotationStartDateTime: values?.quotationStartDate || "",
            quotationEndDateTime: values?.quotationEndDate || "",
            termsAndConditions: "",
            intPaymentTermsId: 0,
            strPaymentTermsName: "",
            strAttachment: ""
        },
          objRow: objRow,
          supplierRow: supplierRow,
        }
        saveData(`/procurement/ShipRequestForQuotation/CreateRequestForQuotationShip`,payload, cb, true)
      }
    } 


  const addRowDtoData = (data, values) => {
    if (values?.isAllItem) {
      // get new items that not exit in rowdto
      const refferenceItems = getUniQueItems(data, rowDto, values);
      // show error if no new item found
      if (refferenceItems?.length === 0) {
        return toast.warn("Not allowed to duplicate items");
      }

      const newData = refferenceItems?.map((item, index) => {

        let obj = {
          intRowId: 0,
          intRequestForQuotationId: id ? +id : 0,
          strItemCode: item?.strItemCode,
          strPrreferenceCode: values?.referenceNo?.label,
          intItemId: item?.value,
          strItemName: item?.strItemName,
          strItemTypeName: item?.strItemTypeName,
          uomDDL: { label: item?.strUoMname, value: item?.intUoMid },
          strDescription: item.strDescription || "",
          intReferenceId: values?.referenceNo?.value,
          numReferenceQuantity: item?.numRequestQuantity,
          intUoMid: item.intUoMid,
          strUoMname: item.strUoMname,
          strAttachment: item?.strAttachment,
          intItemCategoryId: item?.intItemCategoryId,
          strPartNo: item?.strPartNo,
          strDrawingNo: item?.strDrawingNo,
          strShippingItemSubHead: item?.strShippingItemSubHead,
        };
        return obj;
      });
      // setRowDto([...newData, ...rowDto]); // previous set data

      const modData = [...newData, ...rowDto];
        const sortedItems = modData?.sort((a, b) => {
          const subHeadA = a?.strShippingItemSubHead || ''; 
          const subHeadB = b?.strShippingItemSubHead || ''; 
          return subHeadA.localeCompare(subHeadB);
      }); 
      setRowDto(sortedItems);  
    } else {
      // if reference, can't add same reference and same item multiple
      // if not reference, can't add multiple item
      const isExists = rowDto.filter(
        (item) => item?.intItemId === values?.itemName?.value
      );
     // if (isExists?.length > 0) return toast.warn("Already exists item");

      if (isExists?.length > 0) {
        toast.warn("Not allowed to duplicate items");
      } else {

        const newData = {
          intRowId: 0,
          intRequestForQuotationId: id ? +id : 0,
          strItemCode: values?.itemName?.strItemCode,
          strPrreferenceCode: values?.referenceNo?.label,
          intItemId: values?.itemName?.value,
          strItemName: values?.itemName?.strItemName,
          strItemTypeName: values?.itemName?.strItemTypeName,
          uomDDL: { label: values?.itemName?.strUoMname, value: values?.itemName?.intUoMid },
          strDescription: values.itemName?.strDescription || "",
          intReferenceId: values?.referenceNo?.value,
          numReferenceQuantity: values?.itemName?.numRequestQuantity,
          intUoMid: values.itemName?.intUoMid,
          strUoMname: values.itemName?.strUoMname,
          strAttachment: values?.itemName?.strAttachment,
          intItemCategoryId: values?.itemName?.intItemCategoryId,
          strPartNo: values?.itemName?.strPartNo,
          strDrawingNo: values?.itemName?.strDrawingNo,
          strShippingItemSubHead: values?.itemName?.strShippingItemSubHead,
        };

        const modData = [...rowDto, newData];
        const sortedItems = modData?.sort((a, b) => {
          const subHeadA = a?.strShippingItemSubHead || ''; 
          const subHeadB = b?.strShippingItemSubHead || ''; 
          return subHeadA.localeCompare(subHeadB);
      });      
        setRowDto(sortedItems);
      }
    }
  };

  const setterTwo = (values) => {
    if (isUniq('intBusinessPartnerId', values?.supplierName?.value, rowDtoTwo)) {
      let obj = {
        strBusinessPartnerName: values.supplierName?.label,
        intBusinessPartnerId: values?.supplierName?.value,
        strBusinessPartnerAddress: values.supplierName?.supplierAddress,
        strEmail: values?.supplierEmail || "",
        strContactNumber: values?.supplierContactNo || "",
        intPartnerRfqid: 0,
      }
      setRowDtoTwo([...rowDtoTwo, obj])
    }
  }

  
  const removeHandler = (deleteItemId) => {
    const data = rowDto?.filter((item) => item?.intItemId !== deleteItemId);
    setRowDto([...data]);
  };

  const removerTwo = (intBusinessPartnerId) => {
    const filterArr = rowDtoTwo.filter((itm) => itm.intBusinessPartnerId !== intBusinessPartnerId)
    setRowDtoTwo(filterArr)
  }

  return (
    <IForm title="Create Request For Quotation" getProps={setObjprops}>
      {(saveLoading || loading) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={ id ? modifyData : {
            ...initData,
          rfqType:{value:1, label:"Standard RFQ"},
          currency:{value:141, label:"BDT"},
          //paymentTerms:{value:1, label:"Cash"},
          //vatAit:{value:"Including",label:"Including"},
          //transportCost:{value:"Including",label:"Including"},
          referenceType:{value:"With Reference",label:"With Reference"}
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setRowDto([]);
              setRowDtoTwo([]);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="rfqType"
                        options={[{value:1, label:"Standard RFQ"}]}
                        value={values?.rfqType}
                        label="RFQ Type"
                        onChange={(valueOption) => {
                          setFieldValue("rfqType", valueOption);
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="currency"
                        options={[{value:141, label:"BDT"},{value:155, label:"USD"}]}
                        value={values?.currency}
                        label="Currency"
                        onChange={(valueOption) => {
                          setFieldValue("currency", valueOption);
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="paymentTerms"
                        options={[{value:1, label:"Cash"},{value:2,label:"Advance"}, {value:3,label:"Both"}]}
                        value={values?.paymentTerms}
                        label="Payment Terms"
                        onChange={(valueOption) => {
                          setFieldValue("paymentTerms", valueOption);
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div> */}
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="vatAit"
                        options={[{value:"Including",label:"Including"},{value:"Excluding",label:"Excluding"}]}
                        value={values?.vatAit}
                        label="VAT/AIT"
                        onChange={(valueOption) => {
                          setFieldValue("vatAit", valueOption);
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div> */}
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="transportCost"
                        options={[{value:"Including",label:"Including"},{value:"Excluding",label:"Excluding"}]}
                        value={values?.transportCost}
                        label="Transport Cost"
                        onChange={(valueOption) => {
                          setFieldValue("transportCost", valueOption);
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.quotationStartDate}
                        label="Quotation Start Date Time"
                        name="quotationStartDate"
                        type="datetime-local"
                        disabled={ modifyData?.strStatus === "Closed"}
                        max={values?.quotationEndDate}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.quotationEndDate}
                        label="Quotation End Date Time"
                        name="quotationEndDate"
                        type="datetime-local"
                        min={values?.quotationStartDate}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.deliveryAddress}
                        label="Delivery Address"
                        name="deliveryAddress"
                        type="text"
                        disabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="referenceType"
                        options={[{value:"With Reference",label:"With Reference"}]}
                        value={values?.referenceType}
                        label="Reference Type"
                        onChange={(valueOption) => {
                          setFieldValue("referenceType", valueOption);
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                  </div>
                  {/* <div className="mt-5">
                    <h6>Add Item :</h6>
                  </div> */}
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="referenceNo"
                        options={referenceNoDDL}
                        value={values?.referenceNo}
                        label="Reference No"
                        onChange={(valueOption) => {
                          if(valueOption){
                            setFieldValue("referenceNo", valueOption);
                            getItemNoDDLForRFQ(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              location?.state?.sbu?.value,
                              location?.state?.purchaseOrg?.value,
                              location?.state?.plant?.value,
                              location?.state?.warehouse?.value,
                              valueOption?.value,
                              valueOption?.label,
                              setRfqItemDDL
                            ) 
                            //getAttachmentId(valueOption?.label, 0, setLoading, null, setAttachmentItemList)
                            setRowDto([])
                            setFieldValue("itemName", "");
                            setFieldValue("uom",  "")
                          }else{
                            setFieldValue("referenceNo", "");
                            setRowDto([])
                            setFieldValue("itemName", "");
                            setFieldValue("uom",  "")
                          }
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemName"
                        options={rfqItemDDL}
                        value={values?.itemName}
                        label="Item Name"
                        onChange={(valueOption) => {
                          if(valueOption){
                            setFieldValue("itemName", valueOption);
                            setFieldValue("uom", valueOption?.strUoMname || "")
                          }else{
                            setFieldValue("itemName", "");
                            setFieldValue("uom", "")
                          }
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed" || values.isAllItem}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.uom}
                        label="UOM"
                        name="uom"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-1">
                      <Field
                        name={values.isAllItem}
                        component={() => (
                          <input
                            id="rfqIsAllItem"
                            type="checkbox"
                            style={{ marginTop: "25px" }}
                            className="mx-2"
                            value={values.isAllItem || ""}
                            checked={values.isAllItem}
                            name="isAllItem"
                            onChange={(e) => {
                              setFieldValue("isAllItem", e.target.checked);
                              setFieldValue("item", "");
                            }}
                          />
                        )}
                        label="isAllItem"
                      />
                      <label
                        style={{
                          position: "absolute",
                          top: "20px",
                        }}
                      >
                        All Item
                      </label>
                    </div>

                    <div style={{ marginTop: "15px" }} className="col-lg-1">
                      <button
                        type="button"
                        onClick={() => {
                          addRowDtoData(rfqItemDDL, values);
                        }}
                        className="btn btn-primary"
                        disabled={ 
                          (!values.isAllItem ? !values.itemName : false) 
                          ? (!values.referenceNo || !values.itemName) 
                          : (!values.referenceNo || modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed") }
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {(modifyData?.strStatus !== "Open" && modifyData?.strStatus !== "Closed") && 
                    <div className="col-lg-12">
                      <RowDtoTable
                        removeHandler={removeHandler}
                        rowDto={rowDto}
                        setRowDto={setRowDto}            
                        values={values}
                        id={id}
                        selectedBusinessUnit={selectedBusinessUnit}
                        profileData={profileData}
                      />
                    </div>
                   }
                </div>
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-12">
                      <h6>Supplier for Send REQ/RFI/RFP</h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="supplierName"
                        options={supplierNameDDL}
                        value={values?.supplierName}
                        label="Supplier Name"
                        onChange={(valueOption) => {
                          setFieldValue("supplierName", valueOption);
                          setFieldValue("supplierContactNo", valueOption?.supplierContact || "")
                          setFieldValue("supplierEmail", valueOption?.supplierEmail || "")
                        }}
                        isDisabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.supplierContactNo}
                        label="Supplier Contact"
                        name="supplierContactNo"
                        type="text"
                        disabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.supplierEmail}
                        label="Supplier Email"
                        name="supplierEmail"
                        type="text"
                        disabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed"}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }} className="col-lg-1">
                      <button
                        type="button"
                        onClick={() => {
                          setterTwo(values)
                        }}
                        disabled={modifyData?.strStatus === "Open" || modifyData?.strStatus === "Closed" || !values?.supplierName}
                        className="btn btn-primary"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {(modifyData?.strStatus !== "Open" && modifyData?.strStatus !== "Closed") && 
                    <div className="col-lg-12">
                      <SupplierRowTable
                        removerTwo={removerTwo}
                        rowDtoTwo={rowDtoTwo}
                        setRowDtoTwo={setRowDtoTwo}              
                        values={values}
                        selectedBusinessUnit={selectedBusinessUnit}
                        profileData={profileData}
                      />
                    </div>
                    }
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}

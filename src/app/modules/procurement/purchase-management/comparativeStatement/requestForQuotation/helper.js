import axios from 'axios';
import { toast } from 'react-toastify';

function mergeObjects(itemDDLData, attachmentData) {
   const itemData =  itemDDLData.map((itm)=>{
         let check = attachmentData.find((data)=> data.intItemId === itm.intItemId)
         let modifyItem = {}
         if(itm?.intItemId === check?.intItemId){
             modifyItem = {
                 ...itm,
                 strAttachment: check?.strAttachment
             }
         }else{
             modifyItem={
                 ...itm
             }
         }
         return modifyItem
     })
     return itemData
   }

export const getRefNoDDLForRFQ = async (
   accId,
   buId,
   sbuId,
   poId,
   plantId,
   wareHouseId,
   setter
) => {
   try {
      const res = await axios.get(
         `/procurement/ShipRequestForQuotation/GetPRReferenceShipDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}&PurchaseOrganizationId=${poId}&PlantId=${plantId}&WearHouseId=${wareHouseId}`
      );
      if (res.status === 200 && res?.data) {
         setter(res?.data);
      }
   } catch (err) {
      setter([]);
   }
};

export const getItemNoDDLForRFQ = async (
   accId,
   buId,
   sbuId,
   poId,
   plantId,
   wareHouseId,
   prId,
   prCode,
   setter
) => {
   try {
      const [res, attach] = await Promise.all([
         axios.get(
            `/procurement/ShipRequestForQuotation/GetPRItemShipDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}&PurchaseOrganizationId=${poId}&PlantId=${plantId}&WearHouseId=${wareHouseId}&PurchaseRequestId=${prId}`
         ),
         axios.get(
            `https://ibos.peopledesk.io/emp/ShippingMgmt/GetPRRowAttachment?PurchaseRequestCode=${prCode}&ItemId=${0}`
         )
       ]);
      // const res = await axios.get(
      //    `/procurement/ShipRequestForQuotation/GetPRItemShipDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}&PurchaseOrganizationId=${poId}&PlantId=${plantId}&WearHouseId=${wareHouseId}&PurchaseRequestId=${prId}`
      // );

      // const attach = await axios.get(
      //    `https://ibos.peopledesk.io/emp/ShippingMgmt/GetPRRowAttachment?PurchaseRequestCode=${prCode}&ItemId=${0}`
      // );
      
      if (res.status === 200 && res?.data) {
         setter(mergeObjects(res?.data, attach?.data?.data));
      }
   } catch (err) {
      setter([]);
   }
};

export const getSupplierNameDDLAction = async (accId, buId, sbuId, setter) => {
   try {
      const res = await axios.get(
         `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${sbuId}`
      );
      if (res.status === 200 && res?.data) {
         setter(res?.data);
      }
   } catch (error) {}
};

export const getWarehouseDDL_ShippingCS = async (
   userId,
   accId,
   buId,
   plantId,
   setter,
   setFieldValue
) => {
   try {
      const res = await axios.get(
         `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
      );
      if (res.status === 200 && res?.data) {
         setter(res?.data);
         setFieldValue('warehouse', {
            value: res?.data[0]?.value,
            label: res?.data[0]?.label,
         });
      }
   } catch (error) {}
};

export const updateRFQ = async (payload, status, cb, setLoading) => {
   setLoading && setLoading(true);
   try {
      
      await axios.put(
         `/procurement/ShipRequestForQuotation/EditRequestForQuotationShip?Status=${status}`,
         payload
      );
      toast.success('Updated successfully');
      cb && cb();
      setLoading && setLoading(false);
   } catch (error) {
      toast.warn('Something went wrong');
      setLoading && setLoading(false);
   }
};

export const closedRFQById = async (rfqID, userId, cb) => {
   try {
      const res = await axios.post(
         `/procurement/ShipRequestForQuotation/CloseRequestForQuotationShip?RequestForQuotation=${rfqID}&UserId=${userId}`
      );
      if (res.status === 200) {
         cb && cb();
         toast.success(res?.data?.message || 'Successfully Closed');
      }
   } catch (error) {}
};

//GetById API
export const getSingleData = async (
   intRequestForQuotationId,
   setter,
   setRowDto,
   setRowDtoTwo,
   setRfqItemDDL,
   setLoading,
   prCode,
   accId,
   buId
) => {
   setLoading && setLoading(true);
   try {
      // const [res, attach] = await Promise.All([
      //     axios.get(
      //       `/procurement/ShipRequestForQuotation/GetRequestForQuotationShipById?RequestForQuotationId=${intRequestForQuotationId}&accountId=${accId}&businessUnitId=${buId}`
      //    ),
      //    axios.get(
      //       `https://ibos.peopledesk.io/emp/ShippingMgmt/GetPRRowAttachment?PurchaseRequestCode=${prCode}&ItemId=${0}`
      //    )
      // ])
      const res = await axios.get(
               `/procurement/ShipRequestForQuotation/GetRequestForQuotationShipById?RequestForQuotationId=${intRequestForQuotationId}&accountId=${accId}&businessUnitId=${buId}`
            )
      const attach = await axios.get(
               `https://ibos.peopledesk.io/emp/ShippingMgmt/GetPRRowAttachment?PurchaseRequestCode=${prCode}&ItemId=${0}`
            )

      const modifiedData = {
         rfqType: {
            value: res?.data[0]?.objHeader?.intRfqTypeId,
            label: res?.data[0]?.objHeader?.strRfqTypeName,
         },
         currency: {
            value: res?.data[0]?.objHeader?.intCurrencyId,
            label: res?.data[0]?.objHeader?.strCurrencyCode,
         },
         paymentTerms: {
            value: res?.data[0]?.objHeader?.intPaymentTermsId,
            label: res?.data[0]?.objHeader?.strPaymentTermsName,
         },
         vatAit: {
            value: res?.data[0]?.objHeader?.strVatAti,
            label: res?.data[0]?.objHeader?.strVatAti,
         },
         transportCost: {
            value: res?.data[0]?.objHeader?.strTransportCost,
            label: res?.data[0]?.objHeader?.strTransportCost,
         },
         quotationStartDate: res?.data[0]?.objHeader?.quotationStartDateTime,
         quotationEndDate: res?.data[0]?.objHeader?.quotationEndDateTime,
         deliveryAddress: res?.data[0]?.objHeader?.strDeliveryAddress,
         referenceType: {
            value: res?.data[0]?.objHeader?.strReferenceTypeName,
            label: res?.data[0]?.objHeader?.strReferenceTypeName,
         },
         strStatus: res?.data[0]?.objHeader?.strStatus,
         referenceNo: {
            value: res?.data[0]?.objRow[0]?.intReferenceId,
            label: res?.data[0]?.objRow[0]?.strPrreferenceCode,
         },
      };

      getItemNoDDLForRFQ(
         res?.data[0]?.objHeader?.intAccountId,
         res?.data[0]?.objHeader?.intBusinessUnitId,
         res?.data[0]?.objHeader?.intSbuid,
         res?.data[0]?.objHeader?.intPurchaseOrganizationId,
         res?.data[0]?.objHeader?.intPlantId,
         res?.data[0]?.objHeader?.intWarehouseId,
         res?.data[0]?.objRow[0]?.intReferenceId,
         res?.data[0]?.objRow[0]?.strPrreferenceCode,
         setRfqItemDDL
      );

      //setRowDto(res?.data[0]?.objRow);
      setRowDto(mergeObjects(res?.data[0]?.objRow, attach?.data?.data));
      setRowDtoTwo(res?.data[0]?.objSuplier);

      intRequestForQuotationId ? setter(modifiedData) : setter(res?.data);

      setLoading && setLoading(false);
   } catch (error) {
      setter('');
      setLoading && setLoading(false);
   }
};

export const getUniQueItems = (arr, rowDto, values) => {
   // get new items that not exit in rowdto
   const refferenceItems = arr?.filter(item => {
      // check single item already added or not
      const isExist = rowDto.findIndex(row => row?.intItemId === item?.value);
      // only return new items
      if (isExist === -1) {
         return true;
      } else {
         return false;
      }
   });

   return refferenceItems;
};

function MailSender(parameterName, valueArr) {
   if(parameterName === "SendTo" && valueArr?.length > 0) {
      const queryArr = valueArr.map(value => parameterName + "=" + value);
         return queryArr.join("&");
   }else{
      return (parameterName + "=" + [] )
   }
 }

function toCCMailSend(parameterName, valueArr) {
   if(parameterName === "SendToCC" && valueArr?.length > 0 ) {
      const queryArr = valueArr.map(value => parameterName + "=" + value);
         return queryArr.join("&");   
   }else{
      console.log("parameterName",parameterName + "=" + [] + "&")
      return (parameterName + "=" + [] )
   }
 }

function toBCCMailSend(parameterName, valueArr) {
   if(parameterName === "SendToBCC" && valueArr?.length > 0 ) {
      const queryArr = valueArr.map(value => parameterName + "=" + value);
         return queryArr.join("&");
   }else{
      return (parameterName + "=" + [])
   }
 }

export const sendEmailPostApi = async (values, attachment, setLoading) => { 
  
  //const checkMail = Array.isArray(values?.toMail)
  const toMail = values?.toMail?.split(",")
  const sendCCMail = values?.toCC === "" ? [] : values?.toCC?.split(",")
  console.log("sendCCMail", sendCCMail)

  const checkBCCMail = Array.isArray(values?.toBCC)
  let sendBCCMail = []
  if(!checkBCCMail){
   sendBCCMail = values?.toBCC?.split(",")
  }

  let formData = new FormData();
  formData.append("file", attachment); 
  setLoading && setLoading(true);
   try {
      let res = await axios.post(
         `/procurement/ShipRequestForQuotation/SendEMailWithAttachment?${MailSender("SendTo", toMail)}&${toCCMailSend("SendToCC",sendCCMail)}&${toBCCMailSend("SendToBCC",sendBCCMail)}&MailSubject=${values?.subject || ""}&MailBody=${values?.message || ""}`, formData );

      toast.success('Mail Send Successfully');
      setLoading && setLoading(false);
      return res;
      
   } catch (error) {
      setLoading && setLoading(false);
      toast.error(
         error?.response?.data?.message || 'Mail cant not send successfully'
      );
   }
};




export const getAttachmentId = async (prCode, itemId, setLoading, cb, setter)=>{
    setLoading && setLoading(true);
   try {
      const res = await axios.get(
         `https://ibos.peopledesk.io/emp/ShippingMgmt/GetPRRowAttachment?PurchaseRequestCode=${prCode}&ItemId=${itemId}`
      );
      if(itemId === 0){
         setter(res?.data?.data)
      }else{
         if(res?.data?.data?.strAttachment === "") {
            setLoading && setLoading(false);
            toast.warn("There is no attachment in this Item")
         } 
         cb && cb(res?.data?.data)
      }   

       setLoading && setLoading(false);
   } catch (error) {
      // setter('');
       setLoading && setLoading(false);
   }
}

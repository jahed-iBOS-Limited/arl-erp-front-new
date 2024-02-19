import Axios from 'axios';
import { toast } from 'react-toastify';

export const getWareHouseDDL = async (accId, buId, userId, setter) => {
   try {
      const res = await Axios.get(
         `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=68&OrgUnitTypeId=8`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const getBankNameDDL = async (accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const getShippointDDL = async (userId, clientId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${clientId}&BusinessUnitId=${buId}`
      );
      if (res.status === 200 && res?.data) {
         const newData = res?.data.map(data => {
            return {
               label: data?.organizationUnitReffName,
               value: data?.organizationUnitReffId,
               address: data?.address,
               banglaAddress: data?.banglaAddress || '',
            };
         });
         setter(newData);
      }
   } catch (error) {}
};

export const getCustomerDDL = async (accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const getItemDDL = async (accId, buId, whId, setter) => {
   try {
      const res = await Axios.get(
         `/item/ItemSales/GetItemSalesforPOSDDL?AccountId=${accId}&BUnitId=${buId}&WarehouseId=${whId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const getCounterSummary = async (accId, buId, shippointId, setter) => {
   try {
      const res = await Axios.get(
         `/partner/Pos/GetCounterSummary?AccountId=${accId}&BusinessUnitId=${buId}&CounterNo=${shippointId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const getVatPercentage = async (accId, buId, setter) => {
   try {
      const res = await Axios.get(
         `/oms/POSDelivery/GetVATParcentage?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const saveDeliveryPos = async (
   payload,
   setHeader,
   setRow,
   setDisabled,
   cb
) => {
   setDisabled(true);
   try {
      const res = await Axios.post(
         '/partner/Pos/POSCreateDeliverySpr',
         payload
      );
      if (res.status === 200) {
         toast.success(res?.data?.message);
         const responseRow = res?.data?.objRow?.map(item => {
            return {
               itemName: item?.strItemName,
               itemCode: item?.strItemCode,
               rate: item?.numItemPrice,
               quantity: item?.numQuantity,
            };
         });
         const headerResponse = {
            deliveryCode: res?.data?.objHeader?.strDeliveryCode,
            creditAmount: res?.data?.objHeader?.numCreditAmount,
            cardAmount: res?.data?.objHeader?.numCardAmount,
            cashAmount: res?.data?.objHeader?.numCashAmount,
            mfsAmount: res?.data?.objHeader?.numMfsamount,
            soldToPartnerName: res?.data?.objHeader?.strSoldToPartnerName,
            partnerContactNo: res?.data?.objHeader?.strShipToPartnerContactNo,
            totalNetAmount: res?.data?.objHeader?.numTotalNetValue,
            dueAmount: res?.data?.dueAmount,
         };
         setHeader(headerResponse);
         setRow(responseRow);
         setDisabled(false);
         cb();
      }
   } catch (error) {
      toast.error(error?.response?.data?.message);
      setDisabled(false);
   }
};

export const saveHoldingDeliveryPos = async (payload, setDisabled, cb) => {
   setDisabled(true);
   try {
      const res = await Axios.post(
         '/partner/Pos/CreatePOSHoldInformation',
         payload
      );
      toast.success(res?.data?.message);
      setDisabled(false);
      cb();
   } catch (error) {
      toast.error(error?.response?.data?.message);
      setDisabled(false);
   }
};

export const getSalesInvoiceLandingData = async (
   accId,
   buId,
   setter,
   setLoading,
   pageNo,
   pageSize,
   shipPointId,
   fromDate,
   toDate,
   customerId
) => {
   try {
      setLoading(true);
      const res = await Axios.get(
         `/partner/Pos/GetDeliverySearchPagination?CustomerId=${customerId}&AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&shipPointId=${shipPointId}&fromDate=${fromDate}&toDate=${toDate}`
      );
      console.log(res?.data?.data);
      setter(res?.data?.data);
      setLoading(false);
   } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
   }
};

export const getSalesInvoiceById = async (
   accountId,
   bussinessUnitId,
   deliveryId,
   setHeader,
   setRow
) => {
   try {
      const res = await Axios.get(
         `/partner/Pos/GetHoldInformationById?HoldInformationId=${deliveryId}`
      );
      const header = res?.data?.objHeader;
      console.log(header);
      const customerData = await Axios.get(
         `/partner/Pos/GetCustomerNameDDL?SearchTerm=${header?.partnerContactNo}&AccountId=${accountId}&BusinessUnitId=${bussinessUnitId}&WarehouseId=${header?.warehouseId}`
      );
      const headerResponse = {
         customer: {
            label: header?.soldToPartnerName,
            value: header?.soldToPartnerId,
            address: header?.soldToPartnerAddress,
            creditLimit: customerData?.data[0]?.creditLimit,
            remainingLimit: customerData?.data[0]?.remainingLimit,
            points: customerData?.data[0]?.points,
         },
         holdInformationId: header?.deliveryId,
         ...res?.data?.objHeader,
      };
      const rowDto = res?.data?.objRow?.map(data => {
         return {
            isHold: true,
            ...data,
         };
      });
      setHeader(headerResponse);
      setRow(rowDto);
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const getSalesDataById = async (deliveryId, setHeader, setRow) => {
   try {
      let res = await Axios.get(
         `/partner/Pos/GetDeliveryDetailById?DeliveryId=${deliveryId}`
      );
      let header = res.data?.objHeader;
      header.dueAmount = res?.data?.dueAmount;
      setHeader(header);
      setRow(res?.data?.objRow);
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const getSalesInvoiceByVoucherCode = async (
   accountId,
   bussinessUnitId,
   voucherCode,
   setHeader,
   setRow
) => {
   try {
      const res = await Axios.get(
         `/partner/Pos/GetDeliveryDetailById?DeliveryCode=${voucherCode}&BusinessUnitId=${bussinessUnitId}`
      );
      const header = res?.data?.objHeader;
      const customerData = await Axios.get(
         `/partner/Pos/GetCustomerNameDDL?SearchTerm=${header?.partnerContactNo}&AccountId=${accountId}&BusinessUnitId=${bussinessUnitId}&WarehouseId=${header?.warehouseId}`
      );
      const headerResponse = {
         customer: {
            label: header?.soldToPartnerName,
            value: header?.soldToPartnerId,
            address: header?.soldToPartnerAddress,
            creditLimit: customerData?.data[0]?.creditLimit,
            remainingLimit: customerData?.data[0]?.remainingLimit,
            points: customerData?.data[0]?.points,
         },
         // bankName:{
         //   label: header?.bankName,
         //   value: header?.bankId
         // },
         // ...res?.data?.objHeader
      };
      setHeader(headerResponse);
      setRow(res?.data?.objRow);
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const getSalesItemById = async (
   accId,
   buId,
   whId,
   salesItemId,
   setter,
   values
) => {
   try {
      const res = await Axios.get(
         `/item/ItemSales/GetItemWiseSalesforPOSDDL?AccountId=${accId}&BUnitId=${buId}&WarehouseId=${whId}&ItemId=${salesItemId}`
      );
      const response = {
         ...values,
         bankName: '',
         cashAmount: '',
         creditAmount: '',
         cardNumber: '',
         shippingCharge: '',
         totalDiscount: '',
         quantity: '',
         rate: '',
         discount: '',
         item: {
            ...res?.data,
         },
      };
      setter(response);
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

// createPartnerBasic_api
export const createPartnerBasic_api = async (data, cb) => {
   try {
      const res = await Axios.post(
         `/partner/BusinessPartnerBasicInfo/CreateBusinessPartner`,
         data
      );
      if (res.status === 200) {
         toast.success(res?.data?.message);
         cb();
      }
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const getHoldingDeliveryDataById = async (
   customerId,
   setHeader,
   setRow,
   setTotalAmount,
   setWarehouseId
) => {
   try {
      const res = await Axios.get(
         `oms/POSDelivery/GetDeliveryDetailByUser?UserId=${customerId}`
      );
      const header = res?.data?.objHeader;
      const headerResponse = {
         whName: {
            label: header?.strWarehouseName,
            value: header?.warehouseId,
            address: header?.strWarehouseAddress,
         },
         counter: {
            label: header?.shipPointName,
            value: header?.shipPointId,
            address: header?.shipPointAddress,
         },
         customer: {
            label: header?.soldToPartnerName,
            value: header?.soldToPartnerId,
            address: header?.soldToPartnerAddress,
         },
         bankName: {
            label: header?.bankName,
            value: header?.bankId,
         },
         cashAmount: header?.cashAmount,
         creditAmount: header?.creditAmount,
         cardNumber: header?.cardNo,
         deliveryId: header?.deliveryId,
         deliveryDate: header?.deliveryDate,
         discountValueOnTotal: header?.discountValueOnTotal,
         paymentTermId: header?.paymentTermId,
         shippingCharge: header?.shippingCharge,
      };
      setHeader(headerResponse);
      setRow(res?.data?.objRow);
      setTotalAmount(header?.totalDeliveryAmount);
      setWarehouseId(header?.warehouseId);
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const getHoldingDeliveryData = async (buId, shippointId, setter) => {
   try {
      const res = await Axios.get(
         `/partner/Pos/GetHoldInformationLanding?BusineessnitId=${buId}&ShippointId=${shippointId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const salesDeliveryReturn = async (
   payload,
   setHeader,
   setRow,
   setDisabled,
   cb
) => {
   setDisabled(true);
   try {
      const res = await Axios.post('/partner/Pos/POSSalesReturn', payload);
      toast.success(res?.data?.message);
      const responseRow = res?.data?.objRow?.map(item => {
         return {
            itemName: item?.strItemName,
            itemCode: item?.strItemCode,
            rate: item?.numItemPrice,
            quantity: item?.numQuantity,
         };
      });
      const headerResponse = {
         deliveryCode: res?.data?.objHeader?.strDeliveryCode,
         creditAmount: res?.data?.objHeader?.numCreditAmount,
         cardAmount: res?.data?.objHeader?.numCardAmount,
         cashAmount: res?.data?.objHeader?.numCashAmount,
         mfsAmount: res?.data?.objHeader?.numMfsamount,
         soldToPartnerName: res?.data?.objHeader?.strSoldToPartnerName,
         partnerContactNo: res?.data?.objHeader?.strShipToPartnerContactNo,
         totalNetAmount: res?.data?.objHeader?.numTotalNetValue,
      };
      setHeader(headerResponse);
      setRow(responseRow);
      setDisabled(false);
      cb();
   } catch (error) {
      toast.error(error?.response?.data?.message);
      setDisabled(false);
   }
};

export const getItemById = async (itemId, whId, setter) => {
   try {
      const res = await Axios.get(
         `/item/ItemSales/GetItemSalesDetailsforPOSDDL?itemId=${itemId}&warehouseId=${whId}`
      );
      return res?.data;
   } catch (error) {
      setter([]);
   }
};

export const customerCreditRecovery = async payload => {
   try {
      const res = await Axios.post(
         '/partner/Pos/SetCustomerCreditRecovery',
         payload
      );
      if (res?.status === 200) {
         toast.success(res?.data?.message);
      }
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const getCustomers = async (whId, customerId, setter) => {
   try {
      const res = await Axios.get(
         `/partner/Pos/GetCustomerCreditRecovery?outletId=${whId}&customerId=${customerId}`
      );
      setter(res?.data);
   } catch (error) {
      setter([]);
   }
};

export const getSalesOrder = async (accId, buId, whId, customerId, setter) => {
   try {
      const res = await Axios.get(
         `/oms/SalesOrder/GetSalesInfoForPos?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${customerId}&WareHouseId=${whId}`
      );
      const response = res?.data.map(item => {
         return {
            customerId: item?.customerId,
            customerName: item?.customerName,
            label: item?.orderCode,
            value: item?.orderId,
         };
      });
      setter(response);
   } catch (error) {
      setter([]);
   }
};

const getItem = itemId => {
   return Axios.get(
      `/item/ItemSales/GetItemSalesDetailsforPOSDDL?itemId=${itemId}`
   );
};

export const getSalesOrderByOrderId = async (
   accId,
   buId,
   whId,
   orderId,
   setHeader,
   setRow
) => {
   try {
      const res = await Axios.get(
         `/oms/SalesOrder/GetItemInfoForPos?SalesOrderId=${orderId}`
      );
      const header = res?.data?.header;
      const customerData = await Axios.get(
         `/partner/Pos/GetCustomerNameDDL?SearchTerm=${header?.customerName}&AccountId=${accId}&BusinessUnitId=${buId}&WarehouseId=${header?.warehouseId}`
      );
      const responseHeader = {
         customer: {
            label: header?.customerName,
            value: header?.customerId,
            address: header?.partnerAddress,
            creditLimit: customerData?.data[0]?.creditLimit,
            remainingLimit: customerData?.data[0]?.remainingLimit,
            points: customerData?.data[0]?.points,
         },
         orderCode: header?.orderCode,
         orderId: header?.orderId,
      };
      setHeader(responseHeader);
      const row = res?.data?.row;
      console.log('row', row);
      const responseRow = await Promise.all(
         row.map(async itm => {
            const itemRateDDL = await getItem(itm?.itemId);
            const item = await Axios.get(
               `/item/ItemSales/GetItemSalesforPOSDDL?SearchTerm=${itm?.itemName}&AccountId=${accId}&BUnitId=${buId}&WarehouseId=${whId}`
            );
            const locationId = item?.data[0]?.locationId;
            return {
               rowId: 0,
               itemRateDDL: itemRateDDL?.data,
               itemId: itm?.itemId,
               itemName: itm?.itemName,
               itemCode: itm?.itemCode,
               quantity: itm?.orderQuantity,
               uomId: itm?.uomId,
               uomName: itm?.uomName,
               returnQuantity: 0,
               previousQuantity: 0,
               locationId: locationId,
               locationName: 'string',
               specification: 'string',
               isFreeItem: true,
               isReturn: false,
            };
         })
      );
      setRow(responseRow);
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

export const deleteHoldingInvoice = async deliveryId => {
   try {
      const res = await Axios.put(
         `/partner/Pos/DeleteHoldInformation?deliveryId=${deliveryId}`
      );
      if (res.status === 200) {
         toast.success(res.data?.message);
      }
   } catch (error) {
      toast.error(error?.response?.data?.message);
   }
};

/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import Form from "./form";
import IConfirmModal from "./../../../_helper/_confirmModal";
import {
  getCustomerDDL,
  getBankNameDDL,
  saveDeliveryPos,
  saveHoldingDeliveryPos,
  getSalesInvoiceById,
  getCounterSummary,
  getVatPercentage,
  getHoldingDeliveryData,
  getItemById,
  getSalesOrder,
  deleteHoldingInvoice,
} from "../helper";
import Loading from "../../../_helper/_loading";

const initData = {
  whName: "",
  customer: "",
  counter: "",
  bankName: "",
  cashAmount: "",
  creditAmount: "",
  cardNumber: "",
  totalDiscount: "",
  item: "",
  quantity: "",
  rate: "",
  discount: "",
  shippingCharge: "",
  discountValueOnTotal: "",
};

export default function SalesInvoiceForm() {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [customerDDL, setCustomsDDL] = useState([]);
  const [salesOrderDDL, setSalesOrderDDL] = useState([]);
  const [bankNameDDL, setBankNameDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [salesReturnDto, setSalesReturnDto] = useState([]);
  const [totalRate, setTotalRate] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [counterSummary, setCounterSummary] = useState({});
  const [vat, setVat] = useState({});
  const [holdingInvoice, setHoldingInvoice] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [id, setId] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [cashReturn, setCashReturn] = useState(0);
  const [creditReturn, setCreditReturn] = useState(0);
  const [itemRateDDL, setItemRateDDL] = useState([]);
  const [isCheck, setIsCheck] = useState(false);
  const [voucherReprintData, setVoucherReprintData] = useState([]);
  const [header, setHeader] = useState({});
  const [row, setRow] = useState([]);
  const [cashReturnAmount, setCashReturnAmount] = useState(0)

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { salesInvoiceData } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );

  const { whName, counter } = salesInvoiceData;

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getCustomerDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomsDDL
      );
      getVatPercentage(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setVat
      );
      getHoldingDeliveryData(
        selectedBusinessUnit?.value,
        counter?.value,
        setHoldingInvoice
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const deleteHoldingDataHandler = async (deliveryId) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to delete the Hold invoice?`,
      yesAlertFunc: async () => {
        await deleteHoldingInvoice(deliveryId);
        getHoldingDeliveryData(
          selectedBusinessUnit?.value,
          counter?.value,
          setHoldingInvoice
        );
      },
      noAlertFunc: () => {
        history.push("/pos-management/sales/sales-entry/create");
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      counter?.value
    ) {
      getCounterSummary(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        counter?.value,
        setCounterSummary
      );
    }
  }, [counter]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value && isCheck) {
      getSalesOrder(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        whName?.value,
        0,
        setSalesOrderDDL
      );
    }
  }, [isCheck]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBankNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBankNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (id) {
      getSalesInvoiceById(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        id,
        setSingleData,
        setRowDto
      );
    }
  }, [id]);

  useEffect(() => {
    if (rowDto.length > 0) {
      let totalItemRate = 0;
      let totalItemDiscount = 0;
      let totalAmount = 0;
      for (let i = 0; i < rowDto.length; i++) {
        if (!rowDto[i].isReturn) {
          totalItemRate += parseFloat(rowDto[i]?.rate || 0);
          totalItemDiscount += parseFloat(rowDto[i]?.totalDiscountValue || 0);
          totalAmount +=
            parseFloat(rowDto[i]?.quantity) *
            (parseFloat(rowDto[i]?.rate || 0) -
              parseFloat(rowDto[i]?.totalDiscountValue || 0));
        } else {
          totalItemRate += parseFloat(rowDto[i]?.rate || 0);
          totalItemDiscount += parseFloat(rowDto[i]?.totalDiscountValue || 0);
          totalAmount +=
            parseFloat(-rowDto[i]?.returnQuantity) *
            (parseFloat(rowDto[i]?.rate || 0) -
              parseFloat(rowDto[i]?.totalDiscountValue || 0));
        }
      }
      setTotalRate(totalItemRate);
      setTotalDiscount(totalItemDiscount);
      setTotal(totalAmount);
    }
  }, [rowDto]);

  const setter = async (payload) => {
    const itemRateDDL = await getItemById(
      payload?.itemId,
      whName?.value,
      setItemRateDDL
    );
    if (itemRateDDL.length === 1) {
      payload.rate = parseFloat(itemRateDDL[0]?.label);
      payload.mrp = itemRateDDL[0]?.mrp;
      payload.referenceId = itemRateDDL[0]?.referenceId;
      payload.inventoryRecordForSaleId = itemRateDDL[0]?.rowId;
      payload.cogs = itemRateDDL[0]?.cogs;
      payload.itemRateDDL = itemRateDDL;
      payload.availableStock = itemRateDDL[0]?.availableStock;
    } else {
      payload.itemRateDDL = itemRateDDL;
    }
    const isUnique =
      rowDto.filter((itm) => itm["itemName"] === payload?.itemName).length < 1;
    if (isUnique) {
      setRowDto([...rowDto, payload]);
    } else {
      let rowData = [...rowDto];
      const index = rowData.findIndex(
        (item) => item?.itemName === payload?.itemName
      );
      rowData[index].quantity =
        rowData[index].quantity + parseFloat(payload?.quantity);
      //rowData[index].abc=rowData[index].quantity+parseInt(payload?.quantity)
      setRowDto(rowData);
    }
  };

  const remover = (itemName) => {
    const index = rowDto.findIndex((item) => item.itemName === itemName);
    const totalItemRate = parseFloat(totalRate);
    const totalItemDiscount = parseFloat(totalDiscount);
    const totalItemPrice = parseFloat(total);
    setTotalRate(totalItemRate - parseFloat(rowDto[index]?.rate));
    setTotalDiscount(totalItemDiscount - rowDto[index]?.totalDiscountValue);
    setTotal(totalItemPrice - rowDto[index]?.total);
    const filterData = rowDto.filter((item) => item.itemName !== itemName);
    setRowDto(filterData);
  };

  const saveHandler = async (values, isHold, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (paidAmount < 0) {
        return toast.warn("Please purchase more item!");
      }

      if (voucherCode) {
        const payload = {
          objHeader: {
            deliveryId: singleData?.deliveryId,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            paymentTermId: 0,
            soldToPartnerId: values?.customer?.value
              ? values?.customer?.value
              : 0,
            soldToPartnerName: values?.customer?.label
              ? values?.customer?.label
              : "",
            soldToPartnerAddress: values?.customer?.address,
            shipPointId: counter?.value,
            shipPointName: counter?.label,
            shipPointAddress: counter?.address || "",
            deliveryDate: new Date(),
            warehouseId: whName?.value,
            strWarehouseName: whName?.label,
            strWarehouseAddress: whName?.address,
            actionBy: profileData?.userId,
            cashAmount: +values?.cashAmount || 0,
            creditAmount: +values?.creditAmount || 0,
            mfsAmount: +values?.mfsAmount || 0,
            paymentMethodId: values?.paymentMethod?.value,
            paymentMethodName: values?.paymentMethod?.label,
            cardAmount: +values?.cardAmount || 0,
            cardNo: values?.cardNo,
            shippingCharge: values?.shippingCharge,
            discountValueOnTotal: values?.discountValueOnTotal || 0,
            totalDiscountValue: totalDiscount,
            totalDeliveryAmount: 0,
            totalNetAmount: 0,
            bankId: 0,
            itemCount: rowDto?.length,
            bankName: "string",
            previousInvoicePoint: 0,
            isHold: isHold,
            cashReturn: cashReturn,
            creditReturn: creditReturn,
          },
          objRow: rowDto,
        };
        await saveDeliveryPos(
          payload,
          setHeader,
          setRow,
          setDisabled,
          () => {
            getCounterSummary(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              counter?.value,
              setCounterSummary
            );
            ResetProductClick();
            setHoldingInvoice([]);
          }
        );
      } else {
        if (rowDto?.length < 1) {
          return toast.warn("Please add atleast one item");
        } else if (!values?.customer?.value) {
          return toast.warn("Please Select Customer");
        }
        let cashReturn=cashReturnAmount>0?cashReturnAmount:0
        const payload = {
          objHeader: {
            deliveryId: 0,
            holdInformationId: singleData?.deliveryId,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            paymentTermId: 0,
            soldToPartnerId: values?.customer?.value
              ? values?.customer?.value
              : 0,
            soldToPartnerName: values?.customer?.label
              ? values?.customer?.label
              : "",
            soldToPartnerAddress: values?.customer?.address,
            shipPointId: counter?.value,
            shipPointName: counter?.label,
            shipPointAddress: counter?.address || "",
            deliveryDate: new Date(),
            warehouseId: whName?.value,
            strWarehouseName: whName?.label,
            strWarehouseAddress: whName?.address,
            actionBy: profileData?.userId,
            cashAmount: (+values?.cashAmount || 0)-cashReturn,
            mfsAmount: +values?.mfsAmount || 0,
            creditAmount: +values?.creditAmount || 0,
            paymentMethodId: values?.paymentMethod?.value,
            paymentMethodName: values?.paymentMethod?.label,
            cardAmount: +values?.cardAmount || 0,
            cardNo: values?.cardNo,
            shippingCharge: values?.shippingCharge || 0,
            discountValueOnTotal: values?.discountValueOnTotal || 0,
            totalDiscountValue: totalDiscount,
            totalDeliveryAmount: 0,
            totalNetAmount: 0,
            bankId: 0,
            itemCount: rowDto?.length,
            bankName: "",
            previousInvoicePoint: 0,
            isHold: isHold,
            cashReturn: 0,
            creditReturn: 0,
          },
          objRow: rowDto,
        };
        if (isHold) {
          let confirmObject = {
            title: "Are you sure?",
            message: `Do you want to Hold the invoice?`,
            yesAlertFunc: async () => {
              payload.objHeader.deliveryId = singleData?.deliveryId || 0;
              await saveHoldingDeliveryPos(payload, setDisabled);
              await getHoldingDeliveryData(
                selectedBusinessUnit?.value,
                counter?.value,
                setHoldingInvoice
              );
              ResetProductClick();
            },
            noAlertFunc: () => {
              
            },
          };
          IConfirmModal(confirmObject);
        } else {
          await saveDeliveryPos(payload, setHeader, setRow, setDisabled, () => {
            getCounterSummary(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              counter?.value,
              setCounterSummary
            );
            ResetProductClick();
            cb()
          });
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const ShowPaymentOption = () => {
    setShow(!show);
  };

  const updateQuantity = (value, index) => {
    const rowData = [...rowDto];
    rowData[index].quantity = parseFloat(value || 0);
    setRowDto(rowData);
  };

  const updateItemRate = (values, index) => {
    if (values) {
      const rowData = [...rowDto];
      if (isCheck) {
        rowData[index].rate = parseFloat(values?.label);
        rowData[index].mrp = values?.mrp;
        rowData[index].referenceId = values?.referenceId;
        rowData[index].cogs = values?.cogs;
        rowData[index].totalDiscountValue = 0;
        rowData[index].total =
          parseFloat(values?.label) * rowData[index].quantity;
        setRowDto(rowData);
      } else {
        rowData[index].rate = parseFloat(values?.label);
        rowData[index].mrp = values?.mrp;
        rowData[index].referenceId = values?.referenceId;
        rowData[index].inventoryRecordForSaleId = values?.rowId;
        rowData[index].cogs = values?.cogs;
        setRowDto(rowData);
      }
    }
  };

  const updateSalesReturnQty = (item) => {
    let data = {
      rowId: item?.rowId,
      itemId: item?.itemId,
      rate: item?.rate,
      totalDiscountValue: item?.totalDiscountValue,
      itemCode: item?.itemCode,
      itemName: item?.itemName,
      intUomId: item?.intUomId,
      referenceId: item?.referenceId,
      inventoryRecordForSaleId: item?.inventoryRecordForSaleId,
      uomName: item?.uomName,
      quantity: 0,
      returnQuantity: item?.returnQuantity,
      previousQuantity: item?.quantity,
      locationId: item?.locationId,
      locationName: item?.locationName,
      specification: "string",
      isFreeItem: true,
      mrp: item?.mrp,
      cogs: item?.cogs,
      dlvHid: singleData?.deliveryId,
      dlvRowId: item.rowId,
      isReturn: true,
    };
    let cashReturnAmount = cashReturn + item?.returnQuantity * item?.rate;
    let creditReturnAmount = creditReturn + item?.returnQuantity * item?.rate;
    setCashReturn(cashReturnAmount);
    setCreditReturn(creditReturnAmount);
    setRowDto([...rowDto, data]);
  };

  const backHandler = () => {
    history.goBack();
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    getHoldingDeliveryData(
      selectedBusinessUnit?.value,
      counter?.value,
      setHoldingInvoice
    );
    setVoucherCode("")
    setRowDto([]);
    setTotal(0);
    setCashReturn(0);
    setCreditReturn(0);
    setSalesReturnDto([]);
    setVoucherReprintData([]);
    if (id) {
      setSingleData({});
    }
    setId("");
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  return (
    <div className={`global-card-header`}>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Sales Invoice"}>
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backHandler}
              className={"btn btn-light"}
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>

            {`  `}
            <button
              type="reset"
              onClick={ResetProductClick}
              ref={resetBtnRef}
              className={"btn btn-light ml-2"}
            >
              <i className="fa fa-redo"></i>
              Reset
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            {isDisabled && <Loading />}
            <Form
              initData={id || voucherCode || isCheck ? singleData : initData}
              saveHandler={saveHandler}
              rowDto={rowDto}
              resetBtnRef={resetBtnRef}
              setRowDto={setRowDto}
              remover={remover}
              singleData={singleData}
              setter={setter}
              isEdit={id}
              whName={whName}
              customerDDL={customerDDL}
              salesOrderDDL={salesOrderDDL}
              total={total}
              totalRate={totalRate}
              totalDiscount={totalDiscount}
              selectedBusinessUnit={selectedBusinessUnit}
              profileData={profileData}
              ShowPaymentOption={ShowPaymentOption}
              bankNameDDL={bankNameDDL}
              id={id}
              updateQuantity={updateQuantity}
              counterSummary={counterSummary}
              vat={vat}
              holdingInvoice={holdingInvoice}
              setHoldingInvoice={setHoldingInvoice}
              counter={counter}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              setId={setId}
              setVoucherCode={setVoucherCode}
              voucherCode={voucherCode}
              salesReturnDto={salesReturnDto}
              updateSalesReturnQty={updateSalesReturnQty}
              cashReturn={cashReturn}
              itemRateDDL={itemRateDDL}
              updateItemRate={updateItemRate}
              setSingleData={setSingleData}
              setSalesReturnDto={setSalesReturnDto}
              isCheck={isCheck}
              setIsCheck={setIsCheck}
              voucherReprintData={voucherReprintData}
              setVoucherReprintData={setVoucherReprintData}
              header={header}
              row={row}
              deleteHoldingDataHandler={deleteHoldingDataHandler}
              isDisabled={isDisabled}
              cashReturnAmount={cashReturnAmount}
              setCashReturnAmount={setCashReturnAmount}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

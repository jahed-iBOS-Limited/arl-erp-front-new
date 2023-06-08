/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  saveServiceReceive,
  getPoNumberDDL,
  //getRowDtoData,
  // attachment_action,
  getSingleDataForEdit,
  saveCreateServiceEdit,
  getCostCenterDDL,
  getProjectDDL,
  getServiceReceivedDDL,
  serviceReceiveAttachment_action,

} from "../helper/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";
// import { _validationNumber } from "../../../../_helper/_numberValidation";

let initData = {
  poNumber: "",
  poAmount: "",
  adjustedAmount: "",
  supplier: "",
  comment: "",
  attachment: "",
  file: "",
  costCenter: "",
  projectName: "",
  serviceReceive: "",
  challanNO: "",
  challanDate: "",
  vatChallan: "",
  vatAmmount: "",
  getEntry: "",
  freight:"",
  grossDiscount:"",
  commission:"",
  productCost: "",
  foreignPurchase:"",
  othersCharge: ""
};

export default function ServiceReceiveForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const { state } = useLocation();
  //fileObjects
  const [fileObjects, setFileObjects] = useState([]);
  const [singleDataState, setSingleDataState] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [PoNumber, setPoNumber] = useState([]);
  const [costCenter, setCostCenter] = useState([]);
  const [projectName, SetProjectName] = useState([]);
  const [serviceReceived, setServiceReceived] = useState([]);
  const [attachError, setAttachError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [attachment, setAttachment] = useState("");
  const dispatch = useDispatch()

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Single Data
  useEffect(() => {
    if (id) {
      getSingleDataForEdit(id, setSingleDataState);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      getPoNumberDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        state.plant.value,
        state.warehouse.value,
        state.sbu.value,
        setPoNumber
      );
      getCostCenterDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        state.sbu.value,
        setCostCenter
      );
      getProjectDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        SetProjectName
      );
      getServiceReceivedDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setServiceReceived
      );
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (id && singleDataState) {
      setRowDto(singleDataState.objRow);
    }
  }, [singleDataState]);

  // const showrowDtoforPO = (poId) => {
  //   getRowDtoData(poId, setRowDto);
  // };

  let vatAmount = rowDto?.reduce((sum, data) => sum + data.vatValue , 0)

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === "quantity") {
      // _sl[name] = _validationNumber(value) ;
      _sl[name] = value ;
      _sl["serviceAmount"] = (_sl.totalValue / _sl.poQuantity) * +value;
      _sl["totalVat"] = (_sl?.vatValue / _sl?.poQuantity) * +value
      _sl["netTotalValue"] = ((_sl?.vatValue / _sl?.poQuantity) * +value) + ((_sl.totalValue / _sl.poQuantity) * +value);
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };


  let totalAmount = rowDto?.reduce((sum, data) => sum + data?.serviceAmount, 0)
  let totalVat = rowDto?.reduce((sum, data) => sum + data?.totalVat, 0)
  let netTotalValue = rowDto?.reduce((sum, data) => sum + data?.netTotalValue, 0)

  const attachmentHandleChange = (files) => {
    // file extention chack
    const condition = Array.from(files).every((itm) => {
      return (
        itm.type === "image/jpeg" ||
        itm.type === "image/png" ||
        itm.type === "image/jpg" ||
        itm.type === "application/pdf"
      );
    });
    if (condition && files.length > 0) {
      setAttachError(false);
    } else {
      setAttachError(true);
    }
  };

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

  const saveHandler = async (values, cb) => {


    if(totalVat.toFixed(4) > 0 && values?.vatAmmount < 1) return toast.warn("Vat amount should be greater than zero")

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      //edit api check
      if (id) {
        let rowFormet = rowDto.map((data) => {
          return {
            rowId: data.rowId,
            serviceId: singleDataState?.objHeader.serviceId,
            itemId: data.itemId,
            transactionQuantity: +data.quantity,
            poQuantity: data?.poQuantity,
            previousQuantity: data?.receiveQuantity,
            referenceId: data?.referenceId || 0
          };
        });

        // filter items quantity greater than 0
        let filterRowDto = rowFormet?.filter(item => item?.transactionQuantity > 0)

        if (filterRowDto?.length === 0) {
          return toast.error("Not inputting valid data")
        }

        const payload = {
          objHeader: {
            serviceId: singleDataState?.objHeader.serviceId,
            referenceId: values.poNumber.value,
            strComments: values.comment,
            strDocumentId: values?.strDocumentId,
          },
          objRow: rowFormet,
        };
        saveCreateServiceEdit(payload, cb, setDisabled);
      } else {
        //create api
        const rowDtoFormet = rowDto.map((data) => {
          return {
            itemId: data.itemId,
            itemName: data.itemName,
            uoMid: data.uoMId,
            uoMname: data.uoMName,
            transactionQuantity: +data.quantity,
            poQuantity: data?.poQuantity,
            previousQuantity: data?.receiveQuantity,
            transactionValue: +data?.quantity * data?.baseBalue,
            vatAmount: data?.vatValue ||0,
            discount: data?.discount || 0,
            referenceId: data?.referenceId || 0,
            profitCenterId: data?.profitCenterId || 0,
            profitCenterName: data?.profitCenterName || "",
            costRevenueName: data?.costRevenueName || "",
            costRevenueId: data?.costRevenueId || 0,
            elementName: data?.elementName || "",
            elementId: data?.elementId || 0,
          };
        });

        // filter items quantity greater than 0
        let filterRowDto = rowDtoFormet?.filter(item => item?.transactionQuantity > 0)

        if (filterRowDto?.length === 0) {
          return toast.error("Not inputting valid data")
        }

        const payload = {
          serviceCode: "",
          transactionDate: _todayDate(),
          referenceId: values.poNumber.value,
          referenceCode: values.poNumber.label,
          accountId: profileData?.accountId,
          accountName: profileData?.accountName,
          businessUnitId: selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          sbuid: state.sbu.value,
          sbuname: state.sbu.label,
          plantId: state.plant.value,
          plantName: state.plant.label,
          warehouseId: state.warehouse.value,
          warehouseName: state.warehouse.label,
          businessPartnerId: values.supplier.value,
          businessPartnerName: values.supplier.label,
          strComments: values.comment,
          intActionBy: profileData.userId,
          strDocumentId: "",
          costCenterId: values?.costCenter?.value || 0,
          costCenterCode: values?.costCenter?.code || "",
          costCenterName: values?.costCenter?.label || "",
          projectId: values?.projectName?.value || 0,
          projectCode: values?.projectName?.code || "",
          projectName: values?.projectName?.label || "",
          receivedById: values?.serviceReceive?.value || 0,
          receivedBy: values?.serviceReceive?.label || 0,
          gateEntryNo: values?.getEntry,
          challan: values?.challanNO,
          challanDateTime: values?.challanDate,
          vatChallan: values?.vatChallan,
          vatAmount: +values?.vatAmmount || 0,
          grossDiscount: +values?.grossDiscount || 0,
          freight: +values?.freight || 0,
          commission: +values?.commission || 0,
          shipmentId: values?.foreignPurchase?.value || 0,
          othersCharge: +values?.othersCharge || 0
        };
        if(fileObjects.length < 1) return toast.warn("Attachment is required", {toastId: "attachment"});
        if (fileObjects.length > 0) {
          setDisabled(true)
          serviceReceiveAttachment_action(fileObjects).then((data) => {
            setDisabled(false)
            const modifyPlyload = {
              objHeader: {
                ...payload,
                strDocumentId: data?.[0]?.id || "",
              },
              images: data?.map(data => {
                return {
                  imageId: data?.id
                }
              }),
              objRow: rowDtoFormet,
            };
            saveServiceReceive(modifyPlyload, cb, setRowDto, setDisabled,IConfirmModal, dispatch).then((data) => {
              setFileObjects([]);
            });
          }).catch(err => {
            setDisabled(false)
          });
        } else {
          const modifyPlyload = {
            objHeader: {
              ...payload,
              //strDocumentId: "",
            },
            images: [],
            objRow: rowDtoFormet,
          };
          saveServiceReceive(modifyPlyload, cb, setRowDto, setDisabled,IConfirmModal, dispatch).then((data) => {
            setFileObjects([]);
          });
        }
      }
    } else {

    }
  };


  const [objProps, setObjprops] = useState({});

  const lastInvData = useSelector(
    (state) => state?.localStorage?.lastInvData
  )

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => index !== payload);
    setRowDto([...filterArr]);
  };


  return (
    <IForm
      title={id ? "Edit Service Receive" : `Create Service Receive (Warehouse : ${state?.warehouse?.label}) ${lastInvData ? lastInvData : ""}`}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={id ? true : false}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleDataState.objHeader : initData}
          saveHandler={saveHandler}
          isEdit={id ? true : false}
          PoNumber={PoNumber}
          // showrowDtoforPO={showrowDtoforPO}
          rowDto={rowDto}
          rowDtoHandler={rowDtoHandler}
          attachmentHandleChange={attachmentHandleChange}
          attachError={attachError}
          setAttachment={setAttachment}
          setRowDto={setRowDto}
          costCenter={costCenter}
          projectName={projectName}
          serviceReceived={serviceReceived}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          vatAmount={vatAmount}
          totalAmount={totalAmount}
          totalVat={totalVat}
          netTotalValue={netTotalValue}
          remover={remover}
          plantId={state.plant.value}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </div>
    </IForm>
  );
}

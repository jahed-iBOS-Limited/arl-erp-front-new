/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  saveAssetReceive,
  getPoNumberDDL,
  attachment_action,
  getSingleDataForEdit,
  saveCreateServiceEdit,
} from "../helper/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { serviceReceiveAttachment_action } from "../../serviceReceive/helper/Actions";
import { confirmAlert } from "react-confirm-alert";


let initData = {
  poNumber: "",
  poAmount: "",
  adjustedAmount: "",
  supplier: "",
  comment: "",
  attachment: "",
  file: "",
  challanNO:"",
  challanDate:"",
  vatChallan:"",
  vatAmmount:"",
  getEntry:"",
  freight:"",
  grossDiscount:"",
  commission:"",
  prodCost:"",
  foreignPurchase:"",
  othersCharge: ""
};

export default function AssetsReceiveForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const { state } = useLocation();

  const [singleDataState, setSingleDataState] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [PoNumber, setPoNumber] = useState([]);
  const [attachError, setAttachError] = useState(false);
  const [attachment, setAttachment] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const dispatch = useDispatch()

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
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
        state?.plant?.value,
        state?.warehouse?.value,
        state?.sbu?.value,
        setPoNumber
      );
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (id && singleDataState) {
      setRowDto(singleDataState?.objRow);
    }
  }, [singleDataState]);

  // const showrowDtoforPO = (poId) => {
  //   getRowDtoData(poId, setRowDto);
  // };

  let vatAmount = rowDto?.reduce((sum, data) => sum + data?.vatValue , 0)

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === "quantity") {
      _sl[name] = +value;
      _sl["receiveAmount"] = (_sl?.netValue / _sl?.poQuantity) * +value;
      _sl["totalVat"] = (_sl?.vatValue / _sl?.poQuantity) * +value
      _sl["netTotalValue"] = ((_sl?.vatValue / _sl?.poQuantity) * +value) + ((_sl?.netValue / _sl?.poQuantity) * +value);
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const attachmentHandleChange = (files) => {
    // file extention chack
    const condition = Array.from(files).every((itm) => {
      return (
        itm?.type === "image/jpeg" ||
        itm?.type === "image/png" ||
        itm?.type === "image/jpg" ||
        itm?.type === "application/pdf"
      );
    });
    if (condition && files?.length > 0) {
      setAttachError(false);
    } else {
      setAttachError(true);
    }
  };

  const lastInvData = useSelector(
    (state) => state?.localStorage?.lastInvData
  )

  console.log("Rowdto", rowDto)


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
      if (id) {
        let rowFormet = rowDto.map((data) => {
          return {
            rowId: data.rowId,
            serviceId: singleDataState?.objHeader.serviceId,
            itemId: data.itemId,
            transactionQuantity: data.quantity,
            poQuantity: data?.poQuantity,
            previousQuantity: data?.receiveQuantity,
            referenceId: data?.referenceId || 0
          };
        });
        // filter items quantity greater than 0
        let filterRowDto = rowFormet?.filter(
          (item) => item?.transactionQuantity > 0
        );

        if (filterRowDto?.length === 0) {
          return toast.error("Not inputting valid data");
        }

        const payload = {
          objHeader: {
            serviceId: singleDataState?.objHeader.serviceId,
            referenceId: values.poNumber.value,
            strComments: values.comment,
            strDocumentId: "",
          },
          objRow: filterRowDto,
        };

        if (values?.file) {
          attachment_action(attachment).then((data) => {
            const modifyPlyload = {
              objHeader: {
                ...payload?.objHeader,
                strDocumentId: data?.length ? data[0]?.id : "",
              },
              objRow: rowFormet,
            };
            saveCreateServiceEdit(modifyPlyload, cb, setDisabled);
          });
        } else {
          saveCreateServiceEdit(payload, cb, setDisabled);
        }
      } else {
        if (rowDto.length === 0) {
          toast.error("Please Add Item");
        } else {
          const rowDtoFormet = rowDto.map((data) => {
            return {
              itemId: data.itemId,
              itemName: data.itemName,
              uoMid: data.uoMId,
              uoMname: data.uoMName,
              transactionQuantity: data.quantity,
              poQuantity: data?.poQuantity,
              previousQuantity: data?.receiveQuantity,
              locationId: data?.location?.value ,
              locationName: data?.location?.label,
              transactionValue: data?.quantity * data?.baseBalue,
              vatAmount: data?.vatValue ||0,
              discount: data?.discount || 0,
              referenceId: data?.referenceId || 0
            };
          });

          // filter items quantity greater than 0
          let filterRowDto = rowDtoFormet?.filter(
            (item) => item?.transactionQuantity > 0
          );

          if (filterRowDto?.length === 0) {
            return toast.error("Not inputting valid data");
          }

          const payload = {
            objHeader: {
              serviceCode: "string",
              othersCharge: +values?.othersCharge || 0,
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
              gateEntryNo: values?.getEntry,
              challan: values?.challanNO,
              challanDateTime: values?.challanDate,
              vatChallan: values?.vatChallan,
              vatAmount: +values?.vatAmmount || 0,
              grossDiscount: +values?.grossDiscount || 0,
              freight: +values?.freight || 0,
              commission: +values?.commission || 0,
              shipmentId: values?.foreignPurchase?.value || 0
            },
            objRow: filterRowDto,
          };

          // if (values?.file) {
          //   if (attachError) {
          //     toast.error("Please upload valid file");
          //   } else {
          //     attachment_action(attachment).then((data) => {
          //       const modifyPlyload = {
          //         objHeader: {
          //           ...payload?.objHeader,
          //           strDocumentId: data[0]?.id || "",
          //         },
          //         objRow: payload.objRow,
          //       };
          //       saveAssetReceive(modifyPlyload, cb, setRowDto, setDisabled);
          //     });
          //   }
          // } else {
          //   saveAssetReceive(payload, cb, setRowDto, setDisabled);
          // }

          if(fileObjects.length < 1) return toast.warn("Attachment is required");

          if (fileObjects.length > 0) {
            serviceReceiveAttachment_action(fileObjects).then((data) => {
              const modifyPlyload = {
                objHeader: {
                  ...payload?.objHeader             
                },
                images: data?.map(data => {
                  return {
                    imageId: data?.id
                  }
                }),
                objRow: payload.objRow,
              };
              saveAssetReceive(modifyPlyload, cb, setRowDto, setDisabled ,IConfirmModal,dispatch).then(
                (data) => {
                  setFileObjects([]);
                }
              );
            });
          } else {
            const modifyPlyload = {
              objHeader: {
                ...payload?.objHeader
              },
              images:[],
              objRow: payload.objRow,
            };
            saveAssetReceive(modifyPlyload, cb, setRowDto, setDisabled , IConfirmModal,dispatch).then(
              (data) => {
                setFileObjects([]);
              }
            );
          }
        }
      }
    } else {
    }
  };


  let totalAmount = rowDto?.reduce((sum, data) => sum + data?.receiveAmount, 0)
  let totalVat = rowDto?.reduce((sum, data) => sum + data?.totalVat, 0)
  let netTotalValue = rowDto?.reduce((sum, data) => sum + data?.netTotalValue, 0)

  const [objProps, setObjprops] = useState({});


   // remove single data from rowDto
   const remover = (payload) => {
    const filterArr = rowDto?.filter((itm, index) => index !== payload);
    setRowDto([...filterArr]);
  };

  return (
    <IForm
      title={id ? "Edit Asset Receive" : `Create Asset Receive ${lastInvData ? lastInvData : ''} `}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={id ? true : false}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleDataState?.objHeader : initData}
          saveHandler={saveHandler}
          // disableHandler={disableHandler}
          isEdit={id ? true : false}
          PoNumber={PoNumber}
          // showrowDtoforPO={showrowDtoforPO}
          rowDto={rowDto}
          rowDtoHandler={rowDtoHandler}
          attachmentHandleChange={attachmentHandleChange}
          attachError={attachError}
          setAttachment={setAttachment}
          setRowDto={setRowDto}
          fileObjects={fileObjects}
          setFileObjects={setFileObjects}
          vatAmount={vatAmount}
          totalAmount={totalAmount}
          totalVat={totalVat}
          netTotalValue={netTotalValue}
          remover={remover}
          plantId ={state?.plant?.value}
          profileData={ profileData}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </div>
    </IForm>
  );
}

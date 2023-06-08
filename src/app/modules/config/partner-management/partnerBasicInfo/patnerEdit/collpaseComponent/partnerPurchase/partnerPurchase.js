/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
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
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isUniq } from "../../../../../../_helper/uniqChecker";
import { toast } from "react-toastify";
import Loading from "./../../../../../../_helper/_loading";

const initProduct = {
  purchaseOrganization: "",
  priceStructure: "",
  generalLedgerName: "",
  accuredGeneralLedgerName: "",
  advancedGeneralLedgerName: "",
  itemCategory: "",
  itemName: "",
  sbu: "",
  shipPointName: "",
};

export default function PartnerPurchase() {
  const { id } = useParams();
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [shipPointRowDto, setShipPointRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    SingleData(id);
  }, [id]);

  const SingleData = async (id) => {
    try {
      const res = await Axios.get(
        `/partner/BusinessPartnerPurchaseInfo/GetPartnerPurchaseDatabyId?Id=${id}`
      );
      if (res && res.data[0]?.objdata) {
        // let newData = res.data[0]?.objRow?.map((item) => ({
        //   ...item,
        //   configId: item?.configid,
        //   itemCategory: { value: item?.categoryId, label: item?.categoryName },
        // }));

        let newobjdata = res.data[0]?.objdata?.map((item) => ({
          ...item,
          shipPointName: item?.strPartnerShippointName,
          isActive:true
        }));

        //setRowDto([...newData]);
        setShipPointRowDto([...newobjdata]);
        const {
          sbuid,
          sbuName,
          purchaseOrganizationId,
          purchaseOrganizationName,
          priceStructureId,
          priceStructureName,
          acPayGLId,
          acPayGLName,
          accruedPayGLId,
          accruedPayGLName,
          advanceGLId,
          advanceGLName,
          configId,
        } = res?.data[0]?.objHeader;
        setSingleData({
          configId,
          sbu: {
            value: sbuid || "",
            label: sbuName || "",
          },
          purchaseOrganization: {
            value: purchaseOrganizationId || "",
            label: purchaseOrganizationName || "",
          },
          priceStructure: {
            value: priceStructureId,
            label: priceStructureName,
          },
          generalLedgerName: {
            value: acPayGLId,
            label: acPayGLName,
          },
          accuredGeneralLedgerName: {
            value: accruedPayGLId || "",
            label: accruedPayGLName || "",
          },
          advancedGeneralLedgerName: {
            value: advanceGLId || "",
            label: advanceGLName || "",
          },
          itemCategory: "",
          itemName: "",
        });
      } else {
        setRowDto([]);
        setShipPointRowDto([]);
      }
    } catch (error) {
     
    }
  };

  const savePurchase = async (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      // let objRow = rowDto?.map((itm) => {
      //   return {
      //     configId: itm?.configId || 0,
      //     businessPartnerId: +id,
      //     itemCategoryId: itm?.itemCategory?.value,
      //     itemId: itm?.itemId,
      //     accountId,
      //     businessUnitId: businessunitid,
      //     supplierItemName: itm?.itemName,
      //     actionBy,
      //   };
      // });
      let objdata = shipPointRowDto?.map((itm) => {
        return {
          strPartnerShippointName: itm?.shipPointName,
          isActive:itm?.isActive
        };
      });

      const purchaseData = {
        objHeader: {
          configId: singleData?.configId || 0,
          accountId,
          businessUnitId: businessunitid,
          sbuid: values?.sbu?.value,
          businessPartnerId: +id,
          priceStructureId: values?.priceStructure?.value,
          purchaseOrganizationId: values?.purchaseOrganization?.value,
          acPayGLId: values?.generalLedgerName?.value,
          advanceGLId: values?.advancedGeneralLedgerName?.value,
          accruedPayGLId: values?.accuredGeneralLedgerName?.value,
          ledgerBalance: 0,
          unbilledAmount: 0,
          actionBy,
          dteLastActionDateTime: "2020-08-31T04:49:29.981Z",
          isActive: true,
        },
        //objRow: objRow,
        objdata: objdata,
      };

      try {
        setDisabled(true);
        const res = await Axios.post(
          "/partner/BusinessPartnerPurchaseInfo/CreateBusinessPartnerPurchaseInfo",
          purchaseData
        );
        if (res.status === 200) {
        }
        cb(initProduct);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        setDisabled(false);
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (payload) => {
    if (isUniq("itemId", payload.itemId, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  const shipPointSetter = (payload) => {
    if (isUniq("shipPointName", payload.shipPointName, shipPointRowDto)) {
      setShipPointRowDto([...shipPointRowDto, payload]);
    }
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm.itemId !== payload);
    setRowDto(filterArr);
  };

  const shipPointRemover = (item) => {
    if(item.id === 0){
      const filterArr = shipPointRowDto.filter((itm, idx) => itm.shipPointName !== item.shipPointName);
      setShipPointRowDto(filterArr);
    }
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

  const rowDtoHandler = (name, value, sl) => {
    let data = [...shipPointRowDto]
    let _sl = data[sl]
       _sl[name] = value
      setShipPointRowDto(data)
  }

  console.log(shipPointRowDto,"shipment")

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Partner Purchase Info">
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
            product={singleData || initProduct}
            btnRef={btnRef}
            savePurchase={savePurchase}
            resetBtnRef={resetBtnRef}
            selectedBusinessUnit={selectedBusinessUnit}
            accountId={profileData?.accountId}
            profileData={profileData}
            rowDto={rowDto}
            setter={setter}
            remover={remover}
            shipPointRowDto={shipPointRowDto}
            shipPointSetter={shipPointSetter}
            shipPointRemover={shipPointRemover}
            id={id}
            rowDtoHandler={rowDtoHandler}
          />
        </div>
      </CardBody>
    </Card>
  );
}

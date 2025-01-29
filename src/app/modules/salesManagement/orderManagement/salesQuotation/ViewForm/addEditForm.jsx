import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getSalesQuotationById,
  setSalesQuotationSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";

import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  salesOrg: "",
  channel: "",
  salesOffice: "",
  soldtoParty: "",
  partnerReffNo: "",
  pricingDate: _todayDate(),
  itemList: "",
  quantity: "",
  price: "",
  value: "",
  specification: "",
  uom: "",
  quotationCode: "",
  isSpecification: false,
};

export default function SalesQuotationViewForm({ history, show, onHide, id }) {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [, setSpecRowDto] = useState([]);
  const [specTableData, setSpecTableData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [objTerms, setObjTerms] = useState([]);
  const [total, setTotal] = useState({ totalQty: 0, totalAmount: 0 });

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.salesQuotation?.singleData;
  }, shallowEqual);

  // sold to party ddl
  const spctionDDL = useSelector((state) => {
    return state.salesQuotation?.setSpction;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesQuotationById(id, setDisabled));
    } else {
      dispatch(setSalesQuotationSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // single data Specification set
  useEffect(() => {
    if (singleData?.objRow?.length) {
      setRowDto(singleData?.objRow);
      setSpecRowDto(singleData?.objSpec);
      setSpecTableData(singleData?.objSpec);
      setObjTerms(singleData?.objTerms || [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  //Total Qty & Total Amount calculation
  useEffect(() => {
    let totalQty = 0;
    let totalAmount = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalQty += +rowDto[i].quotationQuantity;
        totalAmount += +rowDto[i].quotationValue;
      }
    }
    setTotal({ totalQty, totalAmount });
  }, [rowDto]);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    return () => {
      dispatch(setSalesQuotationSingleEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IViewModal
      show={show}
      onHide={onHide}
      title={`View Sales Quotation (${history?.location?.state?.quotationCode})`}
      isShow={singleData && false}
    >
      <IForm
        title={"View Sales Quotation"}
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenReset
        isHiddenSave
        isHiddenBack
        renderProps={
          () => (
            <button className="btn btn-primary" onClick={() => {
              console.log("clicked");
            }}>
              Print
            </button>
          )

        }

      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData?.objHeader || initData}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id || false}
          rowDto={rowDto}
          total={total}
          specTableData={specTableData}
          spctionDDL={spctionDDL}
          id={id}
          objTerms={singleData.objTerms}
        />
      </IForm>
    </IViewModal>
  );
}

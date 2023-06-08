import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import toArray from "lodash/toArray";
import { updateQuotationEntry } from "../_redux/Actions";

const initData = {
  id: undefined,
  supplierName: "",
  supplierRef: "",
  supplierDate: "",
};

export default function QuotationForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState({});

  const dispatch = useDispatch();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // supplier ddl
  const supplierDDL = useSelector((state) => {
    return state.commonDDL.supplierDDL;
  }, shallowEqual);

  // quotation grid data
  const quotationData = useSelector((state) => {
    return state.rfq.quotationGridData;
  }, shallowEqual);

  useEffect(() => {
    let temp = {};
    quotationData.forEach(function(element, index) {
      temp[index] = {
        ...element,
        rate: element?.rate || "",
        comments: element?.comments || "",
      };
    });
    setRowDto(temp);
  }, [quotationData]);

  
  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const rowData = toArray(rowDto)?.map((itm) => {
          return {
            // rowId: +itm?.rowid,
            partnerRFQId: +itm?.partnerRFQId,
            itemId: +itm?.itemId,
            numRate: +itm?.rate,
            remarks: itm?.comments,
          };
        });
        let date = new Date();
        let payload = {
          objHeader: {
            partnerRFQId: +rowDto[0]?.partnerRFQId,
            requestForQuotationId: +id,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessPartnerId: +values?.supplierName?.value,
            supplierRefNo: values?.supplierRef || "string",
            supplierRefDate: values?.supplierDate || date,
          },
          objRow: rowData,
        };
        dispatch(updateQuotationEntry({ data: payload, cb }));
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const rowDtoHandler = (name, value, sl) => {
    setRowDto({
      ...rowDto,
      [sl]: {
        ...rowDto[sl],
        [name]: value,
      },
    });
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Maintain RFQ: Quotation Entry"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        id={id}
        profileData={profileData}
        supplierDDL={supplierDDL}
        rowDtoHandler={rowDtoHandler}
      />
    </IForm>
  );
}

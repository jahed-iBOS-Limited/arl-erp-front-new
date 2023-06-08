/* eslint-disable eqeqeq */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { getCsDataAction, saveCSDataAction, getRFQSupplierList } from "../_redux/Actions";
import { getSupplierDDLAction } from "../../../../_helper/_redux/Actions";
import toArray from "lodash/toArray";
const initData = {
  supplier: "",
};

export default function CSForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState({});
  const [supplier, setSupplier] = useState([]);
  const [rfqSupplier, setRfqSupplier] = useState([]);

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

  // cs grid data
  const csGridData = useSelector((state) => {
    return state.rfq.csData;
  }, shallowEqual);

  useEffect(() => {
    // let temp = {};
    // let newData = csGridData?.filter(
    //   (v, i, a) => a.findIndex((t) => t.itemId === v.itemId) === i
    // );
    // newData.length > 0 &&
    //   newData.forEach(function (element, index) {
    //     temp[index] = {
    //       ...element,
    //       supplier: supplier || [],
    //       comments: "",
    //     };
    //   });


    if (csGridData.length > 0) {
      const rfqId = history?.location?.pathname?.split("/mngProcurement/purchase-management/rfq/cs/")[1]
      getRFQSupplierList(profileData?.accountId, selectedBusinessUnit?.value, rfqId)
        .then(res => {
          setRfqSupplier(res.data)
          let itemList = []
          csGridData.forEach(item => {
            // eslint-disable-next-line eqeqeq
            if (!itemList.find(a => item.itemId == a.itemId)) {
              itemList.push(item)
            }
          })
          itemList = itemList.map(item => ({ ...item, supplierList: [] }))
          itemList.forEach(item => {
            res.data.forEach(supplier => {
              const obj = csGridData.find(a => {
                if (a.itemId === item.itemId && supplier.rfqId === a.partnerRfqid) {
                  return true
                }
                return false;
              })
              if (obj) {
                item['supplierList'].push({
                  supplierName: supplier.label,
                  rate: obj.rate,
                  value: obj.value,
                })
              } else {
                item['supplierList'].push({
                  supplierName: supplier.label,
                  rate: "",
                  value: "",
                })
              }

            })
          })
          itemList.forEach(item => {
            const minValue = Math.min(...item.supplierList.filter(a => a.rate != null && a.rate != undefined && a.rate != "").map(a => a.rate));
            item.supplierList.forEach(supplier => {
              if (minValue === supplier.rate) {
                supplier['isLowestRate'] = true
              }
            })
          })
          itemList.push({
            supplierList: []
          })
          res.data.forEach((supplier, index) => {
            let sumValue = 0;
            for (let i = 0; i < itemList.length - 1; i++) {
              sumValue += itemList[i]['supplierList'][index].value;
            }
            itemList[itemList.length - 1]['supplierList'].push({
              value: sumValue
            })
          })
          setRowDto(toArray(itemList));
        })

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csGridData, supplier]);

  // Dispatch action
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      if (id) {
        dispatch(
          getCsDataAction(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            id
          )
        );
      }
      dispatch(
        getSupplierDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, id]);

  // useEffect(() => {

  // }, [csGridData, profileData?.accountId, selectedBusinessUnit?.value])

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      let payload = {};
      dispatch(saveCSDataAction({ data: payload, cb }));
    } else {
      setDisabled(false);
    }
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

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Comperative Statement & Supplier Selection"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      <Form
        {...objProps}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        csGridData={csGridData}
        supplierDDL={supplierDDL}
        rowDtoHandler={rowDtoHandler}
        initData={initData}
        setSupplier={setSupplier}
        supplier={supplier}
        rfqSupplier={rfqSupplier}
      />
    </IForm>
  );
}

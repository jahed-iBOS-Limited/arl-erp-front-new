import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls';
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls';
import { useSelector, shallowEqual } from 'react-redux';
import Form from '../common/form';
import Axios from 'axios';
import shortid from 'shortid';
import { toast } from 'react-toastify';
import Loading from '../../../../_helper/_loading';
import { getPurchaseOrgList } from '../../../../procurement/purchase-management/purchaseRequestNew/helper';

const data = {
  id: undefined,
  itemName: '',
  itemCode: '',
  drawingCode: '',
  partNo: '',
  itemType: '',
  itemTypeId: '',
  itemCategoryName: '',
  itemCategoryId: '',
  itemSubCategoryName: '',
  itemSubCategoryId: '',
  itemSubCategory: '',
  itemCategory: '',
  purchaseOrg: '',
};

export default function AddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [saveConfigBtn, setSaveConfigBtn] = useState(false);
  const [purchaseOrg, setPurchaseOrg] = useState([]);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const businessUnitId = selectedBusinessUnit?.value;
  const isWorkable = businessUnitId === 138 || businessUnitId === 186;

  useEffect(() => {
    getPurchaseOrgList(profileData?.accountId, 4, setPurchaseOrg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveData = async (values, cb) => {
    setDisabled(true);
    if (
      !id &&
      values &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      const { userId: actionBy } = profileData;

      const itemBasicData = {
        itemMasterId: 0,
        itemMasterCode:
          selectedBusinessUnit?.value === 102
            ? values?.itemCode
              ? values?.itemCode
              : ''
            : '',
        itemMasterName: values.itemName,
        itemMasterTypeId: values.itemType.value,
        itemMasterTypeName: values.itemType.label,
        itemMasterCategoryId: values.itemCategory.value,
        itemMasterCategoryName: values.itemCategory.label,
        itemMasterSubCategoryId: values.itemSubCategory.value,
        itemMasterSubCategoryName: values.itemSubCategory.label,
        actionBy: actionBy,
        drawingCode: values?.drawingCode || '',
        partNo: values?.partNo || '',
        purchaseOrganizationId: values?.purchaseOrg?.value,
        purchaseOrganizationName: values?.purchaseOrg?.label,
      };

      if (!saveConfigBtn) {
        try {
          setDisabled(true);
          const res = await Axios.post(
            '/item/ItemMaster/CreateItemMaster',
            itemBasicData,
          );
          // const res = await Axios.post(
          //   "/item/ItemBasic/CreateItemBasic",
          //   itemBasicData
          // );
          cb(data);
          setDisabled(false);
          toast.success(res.data?.message || 'Submitted successfully', {
            toastId: shortid(),
          });
          history.push({
            pathname: `/config/material-management/itembasicinfo-master`,
          });
        } catch (error) {
          setDisabled(false);
          toast.error(error?.response?.data?.message, { toastId: shortid() });
        }
      } else {
        try {
          setDisabled(true);
          const res = await Axios.post(
            '/item/ItemMaster/CreateItemMaster',
            itemBasicData,
          );
          // const res = await Axios.post(
          //   "/item/ItemBasic/CreateItemBasic",
          //   itemBasicData
          // );
          if (res?.data) {
            history.push({
              pathname: `/config/material-management/item-basic-info/edit/${res?.data?.key}`,
              state: {
                item: {
                  itemName: res?.data?.keyValue,
                  itemCode: res?.data?.itemCode,
                },
              },
            });
          }
        } catch (error) {
          setDisabled(false);
          toast.error(error?.response?.data?.message, { toastId: shortid() });
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const saveBtnRef = useRef();
  const saveItemBasicClick = () => {
    if (saveBtnRef && saveBtnRef.current) {
      saveBtnRef.current.click();
    }
  };

  const saveConfigBtnRef = useRef();
  // const saveConfigItemBasicClick = () => {
  //   if (saveConfigBtnRef && saveConfigBtnRef.current) {
  //     saveConfigBtnRef.current.click();
  //   }
  // };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const backHandler = () => {
    history.push(`/config/material-management/itembasicinfo-master`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Item Basic info">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
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
            onClick={saveItemBasicClick}
            ref={saveBtnRef}
            disabled={isDisabled}
          >
            Save
          </button>
          {/* <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveConfigItemBasicClick}
            ref={saveConfigBtnRef}
            disabled={isDisabled}
          >
            Save & Complete
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            data={data}
            saveBtnRef={saveBtnRef}
            saveConfigBtnRef={saveConfigBtnRef}
            saveData={saveData}
            resetBtnRef={resetBtnRef}
            selectedBusinessUnit={selectedBusinessUnit}
            accountId={profileData.accountId}
            setSaveConfigBtn={setSaveConfigBtn}
            isWorkable={isWorkable}
            purchaseOrg={purchaseOrg}
          />
        </div>
      </CardBody>
    </Card>
  );
}

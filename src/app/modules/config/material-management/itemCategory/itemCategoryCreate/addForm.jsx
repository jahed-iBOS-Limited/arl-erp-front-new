import Axios from 'axios';
import React, { useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import Loading from '../../../../_helper/_loading';
import Form from '../common/form';
const initProduct = {
  id: undefined,
  itemCategoryName: '',
  itemTypeName: '',
};

export default function ItemCategoryAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const saveItemCategory = async (values, cb) => {
    console.log('mm m', values, id, profileData);
    setDisabled(true);
    if (!id && values && profileData) {
      const itemCategoryCreatePayload = {
        sl: 0,
        itemMasterCategoryId: 0,
        accountId: profileData?.accountId,
        itemMasterCategoryCode: '',
        itemMasterCategoryName: values?.itemCategoryName || '',
        itemMasterTypeId: values?.itemTypeName?.value || 0,
        actionBy: profileData?.userId,
      };

      try {
        setDisabled(true);
        const res = await Axios.post(
          '/item/MasterCategory/CreateItemMasterCategory',
          itemCategoryCreatePayload
        );
        cb(initProduct);
        toast.success(res.data?.message || 'Submitted successfully', {
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

  const backToItemCategoryList = () => {
    history.push(`/config/material-management/item-category/`);
  };
  return (
    <Card>
      <ModalProgressBar />
      <CardHeader title="Create Item Category">
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToItemCategoryList}
            className="btn btn-light"
          >
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
            onClick={saveBtnClicker}
            ref={btnRef}
            disabled={isDisabled}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            product={initProduct}
            btnRef={btnRef}
            saveItemCategory={saveItemCategory}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            selectedBusinessUnit={selectedBusinessUnit}
            profileData={profileData}
          />
        </div>
      </CardBody>
    </Card>
  );
}

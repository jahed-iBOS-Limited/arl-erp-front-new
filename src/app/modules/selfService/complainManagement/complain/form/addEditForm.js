import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import { createComplain, getComplainById } from '../helper';
import Form from './form';

const initData = {
  occurrenceDate: _todayDate(),
  respondentType: {
    value: 1,
    label: 'Employee',
  },
  respondentName: '',
  respondentContact: '',
  issueType: '',
  issueSubType: '',
  issueTitle: '',
  distributionChannel: '',
  product: '',
  issueDetails: '',
  contactSource: '',
  // new add
  occurrenceTime: '',
  respondentBusinessUnit: '',
  respondent: '',
  respondentOrg: '',
  designationOrRelationship: '',
  additionalCommentAndSuggestion: '',
  itemCategory: '',
  challanOrPO: '',
  deliveryDate: '',
  reference: '',
  respondentAddress: '',
  sourceCustomerType: '',
  upazila: '',
  customer: '',
  territoryId: '',
  territoryName: '',
};

function ComplainForm() {
  const [singleData, setSingleData] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [fileObjects, setFileObjects] = useState([]);
  const { view, edit } = useParams();
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, userName },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      complainId: +edit || 0,
      requestDateTime: values?.occurrenceDate || new Date(),
      complainCategoryId: values?.issueType?.value || 0,
      complainCategoryName: values?.issueType?.label || '',
      complainSubCategoryId: values?.issueSubType?.value || 0,
      complainSubCategoryName: values?.issueSubType?.label || '',
      issueTitle: values?.issueTitle || '',
      accountId: accId,
      businessUnitId: values?.respondentBusinessUnit?.value || 0,
      description: values?.issueDetails || '',
      attachment: values?.attachment || '',
      actionById: userId,
      contactNo: values?.respondentContact || '',
      respondentTypeId: values?.respondentType?.value || 0,
      respondentTypeName: values?.respondentType?.label || '',
      respondentId: values?.respondentName?.value || 0,
      respondentName:
        values?.respondentName?.label ||
        (values?.respondentType?.value === 4 && values?.respondent) ||
        '',
      distributionChannelId: values?.distributionChannel?.value || 0,
      delegateToId: singleData?.delegateToId || 0,
      delegateToName: singleData?.delegateToName || '',
      statusId: singleData?.statusId || 0,
      status: singleData?.status || '',
      delegateDateTime: singleData?.delegateDateTime || '',
      distributionChannelName: values?.distributionChannel?.label || '',
      respondentBusinessUnitId: values?.respondentBusinessUnit?.value || 0,
      respondentBusinessUnitIdName: values?.respondentBusinessUnit?.label || '',
      respondentOrg: values?.respondentOrg || '',
      designationOrRelationship: values?.designationOrRelationship || '',
      commentAndSuggestion: values?.additionalCommentAndSuggestion || '',
      itemCategoryId: values?.itemCategory?.value || 0,
      itemCategoryName: values?.itemCategory?.label || '',
      challanOrPoId: values?.challanOrPO?.value || 0,
      challanOrPoName: values?.challanOrPO?.label || '',
      deliveryDate: values?.deliveryDate || '',
      reference: values?.reference || '',
      occurrenceTime: values?.occurrenceTime || '',
      isActive: true,
      lastActionDateTime: new Date(),
      respondentType: values?.respondent || '',
      contactSourceId: values?.contactSource?.value || 0,
      contactSourceName: values?.contactSource?.label || '',
      respondentAddress: values?.respondentAddress || '',
      sourceCustomerType: values?.sourceCustomerType?.label || '',
      customerId: values?.customer?.value || 0,
      customerName: values?.customer?.label || '',
      territoryName: values?.territoryName || '',
      territoryId: values?.territoryId || 0,

      upazilaName: values?.upazila?.upazilaName || '',
      districtName: values?.upazila?.districtName || '',
    };

    if (edit) {
      payload.updateBye = userName;
    } else {
      payload.actionByName = userName;
    }
    createComplain(payload, setLoading, () => {
      if (!edit) {
        cb();
      }
    });
  };

  useEffect(() => {
    if (edit || view) {
      const id = edit || view;
      getComplainById(id, accId, buId, setLoading, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit, view]);
  const isLoader = loading;

  return (
    <>
      {isLoader && <Loading />}
      <Form
        initData={singleData || initData}
        saveHandler={saveHandler}
        history={history}
        accId={accId}
        buId={buId}
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        setLoading={setLoading}
        view={view}
      />
    </>
  );
}

export default ComplainForm;

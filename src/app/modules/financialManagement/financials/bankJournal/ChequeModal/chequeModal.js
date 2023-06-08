/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Form, Formik } from "formik";
import InputField from "../../../../_helper/_inputField";
import { setGenarateChequeNo, changeChequeBookSave } from "../helper";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getBankJournalGridData } from "../_redux/Actions";

const initData = {
  checkNo: "",
};

export default function ChequeModal({
  id,
  chequeData,
  currentCheckNo,
  show,
  onHide,
  setChequeModal,
  parentFormValue,
  pageNo,
  pageSize,
  gridDataLoad,
}) {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  // useEffect(() => {
  //   if (chequeData?.instrumentType) {
  //     setGenarateChequeNo(
  //       profileData?.accountId,
  //       selectedBusinessUnit?.value,
  //       chequeData?.bankId,
  //       chequeData?.branchId,
  //       chequeData?.bankAccountId,
  //       chequeData?.bankAccountNo,
  //       chequeData?.instrumentType,
  //       setCurrentChequeNo
  //     );
  //   }
  // }, [chequeData]);

  const saveHandler = (values) => {
    if (currentCheckNo) {
      const callBackFunc = () => {
        gridDataLoad(
          parentFormValue?.sbu?.value,
          parentFormValue?.accountingJournalTypeId?.value,
          parentFormValue?.fromDate,
          parentFormValue?.toDate,
          parentFormValue?.type,
          pageNo,
          pageSize
        );
      };
      changeChequeBookSave(
        +chequeData?.bankJournalId,
        currentCheckNo,
        callBackFunc
      );
      setChequeModal(false);
    }
  };

  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isModalFooterActive={false}
        // isShow={rowDto && false}
        title="Change Cheque Number"
        style={{ fontSize: "1.2rem !important" }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initData, checkNo: currentCheckNo }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>Check No</label>
                      <InputField
                        value={values?.checkNo}
                        name="checkNo"
                        placeholder="Check No"
                        type="text"
                        required
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: "14px" }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </IViewModal>
    </div>
  );
}

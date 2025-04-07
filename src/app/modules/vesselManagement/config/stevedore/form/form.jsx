import { Formik } from 'formik';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import ICustomCard from '../../../../_helper/_customCard';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { editStevedore } from '../helper';

const initData = { stevedoreName: '', phoneNo: '' };

const StevedoreCreateForm = ({ setShow, getData, formType, singleData }) => {
  const [, postData, isLoading] = useAxiosPost();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user data from store
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const addRow = (values, callBack) => {
    const newRow = {
      steveDoreName: values?.stevedoreName,
      phone: values?.phoneNo,
      insertby: userId,
      businessUnitId: buId,
    };
    setRows([...rows, newRow]);
    callBack();
  };

  const removeRow = (index) => {
    setRows(rows?.filter((_, i) => i !== index));
  };

  const saveHandler = (values) => {
    if (formType === 'create') {
      const cb = () => {
        getData('', 0, 15);
        setShow(false);
      };
      postData(
        `/wms/FertilizerOperation/CreateLighterStevedore`,
        rows,
        cb,
        true
      );
    } else {
      const payload = {
        stevedoreId: singleData?.stevedoreId,
        steveDoreName: values?.stevedoreName,
        phone: values?.phoneNo,
      };
      const cb = () => {
        getData('', 0, 15);
        setShow(false);
      };
      editStevedore(payload, setLoading, cb);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          formType === 'edit'
            ? {
                stevedoreName: singleData?.steveDoreName,
                phoneNo: singleData?.phone,
              }
            : initData
        }
        onSubmit={() => {}}
      >
        {({ values, resetForm }) => (
          <>
            <ICustomCard
              title={`${formType === 'edit' ? 'Edit' : 'Create'} Stevedore`}
              resetHandler={() => resetForm(initData)}
              saveHandler={() => saveHandler(values)}
              saveDisabled={
                formType === 'create'
                  ? rows?.length < 1
                  : !values?.stevedoreName || !values?.phoneNo
              }
            >
              {(loading || isLoading) && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <InputField
                        label="Stevedore Name"
                        placeholder="Stevedore Name"
                        value={values?.stevedoreName}
                        name="stevedoreName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-6">
                      <InputField
                        label="Phone No"
                        placeholder="Phone No"
                        value={values?.phoneNo}
                        name="phoneNo"
                        type="text"
                      />
                    </div>
                    {formType === 'create' && (
                      <div className="col-12 mt-3 text-right">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            const callBack = () => resetForm();
                            addRow(values, callBack);
                          }}
                          disabled={!values?.stevedoreName || !values?.phoneNo}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {rows?.length > 0 && formType === 'create' && (
                  <div className="table-responsive">
                    <table
                      id="table-to-xlsx"
                      className={
                        'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {['SL', 'Stevedore Name', 'Phone No', 'Action']?.map(
                            (th, index) => {
                              return <th key={index}> {th} </th>;
                            }
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {rows?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: '40px' }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.steveDoreName}</td>
                              <td>{item?.phone}</td>
                              <td className="text-center">
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IDelete remover={removeRow} id={index} />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default StevedoreCreateForm;

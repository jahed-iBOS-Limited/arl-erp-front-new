import { Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ICustomCard from '../../../../_helper/_customCard';
import NewSelect from '../../../../_helper/_select';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import IButton from '../../../../_helper/iButton';

export default function FormCmp({
  viewType,
  initData,
  postData,
  saveHandler,
  channelList,
}) {
  const history = useHistory();

  const {
    tokenData: { token },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <ICustomCard
              title={`Ship To Party Target Entry`}
              backHandler={() => history.goBack()}
              resetHandler={
                viewType !== 'view'
                  ? () => {
                      resetForm(initData);
                    }
                  : ''
              }
              renderProps={() => {
                return (
                  <button
                    className="btn btn-primary "
                    disabled={
                      !values?.conditionType || !values?.conditionTypeRef
                    }
                    onClick={() => {
                      postData(
                        `https://automation.ibos.io/ship_to_party_id_vs_target`,
                        {
                          bearer_token: token,
                        },
                        () => {},
                        true
                      );
                    }}
                  >
                    Update from Google Sheet
                  </button>
                );
              }}
              // saveHandler={() => {
              //   handleSubmit();
              // }}
            >
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="conditionType"
                        options={[
                          {
                            value: 2,
                            label: 'Distribution Channel',
                          },
                        ]}
                        value={values?.conditionType}
                        label="Condition Type"
                        onChange={(valueOption) => {
                          setFieldValue('conditionType', valueOption);
                        }}
                        placeholder="Select Condition Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={viewType}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="conditionTypeRef"
                        options={channelList || []}
                        value={values?.conditionTypeRef}
                        label="Condition Type Ref"
                        onChange={(valueOption) => {
                          setFieldValue('conditionTypeRef', valueOption);
                        }}
                        placeholder="Select Condition Type Ref"
                        errors={errors}
                        touched={touched}
                        isDisabled={viewType || !values?.conditionType}
                      />
                    </div>
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <IButton
                      disabled={
                        !values?.conditionType || !values?.conditionTypeRef
                      }
                      onClick={() => {
                        window.open(
                          'https://docs.google.com/spreadsheets/d/1vYSyNgWPP0qvbEI9mufCr1pC6w9AUWXwd5HlqMUJH-M',
                          '_blank',
                          'noopener'
                        );
                      }}
                    >
                      <span>
                        <i
                          className={`fa pointer fa-eye `}
                          aria-hidden="true"
                        ></i>
                      </span>{' '}
                      View From Google Sheet
                    </IButton>
                  </div>
                </div>
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}

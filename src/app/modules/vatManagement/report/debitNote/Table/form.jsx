import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from './../../../../_helper/_inputField';
import { useSelector } from 'react-redux';
import GridData from './grid';
import GridDatatwo from '../../creditNote/Table/grid';
import { shallowEqual } from 'react-redux';

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from './../../../../../../_metronic/_partials/controls';

import { getDebitNoteReport_api } from '../helper';
import NewSelect from '../../../../_helper/_select';
import { getCreditNoteReport_api } from '../../creditNote/helper';

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  musok: '',
  type: { value: 1, label: 'Ganeral' },
};

export default function HeaderForm() {
  const [singleData, setSingleData] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Debit Note'}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push(
                        '/human-capital-management/humanresource/employee-info/add'
                      )
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Musok-6.9 : No</label>
                      <InputField
                        value={values?.musok}
                        name="musok"
                        placeholder="Musok-6.9 : No"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('musok', e.target.value);
                          setSingleData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={[
                          { value: 1, label: 'Ganeral' },
                          { value: 2, label: 'Adjustment' },
                        ]}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue('type', valueOption);
                          setSingleData([]);
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setSingleData([]);
                          if (values?.type?.value === 1) {
                            getDebitNoteReport_api(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.musok,
                              setSingleData,
                              setLoading
                            );
                          } else {
                            getCreditNoteReport_api(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.musok,
                              setSingleData,
                              setLoading
                            );
                          }
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {singleData?.objRow?.length > 0 &&
                    (values?.type?.value === 1 ? (
                      <GridData
                        singleData={singleData}
                        loading={loading}
                        title={'DEBIT NOTE'}
                        values={values}
                      />
                    ) : (
                      <GridDatatwo
                        singleData={singleData}
                        loading={loading}
                        title={'DEBIT NOTE'}
                        values={values}
                      />
                    ))}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';
import {
  getDistributionChannelDDL,
  saveTerritorySetup,
  editTerritorySetup,
} from '../helper';
// import { amber } from "@mui/material/colors";
import NewSelect from './../../../../../_helper/_select';
import InputField from './../../../../../_helper/_inputField';
import ICard from './../../../../../_helper/_card';

const validationSchema = Yup.object().shape({
  territoryName: Yup.string().required('Territory  Name is required'),
  channelDDL: Yup.object().required('Channel is required').nullable(),
});

function Form(props) {
  const {
    initData,
    profileData,
    selectedBusinessUnit,
    saveHandler,
    isEdit,
    selectedData,
    setIsShowModal,
    setLandingData,
    value,
  } = props;

  // const history = useHistory();

  const [channelDDL, setChannelDDL] = useState([]);

  useEffect(() => {
    getDistributionChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);
  return (
    <>
      <ICard title="Territory Setup">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              if (!isEdit) {
                resetForm(initData);
              }
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
            dirty,
          }) => (
            <>
              <FormikForm>
                <div className="form-card">
                  <div className="form-card-heading d-flex justify-content-end">
                    <div>
                      <button
                        onSubmit={handleSubmit}
                        type="submit"
                        className="btn btn-primary save-btn"
                        disabled={!(isValid && dirty)}
                        onClick={() => {
                          if (selectedData?.routeState === 'edit') {
                            const payload = {
                              intTerritoryId:
                                selectedData?.row[
                                  selectedData?.editlabelKey.split('n')[1]
                                ],
                              newTerritoryName: values?.territoryName,
                              newLevelId: selectedData?.header?.levelId,
                              existingAutoId: selectedData?.row?.autoId,
                              actionBy: profileData?.userId,
                            };

                            editTerritorySetup(payload, () => {
                              setLandingData(value);
                              setIsShowModal(false);
                            });
                          } else {
                            const payload = {
                              newTerritoryName: values?.territoryName,
                              accountId: profileData?.accountId,
                              businessUnitId: selectedBusinessUnit?.value,
                              newTerritoryTypeId:
                                selectedData?.header?.territoryTypeId,
                              newTerritoryTypeName:
                                selectedData?.header?.territoryTypeName,
                              newChannelId: values?.channelDDL.value,
                              newChannelName: values?.channelDDL.label,
                              newLevelId: selectedData?.header?.levelId,
                              newLevelCode:
                                selectedData?.header?.territoryTypeCode,
                              existingAutoId: selectedData?.row?.autoId,
                              actionBy: profileData?.userId,
                            };

                            saveTerritorySetup(payload, () => {
                              setLandingData(value);
                              setIsShowModal(false);
                            });
                          }
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="form-card-content">
                    <div className="row global-form">
                      <div className="col-lg-3">
                        <NewSelect
                          name="channelDDL"
                          options={channelDDL}
                          value={values?.channelDDL}
                          label="Distribution Channel*"
                          onChange={(valueOption) => {
                            setFieldValue('channelDDL', valueOption);
                          }}
                          placeholder="Distribute Channel"
                          errors={errors}
                          touched={touched}
                          isDisabled={selectedData?.row?.channelId !== 0}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>{selectedData?.header?.territoryTypeName}</label>
                        <InputField
                          value={values?.territoryName}
                          name="territoryName"
                          placeholder="Territory Name"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
}

export default Form;

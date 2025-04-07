import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import IConfirmModal from '../../../../_helper/_confirmModal';
import ICustomCard from '../../../../_helper/_customCard';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import IViewModal from '../../../../_helper/_viewModal';
import SubmittedRow from '../../renewalRegistration/view/viewModal';
import { renewalRegistrationApproval } from '../helper';
import useAxiosGet from './../../../../_helper/customHooks/useAxiosGet';
import RenewalApprovalTable from './renewalApprovalTable';

const validationSchema = Yup.object().shape({});

const initData = {
  code: '',
};
export default function RenewalBillForm() {
  const [loading, setLoading] = useState(false);
  const [gridData, getGridData, getLoading, setGridData] = useAxiosGet();
  const [codeDDL, getCodeDDL] = useAxiosGet();
  const [pageNo] = React.useState(0);
  const [pageSize] = React.useState(15);
  const [isShowModal, setIsShowModal] = useState(false);
  const [code, setCode] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getCodeDDL(
      `/asset/LandingView/GetRenewalRegistrationList?typeId=3&UnitId=${selectedBusinessUnit?.value}&PlantId=0&RenewalServiceId=0&AssetId=0&statusId=4&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  }, []);

  const confirmToApprove = (values) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: '',
      yesAlertFunc: async () => {
        const rowList = gridData
          ?.filter((item) => item?.checked)
          ?.map((item) => {
            return {
              renewalCode: item?.renewalCode,
              actionBy: profileData?.userId,
            };
          });
        renewalRegistrationApproval(rowList, setLoading, () => {
          const renewalCode = values?.code?.value
            ? `&renewalCode=${values?.code?.value || null}`
            : '';
          getGridData(
            `/asset/LandingView/GetRenewalRegistrationList?typeId=2&AccountId=${
              profileData?.accountId
            }&UnitId=${
              selectedBusinessUnit?.value
            }&PlantId=${0}&RenewalServiceId=${0}&AssetId=${0}&statusId=${4}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${renewalCode}`,
            (data) => {
              const modifyingData = data.map((item) => ({
                ...item,
                checked: false,
              }));
              setGridData(modifyingData);
            }
          );
        });
      },
      noAlertFunc: () => {
        '';
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <ICustomCard title="Renewal Bill Approval">
        {(loading || getLoading) && <Loading />}
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            errors,
            touched,
            setFieldValue,
            isValid,
            values,
            resetForm,
            handleSubmit,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="code"
                        options={[{ value: null, label: 'All' }, ...codeDDL]}
                        value={values?.code}
                        label="Code"
                        onChange={(valueOption) => {
                          setFieldValue('code', valueOption);
                          setGridData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div
                      style={{ marginTop: '18px' }}
                      className="col-lg-4 col-md-4"
                    >
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        disabled={!values?.code}
                        onClick={() => {
                          const renewalCode = values?.code?.value
                            ? `&renewalCode=${values?.code?.value || null}`
                            : '';
                          getGridData(
                            `/asset/LandingView/GetRenewalRegistrationList?typeId=2&AccountId=${
                              profileData?.accountId
                            }&UnitId=${
                              selectedBusinessUnit?.value
                            }&PlantId=${0}&RenewalServiceId=${0}&AssetId=${0}&statusId=${4}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${renewalCode}`,
                            (data) => {
                              const modifyingData = data.map((item) => ({
                                ...item,
                                checked: false,
                              }));
                              setGridData(modifyingData);
                            }
                          );
                        }}
                      >
                        Show
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => confirmToApprove(values)}
                        disabled={
                          !values?.code ||
                          !gridData?.some((item) => item?.checked)
                        }
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
              <RenewalApprovalTable
                gridData={gridData}
                setGridData={setGridData}
                setCode={setCode}
                setIsShowModal={setIsShowModal}
              />
            </>
          )}
        </Formik>
        <IViewModal
          title="Renewal Registration View"
          show={isShowModal}
          onHide={() => {
            setIsShowModal(false);
            setCode({});
          }}
        >
          <SubmittedRow code={code} />
        </IViewModal>
      </ICustomCard>
    </>
  );
}

import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { imarineBaseUrl } from '../../../../App';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

const initData = {};
export default function VesselNominationAccept() {
  const [gridData, getGridData, loading] = useAxiosGet();

  useEffect(() => {
    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/GetVesselNominationAcceptancesLanding`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Vessel Nomination Acceptance"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Vessel Nomination Code</th>
                        <th>Remarks</th>
                        <th>Acceptance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>

                          <td className="text-center">
                            {item?.strVesselNominationCode}
                          </td>
                          <td className="text-center">{item?.strRemarks}</td>
                          <td className="text-center">
                            {item?.isVesselNominationAccept ? 'Yes' : 'No'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

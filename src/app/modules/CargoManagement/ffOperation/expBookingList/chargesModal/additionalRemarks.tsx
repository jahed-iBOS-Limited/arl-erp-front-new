import { Formik } from 'formik';
import InputField from '../../../../_helper/_inputField';

type AdditionalRemarksType = {
  additionalRemarksHandleChange: (value: string) => void;
  additionalRemarksValue: string;
};
const AdditionalRemarks = ({
  additionalRemarksHandleChange,
  additionalRemarksValue,
}: AdditionalRemarksType) => {
  const additionalRemarks = additionalRemarksValue
    .replace(/Other Charge/i, '')
    .trim();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        additionalRemarks: additionalRemarks,
      }}
      onSubmit={() => {}}
    >
      {({ setFieldValue, values, handleSubmit }) => (
        <div>
          <form className="form form-label-right" onSubmit={handleSubmit}>
            <div className="form-group row global-form">
              <div className="col-lg-12">
                <InputField
                  value={values?.additionalRemarks}
                  label="Additional Remarks"
                  name="additionalRemarks"
                  type="text"
                  onChange={(e) => {
                    setFieldValue('additionalRemarks', e.target.value);
                    additionalRemarksHandleChange(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default AdditionalRemarks;

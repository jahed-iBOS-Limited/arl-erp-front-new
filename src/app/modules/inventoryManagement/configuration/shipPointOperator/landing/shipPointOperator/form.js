import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import NewSelect from '../../../../../_helper/_select';

const ShipPointOperatorForm = ({ values, setFieldValue }) => {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  return (
    <>
            {/* {(loading || loader) && <Loading />} */}
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={[
                      { value: 0, label: "All Business Unit" },
                      { value: buId, label: "Selected Business Unit" },
                    ]}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    //   getData({ ...values, businessUnit: valueOption });
                    }}
                  />
                </div>
            
          </>
  )
}

export default ShipPointOperatorForm
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import { downloadDocumentaryCredit } from "../helper";

const ExportDocumentaryCredit = ({ setShow }) => {
  const [bankDDL, getBankDDL] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBankDDL(`/imp/ImportCommonDDL/GetBankListForLCBusinessPartnerDDL`);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => {}}>
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <Card>
              <CardHeader title="Download LC Application"></CardHeader>
              <CardBody>
                <div className="row global-form">
                  <div className="col-lg-12 pt-2">
                    <NewSelect
                      options={bankDDL || []}
                      value={values?.bank}
                      label="Bank Name"
                      placeholder="Bank name"
                      name="bank"
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <IButton
                    className="btn-success btn-sm"
                    onClick={() => {
                      setLoading(true);
                      downloadDocumentaryCredit(setLoading);
                    }}
                    disabled={!values?.bank}
                  >
                    Download
                  </IButton>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default ExportDocumentaryCredit;

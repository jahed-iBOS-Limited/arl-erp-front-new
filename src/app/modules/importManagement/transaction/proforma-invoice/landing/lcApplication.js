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
import IViewModal from "../../../../_helper/_viewModal";
import LCApplication from "./LCApplication/index";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  bank: "",
  branch: "",
  type: "",
};

const LCApplicationExport = ({ obj }) => {
  const { singleItem } = obj;
  const [bankDDL, getBankDDL] = useAxiosGet();
  const [branchDDL, getBranchDDL, loader, setBranchDDL] = useAxiosGet();

  const [show, setShow] = useState(false);
  const [lcInfo, getLCInfo, loading] = useAxiosPost();

  const {
    selectedBusinessUnit: { label: buName },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankDDL(`/imp/ImportCommonDDL/GetBankListForLCBusinessPartnerDDL`);
  }, []);

  return (
    <>
      {(loader || loading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <Card>
              <CardHeader title="Download LC Application"></CardHeader>
              <CardBody>
                <div className="row global-form">
                  <div className="col-lg-3 pt-2">
                    <NewSelect
                      options={bankDDL || []}
                      value={values?.bank}
                      label="Bank Name"
                      placeholder="Bank name"
                      name="bank"
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption);
                        getBranchDDL(
                          `/partner/BusinessPartnerBankInfo/GetBranchDDLInfo?BankId=${valueOption?.value}`,
                          (resData) => {
                            const modifiedData = resData?.map((item) => {
                              return {
                                ...item,
                                value: item?.bankBranchId,
                                label: item?.bankBranchName,
                              };
                            });
                            setBranchDDL(modifiedData);
                          }
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 pt-2">
                    <NewSelect
                      options={branchDDL || []}
                      value={values?.branch}
                      label="Branch Name"
                      placeholder="Branch name"
                      name="branch"
                      onChange={(valueOption) => {
                        setFieldValue("branch", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 pt-2">
                    <NewSelect
                      options={[
                        { value: 1, label: "With Dollar Arrange" },
                        { value: 2, label: "Without Dollar Arrange" },
                      ]}
                      value={values?.type}
                      label="Type"
                      placeholder="Type"
                      name="type"
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <IButton
                    className="btn-success btn-sm"
                    onClick={() => {
                      getLCInfo(
                        `https://automation.ibos.io/lc_issuance`,
                        {
                          text: singleItem?.pdfTextdata || '',
                        },
                        () => {
                          setShow(true);
                        },
                        true
                      );
                    }}
                    disabled={!values?.bank || !values?.branch}
                  >
                    Preview
                  </IButton>
                  <IViewModal show={show} onHide={() => setShow(false)}>
                    <LCApplication obj={{ values, lcInfo, buName }} />
                  </IViewModal>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default LCApplicationExport;

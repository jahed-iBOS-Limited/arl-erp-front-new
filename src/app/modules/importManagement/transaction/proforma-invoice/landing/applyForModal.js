/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ApplyForLC from "./applyForLC";
import { GetProformaInvoiceById } from "../helper";

const initData = {
  bank: "",
  branch: "",
  applyType: "",
};

const ApplyForModal = ({ obj }) => {
  const { singleItem } = obj;
  const [bankDDL, getBankDDL] = useAxiosGet();
  const [branchDDL, getBranchDDL, loader, setBranchDDL] = useAxiosGet();
  const [singleData, setSingleData] = useState("");
  const [piLoader, setPILoader] = useState(false);

  const [show, setShow] = useState(false);

  const {
    selectedBusinessUnit: { label: buName },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankDDL(`/imp/ImportCommonDDL/GetBankListForLCBusinessPartnerDDL`);
  }, []);

  useEffect(() => {
    if (singleItem?.proformaInvoiceId) {
      GetProformaInvoiceById(
        singleItem?.proformaInvoiceId,
        setSingleData,
        setPILoader
      );
    }
  }, [singleItem]);

  return (
    <>
      {(loader || piLoader) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <Card>
              <CardHeader title="Apply for LC"></CardHeader>
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
                  {/* Apply Type DDL  */}
                  <div className="col-lg-3 pt-2">
                    <NewSelect
                      options={[
                        {
                          value: 1,
                          label: "Prayer for issuance of LC",
                        },
                        {
                          value: 2,
                          label: "Request for original documents",
                        },
                        {
                          value: 3,
                          label: "Request for Issuance",
                        },
                      ]}
                      value={values?.applyType}
                      label="Apply Type"
                      placeholder="Apply Type"
                      name="applyType"
                      onChange={(valueOption) => {
                        setFieldValue("applyType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <IButton
                    className="btn-success btn-sm"
                    onClick={() => {
                      setShow(true);
                    }}
                    disabled={
                      !values?.bank || !values?.branch || !values?.applyType
                    }
                  >
                    Preview
                  </IButton>
                  <IViewModal show={show} onHide={() => setShow(false)}>
                    <ApplyForLC
                      obj={{
                        values,
                        buName,
                        singleData: {
                          ...singleItem,
                          ...singleData,
                        },
                      }}
                    />
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

export default ApplyForModal;

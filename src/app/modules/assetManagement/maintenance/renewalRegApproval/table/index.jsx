import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import SubmittedRow from "../../renewalRegistration/view/viewModal";
import { renewalRegistrationApproval } from "../helper";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";

const validationSchema = Yup.object().shape({});

const initData = {
  code: "",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmToApprove = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "",
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
            : "";
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
        "";
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
                        options={[{ value: null, label: "All" }, ...codeDDL]}
                        value={values?.code}
                        label="Code"
                        onChange={(valueOption) => {
                          setFieldValue("code", valueOption);
                          setGridData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div
                      style={{ marginTop: "18px" }}
                      className="col-lg-4 col-md-4"
                    >
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        disabled={!values?.code}
                        onClick={() => {
                          const renewalCode = values?.code?.value
                            ? `&renewalCode=${values?.code?.value || null}`
                            : "";
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
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table mt-0">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>
                        <input
                          disabled={!gridData?.length}
                          type="checkbox"
                          checked={
                            gridData?.length > 0
                              ? gridData?.every((item) => item?.checked)
                              : false
                          }
                          onChange={(e) => {
                            setGridData(
                              gridData?.map((item) => {
                                return {
                                  ...item,
                                  checked: e?.target?.checked,
                                };
                              })
                            );
                          }}
                        />
                      </th>
                      <th>Sl</th>
                      <th>Code</th>
                      <th>Total Amount</th>
                      <th className="text-right pr-1" style={{ width: 80 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.length
                      ? gridData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-center align-middle">
                                <input
                                  type="checkbox"
                                  checked={item?.checked}
                                  onChange={(e) => {
                                    item["checked"] = e.target.checked;
                                    setGridData([...gridData]);
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                {index + 1}
                              </td>
                              <td className="text-center">
                                {item?.renewalCode}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.totalAmount)}
                              </td>
                              <td className="text-center">
                                <div className="d-flex align-items-center justify-content-center">
                                  <span className="mx-1">
                                    <IView
                                      clickHandler={(e) => {
                                        setCode({
                                          renewalCode: item.renewalCode,
                                          statusTypeId: item.statusTypeId,
                                        });
                                        setIsShowModal(true);
                                      }}
                                    />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
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

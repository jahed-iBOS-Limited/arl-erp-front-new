import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import SubmittedRow from "../../../../../assetManagement/maintenance/renewalRegistration/view/viewModal";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../../../_helper/_confirmModal";
import IForm from "../../../../../_helper/_form";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import IView from "../../../../../_helper/_helperIcons/_view";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IViewModal from "../../../../../_helper/_viewModal";
const validationSchema = Yup.object().shape({});
const initData = {
  employee: "",
};
export default function RenewalBillForm({ headerData }) {
  const [loading] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveHandler, saveLoading] = useAxiosPost();
  const [employeeDDL, getEmployeeDDL] = useAxiosGet();
  const [gridData, getGridData, getLoading, setGridData] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [code, setCode] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getEmployeeDDL(
      `/asset/LandingView/GetRenewalRegistrationList?typeId=99&dteFrom=${_todayDate()}&dteTo=${_todayDate()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const total = gridData
      ?.filter((item) => item.checked)
      .reduce((acc, crr) => acc + crr?.totalAmount, 0);
    setTotalAmount(total || 0);
  }, [gridData]);

  const getLandingData = () => {
    getGridData(
      `/asset/LandingView/GetRenewalRegistrationList?typeId=2&AccountId=${
        profileData?.accountId
      }&UnitId=${
        selectedBusinessUnit?.value
      }&PlantId=${0}&RenewalServiceId=${0}&AssetId=${0}&statusId=${1}&PageNo=${0}&PageSize=${15}&viewOrder=desc`,
      (data) => {
        const modifyingData = data.map((item) => ({
          ...item,
          checked: false,
        }));
        setGridData(modifyingData);
      }
    );
  };

  useEffect(() => {
    getLandingData();
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
              employeeId: values?.employee?.value,
              renewalCode: item?.renewalCode,
              naration: "",
              plantId: headerData?.plant?.value || 0,
              sbuId: headerData?.sbu?.value || 0,
              netAmount: item?.approvedAmount || 0,
              actionBy: profileData?.userId,
            };
          });

        saveHandler(
          `/fino/BillRegister/RenewalBillRegister`,
          rowList,
          () => {
            getLandingData();
          },
          true
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <IForm
        title="Renewal Bill"
        getProps={setObjprops}
        isDisabled={loading}
        isHiddenSave
        isHiddenReset
      >
        {(loading || saveLoading || getLoading) && <Loading />}
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
                    <div className="col-lg-2">
                      <NewSelect
                        name="employee"
                        options={employeeDDL || []}
                        value={values?.employee}
                        label="Employee"
                        onChange={(valueOption) => {
                          setFieldValue("employee", valueOption);
                        }}
                      />
                    </div>

                    <div
                      style={{ marginTop: "18px" }}
                      className="col-lg-4 col-md-4"
                    >
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          confirmToApprove(values);
                        }}
                        disabled={
                          !values?.employee ||
                          !gridData?.some((item) => item?.checked)
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
              <div className="d-flex align-items-center justify-content-end">
                <span className="mr-2 font-weight-bold">
                  Total Amount: {totalAmount}
                </span>
              </div>
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

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </>
          )}
        </Formik>
      </IForm>

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
    </>
  );
}

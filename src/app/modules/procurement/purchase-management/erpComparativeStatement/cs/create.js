/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { Form, Formik } from "formik";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import Loading from "./../../../../_helper/_loading";
import { PlusCircleFilled } from "@ant-design/icons";
import {
  AddCircleOutlineSharp,
  CloseRounded,
  CloseSharp,
  Email,
  Phone,
} from "@material-ui/icons";
import { Button } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import PlaceModal from "./placeModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { eProcurementBaseURL } from "../../../../../App";
import { toast } from "react-toastify";
import Chips from "../../../../_helper/chips/Chips";
import CardBody from "./cardBody";

const initData = {
  id: undefined,
  organizationName: "",
};

export default function PurchaseOrgAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [
    suppilerStatement,
    getSuppilerStatement,
    suppilerStatementLoading,
    setSuppilerStatement,
  ] = useAxiosGet();
  const [isModalShowObj, setIsModalShowObj] = React.useState({
    isModalOpen: false,
    firstPlaceModal: false,
    secondPlaceModal: false,
  });
  const [rowDtos, setRowDtos] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get emplist ddl from store
  const businessUnitDDL = useSelector((state) => {
    return state?.commonDDL?.buDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.purchaseOrg?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();

  //Dispatch Get emplist action for get emplist ddl

  useEffect(() => {
    getSuppilerStatement(
      `${eProcurementBaseURL}/ComparativeStatement/GetSupplierStatementForCS?requestForQuotationId=${592}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {};

  const getRank = (businessPartnerId) => {
    if (suppilerStatement?.data) {
      const rank = suppilerStatement?.data?.find(
        (item) => item?.businessPartnerId === businessPartnerId
      )?.rank;
      return rank;
    }
  };

  const getbusinessPartnerName = (businessPartnerId) => {
    if (suppilerStatement?.data) {
      const name = suppilerStatement?.data?.find(
        (item) => item?.businessPartnerId === businessPartnerId
      )?.businessPartnerName;
      return name;
    }
  };

  const [objProps, setObjprops] = useState({});
  console.log(suppilerStatement, "fast page suppilerStatement");
  return (
    <IForm getProps={setObjprops} isDisabled={isDisabled} title={"Create"}>
      {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="csType"
                      options={[
                        { value: 0, label: "Item Wise Create" },
                        { value: 1, label: "Supplier Wise Create" },
                      ]}
                      value={values?.csType}
                      label="CS Type"
                      onChange={(valueOption) => {
                        setFieldValue("csType", valueOption);
                      }}
                      placeholder="CS Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              {values?.csType?.value === 1 && (
                <div className="row">
                  <div className="col-lg-3">
                    <div
                      className="card"
                      style={{
                        position: "relative",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      {suppilerStatement?.firstSelectedId &&
                      suppilerStatement?.firstSelectedId !== 0 ? (
                        <button
                          onClick={() => {
                            if (
                              suppilerStatement?.secondSelectedId &&
                              suppilerStatement?.secondSelectedId !== 0
                            ) {
                              setSuppilerStatement((prev) => ({
                                ...prev,
                                firstSelectedId:
                                  suppilerStatement?.secondSelectedId,
                                firstSelectedItem:
                                  suppilerStatement?.secondSelectedItem,
                                secondSelectedId: 0,
                                secondSelectedItem: {},
                              }));
                            } else {
                              setSuppilerStatement((prev) => ({
                                ...prev,
                                firstSelectedId: 0,
                                firstSelectedItem: {},
                              }));
                            }
                          }}
                          className="btn btn-sm btn-outline-danger"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            border: "none",
                            padding: "0",
                            cursor: "pointer",
                          }}
                        >
                          <CloseSharp />
                        </button>
                      ) : (
                        <></>
                      )}

                      <CardBody
                        name="1st Place"
                        id={suppilerStatement?.firstSelectedId}
                        item={suppilerStatement?.firstSelectedItem}
                        CB={() => {
                          setIsModalShowObj({
                            ...isModalShowObj,
                            isModalOpen: true,
                            firstPlaceModal: true,
                            secondPlaceModal: false,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div
                      className="card"
                      style={{
                        position: "relative",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      {suppilerStatement?.secondSelectedId &&
                      suppilerStatement?.secondSelectedId !== 0 ? (
                        <button
                          onClick={() => {
                            setSuppilerStatement((prev) => ({
                              ...prev,
                              secondSelectedId: 0,
                              secondSelectedItem: {},
                            }));
                          }}
                          className="btn btn-sm btn-outline-danger"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            border: "none",
                            padding: "0",
                            cursor: "pointer",
                          }}
                        >
                          <CloseSharp />
                        </button>
                      ) : (
                        <></>
                      )}
                      <CardBody
                        name="2nd Place"
                        id={suppilerStatement?.secondSelectedId}
                        item={suppilerStatement?.secondSelectedItem}
                        CB={() => {
                          if (
                            suppilerStatement?.firstSelectedId === 0 ||
                            !suppilerStatement?.firstSelectedId
                          ) {
                            toast.warning(
                              "Please select 1st place supplier first"
                            );
                            return;
                          }
                          setIsModalShowObj({
                            ...isModalShowObj,
                            isModalOpen: true,
                            firstPlaceModal: false,
                            secondPlaceModal: true,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>

      {isModalShowObj?.isModalOpen && (
        <>
          <IViewModal
            title={
              isModalShowObj?.firstPlaceModal
                ? "Select 1st Place Supplier"
                : "Select 2nd Place Supplier"
            }
            show={isModalShowObj?.isModalOpen}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isModalOpen: false,
              });
            }}
          >
            <PlaceModal
              uomDDL={[]}
              modalType={isModalShowObj}
              dataList={suppilerStatement}
              CB={(selectedId, item1st, item2nd) => {
                // commonLandingApi();
                if (isModalShowObj?.firstPlaceModal) {
                  setSuppilerStatement({
                    ...suppilerStatement,
                    firstSelectedId: selectedId || 0,
                    firstSelectedItem: item1st || {},
                  });
                } else {
                  setSuppilerStatement({
                    ...suppilerStatement,
                    secondSelectedId: selectedId || 0,
                    secondSelectedItem: item2nd || {},
                  });
                }
                setIsModalShowObj({
                  ...isModalShowObj,
                  isModalOpen: false,
                });
              }}
            />
          </IViewModal>
        </>
      )}
    </IForm>
  );
}

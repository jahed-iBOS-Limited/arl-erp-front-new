/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { IInput } from "../../../../_helper/_input";
import CostEntry from "./costEntry";
import { set } from "lodash";
import SupplyWiseTable from "./supplyWiseTable";

const initData = {
  id: undefined,
  organizationName: "",
};

export default function CreateCs({
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
  const [itemDDL, getItemDDL, itemDDLLoading, setItemDDL] = useAxiosGet();
  const [isCostEntryModal, setIsCostEntryModal] = useState(false);
  const [
    SupplierDDL,
    getSupplierDDL,
    SupplierDDLLoading,
    setSupplierDDL,
  ] = useAxiosGet();
  const [isModalShowObj, setIsModalShowObj] = React.useState({
    isModalOpen: false,
    firstPlaceModal: false,
    secondPlaceModal: false,
  });
  const [
    placePartnerList,
    getPlacePartnerList,
    placePartnerListLoading,
    setPlacePartnerList,
  ] = useAxiosGet();

  const [costEntryList, setCostEntryList] = useState([]);
  const location = useLocation();

  const { rfqDetail } = location?.state;
  console.log(rfqDetail, "rfqDetail");
  const [rowData, setRowData] = useState([]);
  const [, saveData] = useAxiosPost();

  const [rowDtos, setRowDtos] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

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
      `${eProcurementBaseURL}/ComparativeStatement/GetSupplierStatementForCS?requestForQuotationId=${rfqDetail?.requestForQuotationId}`
    );

    getItemDDL(
      `${eProcurementBaseURL}/ComparativeStatement/GetItemWiseStatementForCS?requestForQuotationId=${rfqDetail?.requestForQuotationId}`,
      (data) => {
        let list = [];
        // eslint-disable-next-line array-callback-return, no-unused-expressions
        data?.map((item) => {
          list.push({
            value: item?.rowId,
            label: item?.itemName,
            rfqquantity: item?.rfqquantity,
            itemId: item?.itemId,
          });
        });
        setItemDDL(list);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPlacePartnerListCsWise();
  }, [
    suppilerStatement?.firstSelectedItem,
    suppilerStatement?.secondSelectedItem,
  ]);

  const getPlacePartnerListCsWise = () => {
    getPlacePartnerList(
      `${eProcurementBaseURL}/ComparativeStatement/GetSupplierWiseCS?requestForQuotationId=${
        rfqDetail?.requestForQuotationId
      }&firstPlacePartnerRfqId=${suppilerStatement?.firstSelectedItem
        ?.partnerRfqId || 0}&secondPlacePartnerRfqId=${suppilerStatement
        ?.secondSelectedItem?.partnerRfqId || 0}`
    );
  };

  const handleExpandClick = (id) => {
    // Toggle expand/collapse
    setExpandedRow(expandedRow === id ? null : id);
  };

  const saveHandler = async (values, cb) => {
    console.log(values, "values");
    console.log("rowData", rowData);
    // Create item list array from rowData
    let itemList =
      rowData?.map((data) => ({
        rowId: data?.rowIdSupplier || 0, // row id from supply
        partnerRfqId: data?.partnerRfqId,
        itemId: data?.itemId,
        takenQuantity: data?.takenQuantity,
        approvalNotes: data?.note,
        rate: data?.supplierRate || 0,
        portList: [],
      })) || [];
    let payload = itemList;
    console.log(payload, "payload");
    // saveData(
    //   `/ComparativeStatement/CreateAndUpdateItemWiseCS`,
    //   payload,
    //   cb,
    //   true
    // );
  };

  const [objProps, setObjprops] = useState({});
  console.log(suppilerStatement, "fast page suppilerStatement");
  console.log(placePartnerList, "fast page placePartnerList");

  const addNewSupplierInfos = (values) => {
    // Adjust foundData check to include port value if required
    let foundData = rowData?.filter((item) => {
      const isSameItemSupplier =
        item?.itemWiseCode === values?.itemWise?.value &&
        item?.supplierCode === values?.supplier?.value;

      // Add port comparison for "Foreign Procurement"
      if (rfqDetail?.purchaseOrganizationName === "Foreign Procurement") {
        return isSameItemSupplier && item?.port?.value === values?.port?.value;
      }

      return isSameItemSupplier;
    });

    const totalTakenQuantity = rowData.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.takenQuantity || 0);
    }, 0);

    if (totalTakenQuantity >= values?.itemWise?.rfqquantity) {
      toast.warning("Total taken quantity can't be greater than RFQ quantity", {
        toastId: "Fae22",
      });
      return;
    }

    if (foundData?.length > 0) {
      toast.warning("Already exist", { toastId: "Fae" });
    } else {
      let payload = {
        itemWise: values?.itemWise?.label,
        itemWiseCode: values?.itemWise?.value,
        supplierRate: values?.supplierRate,
        supplier: values?.supplier?.label,
        supplierCode: values?.supplier?.value,
        takenQuantity: values?.takenQuantity,
        rowIdSupplier: values?.supplier?.rowIdSupplier,
        partnerRfqId: values?.supplier?.partnerRfqId,
        itemId: values?.itemWise?.itemId,
        note: values?.note,
      };

      // Add port field if Foreign Procurement and port value exists
      if (
        rfqDetail?.purchaseOrganizationName === "Foreign Procurement" &&
        values?.port?.value
      ) {
        payload.port = {
          value: values.port.value,
          label: values.port.label,
        };
      }

      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (item, supplier) => {
    console.log(item, supplier, "item, supplier");
    console.log(rowData, "rowData");

    // Filter out only the rows that match both itemWiseCode and supplierCode
    const filterData = rowData.filter(
      (items) =>
        !(items?.itemWiseCode === item && items?.supplierCode === supplier)
    );

    setRowData(filterData);
  };

  const rowDataHandler = (field, value, index) => {
    console.log(field, value, index, "field, value, index");
    const copyRowDto = [...placePartnerList];
    copyRowDto[index][field] = value;
    setPlacePartnerList(copyRowDto);
  };

  console.log(placePartnerList, "placePartnerList");

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
                  {values?.csType?.value === 0 && (
                    <div className="col-lg-3">
                      <InputField
                        label="Note"
                        value={values?.note}
                        name="note"
                        onChange={(e) => {
                          setFieldValue("note", e.target.value);
                        }}
                        placeholder="Note"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {values?.csType?.value === 0 && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemWise"
                        options={itemDDL || []}
                        value={values?.itemWise}
                        label="Item Wise List"
                        onChange={(valueOption) => {
                          setFieldValue("itemWise", valueOption);
                          getSupplierDDL(
                            `${eProcurementBaseURL}/ComparativeStatement/GetItemWiseStatementDetails?requestForQuotationId=${
                              rfqDetail?.requestForQuotationId
                            }&itemId=${valueOption?.value || 0}`,
                            (res) => {
                              const modData = res?.map((item) => {
                                return {
                                  ...item,
                                  value: item?.businessPartnerId,
                                  label: item?.businessPartnerName,
                                  rowIdSupplier: item?.rowId,
                                };
                              });
                              setSupplierDDL(modData);
                            }
                          );
                        }}
                        placeholder="Item Wise"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {values?.csType?.value === 0 && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="supplier"
                        options={SupplierDDL || []}
                        value={values?.supplier}
                        label="Supplier"
                        onChange={(valueOption) => {
                          setFieldValue("supplier", valueOption);
                        }}
                        placeholder="Supplier"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {values?.csType?.value === 0 &&
                    rfqDetail?.purchaseOrganizationName ===
                      "Foreign Procurement" && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="port"
                          options={
                            SupplierDDL.find(
                              (item) =>
                                item?.businessPartnerId ===
                                values?.supplier?.value
                            )?.portList?.map((port) => ({
                              value: port?.portId,
                              label: port?.portName,
                              ...port, // keep the original properties as well
                            })) || []
                          }
                          value={values?.port}
                          label="Port"
                          onChange={(valueOption) => {
                            setFieldValue("port", valueOption);
                          }}
                          placeholder="Port"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                  {values?.csType?.value === 0 && (
                    <div className="col-lg-3">
                      <label>Taken Quantity</label>
                      <InputField
                        value={values?.takenQuantity}
                        name="takenQuantity"
                        onChange={(e) => {
                          setFieldValue("takenQuantity", e.target.value);
                        }}
                        placeholder="takenQuantity"
                        type="number"
                      />
                    </div>
                  )}
                  {values?.csType?.value === 0 && (
                    <div className="col-lg-3">
                      <label>Supplier Rate</label>
                      <InputField
                        value={values?.supplierRate}
                        name="supplierRate"
                        onChange={(e) => {
                          setFieldValue("supplierRate", e.target.value);
                        }}
                        placeholder="supplierRate"
                        type="number"
                      />
                    </div>
                  )}

                  {values?.csType?.value === 0 && (
                    <div className="col-lg-3 pt-6">
                      <button
                        type="button"
                        disabled={!values?.supplierRate}
                        className="btn btn-primary"
                        onClick={() => {
                          addNewSupplierInfos(values);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {values?.csType?.value === 0 && (
                <div className="table-responsive pt-5">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    {rowData?.length > 0 && (
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item</th>
                          <th>Supplier</th>
                          {rfqDetail?.purchaseOrganizationName ===
                            "Foreign Procurement" && <th>Port</th>}
                          <th>Taken Quantity</th>
                          <th>Supplier Rate</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "15px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>
                                <span className="pl-2 text-center">
                                  {item?.itemWise}
                                </span>
                              </td>
                              <td>
                                <span className="pl-2 text-center">
                                  {item?.supplier}
                                </span>
                              </td>
                              {rfqDetail?.purchaseOrganizationName ===
                                "Foreign Procurement" && (
                                <td>
                                  <span className="pl-2 text-center">
                                    {item?.port?.label}
                                  </span>
                                </td>
                              )}
                              <td>
                                <span className="pl-2 text-center">
                                  {item?.takenQuantity}
                                </span>
                              </td>
                              <td>
                                <span className="pl-2 text-center">
                                  {item?.supplierRate}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleDelete(
                                      item?.itemWiseCode,
                                      item?.supplierCode
                                    );
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {values?.csType?.value === 1 && (
                <div className="row">
                  <div className="col-lg-12">
                    <p>
                      Please Select two suppliers for confirmation. Your Choices
                      will go an approval process.
                    </p>
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
                  {rfqDetail?.purchaseOrganizationName ===
                    "Foreign Procurement" && (
                    <div className="col-lg-3">
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => setIsCostEntryModal(true)}
                      >
                        Cost Entry
                      </button>
                    </div>
                  )}
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
              {values?.csType?.value === 1 && (
                <SupplyWiseTable
                  type={rfqDetail?.purchaseOrganizationName}
                  data={placePartnerList}
                  rowDataHandler={rowDataHandler}
                />
              )}
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
              // getFirstPlacePartnerList();
            }}
          >
            <PlaceModal
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

      {isCostEntryModal && (
        <>
          <IViewModal
            title={"Create Cost Entry"}
            show={isCostEntryModal}
            onHide={() => {
              setIsCostEntryModal(false);
              // getFirstPlacePartnerList();
            }}
          >
            <CostEntry
              costEntryList={costEntryList}
              dataList={suppilerStatement}
              CB={(list) => {
                setCostEntryList(list);
                setIsCostEntryModal(false);
              }}
            />
          </IViewModal>
        </>
      )}
    </IForm>
  );
}

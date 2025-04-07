import { CloseSharp } from '@mui/icons-material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { eProcurementBaseURL } from '../../../../../../App';
import IForm from '../../../../_helper/_form';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import Loading from './../../../../_helper/_loading';
import CardBody from './cardBody';
import CostEntry from './costEntry';
import { getCostEntryPayload, saveHandlerPayload } from './helper';
import PlaceModal from './placeModal';
import SupplyWiseTable from './supplyWiseTable';

const initData = {
  id: undefined,
  organizationName: '',
};

export default function CreateCs({
  match: {
    params: { id },
  },
}) {
  const [isDisabled] = useState(false);
  const [
    suppilerStatement,
    getSuppilerStatement,
    suppilerStatementLoading,
    setSuppilerStatement,
  ] = useAxiosGet();
  const [itemDDL, getItemDDL, itemDDLLoading, setItemDDL] = useAxiosGet();
  const [isCostEntryModal, setIsCostEntryModal] = useState(false);
  const [SupplierDDL, getSupplierDDL, SupplierDDLLoading, setSupplierDDL] =
    useAxiosGet();
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
  const history = useHistory();

  const { rfqDetail, isView } = location?.state;
  console.log(rfqDetail, 'rfqDetail');
  const [rowData, setRowData] = useState([]);
  const [, saveData, mainDataLoading] = useAxiosPost();
  const [, saveCostEntry, costEntryLoading] = useAxiosPost();

  //Dispatch Get emplist action for get emplist ddl

  useEffect(() => {
    if (!isView) {
      getSuppilerStatement(
        `${eProcurementBaseURL}/ComparativeStatement/GetSupplierStatementForCS?requestForQuotationId=${rfqDetail?.requestForQuotationId}`
      );

      getItemDDL(
        `${eProcurementBaseURL}/ComparativeStatement/GetItemWiseStatementForCS?requestForQuotationId=${rfqDetail?.requestForQuotationId}`,
        (data) => {
          let list = [];
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
    }

    if (isView) {
      getSuppilerStatement(
        `${eProcurementBaseURL}/ComparativeStatement/GetCSInfoDetails?requestForQuotationId=${rfqDetail?.requestForQuotationId}`,
        (data) => {
          setSuppilerStatement((prev) => ({
            ...prev,
            firstSelectedItem: data?.supplierPlaceNoList
              ? data?.supplierPlaceNoList[0]
              : {},
            secondSelectedItem: data?.supplierPlaceNoList
              ? data?.supplierPlaceNoList[1]
              : {},
            firstSelectedId: data?.supplierPlaceNoList
              ? data?.supplierPlaceNoList[0]?.businessPartnerId
              : null,
            secondSelectedId: data?.supplierPlaceNoList
              ? data?.supplierPlaceNoList[1]?.businessPartnerId
              : null,
          }));
          // data?.itemDataList?.map((item) => {
          //   setRowData((prev) => [
          //     ...prev,
          //     {
          //       itemWise: item?.itemName,
          //       takenSupplier: item?.takenSupplier,
          //       takenQuantity: item?.totalTakenSupplier,
          //     },
          //   ]);
          // });
        }
      );
    }
  }, []);

  useEffect(() => {
    getPlacePartnerListCsWise();
  }, [suppilerStatement]);

  const getPlacePartnerListCsWise = () => {
    getPlacePartnerList(
      `${eProcurementBaseURL}/ComparativeStatement/GetSupplierWiseCS?requestForQuotationId=${
        rfqDetail?.requestForQuotationId
      }&firstPlacePartnerRfqId=${
        suppilerStatement?.firstSelectedItem?.partnerRfqId || 0
      }&secondPlacePartnerRfqId=${
        suppilerStatement?.secondSelectedItem?.partnerRfqId || 0
      }`
    );
  };

  const saveHandler = async (values, cb) => {
    console.log(values, 'values');
    console.log('rowData', rowData);
    // Create item list array from rowData

    console.log('Save hand', suppilerStatement);

    if (values?.csType?.value === 1 && !suppilerStatement?.firstSelectedItem) {
      toast.warning('Please select 1st place supplier!');
      return;
    }
    let payload = [];
    payload = saveHandlerPayload(
      values,
      payload,
      rfqDetail,
      suppilerStatement,
      placePartnerList,
      rowData
    );

    console.log(payload, 'payload');
    let apiURL =
      values?.csType?.value === 0
        ? `${eProcurementBaseURL}/ComparativeStatement/CreateAndUpdateItemWiseCS
`
        : `${eProcurementBaseURL}/ComparativeStatement/CreateAndUpdateSupplierWiseCS`;
    saveData(
      apiURL,
      payload,
      (res) => {
        if (res?.message === 'Saved Successfully') {
          if (rfqDetail?.purchaseOrganizationName === 'Foreign Procurement') {
            saveCostEntry(
              `${eProcurementBaseURL}/ComparativeStatement/CreateOrUpdateCostComponentTransaction
`,
              getCostEntryPayload(costEntryList, rfqDetail),
              (costRes) => {
                console.log(costRes, 'costRes');
                history.push('/mngProcurement/purchase-management/cs');
              }
            ); // cost entry api
          } else {
            console.log(res, 'save data found');
            history.push('/mngProcurement/purchase-management/cs');
          }
        }
      },
      true
    );
  };

  const getCsTypes = () => {
    let list = [];
    rfqDetail?.comparativeStatementType === 'Item Wise CS'
      ? list.push({ value: 0, label: 'Item Wise Create' })
      : list.push({ value: 1, label: 'Supplier Wise Create' });

    return list;
  };

  const [objProps, setObjprops] = useState({});
  console.log(suppilerStatement, 'fast page suppilerStatement');
  console.log(placePartnerList, 'fast page placePartnerList');

  console.log(costEntryList, 'costEntryList');

  const addNewSupplierInfos = (values) => {
    // Adjust foundData check to include port value if required
    let foundData = rowData?.filter((item) => {
      const isSameItemSupplier =
        item?.itemWiseCode === values?.itemWise?.value &&
        item?.supplierCode === values?.supplier?.value;

      // Add port comparison for "Foreign Procurement"
      // if (rfqDetail?.purchaseOrganizationName === "Foreign Procurement") {
      //   return isSameItemSupplier && item?.port?.value === values?.port?.value;
      // }

      return isSameItemSupplier;
    });

    const totalTakenQuantity = rowData.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.takenQuantity || 0);
    }, 0);

    if (totalTakenQuantity >= values?.itemWise?.rfqquantity) {
      toast.warning("Total taken quantity can't be greater than RFQ quantity", {
        toastId: 'Fae22',
      });
      return;
    }

    if (foundData?.length > 0) {
      toast.warning('Already exist', { toastId: 'Fae' });
    } else {
      let payload = {
        itemWise: values?.itemWise?.label,
        itemWiseCode: values?.itemWise?.value,
        supplierRate: values?.supplierRate,
        supplier: values?.supplier?.label,
        supplierInfo: values?.supplier,
        supplierCode: values?.supplier?.value,
        takenQuantity: values?.takenQuantity,
        rowIdSupplier: values?.supplier?.rowIdSupplier,
        partnerRfqId: values?.supplier?.partnerRfqId,
        itemId: values?.itemWise?.itemId,
        note: values?.note,
      };

      // Add port field if Foreign Procurement and port value exists
      if (
        rfqDetail?.purchaseOrganizationName === 'Foreign Procurement' &&
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

  const handleDelete = (item, supplier, portValue) => {
    console.log(item, supplier, 'item, supplier');
    console.log(rowData, 'rowData');

    const filterData = rowData.filter((items) => {
      // Check if purchaseOrganizationName is "Foreign Procurement"
      if (rfqDetail?.purchaseOrganizationName === 'Foreign Procurement') {
        // Add the portValue check when it's Foreign Procurement
        return !(
          items?.itemWiseCode === item &&
          items?.supplierCode === supplier &&
          items?.port?.value === portValue
        );
      } else {
        // Only check itemWiseCode and supplierCode otherwise
        return !(
          items?.itemWiseCode === item && items?.supplierCode === supplier
        );
      }
    });

    setRowData(filterData);
  };
  ///
  const rowDataHandler = (field, value, index) => {
    console.log(field, value, index, 'field, value, index');
    const copyRowDto = [...placePartnerList];
    copyRowDto[index][field] = value;
    setPlacePartnerList(copyRowDto);
  };

  console.log(placePartnerList, 'placePartnerList');

  return (
    <IForm getProps={setObjprops} isDisabled={isView} title={'Create'}>
      {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          csType: isView
            ? rfqDetail?.comparativeStatementType === 'Item Wise CS'
              ? { value: 0, label: 'Item Wise Create' }
              : { value: 1, label: 'Supplier Wise Create' }
            : '',
        }}
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
            {(itemDDLLoading ||
              SupplierDDLLoading ||
              suppilerStatementLoading ||
              placePartnerListLoading ||
              costEntryLoading ||
              mainDataLoading) && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="csType"
                      options={
                        isView
                          ? getCsTypes()
                          : [
                              { value: 0, label: 'Item Wise Create' },
                              { value: 1, label: 'Supplier Wise Create' },
                            ]
                      }
                      value={values?.csType}
                      label="CS Type"
                      onChange={(valueOption) => {
                        setFieldValue('csType', valueOption);
                      }}
                      placeholder="CS Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={isView}
                    />
                  </div>
                  {!isView && values?.csType?.value === 1 && (
                    <div className="col-lg-3">
                      <InputField
                        label="Note"
                        value={values?.approvalNotes}
                        name="approvalNotes"
                        onChange={(e) => {
                          setFieldValue('approvalNotes', e.target.value);
                        }}
                        placeholder="Note"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {!isView && (
                    <>
                      {values?.csType?.value === 0 && (
                        <div className="col-lg-3">
                          <InputField
                            label="Note"
                            value={values?.note}
                            name="note"
                            onChange={(e) => {
                              setFieldValue('note', e.target.value);
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
                              setFieldValue('itemWise', valueOption);
                              setFieldValue('supplier', []);

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
                              setFieldValue('supplier', valueOption);
                              setFieldValue(
                                'supplierRate',
                                valueOption?.supplierRate || 0
                              );
                              setFieldValue('port', []);
                              setFieldValue(
                                'currencyCode',
                                valueOption?.currencyCode
                              );
                            }}
                            placeholder="Supplier"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      {values?.csType?.value === 0 && (
                        <div className="col-lg-3">
                          <label>Currency</label>
                          <InputField
                            value={values?.currencyCode}
                            name="currencyCode"
                            onChange={(e) => {
                              setFieldValue('currencyCode', e.target.value);
                            }}
                            disabled={true}
                            placeholder="currencyCode"
                            type="text"
                          />
                        </div>
                      )}
                      {values?.csType?.value === 0 &&
                        rfqDetail?.purchaseOrganizationName ===
                          'Foreign Procurement' && (
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
                                setFieldValue('port', valueOption);
                                setFieldValue(
                                  'supplierRate',
                                  valueOption?.rate
                                );
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
                              setFieldValue('takenQuantity', e.target.value);
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
                              setFieldValue('supplierRate', e.target.value);
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
                    </>
                  )}
                </div>
              </div>

              {values?.csType?.value === 0 && (
                <div className="table-responsive pt-5">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    {rowData?.length > 0 && (
                      <thead>
                        {isView ? (
                          <tr>
                            <th>SL</th>
                            <th>Item</th>

                            <th>Taken Quantity</th>
                            <th>Taken Supplier</th>
                          </tr>
                        ) : (
                          <tr>
                            <th>SL</th>
                            <th>Item</th>
                            <th>Supplier</th>
                            {rfqDetail?.purchaseOrganizationName ===
                              'Foreign Procurement' && <th>Port</th>}
                            <th>Taken Quantity</th>
                            <th>Supplier Rate</th>
                            <th>Actions</th>
                          </tr>
                        )}
                      </thead>
                    )}
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: '15px' }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>
                                <span className="pl-2 text-center">
                                  {item?.itemWise}
                                </span>
                              </td>
                              {!isView && (
                                <td>
                                  <span className="pl-2 text-center">
                                    {item?.supplier}
                                  </span>
                                </td>
                              )}

                              {rfqDetail?.purchaseOrganizationName ===
                                'Foreign Procurement' &&
                                !isView && (
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
                              {isView && (
                                <td>
                                  <span className="pl-2 text-center">
                                    {item?.takenSupplier}
                                  </span>
                                </td>
                              )}
                              {!isView && (
                                <td>
                                  <span className="pl-2 text-center">
                                    {item?.supplierRate}
                                  </span>
                                </td>
                              )}

                              {!isView && (
                                <td>
                                  <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      handleDelete(
                                        item?.itemWiseCode,
                                        item?.supplierCode,
                                        item?.port?.value
                                      );
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                </td>
                              )}
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
                        position: 'relative',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                      }}
                    >
                      {suppilerStatement?.firstSelectedId &&
                      suppilerStatement?.firstSelectedId !== 0 &&
                      !isView ? (
                        <button
                          type="button"
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
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            border: 'none',
                            padding: '0',
                            cursor: 'pointer',
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
                        position: 'relative',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                      }}
                    >
                      {suppilerStatement?.secondSelectedId &&
                      suppilerStatement?.secondSelectedId !== 0 &&
                      !isView ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSuppilerStatement((prev) => ({
                              ...prev,
                              secondSelectedId: 0,
                              secondSelectedItem: {},
                            }));
                          }}
                          className="btn btn-sm btn-outline-danger"
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            border: 'none',
                            padding: '0',
                            cursor: 'pointer',
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
                              'Please select 1st place supplier first!!'
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
                    'Foreign Procurement' && (
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
                style={{ display: 'none' }}
                ref={objProps.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              {values?.csType?.value === 1 && (
                <SupplyWiseTable
                  isView={isView}
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
                ? 'Select 1st Place Supplier'
                : 'Select 2nd Place Supplier'
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
            title={isView ? 'View Cost Entry' : 'Create Cost Entry'}
            show={isCostEntryModal}
            onHide={() => {
              setIsCostEntryModal(false);
              // getFirstPlacePartnerList();
            }}
          >
            <CostEntry
              costEntryList={costEntryList}
              rfqId={rfqDetail?.requestForQuotationId}
              dataList={suppilerStatement}
              isView={isView}
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

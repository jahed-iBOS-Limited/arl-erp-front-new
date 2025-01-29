import { Button } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import IDelete from '../../../_helper/_helperIcons/_delete';
import NewSelect from '../../../_helper/_select';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { toast } from 'react-toastify';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import Loading from '../../../_helper/_loading';

const initialValues = {
  shipper: '',
  consignee: '',
  deliveryAgent: '',
  notifyParty: '',
  participantType: '',
  tradeType: 1,
};

export default function AssigneeModal({
  isModalOpen,
  setIsModalOpen,
  isViewMoadal,
  clickRowData,
}) {
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [shipperListDDL, getShipperListDDL] = useAxiosGet();
  const [consigneeListDDL, getConsigneeListDDL] = useAxiosGet();
  const [itemTypeOption, getItemTypeOption, , setItemTypeOption] =
    useAxiosGet();
  const [, GetParticipantsWithShipper, participantLoading] = useAxiosGet();
  const [participantDDL, getParticipantDDL, , setParticipantDDL] =
    useAxiosGet();
  const formikRef = React.useRef(null);
  const [addedItem, setAddedItem] = React.useState([]);
  const [participantTypeListDDL, GetParticipantTypeListDDL] = useAxiosGet();
  const [, saveParticipntMapping, participntMappingLoading] = useAxiosPost();

  const saveHandler = (values, cb) => {
    if (addedItem?.length === 0)
      return toast.warning('Please add at least one item');
    const modifiedData = addedItem?.map((item) => {
      return {
        ...item,
      };
    });

    // tradeType 1 = Export 2 = Import
    if (values?.tradeType === 1) {
      saveParticipntMapping(
        `${imarineBaseUrl}/domain/ShippingService/SaveExportParticipntMapping`,
        modifiedData,
        () => {
          setAddedItem([]);
          // setIsModalOpen(false);
          if (cb) {
            cb();
          }
        },
        'save',
      );
    }

    if (values?.tradeType === 2) {
      saveParticipntMapping(
        `${imarineBaseUrl}/domain/ShippingService/SaveImportParticipntMapping`,
        modifiedData,
        () => {
          setAddedItem([]);
          // setIsModalOpen(false);
          if (cb) {
            cb();
          }
        },
        'save',
      );
    }
  };

  React.useEffect(() => {
    getItemTypeOption(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList`,
      (resData) => {
        const updatedData = resData
          ?.filter((item) => [1, 2].includes(item?.businessPartnerTypeId))
          .map((item) => {
            return {
              ...item,
              label: item?.businessPartnerTypeName,
              value: item?.businessPartnerTypeId,
            };
          });
        setItemTypeOption(updatedData);
      },
    );
    GetParticipantTypeListDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetShipingCargoTypeDDL`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commonGeParticipantDDL = (actionName, partnerType, cargoType) => {
    actionName(
      `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?businessPartnerType=${partnerType}&cargoType=${cargoType}`,
    );
  };

  const onChangeParticipantType = (values) => {
    const participantTypeId = values?.participantType?.value || 0;
    const supplierTypeId = values?.businessPartnerType?.value || 0;

    setParticipantDDL([]);
    commonGeParticipantDDL(
      getParticipantDDL,
      supplierTypeId,
      participantTypeId,
    );
  };

  const addButtonHandler = (values) => {
    const obj = {
      mappingId: 0,
      shipperId: values?.shipper?.value || 0,
      shipperName: values?.shipper?.label || '',
      consigneeId: values?.consignee?.value || 0,
      consigneeName: values?.consignee?.label || '',
      businessPartnerTypeName: values?.businessPartnerType?.label || '',
      participantTypeId: values?.participantType?.value || 0,
      participantType: values?.participantType?.label || '',
      participantId: values?.participant?.value || 0,
      participantName: values?.participant?.label || '',
      createdBy: profileData?.userId || 0,
      createdAt: new Date(),
    };
    const isExist = addedItem?.find(
      (item) =>
        item?.participantTypeId === obj?.participantTypeId &&
        item?.participantId === obj?.participantId,
    );
    if (isExist) return toast.warning('Duplicate item not allowed');
    setAddedItem((prev) => [...prev, obj]);
  };

  const consigneeOrShipperChangeHandler = ({ values }) => {
    // if tradeType 1 = Export
    if (values?.tradeType === 1) {
      GetParticipantsWithShipper(
        `${imarineBaseUrl}/domain/ShippingService/GetParticipantsWithShipper?shipperId=${values?.shipper?.value}`,
        (redData) => {
          const deliveryAgentList = redData?.deliveryAgentList || [];
          const notifyPartyList = redData?.notifyPartyList || [];
          const airLineList = redData?.airLineList || [];
          const consineList = redData?.consineList || [];
          const shippingLineList = redData?.shippingLineList || [];
          const gsaList = redData?.gsaList || [];

          // how to setAddedItem here
          const allItems = [
            ...consineList,
            ...deliveryAgentList,
            ...notifyPartyList,
            ...shippingLineList,
            ...airLineList,
            ...gsaList,
          ];
          const addedItems = allItems?.map((item) => {
            return {
              mappingId: item?.mappingId || 0,
              shipperId: values?.shipper?.value || 0,
              shipperName: values?.shipper?.label || '',
              participantTypeId: item?.participantTypeId || 0,
              participantType: item?.participantType || '',
              participantId: item?.participantId || 0,
              participantName: item?.participantsName || '',
              createdBy: profileData?.userId || 0,
              createdAt: new Date(),
              businessPartnerTypeName: item?.businessPartnerTypeName || '',
            };
          });
          setAddedItem(addedItems);
        },
      );
    }

    // if tradeType 2 = Import
    if (values?.tradeType === 2) {
      GetParticipantsWithShipper(
        `${imarineBaseUrl}/domain/ShippingService/GetParticipantsWithConsignee?consigneeId=${values?.consignee?.value}`,
        (redData) => {
          const deliveryAgentList = redData?.deliveryAgentList || [];
          const notifyPartyList = redData?.notifyPartyList || [];
          const airLineList = redData?.airLineList || [];
          const shipperList = redData?.shipperList || [];
          const shippingLineList = redData?.shippingLineList || [];
          const gsaList = redData?.gsaList || [];

          // how to setAddedItem here
          const allItems = [
            ...shipperList,
            ...deliveryAgentList,
            ...notifyPartyList,
            ...shippingLineList,
            ...airLineList,
            ...gsaList,
          ];
          const addedItems = allItems?.map((item) => {
            return {
              mappingId: item?.mappingId || 0,
              consigneeId: values?.consignee?.value || 0,
              consigneeName: values?.consignee?.label || '',
              participantTypeId: item?.participantTypeId || 0,
              participantType: item?.participantType || '',
              participantId: item?.participantId || 0,
              participantName: item?.participantsName || '',
              createdBy: profileData?.userId || 0,
              createdAt: new Date(),
              businessPartnerTypeName: item?.businessPartnerTypeName || '',
            };
          });
          setAddedItem(addedItems);
        },
      );
    }
  };

  useEffect(() => {
    if (clickRowData && isViewMoadal) {
      const values = {
        shipper: {
          value: clickRowData?.shipperId,
          label: clickRowData?.shipperName,
        },
        tradeType: clickRowData?.tradeType,
        consignee: {
          value: clickRowData?.consigneeId,
          label: clickRowData?.consigneeName,
        },
      };
      consigneeOrShipperChangeHandler({ values });
      formikRef.current.setFieldValue('tradeType', clickRowData?.tradeType);
    } else {
      getCommonShipperAndConsigneeDDL(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);

  // tradeType 1 = Export 2 = Import
  const tradeTypeHandler = ({ resetForm, values, setFieldValue }) => {
    const prvValues = {
      ...values,
    };
    resetForm();
    setAddedItem([]);
    setFieldValue('tradeType', prvValues?.tradeType);
    getCommonShipperAndConsigneeDDL(prvValues?.tradeType);
  };

  const getCommonShipperAndConsigneeDDL = (tradeTypeId) => {
    // tradeTypeId 1 = Export
    if (tradeTypeId === 1) {
      getShipperListDDL(
        `${imarineBaseUrl}/domain/ShippingService/ImportorExportTypeWisePartnerDDL?typeId=${tradeTypeId}`,
      );
    }
    // tradeTypeId 2 = Import
    if (tradeTypeId === 2) {
      getConsigneeListDDL(
        `${imarineBaseUrl}/domain/ShippingService/ImportorExportTypeWisePartnerDDL?typeId=${tradeTypeId}`,
      );
    }
  };

  const participantTypeListDDLFilter = (values) => {
    const updatedData = participantTypeListDDL?.filter((item) => {
      if (values?.tradeType === 1) {
        return ![1, 8].includes(item?.value);
      } else {
        return ![2, 8].includes(item?.value);
      }
    });
    return updatedData;
  };

  console.log('addedItem', addedItem);
  return (
    <div>
      <IViewModal
        title=""
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
      >
        <ICustomCard
          title={isViewMoadal ? 'View Assignee' : 'Assign Business Partner'}
          // backHandler={() => {
          //   setIsModalOpen(false);
          // }}
          saveHandler={
            isViewMoadal
              ? false
              : () => {
                  const values = formikRef.current.values;
                  saveHandler(values, () => {
                    formikRef.current.resetForm();
                  });
                }
          }
          resetHandler={
            isViewMoadal
              ? false
              : () => {
                  formikRef.current.resetForm();
                  setAddedItem([]);
                }
          }
        >
          {(participntMappingLoading || participantLoading) && <Loading />}
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            innerRef={formikRef}
          >
            {({
              errors,
              touched,
              setFieldValue,
              isValid,
              values,
              resetForm,
            }) => (
              <Form className="form form-label-right">
                {!isViewMoadal && (
                  <>
                    {' '}
                    <div className="form-group row global-form">
                      <div className="col-lg-12">
                        <label className="mr-3 pointer">
                          <input
                            type="radio"
                            name="tradeType"
                            checked={values?.tradeType === 1}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(e) => {
                              setFieldValue('tradeType', 1);
                              tradeTypeHandler({
                                resetForm,
                                values: {
                                  ...values,
                                  tradeType: 1,
                                },
                                setFieldValue,
                              });
                            }}
                          />
                          Export
                        </label>
                        <label className="pointer">
                          <input
                            type="radio"
                            name="tradeType"
                            checked={values?.tradeType === 2}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(e) => {
                              setFieldValue('tradeType', 2);
                              tradeTypeHandler({
                                resetForm,
                                values: {
                                  ...values,
                                  tradeType: 2,
                                },
                                setFieldValue,
                              });
                            }}
                          />
                          Import
                        </label>
                      </div>
                      <div className="col-lg-12">
                        <hr />
                      </div>

                      {/* Shipper DDL*/}
                      {values?.tradeType === 1 && (
                        <div className="col-lg-3">
                          <NewSelect
                            label="Select Shipper"
                            options={shipperListDDL || []}
                            value={values?.shipper}
                            name="shipper"
                            onChange={(valueOption) => {
                              setFieldValue('shipper', valueOption);
                              consigneeOrShipperChangeHandler({
                                values: {
                                  ...values,
                                  shipper: valueOption,
                                },
                              });
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={addedItem?.length > 0}
                          />
                        </div>
                      )}

                      {/* consignee DDL*/}
                      {values?.tradeType === 2 && (
                        <div className="col-lg-3">
                          <NewSelect
                            label="Select Consignee"
                            options={consigneeListDDL || []}
                            value={values?.consignee}
                            name="consignee"
                            onChange={(valueOption) => {
                              setFieldValue('consignee', valueOption);
                              consigneeOrShipperChangeHandler({
                                values: {
                                  ...values,
                                  consignee: valueOption,
                                },
                              });
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={addedItem?.length > 0}
                          />
                        </div>
                      )}

                      <div className="col-lg-3">
                        <NewSelect
                          label="Participant Type"
                          options={participantTypeListDDLFilter(values) || []}
                          value={values?.participantType}
                          name="participantType"
                          onChange={(valueOption) => {
                            setFieldValue('participantType', valueOption);
                            setFieldValue('participant', '');
                            setFieldValue('businessPartnerType', '');
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessPartnerType"
                          options={itemTypeOption}
                          value={values?.businessPartnerType}
                          label="Partner Type"
                          onChange={(valueOption) => {
                            setFieldValue('businessPartnerType', valueOption);
                            setFieldValue('participant', '');
                            onChangeParticipantType({
                              ...values,
                              businessPartnerType: valueOption,
                            });
                          }}
                          placeholder="Select Partner Type"
                          isSearchable={true}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.participantType}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          label={`Select Partner` || ''}
                          options={participantDDL || []}
                          value={values?.participant}
                          name="participant"
                          onChange={(valueOption) => {
                            setFieldValue('participant', valueOption || ``);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            !values?.participantType ||
                            !values?.businessPartnerType
                          }
                        />
                      </div>

                      <div className="col-lg-3">
                        <div className="d-flex my-1">
                          <button
                            type="button"
                            className="btn btn-primary mt-5"
                            onClick={() => {
                              addButtonHandler(values);
                            }}
                            disabled={
                              !values?.participantType ||
                              !values?.participant ||
                              (values?.tradeType === 1
                                ? !values?.shipper
                                : !values?.consignee)
                            }
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {addedItem?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          {values?.tradeType === 1 ? (
                            <th>Shipper</th>
                          ) : (
                            <th>Consignee</th>
                          )}
                          <th>Partner Type</th>
                          <th>Participant Type</th>
                          <th>Participant</th>
                          {!isViewMoadal && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {addedItem?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>

                            {values?.tradeType === 1 ? (
                              <td>{item?.shipperName}</td>
                            ) : (
                              <td>{item?.consigneeName}</td>
                            )}
                            <td>{item?.businessPartnerTypeName}</td>
                            <td>{item?.participantType}</td>
                            <td>{item?.participantName}</td>
                            {!isViewMoadal && (
                              <td>
                                <div className="d-flex justify-content-center">
                                  <Button
                                    onClick={() => {
                                      const prv = [...addedItem];
                                      const filtered = prv.filter(
                                        (itm, i) => i !== index,
                                      );
                                      setAddedItem(filtered);
                                    }}
                                    color="error"
                                    size="small"
                                    title="Remove"
                                  >
                                    <IDelete />
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </ICustomCard>
      </IViewModal>
    </div>
  );
}

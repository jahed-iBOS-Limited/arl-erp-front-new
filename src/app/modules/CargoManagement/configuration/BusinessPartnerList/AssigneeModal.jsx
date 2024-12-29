import { Button } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { imarineBaseUrl } from '../../../../App';
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
  deliveryAgent: '',
  notifyParty: '',
  participantType: '',
};

export default function AssigneeModal({ isModalOpen, setIsModalOpen }) {
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [consigneeListDDL, getConsigneeListDDL] = useAxiosGet();
  const [
    itemTypeOption,
    getItemTypeOption,
    ,
    setItemTypeOption,
  ] = useAxiosGet();
  const [, getParticipantsWithConsigneeDtl, participantLoading] = useAxiosGet();
  const [
    participantDDL,
    getParticipantDDL,
    ,
    setParticipantDDL,
  ] = useAxiosGet();
  const formikRef = React.useRef(null);
  const [addedItem, setAddedItem] = React.useState([]);
  const [
    participantTypeListDDL,
    GetParticipantTypeListDDL,
    ,
    setParticipantTypeList,
  ] = useAxiosGet();
  const [, saveParticipntMapping, participntMappingLoading] = useAxiosPost();

  const saveHandler = (values, cb) => {
    // addItem minimum 1 item check
    // if (addedItem?.length === 0)
    //   return toast.warning("Please add at least one item");
    const isAllFalse = addedItem?.every((item) => item?.isActive === false);
    if (isAllFalse) return toast.warning('Please add at least one item');
    const modifiedData = addedItem?.map((item) => {
      return {
        ...item,
      };
    });
    saveParticipntMapping(
      `${imarineBaseUrl}/domain/ShippingService/SaveParticipntMapping`,
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
      (redData) => {
        const updatedData = redData?.filter(
          (item) => ![1].includes(item?.value),
        );
        setParticipantTypeList(updatedData);
      },
    );
    // 2=Customer, 1= shipper
    commonGeParticipantDDL(getConsigneeListDDL, 2, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commonGeParticipantDDL = (actionName, partnerType, cargoType) => {
    actionName(
      `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?businessPartnerType=${partnerType}&cargoType=${cargoType}`,
    );
  };

  const onChangeParticipantType = (supplierTypeId) => {
    setParticipantDDL([]);
    commonGeParticipantDDL(getParticipantDDL, supplierTypeId, 0);
  };

  const addButtonHandler = (values) => {
    const obj = {
      mappingId: 0,
      shipperId: values?.shipper?.value || 0,
      shipperName: values?.shipper?.label || '',
      participantTypeId: values?.participantType?.value || 0,
      participantType: values?.participantType?.label || '',
      participantId: values?.participant?.value || 0,
      participantName: values?.participant?.label || '',
      isActive: true,
      createdBy: profileData?.userId || 0,
      createdAt: new Date(),
    };

    // duplicate check "participantTypeId, participantId"
    const addedItemIsActive = addedItem?.filter((item) => item?.isActive);
    const isExist = addedItemIsActive?.find(
      (item) =>
        item?.participantTypeId === obj?.participantTypeId &&
        item?.participantId === obj?.participantId,
    );
    if (isExist) return toast.warning('Duplicate item not allowed');
    setAddedItem((prev) => [...prev, obj]);
  };

  const consigneeOnChangeHandler = (valueOption) => {
    getParticipantsWithConsigneeDtl(
      `${imarineBaseUrl}/domain/ShippingService/GetParticipantsWithConsigneeDtl?shipperId=${valueOption?.value}`,
      (redData) => {
        const shipperList = redData?.shipperList?.map((item) => {
          return {
            ...item,
            participantTypeId: 1,
            participantType: 'Shipper',
            participantsName: item?.participantsName || '',
            participantId: item?.participantId || 0,
          };
        });
        const deliveryAgentList = redData?.deliveryAgentList || [];
        const notifyPartyList = redData?.notifyPartyList || [];

        // how to setAddedItem here
        const allItems = [
          ...shipperList,
          ...deliveryAgentList,
          ...notifyPartyList,
        ];
        const addedItems = allItems.map((item) => {
          return {
            mappingId: item?.mappingId || 0,
            shipperId: valueOption?.value || 0,
            shipperName: valueOption?.label || '',
            participantTypeId: item?.participantTypeId || 0,
            participantType: item?.participantType || '',
            participantId: item?.participantId || 0,
            participantName: item?.participantsName || '',
            isActive: true,
            createdBy: profileData?.userId || 0,
            createdAt: new Date(),
          };
        });
        setAddedItem(addedItems);
      },
    );
  };

  const addedItemIsActive = addedItem?.filter((item) => item?.isActive);
  return (
    <div>
      <IViewModal
        title="Assignee Modal"
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
      >
        <ICustomCard
          title={'Assign Business Partner'}
          backHandler={() => {
            setIsModalOpen(false);
          }}
          saveHandler={(values) => {
            saveHandler(values, () => {
              formikRef.current.resetForm();
            });
          }}
          resetHandler={() => {
            formikRef.current.resetForm();
          }}
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
                <div className="form-group row global-form">
                  {/* Consignee */}
                  <div className="col-lg-3">
                    <NewSelect
                      label="Select Shipper"
                      options={consigneeListDDL || []}
                      value={values?.shipper}
                      name="shipper"
                      onChange={(valueOption) => {
                        setFieldValue('shipper', valueOption);
                        consigneeOnChangeHandler(valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={addedItemIsActive?.length > 0}
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
                        onChangeParticipantType(valueOption?.value);
                      }}
                      placeholder="Select Partner Type"
                      isSearchable={true}
                      errors={errors}
                      touched={touched}
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
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      label="Participant Type"
                      options={participantTypeListDDL || []}
                      value={values?.participantType}
                      name="participantType"
                      onChange={(valueOption) => {
                        setFieldValue('participantType', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
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
                          !values?.shipper ||
                          !values?.participantType ||
                          !values?.participant
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          {addedItem?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Shipper</th>
                    <th>Participant Type</th>
                    <th>Participant</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {addedItem?.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        display: item?.isActive ? 'table-row' : 'none',
                      }}
                    >
                      <td>{index + 1}</td>

                      <td>{item?.shipperName}</td>
                      <td>{item?.participantType}</td>
                      <td>{item?.participantName}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Button
                            onClick={() => {
                              // setAddedItem((prev) =>
                              //   prev.filter((itm, i) => i !== index)
                              // );
                              // set is active false
                              setAddedItem((prev) =>
                                prev.map((itm, i) => {
                                  if (i === index) {
                                    return {
                                      ...itm,
                                      isActive: false,
                                    };
                                  } else {
                                    return itm;
                                  }
                                }),
                              );
                            }}
                            color="error"
                            size="small"
                            title="Remove"
                          >
                            <IDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ICustomCard>
      </IViewModal>
    </div>
  );
}

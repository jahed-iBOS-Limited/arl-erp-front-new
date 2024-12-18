import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getVesselDDL, getVoyageDDLNew } from '../../helper';
import VoyageLicenseFlagAttachment from './voyageFlagLicenseAttachment';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import FormikSelect from '../../../chartering/_chartinghelper/common/formikSelect';
import customStyles from '../../../selectCustomStyle';
import IViewModal from '../../../_helper/_viewModal';
import { imarineBaseUrl } from '../../../../App';
import DiffEmailSender from '../../utils/diffEmailSender';
import EmailEditor from '../../utils/emailEditor';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import ICustomTable from '../../../chartering/_chartinghelper/_customTable';

const initData = {
  voyageFlagLicenseAtt: '',
};

const headers = [
  { name: 'SL' },
  { name: 'Code' },
  { name: 'Vessel Name' },
  { name: 'Voyage Type' },
  { name: 'Voyage No' },
  { name: 'Charterer Name' },
  { name: 'Broker Name' },
  { name: 'Load Port' },
  { name: 'Discharge Port' },
  { name: 'Cargo Quantity(Mt)' },
  { name: 'Freight Per(Mt)' },
  { name: 'Bunker Calculator' },
  { name: 'Dead Weight Calculation & Pre Stowage' },
  { name: 'Vessel Nomination' },
  { name: 'EDPA Loadport' },
  { name: 'On Hire Bunker and Conditional Survey(CS)' },
  // { name: "Dead Weight Calculation" },
  { name: 'Voyage Instruction' },
  { name: 'PI & Survey' },
  { name: 'Voyage License/Flag Waiver' },
  { name: 'TCL' },
  { name: 'Weather Routing Company' },
  { name: 'Departure Document Loadport' },
  { name: 'EPDA Discharge Port' },
  { name: 'Off Hire Bunker Survey' },
  { name: 'Departure Document Discharge Port' },
];

export default function VesselNominationDashboard() {
  const saveHandler = (values, cb) => {};
  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [landingData, getLandingData] = useAxiosGet();
  const [isShowMailModal, setIsShowMailModal] = useState(false);
  const [isDiffMailSenderModal, setIsDiffMailSenderModal] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [, setLoading] = useState(false);

  const [singleRowData, setSingleRowData] = useState({});
  const history = useHistory();

  const getGridData = (values) => {
    const shipTypeSTR = values?.shipType
      ? `shipType=${values?.shipType?.label}`
      : '';
    const voyageTypeSTR = values?.voyageType
      ? `&voyageType=${values?.voyageType?.label}`
      : '';
    const vesselNameSTR = values?.vesselName
      ? `&vesselName=${values?.vesselName?.label}`
      : '';
    const voyageNoSTR = values?.voyageNo
      ? `&voyageNo=${values?.voyageNo?.label}`
      : '';
    getLandingData(
      `${imarineBaseUrl}/domain/VesselNomination/VesselNominationLanding?${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`,
    );
  };

  useEffect(() => {
    getGridData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getButtonVisibility = (data) => {
    let visibility = [
      'isBunkerCalculationSave',
      'edpaLoadportSend',
      'onHireBunkerSurveySent',
      'isDeadWeightCalculationSave',
      'voyageInstructionSent',
      'pisurveySent',
      'voyageLicenseFlagWaiverSend',
      'tclSend',
      'weatherRoutingCompanySend',
      'departureDocumentLoadPortSend',
      'departureDocumentDischargePortSend',
      'epdadischargePortSent',
      'offHireBunkerSurveySent',
    ];

    // Second block
    if (data?.isBunkerCalculationSave) {
      visibility.push('preStowageSend');
    }

    return visibility;
  };

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      shipType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };

  return (
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Vessel Nomination"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <>
                <div className="form-group global-form row mb-5">
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.shipType}
                      isSearchable={true}
                      options={[
                        { value: 1, label: 'Own Ship' },
                        { value: 2, label: 'Charterer Ship' },
                      ]}
                      styles={customStyles}
                      name="shipType"
                      placeholder="Ship Type"
                      label="Ship Type"
                      onChange={(valueOption) => {
                        setFieldValue('shipType', valueOption);
                        setFieldValue('vesselName', '');
                        setFieldValue('voyageNo', '');
                        setVesselDDL([]);
                        if (valueOption) {
                          getVesselDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setVesselDDL,
                            valueOption?.value === 2 ? 2 : '',
                          );
                        } else {
                          getGridData();
                        }
                      }}
                    />
                  </div>

                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.voyageType}
                      isSearchable={true}
                      options={[
                        { value: 1, label: 'Time Charter' },
                        { value: 2, label: 'Voyage Charter' },
                      ]}
                      styles={customStyles}
                      name="voyageType"
                      placeholder="Voyage Type"
                      label="Voyage Type"
                      onChange={(valueOption) => {
                        setFieldValue('vesselName', '');
                        setFieldValue('voyageNo', '');
                        setFieldValue('voyageType', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.vesselName}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue('vesselName', valueOption);
                        setFieldValue('voyageNo', '');
                        if (valueOption) {
                          getVoyageDDL({ ...values, vesselName: valueOption });
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.voyageNo || ''}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue('voyageNo', valueOption);
                      }}
                      isDisabled={!values?.vesselName}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={!values?.shipType}
                      onClick={() => {
                        getGridData(values);
                      }}
                      style={{ marginTop: '18px' }}
                      className="btn btn-primary"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  {landingData?.length > 0 && (
                    <ICustomTable ths={headers} scrollable={true}>
                      {landingData?.map((item, index) => {
                        const visibleButtons = getButtonVisibility(item);
                        return (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{item?.strCode}</td>
                            <td>{item?.strNameOfVessel}</td>
                            <td>{item?.strVoyageType}</td>
                            <td className="text-center">{item?.intVoyageNo}</td>
                            <td>{item?.strChartererName}</td>
                            <td>{item?.strBrokerName}</td>
                            <td>{item?.strNameOfLoadPort}</td>
                            <td>{item?.strDischargePort}</td>
                            <td className="text-center">
                              {item?.intCargoQuantityMts}
                            </td>
                            <td className="text-right">
                              {item?.numFreightPerMt}
                            </td>

                            <td className="text-center">
                              {visibleButtons.includes(
                                'isBunkerCalculationSave',
                              ) && (
                                <button
                                  className={
                                    item.isBunkerCalculationSave
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    history.push(
                                      '/shippingOperation/bunker-management/bunker/create',
                                      {
                                        landingData: item,
                                      },
                                    );
                                  }}
                                  // disabled={item?.isBunkerCalculationSave}
                                >
                                  Bunker Calculator
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes('preStowageSend') && (
                                <button
                                  className={
                                    item.preStowageSend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.preStowageSend) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'PRE STOWAGE',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.preStowageSend}
                                >
                                  DEAD WEIGHT CALCULATION & PRE STOWAGE SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              <button
                                className={
                                  item.isVesselNominationEmailSent
                                    ? 'btn btn-sm btn-success px-1 py-1'
                                    : 'btn btn-sm btn-warning px-1 py-1'
                                }
                                type="button"
                                onClick={() => {
                                  if (item.isVesselNominationEmailSent) {
                                    const confirmation = window.confirm(
                                      'Email already sent. Do you want to send it again?',
                                    );

                                    if (!confirmation) {
                                      return;
                                    }
                                  }
                                  setSingleRowData({
                                    ...item,
                                    columnName: 'VESSEL NOMINATION',
                                  });
                                  setIsShowMailModal(true);
                                }}
                                // disabled={item.isVesselNominationEmailSent}
                              >
                                VESSEL NOMINATION SEND
                              </button>
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes('edpaLoadportSend') && (
                                <button
                                  className={
                                    item.edpaLoadportSend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.edpaLoadportSend) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'EDPA LOADPORT',
                                    });
                                    // setIsShowMailModal(true);
                                    setIsDiffMailSenderModal(true);
                                  }}
                                  // disabled={item.edpaLoadportSend}
                                >
                                  EDPA LOADPORT SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                'onHireBunkerSurveySent',
                              ) && (
                                <button
                                  className={
                                    item.onHireBunkerSurveySent
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.onHireBunkerSurveySent) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'ON HIRE BUNKER SURVEY',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.onHireBunkerSurveySent}
                                >
                                  ON HIRE BUNKER SURVEY SENT
                                </button>
                              )}
                            </td>
                            {/* <td className="text-center">
                              {visibleButtons.includes(
                                "isDeadWeightCalculationSave"
                              ) && (
                                <button
                                  className={
                                    item.isDeadWeightCalculationSave
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    history.push(
                                      `/chartering/operation/pre-stowagePlanning/create/${item?.intId}/${item?.strCode}`,
                                      {
                                        landingData: item,
                                      }
                                    );
                                  }}
                                  disabled={item?.isDeadWeightCalculationSave}
                                >
                                  DEAD WEIGHT CALCULATION
                                </button>
                              )}
                            </td> */}
                            <td className="text-center">
                              {visibleButtons.includes(
                                'voyageInstructionSent',
                              ) && (
                                <button
                                  className={
                                    item.voyageInstructionSent
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    let message =
                                      'Email already sent. Do you want to send it again?';

                                    if (!item.voyageInstructionSent) {
                                      message = `Please check all fields and ensure they are filled correctly in Voyage instruction for Voyage no: ${item?.intVoyageNo}`;
                                    } else {
                                      message += ` \nPlease check all fields and ensure they are filled correctly in Voyage instruction for Voyage no: ${item?.intVoyageNo}`;
                                    }

                                    const confirmation = window.confirm(
                                      message,
                                    );

                                    if (!confirmation) {
                                      return;
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'VOYAGE INSTRUCTION',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.voyageInstructionSent}
                                >
                                  VOYAGE INSTRUCTION SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes('pisurveySent') && (
                                <button
                                  className={
                                    item.pisurveySent
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.pisurveySent) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'PI SURVEY',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.pisurveySent}
                                >
                                  PI SURVEY SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                'voyageLicenseFlagWaiverSend',
                              ) && (
                                <button
                                  className={
                                    item.voyageLicenseFlagWaiverSend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.voyageLicenseFlagWaiverSend) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'VOYAGE LICENSE/FLAG WAIVER',
                                    });
                                    // setIsShowMailModal(true);
                                    setShow(true);
                                  }}
                                  // disabled={item.voyageLicenseFlagWaiverSend}
                                >
                                  VOYAGE LICENSE/FLAG WAIVER SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes('tclSend') && (
                                <button
                                  className={
                                    item.tclSend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.tclSend) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }

                                    setSingleRowData({
                                      ...item,
                                      columnName: 'TCL',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.tclSend}
                                >
                                  TCL SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                'weatherRoutingCompanySend',
                              ) && (
                                <button
                                  className={
                                    item.weatherRoutingCompanySend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.weatherRoutingCompanySend) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'WEATHER ROUTING COMPANY',
                                    });
                                    // setIsShowMailModal(true);
                                    setIsDiffMailSenderModal(true);
                                  }}
                                  // disabled={item.weatherRoutingCompanySend}
                                >
                                  WEATHER ROUTING COMPANY SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                'departureDocumentLoadPortSend',
                              ) && (
                                <button
                                  className={
                                    item.departureDocumentLoadPortSend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.departureDocumentLoadPortSend) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'DEPARTURE DOCUMENT LOADPORT',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.departureDocumentLoadPortSend}
                                >
                                  DEPARTURE DOCUMENT LOADPORT SEND
                                </button>
                              )}
                            </td>

                            <td className="text-center">
                              {visibleButtons.includes(
                                'epdadischargePortSent',
                              ) && (
                                <button
                                  className={
                                    item.epdadischargePortSent
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.epdadischargePortSent) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'EPDA DISCHARGE PORT',
                                    });
                                    setIsDiffMailSenderModal(true);
                                  }}
                                  // disabled={item.epdadischargePortSent}
                                >
                                  EPDA DISCHARGE PORT SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                'offHireBunkerSurveySent',
                              ) && (
                                <button
                                  className={
                                    item.offHireBunkerSurveySent
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.offHireBunkerSurveySent) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName: 'OFFHIRE BUNKER SURVEY',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={item.offHireBunkerSurveySent}
                                >
                                  OFFHIRE BUNKER SURVEY SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                'departureDocumentDischargePortSend',
                              ) && (
                                <button
                                  className={
                                    item.departureDocumentDischargePortSend
                                      ? 'btn btn-sm btn-success px-1 py-1'
                                      : 'btn btn-sm btn-warning px-1 py-1'
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (
                                      item.departureDocumentDischargePortSend
                                    ) {
                                      const confirmation = window.confirm(
                                        'Email already sent. Do you want to send it again?',
                                      );

                                      if (!confirmation) {
                                        return;
                                      }
                                    }
                                    setSingleRowData({
                                      ...item,
                                      columnName:
                                        'DEPARTURE DOCUMENT DISCHARGE PORT',
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  // disabled={
                                  //   item.departureDocumentDischargePortSend
                                  // }
                                >
                                  DEPARTURE DOCUMENT DISCHARGE PORT SEND
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </ICustomTable>
                  )}
                </div>
              </>
            </Form>
          </IForm>
          <IViewModal show={show} onHide={onHide}>
            <VoyageLicenseFlagAttachment
              values={values}
              setFieldValue={setFieldValue}
              item={singleRowData}
              getGridData={getGridData}
              setShow={setShow}
              setIsShowMailModal={setIsShowMailModal}
            />
          </IViewModal>
          <IViewModal
            show={isShowMailModal}
            onHide={() => {
              setIsShowMailModal(false);
            }}
          >
            <EmailEditor
              emailEditorProps={{
                intId: singleRowData?.intId,
                singleRowData: singleRowData,
                // emailInfoUrl: "/automation/vessel_nomitaion_mail_format",
                // sendEmailUrl: "/automation/vessel_nomitaion_mail_sent",
                cb: () => {
                  getGridData();
                  setIsShowMailModal(false);
                },
              }}
            />
          </IViewModal>
          <IViewModal
            show={isDiffMailSenderModal}
            onHide={() => {
              setIsDiffMailSenderModal(false);
            }}
          >
            <DiffEmailSender
              emailEditorProps={{
                intId: singleRowData?.intId,
                singleRowData: singleRowData,
                cb: () => {
                  getGridData();
                  setIsDiffMailSenderModal(false);
                },
              }}
            />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}

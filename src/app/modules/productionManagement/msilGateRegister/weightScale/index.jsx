/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import IForm from '../../../_helper/_form';
import FirstWeightCreateEdit from '../firstWeight/createEdit';
import SecondWeightCreateEdit from '../secondWeight/createEdit';
import { serial as polyfill } from 'web-serial-polyfill';
import { setSerialPortAction } from '../../../_helper/_redux/Actions';
import ButtonStyleOne from '../../../_helper/button/ButtonStyleOne';
import IViewModal from '../../../_helper/_viewModal';
import WeightScaleConfig from './weightScaleConfig';

const magnumSteelUnitId = 171;
const isPatUnitId = 224;
const essentialUnitId = 144;
const kofilRazzakUnitId = 189;

const urlParams = new URLSearchParams(window.location.search);
const usePolyfill = urlParams.has('polyfill');
let weightValue = '';
let reader = null;
let writer = null;

const WeightScale = () => {
  const { weightScaleConfigValues } = useSelector(
    (state) => state.localStorage,
  );
  console.log(weightScaleConfigValues, 'weightScaleConfigValues');
  // {
  //   "scaleType": {
  //     "value": "new",
  //     "label": "New"
  //   },
  //   "byteType": {
  //     "value": "8 byte",
  //     "label": "8 byte"
  //   },
  //   "baudRate": ""
  // }

  const [objProps, setObjprops] = useState({});
  const connectedPort = useSelector(
    (state) => state?.commonDDL?.port,
    shallowEqual,
  );
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [weight, setWeight] = useState(0);
  const dispatch = useDispatch();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const isOldMachine = (info) => {
    if (weightScaleConfigValues?.scaleType?.value === 'new') {
      return false;
    } else if (
      weightScaleConfigValues?.scaleType?.value === 'old' ||
      (info?.usbProductId === 9123 && info?.usbVendorId === 1659)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getSelectedPort = async () => {
    try {
      const serial = usePolyfill ? polyfill : navigator.serial;
      let port = await serial.requestPort({});
      dispatch(setSerialPortAction(port));
      return port;
    } catch (error) {}
  };

  const connectHandler = async () => {
    closePort();
    const oldMachineOptions = {
      baudRate: weightScaleConfigValues?.baudRate || 1200,
      baudrate: weightScaleConfigValues?.baudRate || 1200,
      bufferSize: 8192,
      dataBits: 7,
      databits: 7,
      flowControl: 'none',
      parity: 'even',
      rtscts: false,
      stopBits: 1,
      stopbits: 1,
    };

    const newMachineOptions = {
      baudRate: weightScaleConfigValues?.baudRate || 9600,
      baudrate: weightScaleConfigValues?.baudRate || 9600,
      bufferSize: 8192,
      dataBits: 7,
      databits: 7,
      flowControl: 'none',
      parity: 'even',
      rtscts: false,
      stopBits: 1,
      stopbits: 1,
    };

    let port = await getSelectedPort();
    if (!port) {
      return;
    }
    let info = port?.getInfo();
    console.log(info, 'info');

    try {
      await port.open(
        isOldMachine(info) ? oldMachineOptions : newMachineOptions,
      );
    } catch (error) {}
    while (port && port.readable) {
      reader = port?.readable?.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          console.log(value, 'value');
          if (done) {
            reader.releaseLock();
            break;
          }
          if (value) {
            let info = port?.getInfo();
            if (isOldMachine(info)) {
              // old machine
              let newValue = decoder.decode(value);
              console.log(newValue, 'old machine output value');
              weightValue += newValue;
              let replacedValue = weightValue.replace(/[^ -~]+/g, ''); // remove stx string
              let splittedValue = replacedValue.split(' ');
              console.log('old machine running', splittedValue);

              splittedValue?.length > 0 &&
                splittedValue.forEach((item) => {
                  if (
                    selectedBusinessUnit?.value === magnumSteelUnitId ||
                    selectedBusinessUnit.value === isPatUnitId
                  ) {
                    if (item?.length === 7) {
                      setWeight(Number(item));
                    }
                  } else {
                    if (item?.length === 7 && item?.[0] === '+') {
                      let newValue = item.substring(1, 7);
                      setWeight(Number(newValue));
                    }
                  }
                });
            } else {
              // new machine
              let newValue = decoder.decode(value);
              console.log(newValue, 'new machine output value');
              let replacedValue = newValue.replace(/[^ -~]+/g, ''); // remove stx string

              if (
                selectedBusinessUnit?.value === essentialUnitId ||
                selectedBusinessUnit?.value === kofilRazzakUnitId ||
                selectedBusinessUnit?.value === magnumSteelUnitId ||
                selectedBusinessUnit.value === isPatUnitId
              ) {
                let newReplacedValue = replacedValue.replace(/[a-zA-Z]/, '8');
                let replacedValueNumber = Number(newReplacedValue);
                let actualValue = replacedValueNumber / 1000;
                console.log('new machine running', actualValue);
                if (actualValue > 0) {
                  setWeight(actualValue.toFixed());
                }
              } else {
                let splittedValue = replacedValue.split(' ');
                console.log('new machine running', splittedValue);
                splittedValue?.length > 0 &&
                  splittedValue.forEach((item) => {
                    if (item?.length === 5) {
                      setWeight(Number(item));
                    }
                  });
              }
            }
          }
          if (done) {
            break;
          }
        }
      } catch (error) {
        closePort();
      } finally {
        if (reader) {
          reader.releaseLock();
          reader = undefined;
        }
      }
    }
  };

  const enterHandler = () => {
    console.log('Enter handler calling');
    weightValue = '';
    if (connectedPort?.writable == null) {
      console.warn(`unable to find writable port`);
      return;
    }
    writer = connectedPort.writable.getWriter();
    writer.write(encoder.encode('test'));
    writer.releaseLock();
  };

  useEffect(() => {
    let info = connectedPort?.getInfo();
    let interval = null;
    if (isOldMachine(info)) {
      interval = setInterval(() => {
        if (connectedPort) {
          enterHandler();
        }
      }, 250);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  const closePort = async () => {
    try {
      if (connectedPort) {
        if (reader) {
          reader.releaseLock();
        }
        if (connectedPort) {
          await connectedPort.close();
        }
        dispatch(setSerialPortAction(null));
      }
    } catch (error) {}
  };

  useEffect(() => {
    closePort();
  }, []);

  const connectedPortInfo = useMemo(() => {
    if (connectedPort?.getInfo) {
      return connectedPort?.getInfo();
    } else {
      return null;
    }
  }, [connectedPort]);

  const portTitleHandler = () => {
    let isOldMachineValue = isOldMachine(connectedPortInfo);
    if (
      selectedBusinessUnit?.value === magnumSteelUnitId ||
      selectedBusinessUnit.value === isPatUnitId
    ) {
      if (isOldMachineValue) {
        return 'ORION';
      } else {
        return 'SARTORIUS';
      }
    } else {
      if (isOldMachineValue) {
        return 'SCALE-1';
      } else {
        return 'SCALE-2';
      }
    }
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // You can adjust the breakpoint as needed
    };

    // Initial check
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [configModal, setConfigModal] = useState(false);
  return (
    <div className="main-weight-scale">
      <IForm
        isHiddenBack
        isHiddenSave
        isHiddenReset
        title="Weight Scale"
        getProps={setObjprops}
        renderProps={() => {
          return (
            <div className="d-flex align-items-center justify-content-between">
              <h1
                style={{
                  marginRight: isMobile ? 0 : '320px',
                  background: 'rgb(27, 197, 189)',
                  padding: '10px 20px',
                  borderRadius: '4px',
                }}
              >
                <b>Weight: {weight || 0} Kg</b>
              </h1>
              {connectedPort ? (
                <div>
                  <b className="mx-2">
                    Status : <span className="text-success">Connected</span>
                  </b>
                  {connectedPortInfo && (
                    <b className="mr-2">
                      Port :{' '}
                      <span className="text-success">{portTitleHandler()}</span>
                    </b>
                  )}
                </div>
              ) : (
                <div>
                  <b className="mx-2">
                    Status : <span className="text-danger">Disconnected</span>
                  </b>
                </div>
              )}

              <ButtonStyleOne
                className="btn btn-primary"
                style={{ padding: '0.65rem 1rem' }}
                onClick={(e) => {
                  connectHandler();
                }}
                label="Connect"
              />

              <div
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'inline',
                  marginLeft: '7px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setConfigModal(true);
                }}
              >
                <i class="fa fa-cog" aria-hidden="true"></i>
              </div>
            </div>
          );
        }}
      >
        <Tabs
          defaultActiveKey="first-weight"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab unmountOnExit eventKey="first-weight" title="First Weight">
            <FirstWeightCreateEdit weight={weight} />
          </Tab>
          <Tab unmountOnExit eventKey="second-weight" title="Second Weight">
            <SecondWeightCreateEdit weight={weight} />
          </Tab>
        </Tabs>

        {configModal && (
          <IViewModal
            show={configModal}
            onHide={() => {
              setConfigModal(false);
            }}
          >
            <WeightScaleConfig />
          </IViewModal>
        )}
      </IForm>
    </div>
  );
};

export default WeightScale;

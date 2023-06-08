import React, { useRef, useEffect, useState } from "react";

import { useHistory, useParams } from "react-router-dom";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import IViewModal from "./_viewModal";

export default function IForm({
  children,
  isDisabled,
  title,
  getProps,
  emailHandler,
  isShow,
  isHiddenReset,
  isHiddenBack,
  isHiddenSave,
  classes,
  submitBtnText,
  isHelp,
  helpModalComponent,
  supportButtons,
  renderProps,
  isPositionRight,
  customTitle,
}) {
  const [isShowModal, setisShowModal] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const saveBtnRef = useRef();
  const supportButtonRefs = useRef([]);
  const saveBtnClicker = () => {
    if (saveBtnRef && saveBtnRef.current) {
      saveBtnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };
  const supportButtonsClickHandler = (index) => {
    if (supportButtonRefs.current[index].current) {
      supportButtonRefs.current[index].current.click();
    }
  };

  const backHandler = () => {
    history.goBack();
  };

  useEffect(() => {
    const propsObj = {
      resetBtnRef,
      btnRef: saveBtnRef,
      supportButtonRefs: supportButtonRefs,
    };
    getProps && getProps(propsObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const _title = title?.split(" ");
  _title && _title.splice(0, 1);
  return (
    <div className={`${classes} global-card-header`}>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader
          title={
            customTitle ? customTitle : id ? `Edit ${_title.join(" ")}` : title
          }
        >
          <CardHeaderToolbar>
          {(renderProps && !isPositionRight) && renderProps()}
            {supportButtons?.length > 0 &&
              supportButtons?.map((item, index) => {
                return (
                  <button
                    type="button"
                    className={item?.className}
                    onClick={() => {
                      supportButtonsClickHandler(index);
                    }}
                    ref={(obj) => (supportButtonRefs.current[index] = obj)}
                  >
                    {item?.label}
                  </button>
                );
              })}
            {isHelp && (
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={() => {
                  setisShowModal(true);
                }}
              >
                Help
              </button>
            )}
            <button
              type="button"
              onClick={backHandler}
              className={isHiddenBack ? "d-none" : "btn btn-light"}
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>

            {`  `}
            <button
              type="reset"
              onClick={ResetProductClick}
              ref={resetBtnRef}
              className={isHiddenReset ? "d-none" : "btn btn-light ml-2"}
            >
              <i className="fa fa-redo"></i>
              Reset
            </button>
            {`  `}
            <button
              type="submit"
              className={isHiddenSave ? "d-none" : "btn btn-primary ml-2"}
              onClick={saveBtnClicker}
              ref={saveBtnRef}
              disabled={isDisabled}
            >
              {submitBtnText ? submitBtnText : "Save"}
            </button>
            <button
              type="button"
              className={isShow ? "btn btn-primary ml-2" : "d-none"}
              onClick={emailHandler}
              disabled={isDisabled}
            >
              Send
            </button>
            {(renderProps && isPositionRight) && renderProps()}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            {children}

            {/* modal*/}
            {isHelp && (
              <IViewModal
                show={isShowModal}
                onHide={() => setisShowModal(false)}
              >
                {helpModalComponent}
              </IViewModal>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

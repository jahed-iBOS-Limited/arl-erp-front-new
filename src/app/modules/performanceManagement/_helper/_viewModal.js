import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Select from "react-select";
import {
  getScaleForValueDDLAction,
  getValuesPopUpAction,
  getCompetencyPopUpAction,
} from "../_redux/Actions";
import { useLocation } from "react-router-dom";
import { IQueryParser } from "../../_helper/_queryParser";
import IViewModal from "../../_helper/_viewModal";
import customStyles from "../../selectCustomStyle"; 

export default function ViewModal({ show, onHide, history, children }) {
  const location = useLocation();
  const { modalData } = location;
  const { valuesOrComId, typeId, name, existedName } = location;

  const id = IQueryParser("id");
  const type = IQueryParser("type");

  const [obj, setObj] = useState({});
  const data = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        scaleForValue: state.performanceMgt.scaleForValueDDL,
        valuesPopupData: state?.performanceMgt?.valuesPopUp,
        competencyPopUp: state?.performanceMgt?.competencyPopUp,
      };
    },
    { shallowEqual }
  );

  const {
    profileData,
    selectedBusinessUnit,
    scaleForValue,
    valuesPopupData,
    competencyPopUp,
  } = data;

  const dispatch = useDispatch();
  // if not modaldata go back
  useEffect(() => {
    if (!modalData) {
      history.push("/performance-management/employee-entry");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData]);

  useEffect(() => {
    if (modalData?.competencyId) {
      dispatch(getCompetencyPopUpAction(modalData?.competencyId));
      dispatch(
        getScaleForValueDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          3
        )
      );
    }
    if (modalData?.coreValueId) {
      dispatch(getValuesPopUpAction(modalData?.coreValueId));
      dispatch(
        getScaleForValueDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          2
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData]);

  useEffect(() => {
    if (valuesOrComId && typeId === 2) {
      dispatch(getValuesPopUpAction(valuesOrComId));
    }
    if (valuesOrComId && typeId === 3) {
      dispatch(getCompetencyPopUpAction(valuesOrComId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesOrComId, typeId]);

  return (
    <div className="viewModal">
      <IViewModal
        title={typeId === 2 ? "Measuring Values" : "Measuring Competencies"}
        show={show}
        onHide={onHide}
        isShow={false}
      >
        <div className="modelBody mt-4">
          <p>
            <i className="fa fa-font"></i>
            <b>{typeId === 2 ? "Value" : "Competency"} Name: </b>
            {modalData?.coreValueName || modalData?.competencyName || name}
          </p>
          <p>
            <i className="fa fa-audio-description"></i>
            <b>Definition: </b>
            {typeId === 2
              ? modalData?.coreValueDefinition || valuesPopupData[0]?.defination
              : modalData?.competencyDefinition ||
                competencyPopUp[0]?.defination}
          </p>
          <p>
            <i className="fa fa-list-ul"></i>
            <b>Demonstrated Behavior</b>
          </p>
          <ul>
            {typeId === 2
              ? valuesPopupData?.length > 0 && (
                  <div>
                    <div>
                      {valuesPopupData?.filter((item) => item.isPositive)
                        .length > 0 && (
                        <h3
                          style={{
                            background: "#a9f2ab",
                            padding: "10px 12px",
                          }}
                        >
                          <b>Positive</b>
                        </h3>
                      )}

                      {valuesPopupData.map((itm, index) => {
                        return (
                          itm?.isPositive && (
                            <li key={index}>{itm?.demonstratedBehaviour}</li>
                          )
                        );
                      })}
                    </div>
                    <div>
                      {valuesPopupData?.filter((item) => !item.isPositive)
                        .length > 0 && (
                        <h3
                          style={{
                            background: "#f49999",
                            padding: "10px 12px",
                          }}
                        >
                          <b>Negative</b>
                        </h3>
                      )}

                      {valuesPopupData.map((itm, index) => {
                        return (
                          !itm?.isPositive && (
                            <li key={index}>{itm?.demonstratedBehaviour}</li>
                          )
                        );
                      })}
                    </div>
                  </div>
                )
              : competencyPopUp?.length > 0 && (
                  <div>
                    <div>
                      {valuesPopupData?.filter((item) => item.isPositive)
                        .length > 0 && (
                        <h3
                          style={{
                            background: "#a9f2ab",
                            padding: "10px 12px",
                          }}
                        >
                          <b>Positive</b>
                        </h3>
                      )}
                      {competencyPopUp?.map((itm, index) => {
                        return (
                          itm?.isPositive && (
                            <li key={index}>{itm?.demonstratedBehaviour}</li>
                          )
                        );
                      })}
                    </div>
                    <div>
                    {valuesPopupData?.filter((item) => !item.isPositive)
                        .length > 0 && (
                        <h3
                          style={{
                            background: "#f49999",
                            padding: "10px 12px",
                          }}
                        >
                          <b>Negative</b>
                        </h3>
                      )}
                      {competencyPopUp?.map((itm, index) => {
                        return (
                          !itm?.isPositive && (
                            <li key={index}>{itm?.demonstratedBehaviour}</li>
                          )
                        );
                      })}
                    </div>
                  </div>
                )}
          </ul>
          <div className="d-flex">
            <div>Measure: </div>
            <div className="col-lg-3">
              <Select
                onChange={(valueOption) => {
                  setObj({
                    [type]: {
                      [id]: {
                        label: valueOption?.label,
                        id: valueOption?.value,
                        measureValue: valueOption?.mesureValue,
                      },
                    },
                  });
                }}
                isDisabled={valuesOrComId}
                options={scaleForValue}
                defaultValue={existedName && { value: 1, label: existedName }}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
            <button
              style={{ transform: "translateY(-5px)" }}
              className="btn btn-primary ml-6"
              disabled={valuesOrComId}
              onClick={() => onHide(obj)}
            >
              Select
            </button>
          </div>
        </div>
      </IViewModal>
    </div>
  );
}

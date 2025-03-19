import React from "react";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { activeInactiveVoyage } from "../helper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Loading from "../../_chartinghelper/loading/_loading";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
import IViewModal from "../../_chartinghelper/_viewModal";
import VoyageDetails from "../../reports/voyageSummary/table/details";
// import BallastPassageForm from "../../ballastPassage/ballastPassage/Form/addEditForm";
// import BunkerInfoForm from "../../bunkerInformation/form/addEditForm";
// import OffHireForm from "../../offHire/Form/addEditForm";
// import TimeCharterForm from "../../transaction/timeCharter/Form/addEditForm";
// import VoyageCharterForm from "../../transaction/voyageCharter/Form/addEditForm";
// import BunkerCostForm from "../../bunker/bunkerCost/Form/addEditForm";
// import AdditionalCostForm from "../../transaction/additionalCost/Form/addEditForm";
// import LayTimeNewForm from "../../layTimeNew/Form/addEditForm";

const CompleteConfirmation = ({
  show,
  onHide,
  checkList,
  singleRow,
  viewGridData,
  values,
  setShow,
}) => {
  const completed = [];
  const notCompleted = [];
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // const [component, setComponent] = React.useState("");
  const history = useHistory();

  const getTitle = (key) => {
    switch (key) {
      case "isBunkerInfo":
        return "Bunker Information";
      case "isOffHire":
        return "Off Hire";
      case "isInvoice":
        return "Invoice";
      case "isBunkerCost":
        return "Bunker Cost";
      case "isPortPda":
        return "Port PDA";
      case "isBallastPassage":
        return "Ballast Passage";
      case "isExpense":
        return "Expense";
      case "isLayTime":
        return "Lay Time";
      default:
        return null;
    }
  };

  const getDate = (key) => {
    switch (key) {
      case "isBunkerInfo":
        return checkList?.lastActionDateBunkerInfo;
      case "isOffHire":
        return checkList?.lastActionDateOffHire;
      case "isInvoice":
        return checkList?.lastActionDateInvoice;
      case "isBunkerCost":
        return checkList?.lastActionDateBunkerCost;
      case "isBallastPassage":
        return checkList?.lastActionDateBallastPassage;
      case "isExpense":
        return checkList?.lastActionDateExpense;
      case "isLayTime":
        return checkList?.lastActionDateLayTime;
      default:
        return null;
    }
  };

  const getRoute = (key, type) => {
    if (type === "view") {
      switch (key) {
        case "Bunker Information":
          return "/chartering/bunker/bunkerInformation/view/:id";
        case "Off Hire":
          return "/chartering/offHire/view/:id";
        case "Invoice":
          return singleRow?.voyageTypeId === 1
            ? "/chartering/transaction/timecharter/view/:id"
            : "/chartering/transaction/voyagecharter/view/:id";
        case "Bunker Cost":
          return "/chartering/bunker/bunkerCost/view/:id";
        default:
          return "";
      }
    }

    // if (type === "create") {
    //   switch (key) {
    //     case "Bunker Information":
    //       setComponent("BunkerInfo");
    //       break;
    //     case "Off Hire":
    //       setComponent("OffHire");
    //       break;
    //     case "Invoice":
    //       setComponent(
    //         singleRow?.voyageTypeId === 1 ? "timeInvoice" : "voyageInvoice"
    //       );
    //       break;
    //     case "Bunker Cost":
    //       setComponent("BunkerCost");
    //       break;
    //     case "Ballast Passage":
    //       setComponent("BallastPassage");
    //       break;
    //     case "Expense":
    //       setComponent("Expense");
    //       break;
    //     case "Lay Time":
    //       setComponent("LayTime");
    //       break;
    //     case "Details":
    //       setComponent("Details");
    //       break;
    //     default:
    //       return "";
    //   }
    //   setOpen(true);
    //   onHide();
    // }
    if (type === "create") {
      switch (key) {
        case "Bunker Information":
          return "/chartering/bunker/bunkerInformation/create";
        case "Off Hire":
          return "/chartering/offHire/create";
        case "Invoice":
          return singleRow?.voyageTypeId === 1
            ? "/chartering/transaction/timecharter/create"
            : "/chartering/transaction/voyagecharter/create";
        case "Bunker Cost":
          return "/chartering/bunker/bunkerCost/create";
        case "Ballast Passage":
          return "/chartering/ballastPassage/ballastPassage/create";
        case "Expense":
          return "/chartering/expense/expense/create";
        case "Lay Time":
          return "/chartering/layTime/layTime/create";
        default:
          return "";
      }
    }
  };

  for (let key in checkList) {
    if (checkList?.hasOwnProperty(key) && checkList[key] > 0) {
      completed.push({
        checked: checkList[key],
        title: getTitle(key),
        [key]: checkList[key],
        date: getDate(key),
      });
    } else if (checkList?.hasOwnProperty(key) && checkList[key] === 0) {
      notCompleted.push({
        checked: checkList[key],
        title: getTitle(key),
        key: key,
        date: "",
      });
    }
  }

  const voyageComplete = () => {
    const voyageRequired = ["isBunkerInfo", "isInvoice", "isBunkerCost"];
    const timeRequired = ["isBunkerInfo", "isInvoice"];
    if (notCompleted?.length) {
      if (singleRow?.voyageTypeName === "Time Charter") {
        for (let i = 0; i < timeRequired?.length; i++) {
          if (notCompleted?.find((item) => item.key === timeRequired[i])) {
            return toast.error("You have to complete red marked information");
          }
        }
      } else if (singleRow?.voyageTypeName === "Voyage Charter") {
        for (let i = 0; i < voyageRequired?.length; i++) {
          if (notCompleted?.find((item) => item.key === voyageRequired[i])) {
            return toast.error("You have to complete red marked information");
          }
        }
      }
    } else {
      activeInactiveVoyage(singleRow?.voyageId, true, setLoading, () => {
        viewGridData(values);
        onHide();
      });
    }
  };

  return (
    <div>
      {loading && <Loading />}
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="pb-5 pt-2">
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Voyage Completion Check list
            </Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          {completed?.length > 0 && (
            <>
              <div className="d-flex justify-content-between">
                <h5>Completed</h5>
                <h6>Completed date</h6>
              </div>
              {completed.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="mt-3 d-flex align-items-center">
                      <input
                        type="checkbox"
                        id="isOtherInfo"
                        value={item?.checked}
                        defaultChecked={item?.checked}
                      />
                      <label className="pl-1">{item?.title}</label>
                    </div>
                    <p>{_dateFormatter(item?.date)}</p>
                  </div>
                );
              })}
              <br />
            </>
          )}

          {notCompleted?.length > 0 && (
            <>
              <h5>Incompleted</h5>
              {notCompleted.map((item, index) => {
                return (
                  <div key={index} className="mt-3 d-flex align-items-center">
                    <i
                      className="fas fa-exclamation-triangle"
                      style={{ color: "red" }}
                    ></i>
                    {}
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="cs-icon">
                          {`Click here to complete ${item?.title}`}
                        </Tooltip>
                      }
                    >
                      <span>
                        <label
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          className="pl-1 text-primary font-weight-bold"
                          onClick={() => {
                            history.push(getRoute(item?.title, "create"));
                            getRoute(item?.title, "create");
                          }}
                        >
                          {item?.title}
                        </label>
                      </span>
                    </OverlayTrigger>
                  </div>
                );
              })}
            </>
          )}
          <p
            style={{
              cursor: "pointer",
              // textDecoration: "underline",
            }}
            className="text-primary text-center mt-2 mb-0"
            onClick={() => {
              setOpen(true);
              onHide();
            }}
          >
            See Details Information
          </p>
        </Modal.Body>
        <Modal.Footer style={{ padding: ".5rem" }}>
          <button
            type="button"
            onClick={() => onHide()}
            className="btn btn-light"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              voyageComplete();
            }}
            className="btn btn-primary"
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
      <IViewModal
        show={open}
        onHide={() => {
          setShow(true);
          setOpen(false);
        }}
      >
        {/* {component === "BunkerInfo" && <BunkerInfoForm />}
        {component === "OffHire" && <OffHireForm />}
        {component === "timeInvoice" && <TimeCharterForm />}
        {component === "voyageInvoice" && <VoyageCharterForm />}
        {component === "BunkerCost" && <BunkerCostForm />}
        {component === "BallastPassage" && <BallastPassageForm />}
        {component === "Expense" && <AdditionalCostForm />}
        {component === "LayTime" && <LayTimeNewForm />} */}
        <VoyageDetails singleRow={singleRow} />
      </IViewModal>
    </div>
  );
};

export default CompleteConfirmation;

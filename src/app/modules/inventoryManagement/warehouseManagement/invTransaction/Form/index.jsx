/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
import IForm from "../../../../_helper/_form";
import IssueInvantory from "./issueInvantory/CreateForm";
import ReturnDelivery from "./returnDelivery/CreateForm";
import ReleaseInventory from "./releaseInventory/CreateForm";
import ReceiveInventory from "./receiveInventory/createForm";
import { IQueryParser } from "../../../../_helper/_queryParser";
import { useLocation } from "react-router-dom";
import TransferInventory from "./transferInventory/createForm";
import RemoveInventory from "./removeInventory/CreateForm";
import AdjustInventory from "./adjustInventory/CreateForm";
import InventoryPosting from "./inventoryPosting/CreateForm";
import InternalInventory from "./internalInventory/CreateForm";
import { useSelector } from "react-redux";
import TransferInForm from "./transferIn/createForm";
import IssueReturnForm from "./issueReturn/createForm";

export function ForminvTrans() {
  const [isDisabled, setDisabled] = useState(true);
  const [title, setTitle] = useState(null);
  const [InvForm, setInvForm] = useState(<></>);

  const potype = IQueryParser("potype");
  const location = useLocation();

  const lastInvData = useSelector((state) => state?.localStorage?.lastInvData);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});
  useEffect(() => {
    switch (+potype) {
      case 1:
        {
          setInvForm(
            <ReceiveInventory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle(
            `Create Receive Inventory ${lastInvData ? lastInvData : ""}`
          );
        }
        break;
      case 2:
        {
          setInvForm(
            <IssueInvantory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Issue Inventory");
        }
        break;
      case 3:
        {
          setInvForm(
            <ReturnDelivery
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Purchase Return");
        }
        break;
      case 4:
        {
          setInvForm(
            <TransferInventory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Transfer Inventory (Warehouse)");
        }
        break;
      case 5:
        {
          setInvForm(
            <ReleaseInventory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Release Inventory");
        }
        break;
      case 6:
        {
          setInvForm(
            <RemoveInventory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Remove Inventory");
        }
        break;
      case 7:
        {
          setInvForm(
            <AdjustInventory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Adjust Inventory");
        }
        break;
      case 8:
        {
          setInvForm(
            <InventoryPosting
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Cancel Inventory Posting");
        }
        break;
      case 9:
        {
          setInvForm(
            <InternalInventory
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Transfer Inventory (internal)");
        }
        break;
      case 13:
        {
          setInvForm(
            <TransferInForm
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Transfer In");
        }
        break;
      case 14:
        {
          setInvForm(
            <IssueReturnForm
              disableHandler={disableHandler}
              landingData={location.state}
              {...objProps}
            />
          );
          setTitle("Create Issue Return");
        }
        break;
      default:
        setInvForm(
          <ReceiveInventory
            disableHandler={disableHandler}
            landingData={location.state}
            {...objProps}
          />
        );
        setTitle("Create Receive Inventory");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potype, objProps, lastInvData]);

  return (
    <IForm title={`${title}(Warehouse : ${location?.state?.warehouse?.label})`} getProps={setObjprops} isDisabled={isDisabled}>
      {InvForm}
    </IForm>
  );
}

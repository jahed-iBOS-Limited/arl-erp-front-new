/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { shallowEqual, useSelector } from "react-redux";
// import CreateUserForm from '../createUser-create/createUserForm'
// import { useHistory } from "react-router-dom";
// import * as actions from "../../../_redux/products/productsActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

//import Form from "./form";
// import Axios from "axios";
// const initProduct = {
//   id: undefined,
//   businessUnit: "",
//   code: "",
//   language: "",
//   baseCurrency: "",
// };

// console.log('createuseredit')

export default function CreateUserEdit({
  history,
  match: {
    params: { id },
  },
}) {
  console.log(history, id);
  const [tab, setTab] = useState("basic");
  const [title, setTitle] = useState("");

  // const saveBusinessUnit = async (values) => {};

  const btnRef = useRef();
  // const saveBtnClicker = () => {
  //   console.log("entered");
  //   if (btnRef && btnRef.current) {
  //     btnRef.current.click();
  //   }
  // };

  const backHandler = () => {
    history.push(`/config/domain-controll/create-user/`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title={title}>
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>

          <button className="btn btn-light ml-2">
            <i className="fa fa-redo"></i>
            Reset
          </button>

          <button
            type="submit"
            className="btn btn-primary ml-2"
            //onClick={saveBtnClicker}
            ref={btnRef}
          >
            Save data
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ul className="nav nav-tabs nav-tabs-line " role="tablist">
          <li className="nav-item" onClick={() => setTab("basic")}>
            <a
              className={`nav-link ${tab === "basic" && "active"}`}
              data-toggle="tab"
              role="tab"
              aria-selected={(tab === "basic").toString()}
            >
              Basic info
            </a>
          </li>
        </ul>
        {/* <div className="mt-5">
          {tab === "basic" && (
            <CreateUserForm
               
              product=""
              btnRef={btnRef}
              saveBusinessUnit={saveBusinessUnit}
 
            />
          )}
           
        </div> */}
      </CardBody>
    </Card>
  );
}

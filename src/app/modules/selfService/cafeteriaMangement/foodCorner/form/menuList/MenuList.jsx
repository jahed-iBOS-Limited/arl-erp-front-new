/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  CardHeader,
  Card,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import Form from "./Form";
import { fetchMenuListData } from "../../helper/action";
import { useSelector, shallowEqual } from "react-redux";

function MenuList() {
  const [editMode,] = useState(false);
  const [menuListArray, setMenuListArray] = useState([]);
  const [menuFormData, setMenuFormData] = useState({
    sunday: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    saturday: "",
  });

  const onChangeFiledHandler = (name, value) => {
    setMenuFormData({
      ...menuFormData,
      [name]: value,
    });
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    fetchMenuListData(profileData.userId, setMenuListArray);
  }, []);

  useEffect(() => {
    let obj = {
      sunday: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      saturday: "",
    };
    menuListArray.length > 0 &&
      menuListArray.forEach(
        (item) => (obj[item?.strDayName.toLowerCase()] = item?.strMenuList)
      );
    setMenuFormData(obj);
  }, [menuListArray]);

  return (
    <div>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Menu List">
          <CardHeaderToolbar></CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Form
            menuListArray={menuListArray}
            editMode={editMode}
            onChangeFiledHandler={onChangeFiledHandler}
            menuFormData={menuFormData}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default MenuList;

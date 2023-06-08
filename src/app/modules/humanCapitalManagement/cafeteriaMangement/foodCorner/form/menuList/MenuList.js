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
import { fetchMenuListData, menuUpdatePost } from "../../helper/action";
import { useSelector, shallowEqual } from "react-redux";

function MenuList() {
  const [editMode, setEditMode] = useState(false);
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

  //user Permission for public start
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const foodCornerFoodMenu = userRole.filter((item)=>item?.strFeatureName === "Food Corner Food Menu");
//user Permission for public end

console.log(foodCornerFoodMenu, 'foodCornerFoodMenu')

  useEffect(() => {
    fetchMenuListData(profileData.userId, setMenuListArray);
  }, []);

  const updateHandler = () => {
    let arr = Object.values(menuFormData).map((item, i) => ({autoId: i+1, menu: item}))
    console.log(arr) 
    menuUpdatePost(profileData.userId, arr, setEditMode, setMenuListArray);
  };

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
          <CardHeaderToolbar>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                type="button"
                className="btn  btn-primary"
                disabled={foodCornerFoodMenu[0]?.isEdit === false}
              >
                Edit Menu
              </button>
            ) : (
              <button
                onClick={() => updateHandler()}
                type="button"
                className="btn  btn-primary"
                disabled={
                  !menuFormData.sunday ||
                  !menuFormData.monday ||
                  !menuFormData.tuesday ||
                  !menuFormData.wednesday ||
                  !menuFormData.thursday ||
                  !menuFormData.saturday
                }
              >
                Update Data
              </button>
            )}
          </CardHeaderToolbar>
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

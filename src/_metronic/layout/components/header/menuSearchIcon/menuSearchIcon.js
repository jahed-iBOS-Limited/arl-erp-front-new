import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import SearchList from "./searchList";
import "./style.css";
import { useComponentVisible } from "./useComponentVisible";
function MenuSearchIcon() {
  const { menu } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [searchMenuList, setSearchMenuList] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const textInput = useRef(null);
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  // if search list hide
  useEffect(() => {
    if (!isComponentVisible) {
      setSearchMenuList("");
      setSearchValue("");
    }
    if (isComponentVisible) textInput.current.focus();
  }, [isComponentVisible]);

  const menuAllThirdListFunc = (typeValue) => {
    const lists = [];
    menu.forEach((itm) => {
      if (itm?.subs?.length > 0) {
        itm.subs.forEach((sub) => {
          if (sub?.nestedSubs?.length > 0) {
            sub.nestedSubs.forEach((nestedSub) => {
              lists.push(nestedSub);
            });
          }
        });
      }
    });

    const filteredCountries = lists.filter((itm) => {
      return (
        itm?.label?.toLowerCase()?.indexOf(typeValue?.toLowerCase()) !== -1
      );
    });
    return filteredCountries;
  };

  return (
    <>
      <div className="menuSearchIcon align-self-center  position-relative">
        <div ref={ref} className="position-relative">
          {!isComponentVisible && (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="quick-user-tooltip">Quick Menu Search </Tooltip>
              }
            >
              <i
                class="fas fa-search mr-2 pointer animate-bounce mt-3"
                onClick={() => setIsComponentVisible(true)}
              ></i>
            </OverlayTrigger>
          )}

          {isComponentVisible && (
            <>
              <input
                type="text"
                ref={textInput}
                id="menuSearchTextBox"
                class="form-control"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e?.target?.value?.trim()) {
                    setSearchMenuList(menuAllThirdListFunc(e.target.value));
                  } else {
                    setSearchMenuList("");
                  }
                }}
                placeholder={"Type Menu Name"}
                style={{
                  height: "26px",
                  width: "230px",
                  position: "absolute",
                  right: 0,
                  top: "-13px",
                }}
              />
              {searchMenuList?.length > 0 && searchValue && (
                <SearchList searchMenuList={searchMenuList} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MenuSearchIcon;

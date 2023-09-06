import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { matchText } from "./matchData";
import { useState } from "react";

function Commands({ listening, transcript, resetTranscript, setComponetRender }) {
  const [menuList, setMenuList] = useState([]);

  const { menu } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    let menuList = [];
    if (menu?.length > 0) {
      menu.forEach((firstLevelMenu) => {
        if (firstLevelMenu.subs.length > 0) {
          firstLevelMenu.subs.forEach((secondLevelMenu) => {
            if (secondLevelMenu.nestedSubs.length > 0) {
              secondLevelMenu.nestedSubs.forEach((thardLevelMenu) => {
                menuList.push({ ...thardLevelMenu });
              });
            } else {
            }
          });
        }
      });
    }
    setMenuList([
      {
        label: "Dashboard",
        to: "/",
      },
      {
        label: "Home",
        to: "/",
      },
      ...menuList,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  const history = useHistory();
  useEffect(() => {
    if (!listening && transcript) {
      const result = matchText(transcript, menuList);
      if (result) {
        history.push(result);
        resetTranscript();
        setComponetRender(false)
      } else {
        toast.warn("Menu not found");
        resetTranscript();
        setComponetRender(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);
  return (
    <span className='pr-2'>
      {listening && !transcript ? "`Speak Menu Name`" : transcript}
    </span>
  );
}

export default Commands;

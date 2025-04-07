import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { matchText } from './matchData';
import { useState } from 'react';

function Commands({ listening, transcript, resetTranscript }) {
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
        label: 'Dashboard',
        to: '/',
      },
      {
        label: 'Home',
        to: '/',
      },
      ...menuList,
    ]);
  }, [menu]);

  const history = useHistory();
  useEffect(() => {
    if (!listening && transcript) {
      const result = matchText(transcript, menuList);
      if (result) {
        history.push(result);
        resetTranscript();
      } else {
        toast.warn('Menu not found');
        resetTranscript();
      }
    }
  }, [listening, transcript]);
  return (
    <span className="pr-2">
      {listening && !transcript ? '`Speak Menu Name`' : transcript}
    </span>
  );
}

export default Commands;

import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useAxiosPost from './useAxiosPost';
import useDebounce from './useDebounce';

export default function useMenuTracking() {
  const { menu, profileData } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const debounce = useDebounce();

  const locationPath = useLocation();
  const [, CreateMenuTracking] = useAxiosPost();
  const createMenuTracking = (payload) => {
    CreateMenuTracking(
      '/partner/BusinessPartnerBasicInfo/CreateMenuTracking',
      payload
    );
  };

  useEffect(() => {
    if (menu?.length > 0) {
      menu.forEach((firstLevelMenu) => {
        if (firstLevelMenu.subs.length > 0) {
          firstLevelMenu.subs.forEach((secondLevelMenu) => {
            if (secondLevelMenu.nestedSubs.length > 0) {
              secondLevelMenu.nestedSubs.forEach((thardLevelMenu) => {
                const str = locationPath?.pathname?.toLowerCase();
                const regex = new RegExp(thardLevelMenu?.to?.toLowerCase());
                const isMatch = regex?.test(str);
                if (isMatch) {
                  debounce(() => {
                    createMenuTracking({
                      menuId: thardLevelMenu?.id,
                      label: thardLevelMenu?.label,
                      toUrl: locationPath?.pathname?.toLowerCase(),
                      userId: profileData?.userId,
                    });
                  });
                }
              });
            } else {
              const str = locationPath?.pathname?.toLowerCase();
              const regex = new RegExp(secondLevelMenu?.to?.toLowerCase());
              const isMatch = regex.test(str);
              if (isMatch) {
                debounce(() => {
                  createMenuTracking({
                    menuId: secondLevelMenu?.id,
                    label: secondLevelMenu?.label,
                    toUrl: locationPath?.pathname?.toLowerCase(),
                    userId: profileData?.userId,
                  });
                });
              }
            }
          });
        }
      });
    }
  }, [locationPath, menu]);

  return null;
}

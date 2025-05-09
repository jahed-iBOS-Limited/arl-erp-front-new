import React, { useMemo } from 'react';
import { AsideMenuList } from './AsideMenuList';
import { useHtmlClassService } from '../../../_core/MetronicLayout';

export function AsideMenu({ disableScroll }) {
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      asideMenuAttr: uiService.getAttributes('aside_menu'),
      ulClasses: uiService.getClasses('aside_menu_nav', true),
      asideClassesFromConfig: uiService.getClasses('aside_menu', true),
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Menu Container */}
      <div
        id="kt_aside_menu"
        data-menu-vertical="1"
        className={`aside-menu my-1 ${layoutProps.asideClassesFromConfig}`}
        {...layoutProps.asideMenuAttr}
      >
        <div className="text-center d-flex justify-content-center">
          {/* <SelectUnit/> */}
        </div>
        <AsideMenuList layoutProps={layoutProps} />
      </div>
      {/* end::Menu Container */}
    </>
  );
}

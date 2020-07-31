import React, { useState, useCallback, FunctionComponent } from 'react'

import { ClickAwayListener } from '@material-ui/core'
import { IHandleSave } from '../../@types/functions'
// import File from './File';
// import Edit from './Edit';

const AppBarMenu: FunctionComponent<{ handleSave: IHandleSave }> = () =>
  // {
  //   // handleSave,
  // }
  {
    const [isMenuOpenable, setIsMenuOpenable] = useState(false)
    const [openedMenuName, setOpenedMenuName] = useState(null)

    // const handleHoverMenu = useCallback(
    //   (menuName) => {
    //     if (isMenuOpenable) setOpenedMenuName(menuName)
    //   },
    //   [isMenuOpenable, setOpenedMenuName]
    // )

    // const handleClickMenu = useCallback(
    //   (menuName) => {
    //     if (isMenuOpenable) {
    //       setIsMenuOpenable(false)
    //       if (openedMenuName) setOpenedMenuName(null)
    //     } else {
    //       setIsMenuOpenable(true)
    //       setOpenedMenuName(menuName)
    //     }
    //   },
    //   [isMenuOpenable, openedMenuName, setIsMenuOpenable, setOpenedMenuName]
    // )

    const handleClickAway = useCallback(() => {
      if (isMenuOpenable) setIsMenuOpenable(false)
      if (openedMenuName) setOpenedMenuName(null)
    }, [isMenuOpenable, openedMenuName, setIsMenuOpenable, setOpenedMenuName])

    // const commonMenuItemProps = useMemo(
    //   () => ({
    //     openedMenuName,
    //     handleClickMenu,
    //     handleHoverMenu,
    //   }),
    //   [openedMenuName, handleClickMenu, handleHoverMenu]
    // )

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="appBarMain__menu">
          {/* <File {...commonMenuItemProps} handleSave={handleSave} />
        <Edit {...commonMenuItemProps} /> */}
        </div>
      </ClickAwayListener>
    )
  }

export default AppBarMenu

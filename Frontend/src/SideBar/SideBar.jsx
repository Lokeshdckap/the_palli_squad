import React from 'react'
import { SideBarComponent } from './SideBarComponent'

export const SideBar = ({param}) => {
  return (
    <div>
        <SideBarComponent 
          param={param}
        />
    </div>
  )
}

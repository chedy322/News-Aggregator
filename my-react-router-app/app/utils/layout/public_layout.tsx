import React from 'react'
import { Outlet } from 'react-router'
import Nav from '~/components/Nav/Nav'

function Public_layout() {
  return (
    <div>
      <Nav/>
      <Outlet/>
    </div>
  )
}

export default Public_layout

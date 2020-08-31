import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { EditOutlined, EyeOutlined, LogoutOutlined } from '@ant-design/icons'

import './Header.scss'

import logo from './assets/logo.png'

const menu = (
  <Menu>
    <Menu.Item key="0">
      <EyeOutlined /> View
    </Menu.Item>

    <Menu.Item key="1">
      <EditOutlined /> Edit
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item key="3">
      <LogoutOutlined /> Logout
    </Menu.Item>
  </Menu>
)

const Header = () => {
  return (
    <div className="header">
      <div>
        <img src={logo} alt="Rolling Scopes School Logo" height="30"></img>
      </div>

      <div>
        <b>Schedule</b>
      </div>

      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="dashed">My Profile</Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default Header

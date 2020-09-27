import React from 'react'
import { Spin } from 'antd'

import './Spinner.scss'

const Spinner = () => {
  return (
      <Spin 
        className="spinner"
        size="large"/>
  )
}

export default Spinner

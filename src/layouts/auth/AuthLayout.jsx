import { Outlet } from 'react-router-dom'
import {Row} from 'antd'
const AuthLayout = () => {
  return (
    <Row className='w-[100vw] h-[100vh] items-center' justify="center">
      <Outlet/>
    </Row>
  )
}

export default AuthLayout
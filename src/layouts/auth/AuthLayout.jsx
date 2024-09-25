import { Outlet } from 'react-router-dom'
import {Row} from 'antd'
const AuthLayout = () => {
  return (
    <Row className='w-[100vw] h-[100vh] items-center' justify="center" style={{
      background: 'linear-gradient(to bottom right, #A4E2F7, #328FDF)'
    }}>
      <Outlet/>
    </Row>
  )
}

export default AuthLayout
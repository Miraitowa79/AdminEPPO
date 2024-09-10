import { Outlet } from 'react-router-dom'
import {Row} from 'antd'
const AuthLayout = () => {
  return (
    <Row className='w-[100vw] h-[100vh] items-center' justify="center" style={{
      background: 'linear-gradient(to bottom right, #7dbae38d, #46b4fd)'
    }}>
      <Outlet/>
    </Row>
  )
}

export default AuthLayout
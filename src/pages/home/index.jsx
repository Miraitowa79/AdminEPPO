import {Button} from 'antd'
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate()
  return (
    <>
      This is a home page
      <Button onClick={() => {
        localStorage.clear('authUser')
        return navigate('/auth/login')
        }
        }>Logout</Button>
    </>
  )
}

export default Home
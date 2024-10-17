import Routes from "./routes/Routes"
import { notification } from 'antd'
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => {
  const [_, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <Provider store={store}>
        <Routes/>
      </Provider>
    </>
  )
}

export default App

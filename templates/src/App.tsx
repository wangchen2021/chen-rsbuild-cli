import { useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { increment } from './store/slices/test';
import MyButton from './components/MyButton';
import { postLogin } from './api';

const App = () => {
  const count = useAppSelector((state) => state.test.count);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(ENV_CONFIG);
  }, []);
  const test = () => {
    dispatch(increment());
  };
  const login = () => {
    postLogin({
      username: 'admin',
      password: '123456',
    });
  };
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <p>Current count: {count}</p>
      <button onClick={test}>Click me</button>
      <MyButton text="My Button" />
      <button onClick={login}>Click me to log mock url</button>
    </div>
  );
};

export default App;

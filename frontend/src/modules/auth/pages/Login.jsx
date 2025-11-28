import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { btnStyle, inputStyle, labelStyle } from '../../../styles/componentsStyle';
import { Eye, EyeOff } from 'lucide-react'; // 👈 import icons
import { playSound } from '../../../utils/soundPlayer';


const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 30 * 1000;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [attempts, setAttempts] = useState(0);


  const togglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const savedAttempts = Number(localStorage.getItem('loginAttempts')) || 0;
    const blockedUntil = Number(localStorage.getItem('blockedUntil')) || 0;

    setAttempts(savedAttempts);
    if (blockedUntil > Date.now()) {
      setRemainingTime(blockedUntil - Date.now());
    }
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) return;
    const timer = setInterval(() => {
      const blockedUntil = Number(localStorage.getItem('blockedUntil')) || 0;
      const diff = blockedUntil - Date.now();
      if (diff <= 0) {
        localStorage.removeItem('blockedUntil');
        setRemainingTime(0); 
        setAttempts(0);
        localStorage.setItem('loginAttempts', '0');
        clearInterval(timer);
      } else {
        setRemainingTime(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const onSubmit = async (data) => {
    const blockedUntil = Number(localStorage.getItem('blockedUntil')) || 0;
    if (blockedUntil > Date.now()) {
      toast.error(`⏳ Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again`);
      return;
    }
    try {
      // const { data: { token } } = await api.post('/auth/owner/login', data);
      const { data: { token } } = await api.post('/auth/doctor/login', data);
      // console.log(token)
      localStorage.setItem('token', token); 

      // const { data: user } = await api.get('/auth/owner/identify');
      const { data: user } = await api.get('/auth/doctor/identify');
      // console.log(user.data)
      // console.log(user.data)
      login(user.data);
      // reset attempts after successful login
      setAttempts(0);
      localStorage.setItem('loginAttempts', '0');
      localStorage.removeItem('blockedUntil');

      navigate("/"+user.data.role || '/unauthorized');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg, { onOpen: playSound("error") });

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const blockedUntil = Date.now() + BLOCK_TIME;
        localStorage.setItem('blockedUntil', blockedUntil.toString());
        setRemainingTime(BLOCK_TIME);
        toast.error(`🚫 Too many attempts. Try again in ${BLOCK_TIME / 1000} seconds`);
      }
      // alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {/* ✅ Show timeout message only if user is blocked */}
      {remainingTime > 0 && <TooManyAttempts remainingTime={remainingTime} />}
      <div className="space-y-2 mb-2">
        <div>
          <label className={labelStyle.primary}>Email</label>
          <input
            {...register('email', { 
              required: '*Email is required', 
              pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
              },
            })}
            placeholder='Your Username / Email'
            className={inputStyle.primary}
          />
          {errors.email && <p className={inputStyle.fieldError}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelStyle.primary}>Password</label>
          <div className="relative">
            <input
              placeholder='Your Password'
              {...register('password', { required: 'Password is required' })}
              type={showPassword ? 'text' : 'password'}
              className={`${inputStyle.primary} pr-10`} // add padding so icon doesn’t overlap
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className={inputStyle.fieldError}>{errors.password.message}</p>}
        </div>

        <button type={attempts < 5?"submit":"button"} className={`${attempts < 5 ? btnStyle.filled:btnStyle.disabled} w-full`}>
          Log In
        </button>
      </div>
      <Link to="/auth/forgot-password">🔐 Forgot Password ?</Link>
    </form>
  );
};

export default Login;


function TooManyAttempts({ remainingTime }) {
  return (
    <div className="mb-4 text-red-600 text-center font-semibold">
      ⏳ Too many attempts. Please wait {Math.ceil(remainingTime / 1000)}s
    </div>
  );
}
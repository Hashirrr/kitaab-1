'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from './login.module.css';
import useLoginForm from './useLoginForm';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/auth/hook';
import { LoginFormProps } from './interface';
import { useAppDispatch } from '@/store/hooks';
import Input from '@/components/primitive/input/Input';
import Tooltip from '@/components/primitive/tooltip/Tooltip';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { getLoginTooltip, handleFormSubmit, isFormDisabled } from './utils';

export default function LoginForm({ onSubmit, onGuestLogin, onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutateAsync: loginMutation, isPending: isLoginPending } = useLogin();

  const formik = useLoginForm({
    onSubmit: (values, helpers) => handleFormSubmit(values, helpers, loginMutation, router, dispatch, onSubmit)
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const isLoginDisabled = isFormDisabled(formik.values, formik.errors, formik.isValid);

  return (
      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        <Input
          required
          type='email'
          label='Email'
          name='email'
          placeholder='Enter your email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helper={formik.touched.email ? formik.errors.email : undefined}
          autoComplete='email'
          left={<FaEnvelope size={14} />}
        />

        <Input
          required
          name='password'
          label='Password'
          onBlur={formik.handleBlur}
          left={<FaLock size={14} />}
          value={formik.values.password}
          onChange={formik.handleChange}
          autoComplete='current-password'
          placeholder='Enter your password'
          type={showPassword ? 'text' : 'password'}
          helper={formik.touched.password ? formik.errors.password : undefined}
          right={
            <button
              type='button'
              className={styles.visibility__btn}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          }
        />

        <div className={styles.forgot__password__wrapper}>
          <button
            type='button'
            className={styles.forgot__password}
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <div className={styles.button__group}>
          <button
            type='button'
            className={clsx(styles.btn, styles.secondary__btn)}
            onClick={onGuestLogin}
          >
            Login as Guest
          </button>
          <Tooltip content={isLoginDisabled ? getLoginTooltip(formik.errors) : ''}>
            <span className={styles.btn__wrapper}>
              <button
                type='submit'
                disabled={isLoginDisabled || isLoginPending}
                className={clsx(styles.btn, styles.primary__btn)}
              >
                {isLoginPending ? 'Logging in...' : 'Login'}
              </button>
            </span>
          </Tooltip>
        </div>
      </form>
  );
}
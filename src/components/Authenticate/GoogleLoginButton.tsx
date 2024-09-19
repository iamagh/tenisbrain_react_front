import React from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAuth } from 'context/AuthContext';

import { useGoogleLogin } from '@react-oauth/google';
import googleSvg from "images/Google.svg";
import { toast } from 'react-toastify';
import { callbackOauthGoogleLogin, callbackOauthGoogleRegister } from 'services/auth';
import { setAuthData } from "store/userSlice";

interface Props {
  isSignUp: string;
  isCoach?: string;
  coachData?: any;
}

const GoogleLoginButton: React.FC<Props> = ({ isSignUp, isCoach = '', coachData = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login: signin } = useAuth();

  const login = useGoogleLogin({
    onSuccess: tokenResponse => handleSuccess(tokenResponse),
    onError: () => console.log("Login Failed"),
  })
  /**
   * 
   * @param {response}
   * @returns void
   * 
  */
  const handleSuccess = async (response: any) => {
    try {
      let res = null;
      if (isSignUp === 'sign_up') {
        res = await callbackOauthGoogleRegister(response.access_token, isCoach, coachData);
      } else {
        res = await callbackOauthGoogleLogin(response.access_token);
      }
      /**
       * 
       * set LocalStorage with response
       */
      signin(res);
      if (res) {
        dispatch(setAuthData(res));
        if (isSignUp === 'sign_up') {
          // signup process
          if (res.role == 'coach') {
            navigate("/availability");
          }
          if (res.role == 'player') {
            navigate("/members");
          }
        } else {
          if (res.role == 'coach') {
            navigate("/calendar");
          } else {
            navigate("/player-calendar");
          }
        }
      }
      // Handle success, e.g., store token and redirect
    } catch (error: any) {
      console.error('Google login failed', error);
      if (isSignUp === 'sign_up') {
        toast.error(error.message || 'Google SignUp failed');
      } else {
        toast.error(error.message || 'Google login failed');
      }
    }
  };

  return (
    <button
      className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
      type='button'
      onClick={() => login()}
    >
      <img
        className="flex-shrink-0"
        src={googleSvg}
        alt={'googleSvg'}
      />
      <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
        Continue with Google
      </h3>
    </button>
  );
};

export default GoogleLoginButton;

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import facebookSvg from "images/Facebook.svg";
import { callbackOauthLogin } from 'services/auth';

const FacebookLoginButton = () => {
  const handleResponse = async (response: any) => {
    try {
      const res = await callbackOauthLogin('facebook', response.accessToken);
      // Handle success, e.g., store token and redirect
      console.log(res)
    } catch (error) {
      console.error('Facebook login failed', error);
    }
  };

  return (
    <FacebookLogin
      appId="1088597931155576"
      callback={handleResponse}
      render={(renderProps: any) => (
        <button
          className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
          onClick={renderProps.onClick}
        >
          <img
            className="flex-shrink-0"
            src={facebookSvg}
            alt={'facebookSvg'}
          />
          <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
            Continue with Facebook
          </h3>
        </button>
      )}
    />
  );
};

export default FacebookLoginButton;

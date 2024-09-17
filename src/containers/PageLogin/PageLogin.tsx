import React, { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import facebookSvg from "images/Facebook.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet-async";
import Input from "shared/Input/Input";
import { useAuth } from "context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { login as userLogin } from "services/auth";
import GoogleLoginButton from "components/Authenticate/GoogleLoginButton";
import BackgroundImg from "images/pred_back.jpg";
import { QUOTES } from "data/data";

// import FacebookLoginButton from "components/Authenticate/FacebookLoginButton";
import { setAuthData } from "store/userSlice";

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const [randomQuote, setRandomQuote] = useState<any>(null);
  const { login } = useAuth();

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length); // Random index from 0 to 22
    setRandomQuote(QUOTES[randomIndex]);
  };

  useEffect(() => {
    generateRandomQuote();
  }, []);


  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await userLogin(email, password);
      login(data);
      dispatch(setAuthData(data));
      // const data = await get_csrf_token();
      // set authcontext
      // axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      // Navigate to dashboard or display success message
      toast.success('Login is successful.')
      if(data.role == 'coach') {
        navigate("/calendar");
      }
      if(data.role == 'player') {
        // handle user first sign up
        const playerDetail = localStorage.getItem(`${data.role}-guide`) || "{}";
        const playerGuide = JSON.parse(playerDetail);
        if (Object.keys(playerGuide).length) {
          for (let guide in playerGuide) {
            if(playerGuide[guide] === "no") {
              navigate(`/${guide}`);
              break;
            }
          }
          navigate("/player-calendar");
        } else {
          navigate("/player-calendar");
        }
      }
    } catch (error: any) {
      // setError(error);
      toast.error(error.error || 'Invalid credential.')
      console.log(error);
    }
  };

  return (
    <div className={`nc-PageLogin min-h-[calc(100vh-5rem)] flex justify-center items-center ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Login || Ciseco React Template</title>
      </Helmet>
      <div className="my-4 flex flex-col mx-4 xs:mx-8 sm:my-8 sm:flex-row shadow-[0_10px_34px_-15px_rgba(0,0,0,0.24)] rounded w-full sm:mx-0 sm:w-4/5 md:w-3/4 lg:w-2/3">
        <div
          className="w-full sm:w-1/2 md:w-2/5 min-h-[200px] p-4 bg-cover text-white rounded-t sm:rounded-l sm:rounded-tr-none"
          style={{ backgroundImage: `url(${BackgroundImg})` }}
        >
          {
            randomQuote && <div className="text text-xl w-100">
              <h1 className="mb-4">
                " {randomQuote.quote} "
              </h1>
              <p>- {randomQuote.author}</p>
            </div>
          }
        </div>
        <div className="mx-auto w-full sm:w-1/2 md:w-3/5 space-y-6 py-4 px-8">
          <div className="grid gap-3">
            <GoogleLoginButton isSignUp="sign_in" />
            {/* {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <img
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))} */}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="tennis@brain.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link to="/forgot-pass" className="text-sm text-green-600">
                  Forgot password?
                </Link>
              </span>
              <Input type="password" className="mt-1" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </label>
            <ButtonPrimary type="submit">Sign In</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" to="/signup">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;

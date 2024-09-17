import React, { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Checkbox from "shared/Checkbox/Checkbox";
import { toast } from "react-toastify";
import { setAuthData } from "store/userSlice";
import BackgroundImg from "images/pred_back.jpg";
import { QUOTES } from "data/data";

import { useAuth } from "context/AuthContext";

import GoogleLoginButton from "components/Authenticate/GoogleLoginButton";
// import FacebookLoginButton from "components/Authenticate/FacebookLoginButton";

import { signup } from "services/auth";

export interface PageSignUpProps {
  className?: string;
}

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [first_name, setFirstName] = useState<string>("");
  const [last_name, setLastName] = useState<string>("");
  const [role, setRole] = useState<string>("player");
  const [coachInfo, setCoachInfo] = useState({
    phone: '+440123456767',
    dayOfbirth: '2024-04-23',
    gender: 'Male',
    Qualifications: '',
    club: '',
    clubAddress: '',
  });
  const [error, setError] = useState<string>("");

  const [randomQuote, setRandomQuote] = useState<any>(null);

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length); // Random index from 0 to 22
    setRandomQuote(QUOTES[randomIndex]);
  };

  useEffect(() => {
    generateRandomQuote();
  }, []);


  const handleEventChange = (e: any) => {
    console.log('onchange', e.target.name, e.target.value);

    setCoachInfo({
      ...coachInfo,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signup(first_name, last_name, email, password, role, coachInfo);
      if(data) {
        login(data);
        dispatch(setAuthData(data));
        if(data.role === 'coach') {
          navigate("/availability");
        }
        if(data.role === 'player') {
          navigate("/members");
        }
      }
    } catch (error: any) {
      setError(error);
      toast.error(error.message || "You can not signup for now.")
      console.log(error);
    }
    return false;
  };

  return (
    <div className={`nc-PageSignUp min-h-[calc(100vh-5rem)] flex justify-center items-center ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Tennis Brain</title>
      </Helmet>
      <div className="xs:mb-16 my-4 mx-4 xs:mx-8 sm:my-8 flex flex-col sm:flex-row shadow-[0_10px_34px_-15px_rgba(0,0,0,0.24)] rounded w-full sm:mx-0 sm:w-4/5 md:w-3/4 lg:w-2/3">
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
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <Checkbox
              name={'userrole'}
              label={`Tick this box if you are a coach?`}
              defaultChecked={false}
              onChange={(checked) =>
                setRole(checked ? 'coach' : 'player')
              }
            />
            <div className="grid gap-3">
              <GoogleLoginButton isSignUp="sign_up" isCoach={role} coachData={coachInfo} />
              {/* <FacebookLoginButton /> */}
            </div>
            {/* OR */}
            <div className="relative text-center">
              <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
                OR
              </span>
              <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
            </div>
            {/* FORM */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                First Name
              </span>
              <Input
                type="text"
                placeholder="John"
                className="mt-1"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Last Name
              </span>
              <Input
                type="text"
                placeholder="Doe"
                className="mt-1"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="tennis@brain.com"
                className="mt-1"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input type="password" autoComplete="false" className="mt-1" onChange={(e) => setPassword(e.target.value)} />
            </label>
            {role === 'coach' && (
              <>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Phone Number
                  </span>
                  <Input
                    type="text"
                    placeholder="+4412345677890"
                    className="mt-1"
                    name="phone"
                    onChange={handleEventChange}
                  />
                </label>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Date of Birth
                  </span>
                  <Input
                    type="date"
                    placeholder="2024-04-06"
                    className="mt-1"
                    name="dateOfBirth"
                    onChange={handleEventChange}
                  />
                </label>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Gender
                  </span>
                  <Select className="mt-1.5" defaultValue={'Male'} name="gender" onChange={handleEventChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </label>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Qualifications
                  </span>
                  <Input
                    type="text"
                    placeholder="your qualifications"
                    className="mt-1"
                    name="qualifications"
                    onChange={handleEventChange}
                  />
                </label>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Club Name
                  </span>
                  <Input
                    type="text"
                    placeholder="Tannis brain"
                    className="mt-1"
                    name="clubName"
                    onChange={handleEventChange}
                  />
                </label>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Club Address
                  </span>
                  <Input
                    type="text"
                    placeholder="London"
                    className="mt-1"
                    name="clubAddress"
                    onChange={handleEventChange}
                  />
                </label>
              </>
            )}
            <ButtonPrimary type="submit">Create an account</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link className="text-green-600" to="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;

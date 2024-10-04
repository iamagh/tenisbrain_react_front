import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import NcImage from "shared/NcImage/NcImage";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { getAllCoaches, updateCoach } from "services/player/coches";
import { updateSignupProcess, getSignupProcess } from "services/setting";
import { updateProcess } from "utils/others";
import Guide from "components/Guide/Guide";

import { useDispatch } from 'react-redux';
import { setPlayerCoach } from 'store/playerSlice'; // Adjust the path to your slice
import { useSelector } from 'react-redux';
import { RootState } from 'store'; // Adjust the path to your store
import { _Coach } from "dataTypes/Player";

type Coach = {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  club_name: string;
  club_address: string;
  qualification: string;
  profile_image: string;
  email: string;
  phone_no: string;
  bio: string;
};

const PagePlayerCoaches: React.FC = () => {
  const dispatch = useDispatch();


  const navigate = useNavigate();
  const playerGuide = localStorage.getItem('signup_processs') || "0";
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showBio, setShowBio] = useState<{ [key: number]: boolean }>({});
  const [signupProcess, setSignupProcess] = useState(Number(playerGuide));

  
  const handleCardClick = async (coachId: any) => {
    try {
      
      const selectedCoach:_Coach = {
        id : coachId,
        first_name : String(coaches.find(e => e.id == coachId)?.first_name),
        last_name : String(coaches.find(e => e.id == coachId)?.last_name),
      }

      dispatch(setPlayerCoach(selectedCoach))
      
      setSelectedCoachId(coachId);
      localStorage.setItem('player-coach', coachId)
      const res = await updateCoach(coachId);
      setShowGuide(false);
      if (res) {
        // if user select a coach, then return notification
        if (signupProcess === 2) {
          const res = await updateSignupProcess({ signup_process: 0 });
          if (res) {
            updateProcess(0);
            setSignupProcess(0);
          }
          navigate('/player-calendar');
          toast("You are now ready to book classes with your coach", { autoClose: 5000 });
        } else {
          toast.success('You selected a coach.');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const toggleShowBio = (coachId: number) => {
    setShowBio((prev) => ({
      ...prev,
      [coachId]: !prev[coachId],
    }));
  };

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const data = await getAllCoaches();
        const res = await getSignupProcess();
        if (res) {
          setSignupProcess(res.signup_process);
          if (res.signup_process === 2) {
            setShowGuide(true);
          }
        }
        setCoaches(data.coaches);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchCoaches();
    const coachId = localStorage.getItem('player-coach');

    setSelectedCoachId(Number(coachId));
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (showGuide && signupProcess === 2) toast("Please select your coach", { autoClose: 5000 });
  }, [showGuide]);

  return (
    <div className="nc-PagePlayerCoaches min-h-[calc(100vh-5rem)]">
      <Helmet>
        <title>Coaches || Tennisbrain : Player</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        <Guide />
        <h1 className="text-2xl font-bold mb-4 pt-4">Select a Coach</h1>
        {/* <Heading
                    desc="We’re impartial and independent, and every day we create distinctive,
                    world-class programmes and content"
                >
                    Coaches
                </Heading> */}
        {showGuide && <div className="w-full h-full top-0 left-0 fixed z-[1000] bg-[rgba(0,0,0,.8)]"></div>}
        <div className={`grid sm:grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 ${showGuide ? 'z-[1001] relative' : ''}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            coaches.map((coach) => (
              <div
                key={coach.id}
                className={`relative p-4 border shadow rounded-lg cursor-pointer ${coach.id === selectedCoachId ? 'border-blue-500' : 'border-gray-300'} ${showGuide ? 'border-2 border-red-400' : ''} bg-white`}
                onClick={() => handleCardClick(coach.id)}
              >
                {coach.id === selectedCoachId && (
                  <div className="absolute -top-[1px] -right-[1px] rounded-tr-lg">
                    <div className="w-28 h-8 absolute top-0 right-0 rounded-tr-lg">
                      <div className="w-full py-[2px] bg-blue-500 text-white text-center rounded-bl-lg rounded-tr-lg font-semibold transform">
                        Selected
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <NcImage
                    src={`${process.env.REACT_APP_BACKEND_URL}${coach.profile_image}`}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {`${coach.first_name} ${coach.last_name}`}
                    </h3>
                    <p className="text-sm text-gray-600">{coach.gender}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600"><strong>Club Name:</strong> {coach.club_name}</p>
                  <p className="text-sm text-gray-600"><strong>Club Address:</strong> {coach.club_address}</p>
                  <p className="text-sm text-gray-600"><strong>Email:</strong> {coach.email}</p>
                  <p className="text-sm text-gray-600"><strong>Phone:</strong> {coach.phone_no}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Bio:</strong> {showBio[coach.id] ? coach.bio : `${coach.bio.substring(0, 50)}...`}
                  </p>
                  <button
                    className="text-blue-500 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShowBio(coach.id);
                    }}
                  >
                    {showBio[coach.id] ? 'Show Less' : 'Show Bio'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default PagePlayerCoaches;

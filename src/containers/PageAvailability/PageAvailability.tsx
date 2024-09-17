import React, { useState, useEffect } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { getAllAvailabilitys, updateAvailability } from "services/coach/availabilitys";
import { updateSignupProcess, getSignupProcess } from "services/setting";
import { updateProcess } from "utils/others";
import { useNavigate } from "react-router-dom";
import Guide from "components/Guide/Guide";

type SelectionsType = {
  [day: string]: boolean[];
};

const PageAvailability: React.FC = () => {
  const navigate = useNavigate();
  const [availabilitys, setAvailabilitys] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const coachGuide = localStorage.getItem('signup_process') || '0';
  const [signup_process, setSignupProcess] = useState(coachGuide);
  // gettting coach guide
  const [showGuide, setShowGuide] = useState(false);
  const coachId = localStorage.getItem('user');


  const daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times: string[] = Array.from({ length: 32 }, (_, index) => {
    const hour = Math.floor(index / 2) + 6; // starting from 6
    const minute = index % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }).slice(0, -1); // Adjust the times according to your needs

  const handleCheckboxChange = (time: any, dayIndex: number) => {
    const updatedAvailabilitys: any = availabilitys.map((availability: any, indexTime: number) => {
      const updatedDays = availability.days.map((item: any, index: number) => {
        if (time == availability.time && index == dayIndex) {
          return {
            day: item.day,
            checked: !item.checked
          };
        } else {
          return item;
        }
      });
      return {
        ...availability,
        days: updatedDays
      };
    });
    setAvailabilitys(updatedAvailabilitys);
  };

  const isChecked = (time: any, index: number) => {
    const availability: any = availabilitys.find((item: any) => item.time == time);
    const checked = availability?.days[index].checked || false;
    return checked;
  };

  const handleSave = async () => {
    console.log('availabilitys', availabilitys);
    setShowGuide(false);
    
    if (coachGuide === '1') {
      const res = await updateSignupProcess({ 'signup_process': 2 });
      if(res) updateProcess(2);
      setTimeout(() => {
        navigate('/settings');
      }, 500);
    }
    updateAvailability(availabilitys);
  };

  useEffect(() => {
    const fetchAvailabilitys = async () => {
      try {
        const data = await getAllAvailabilitys(coachId); // coach id
        const res = await getSignupProcess();
        setSignupProcess(res.signup_process);
        
        setAvailabilitys(data.availability);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };
    if (signup_process === '1') {
      setShowGuide(true);
      // if(playerGuideData['members'] == 'no') toastNotify()
    }
    fetchAvailabilitys();

  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

    useEffect(() => {
      if (showGuide) toast("Please save the times you wish to receive private bookings from your students.", { className: 'bg-blue-500 text-white font-bold py-2 px-4 rounded', autoClose: 5000 });
    }, [showGuide]);

  return (
    <div className="nc-Page404">
      <Helmet>
        <title>Coaches || Availability</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        {/* HEADER */}
        <Guide />
        {
          showGuide && <div className="fixed z-[1000] w-full h-full top-0 left-0 bg-[rgba(0,0,0,.5)]"></div>
        }
        <div className="mt-1 overflow-x-auto">
          <div className="table-container relative">
            <table className={`w-full border-collapse text-center relative bg-white ${showGuide ? 'z-[1001] border-4 border-red-400' : ''}`}>
              <thead>
                <tr>
                  <th className="border p-3 sticky left-0 bg-white">Time</th>
                  {daysOfWeek.map(day => (
                    <th className="border p-3" key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times?.map((time: any, timeIndex) => (
                  <tr key={time}>
                    <td className="border px-2 sticky left-0 bg-white">{time}</td>
                    {daysOfWeek?.map((day: any, dayIndex: number) => (
                      <td className="border px-2" key={`${timeIndex} - ${day}`}>
                        <input
                          type="checkbox"
                          id={`checkbox-${day}-${time}`}
                          name={`${day}-${time}`}
                          value={`${day}-${time}`}
                          checked={isChecked(time, dayIndex)}
                          onChange={() => handleCheckboxChange(time, dayIndex)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pt-8">
          <ButtonPrimary onClick={handleSave} className={`${showGuide ? 'z-[1001] border-4 border-red-400' : ''}`}>Save Changes</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default PageAvailability;

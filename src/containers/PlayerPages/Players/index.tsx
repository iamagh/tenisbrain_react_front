import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createMember, getAllMembers, updateMember } from "services/player/members";
import DialogPlayerMember from "components/Dialog/DialogPlayerMember";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Guide from "components/Guide/Guide";

import { updateSignupProcess, getSignupProcess } from "services/setting";
import { updateProcess } from "utils/others";

interface Player {
  id: number;
  name: string;
  hand: string;
  gender: string;
  dob: string;
}

const PagePlayerPlayers: React.FC = () => {
  const navigate = useNavigate();
  const playerGuide = localStorage.getItem('signup_processs') || "0";
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [signupProcess, setSignupProcess] = useState(Number(playerGuide));

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState({});

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (newData: any) => {
    try {
      if (newData.id) {
        await updateMember(newData.id, newData);
      } else {
        await createMember(newData);
        // set guide
        setShowGuide(false);
        if (signupProcess === 1) {
          const res = await updateSignupProcess({ signup_process: 2 });
          if (res) {
            updateProcess(2);
            setSignupProcess(2);
            setTimeout(() => {
              navigate('/player-coaches');
            }, 500);
          }
        }
      }

      const data = await getAllMembers();
      setMembers(data.members);
      setLoading(false);
      setIsDialogOpen(false);

    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const addMember = () => {
    setDialogData({});
    setIsDialogOpen(true);
  };

  const editMember = (oldData: any) => {
    setDialogData(oldData);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getAllMembers();
        const res = await getSignupProcess();
        if (res) {
          setSignupProcess(res.signup_process);
          if (res.signup_process === 1) setShowGuide(true);
        }
        setMembers(data.members);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (signupProcess === 1 && showGuide) toast("Please add your information about the player", { autoClose: 5000 });
  }, [showGuide]);

  return (
    <div className="nc-PagePlayerPlayers  min-h-[calc(100vh-5rem)]">
      <Helmet>
        <title>Players || Tennisbrain : Player</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        <Guide />
        <div className="mx-auto py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Manage Players</h1>
            <button
              className={`relative bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${showGuide ? 'z-[1001] border-4 border-red-400' : ''}`}
              type="button"
              onClick={addMember}
            >
              Add Player
            </button>
            {
              showGuide && <div className="fixed z-[1000] w-full h-full top-0 left-0 bg-[rgba(0,0,0,.5)]"></div>
            }
          </div>
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Playing Hand</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Date of Birth</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{`${member.first_name} ${member.last_name}`}</td>
                  <td className="px-4 py-2">{member.playing_hand}</td>
                  <td className="px-4 py-2">{member.gender}</td>
                  <td className="px-4 py-2">{member.date_of_birth}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      type="button"
                      onClick={() => editMember(member)}
                    >
                      Edit/Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <DialogPlayerMember isOpen={isDialogOpen} data={dialogData} onOK={handleSubmit} onClose={closeDialog} />
        </div>
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default PagePlayerPlayers;

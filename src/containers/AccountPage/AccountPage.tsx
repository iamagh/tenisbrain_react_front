import React, { FC, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { clearStorage } from "utils/others";

import Label from "components/Label/Label";
import DialogConfirm from "components/Dialog/DialogConfirm";

import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonThird from "shared/Button/ButtonThird";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";

import CommonLayout from "./CommonLayout";

import { updateAccountInformation, closeAccount } from "services/shared/accounts";

export interface AccountPageProps {
  className?: string;
}
const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const userRole = localStorage.getItem("user-role");
  const userData: any = localStorage.getItem('user-info');

  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [showUpload, setShowUpload] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    club_address: '',
    club_name: '',
    bio: '',
    gender: '',
    date_of_birth: '',
  });

  useEffect(() => {
    if(userData){
      setUserInfo({
        ...userInfo,
        ...JSON.parse(userData)
      });
    }
  }, []);

  /**
   * 
   * @param e FileInputChange
   * 
   */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfileImg(file);
    }
  }

  const handleProfileOption = (e: any) => {
    setUserInfo({
      ...userInfo,
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  /**
   * 
   * @param e FormSubmit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: any = new FormData();

    if(profileImg){
      formData.append('profile_image', profileImg);
      setProfileImg(null);
    }

    formData.append('role', userRole);
    formData.append('first_name', userInfo.first_name);
    formData.append('last_name', userInfo.last_name);
    
    if (userInfo.registration_method == 'email') {
      formData.append('email', userInfo.email);
    }
    
    if (userRole == 'coach') {
      formData.append('club_address', userInfo.club_address);
      formData.append('club_name', userInfo.club_name);
      formData.append('bio', userInfo.bio);
      formData.append('gender', userInfo.gender);
      formData.append('date_of_birth', userInfo.date_of_birth);
      formData.append('phone_no', userInfo.phone_no);
    }

    try {
      const res = await updateAccountInformation(formData);
      if(res) {
        toast.success(res.message || 'Data saved successfully.');
        /**
         * set localStorage when update userinfo
         */
        localStorage.setItem('user-info', JSON.stringify(userInfo));
      }
    } catch (errors: any) {
      toast.error(errors.message || 'Server returns error during upload');
    }
  }

  const closeMyAccount = async () => {
    try {
      const res = await closeAccount();
      if(res) {
        clearStorage();
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Server had an error while during your request.')
    }
  }

  const closeDialogConfirm = () => setIsDialog(false);

  return (
    <div className={`nc-AccountPage  min-h-[calc(100vh-5rem)] ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>My Account || TennisBrain </title>
      </Helmet>
      <CommonLayout>
        <form onSubmit={handleSubmit}>
          <div className="space-y-10 sm:space-y-12">
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Account infomation
            </h2>
            <div className="flex flex-col md:flex-row">
              <div 
                className="flex-shrink-0 flex items-start"
              >
                {/* AVATAR */}
                <div
                  className="relative rounded-full overflow-hidden flex"
                  onMouseEnter={() => setShowUpload(true)}
                  onMouseLeave={() => setShowUpload(false)}
                >
                  <img
                    src={avatar || process.env.REACT_APP_BACKEND_URL + userInfo.profile_image}
                    alt=""
                    
                    className="w-32 h-32 rounded-full object-cover z-0"
                  />
                  {
                    showUpload && <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="mt-1 text-xs">Change Image</span>
                  </div>
                  }
                  
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    
                    onChange={(e) => handleAvatarChange(e)}
                  />
                </div>
              </div>
              <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                <div>
                  <Label>First Name</Label>
                  <Input
                    name="first_name"
                    className="mt-1.5"
                    placeholder="Enrico"
                    value={userInfo.first_name}
                    onChange={handleProfileOption}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    name="last_name"
                    className="mt-1.5"
                    placeholder="Cole"
                    value={userInfo.last_name}
                    onChange={handleProfileOption}
                  />
                </div>

                {/* ---- */}

                {/* ---- */}
                {
                  userInfo.registration_method == 'email' && <div>
                    <Label>Email</Label>
                    <div className="mt-1.5 flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                        <i className="text-2xl las la-envelope"></i>
                      </span>
                      <Input
                        className="!rounded-l-none"
                        placeholder="example@email.com"
                        name="email"
                        value={userInfo.email}
                        onChange={handleProfileOption}
                      />
                    </div>
                  </div>
                }

                {
                  userRole == 'coach' && <>
                    {/* ---- */}
                    <div>
                      <Label>Club Name</Label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-map-signs"></i>
                        </span>
                        <Input
                          className="!rounded-l-none"
                          placeholder="Tennis brain"
                          value={userInfo.club_name}
                          name="club_name"
                          onChange={handleProfileOption}
                        />
                      </div>
                    </div>
                    {/* ---- */}
                    <div>
                      <Label>Club Address</Label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-map-signs"></i>
                        </span>
                        <Input
                          className="!rounded-l-none"
                          name="club_address"
                          placeholder="New york, USA"
                          value={userInfo.club_address}
                          onChange={handleProfileOption}
                        />
                      </div>
                    </div>
                    {/* ---- */}
                    <div className="max-w-lg">
                      <Label>Date of birth</Label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-calendar"></i>
                        </span>
                        <Input
                          className="!rounded-l-none"
                          type="date"
                          name="day_of_birth"
                          value={userInfo.date_of_birth}
                          onChange={handleProfileOption}
                        />
                      </div>
                    </div>
                    {/* ---- */}
                    <div>
                      <Label>Gender</Label>
                      <Select
                        className="mt-1.5"
                        value={userData.gender}
                        name="gender"
                        onChange={handleProfileOption}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </div>
      
                    {/* ---- */}
                    <div>
                      <Label>Phone number</Label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-phone-volume"></i>
                        </span>
                        <Input
                          name="phone_no"
                          className="!rounded-l-none"
                          placeholder="003 888 232"
                          value={userInfo.phone_no}
                          onChange={handleProfileOption}
                        />
                      </div>
                    </div>
                    {/* ---- */}
                    <div>
                      <Label>About you</Label>
                      <Textarea className="mt-1.5" name="bio" value={userInfo.bio} onChange={handleProfileOption} />
                    </div>
                  </>
                }
                <div className="pt-2">
                  <ButtonPrimary type="submit">Update account</ButtonPrimary>
                  <ButtonThird type="button" className="ml-4 bg-red-700 text-white" onClick={() => setIsDialog(true)}>Close My Account</ButtonThird>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CommonLayout>
      <DialogConfirm 
        isOpen={isDialog}
        title="Do you want to close Account?"
        description="If you close account, then you will get lost all informations."
        color="red"
        onClose={closeDialogConfirm}
        onSubmit={closeMyAccount}
      />
    </div>
  );
};

export default AccountPage;

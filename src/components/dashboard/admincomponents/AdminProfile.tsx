import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/redux/api/authApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import coverImage from '../../../assets/images/cover.jpg';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';
import demoUserImage from '../../../assets/images/babul.png';

const AdminProfile = () => {
  CheckRoleAndLogout('admin');

  const [showProfileUpdateModal, setShowProfileUpdateModal] =
    useState<boolean>(false);
  const [showProfilePhotoUpdateModal, setShowProfilePhotoUpdateModal] =
    useState<boolean>(false);
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] =
    useState<boolean>(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [userNewName, setUserNewName] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userCity, setUserCity] = useState<string>('');
  const [userState, setUserState] = useState<string>('');
  const [userCountry, setUserCountry] = useState<string>('');
  const [userPostalCode, setUserPostalCode] = useState<string>('');
  const [userMobile, setUserMobile] = useState<string>('');
  const [newProfileImage, setNewProfileImage] = useState('' as any);
  const [updateProfilePhotoOngoing, setUpdateProfilePhotoOngoing] =
    useState(false);

  const [changePassword] = useChangePasswordMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: profileData, isLoading } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  // handle profile image upload
  const handleProfilePhotoUpload = async (e: any) => {
    e.preventDefault();
    setUpdateProfilePhotoOngoing(true);

    const formData = new FormData();

    if (!newProfileImage) {
      setUpdateProfilePhotoOngoing(false);
      toast.error('Please select an image to upload', {
        position: 'top-right',
        duration: 1500,
      });
      return;
    }

    if (newProfileImage) {
      if (newProfileImage.size > 1024 * 1024) {
        setUpdateProfilePhotoOngoing(false);
        toast.error('Image size should be less than 1MB', {
          position: 'top-right',
          duration: 1500,
        });
        return;
      } else if (
        newProfileImage.type !== 'image/jpeg' &&
        newProfileImage.type !== 'image/jpg' &&
        newProfileImage.type !== 'image/png'
      ) {
        setUpdateProfilePhotoOngoing(false);
        toast.error('We accept only jpg, jpeg and png type images', {
          position: 'top-right',
          duration: 1500,
        });
        return;
      } else {
        formData.append('file', newProfileImage);
      }
    }

    try {
      const uploadResult = await uploadImage(formData).unwrap();
      const response = await updateProfile({
        name: userProfileFromDb?.name,
        profileImage: uploadResult?.data?.url || userProfileFromDb?.profileImage,
      }).unwrap();

      if (response?.statusCode === 200) {
        toast.success('Profile photo updated successfully', {
          position: 'top-right',
          duration: 1500,
        });
        setShowProfilePhotoUpdateModal(!showProfilePhotoUpdateModal);
        setUpdateProfilePhotoOngoing(false);
        setNewProfileImage('');
      } else {
        toast.error('Profile photo update failed', {
          position: 'top-right',
          duration: 1500,
        });
        setUpdateProfilePhotoOngoing(false);
      }
    } catch (e) {
      toast.error('Image upload failed', {
        position: 'top-right',
        duration: 1500,
      });
      setUpdateProfilePhotoOngoing(false);
      console.log(e);
    }
  };

  // handle profile  update
  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    const isAnyFieldFilled =
      userNewName ||
      userAddress ||
      userCity ||
      userState ||
      userCountry ||
      userPostalCode ||
      userMobile;

    if (!isAnyFieldFilled) {
      toast.error('Whats the update you want to made?', {
        position: 'top-right',
        duration: 1500,
      });
      return;
    } else {
      const response = await updateProfile({
        name: userNewName ? userNewName : userProfileFromDb?.name,
        profileImage: userProfileFromDb?.profileImage,
        address: {
          address: userAddress
            ? userAddress
            : userProfileFromDb?.address?.address,
          city: userCity ? userCity : userProfileFromDb?.address?.city,
          state: userState ? userState : userProfileFromDb?.address?.state,
          country: userCountry
            ? userCountry
            : userProfileFromDb?.address?.country,
          postalCode: userPostalCode
            ? userPostalCode
            : userProfileFromDb?.address?.postalCode,
          mobile: userMobile ? userMobile : userProfileFromDb?.address?.mobile,
        },
      }).unwrap();

      if (response?.statusCode === 200) {
        toast.success('Profile updated successfully', {
          position: 'top-right',
          duration: 1500,
        });
        setShowProfileUpdateModal(!showProfileUpdateModal);
        setUserNewName('');
      } else {
        toast.error('Name update failed', {
          position: 'top-right',
          duration: 1500,
        });
      }
    }
  };

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();

    if (
      userProfileFromDb?.email === 'demoadmin@gmail.com' ||
      userProfileFromDb?.email === 'democustomer@gmail.com' ||
      userProfileFromDb?.email === 'demovendor@gmail.com'
    ) {
      toast.error(
        `Any visitor may use this demo account, so you can't change this account's password`,
        {
          position: 'top-right',
          duration: 1500,
          icon: '🔒',
        }
      );
      return;
    }

    if (!currentPassword || !newPassword) {
      toast.error('Please fill all the fields', {
        position: 'top-right',
        duration: 1500,
      });
    } else {
      const response = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      if (response?.statusCode === 200) {
        toast.success('Password updated successfully', {
          position: 'top-right',
          duration: 1500,
        });
        setShowPasswordUpdateModal(!showPasswordUpdateModal);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error('Password update failed', {
          position: 'top-right',
          duration: 1500,
        });
      }
    }
  };

  const toggleShowingCurrentPassword = () => {
    const passwordInput = document.getElementById(
      'currentpassword'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      setIsCurrentPasswordVisible(true);
    } else {
      passwordInput.type = 'password';
      setIsCurrentPasswordVisible(false);
    }
  };
  const toggleShowingNewPassword = () => {
    const passwordInput = document.getElementById(
      'newpassword'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      setIsNewPasswordVisible(true);
    } else {
      passwordInput.type = 'password';
      setIsNewPasswordVisible(false);
    }
  };

  const userImage = userProfileFromDb?.profileImage || demoUserImage;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2] p-4 lg:p-8 space-y-6 font-sans">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight mb-2">Profile Management</h3>
        <p className="text-sm font-bold text-slate-400 leading-relaxed md:w-2/3">
          Manage your personal details, update your contact information, and secure your account credentials securely. Future updates will bring even deeper customization options!
        </p>
      </div>
      <div className="w-full relative space-y-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange"></div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
              <img
                src={coverImage}
                alt="cover"
                className="w-full h-32 md:h-48 lg:h-64 object-cover"
              />
              <div className="px-8 pb-8 flex flex-col relative -mt-12 sm:-mt-16">
                
                <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 h-full">
                    <img
                      src={userImage}
                      alt={userProfileFromDb?.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-[1.5rem] border-4 border-white shadow-md bg-white shrink-0"
                    />
                    <div className="flex flex-col items-center sm:items-start pb-2">
                      <h2 className="text-2xl font-black text-slate-800 leading-none">
                        {userProfileFromDb?.name}
                      </h2>
                      <p className="inline-block mt-2 px-3 py-1 bg-orange/10 text-orange font-black text-[10px] uppercase tracking-widest rounded-full">
                        {userProfileFromDb?.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex self-end sm:self-auto" title="Update Account">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="size-10 bg-slate-50 text-slate-400 hover:text-orange hover:bg-orange/10 rounded-xl flex items-center justify-center transition-colors">
                        <CiEdit className="text-xl font-black" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-2 border-slate-100 rounded-2xl shadow-lg mt-2 min-w-[200px]" style={{ background: 'white' }}>
                        <DropdownMenuItem className="focus:bg-transparent">
                          <button
                            onClick={() => setShowProfileUpdateModal(true)}
                            className="w-full text-left text-xs font-bold text-slate-600 hover:text-orange px-2 py-1.5 hover:bg-orange/5 rounded-lg transition-colors cursor-pointer"
                          >
                            Update Profile Details
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-transparent">
                          <button
                            onClick={() => setShowProfilePhotoUpdateModal(true)}
                            className="w-full text-left text-xs font-bold text-slate-600 hover:text-orange px-2 py-1.5 hover:bg-orange/5 rounded-lg transition-colors cursor-pointer"
                          >
                            Update Profile Photo
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-transparent">
                          <button
                            onClick={() => setShowPasswordUpdateModal(true)}
                            className="w-full text-left text-xs font-bold text-slate-600 hover:text-orange px-2 py-1.5 hover:bg-orange/5 rounded-lg transition-colors cursor-pointer"
                          >
                            Update Security/Password
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* about and adress section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-8">
                  {/* About */}
                  <div className="lg:col-span-2 bg-[#f8f6f2] p-6 sm:p-8 rounded-3xl border border-slate-100/50">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">About {userProfileFromDb?.name}</h3>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">
                      Welcome to my profile! I love discovering new products and
                      deals. Whether it's tech gadgets, home essentials, or the
                      latest fashion trends, I enjoy finding items that enhance my
                      daily life. My goal is to share reviews and feedback on
                      purchases to help others make informed decisions. I value
                      quality, convenience, and style in everything I buy. In my
                      free time, I explore the latest product launches and engage
                      with communities that share my interests. Let’s connect and
                      enjoy the best of online shopping together!
                    </p>
                  </div>
                  
                  {/* Contact & Address */}
                  <div className="space-y-6">
                    <div className="bg-[#f8f6f2] p-6 sm:p-8 rounded-3xl border border-slate-100/50">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Primary Layout</h3>
                      <div className="space-y-1 text-sm font-bold text-slate-600">
                        <p>{userProfileFromDb?.address?.address || 'Street address not set'}</p>
                        {(userProfileFromDb?.address?.city || userProfileFromDb?.address?.state || userProfileFromDb?.address?.postalCode) && (
                           <p>
                             {userProfileFromDb?.address?.city && userProfileFromDb.address.city + ', '} 
                             {userProfileFromDb?.address?.state && userProfileFromDb.address.state + ' '} 
                             {userProfileFromDb?.address?.postalCode}
                           </p>
                        )}
                        <p>{userProfileFromDb?.address?.country || 'Country not set'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#f8f6f2] p-6 sm:p-8 rounded-3xl border border-slate-100/50">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Protocol</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                          <p className="text-sm font-bold text-slate-600">{userProfileFromDb?.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Mobile Network</p>
                          <p className="text-sm font-bold text-slate-600">{userProfileFromDb?.address?.mobile || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* profile update modal */}
          <div>
            {showProfileUpdateModal ? (
              <>
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                  data-aos="zoom-in"
                  data-aos-duration="500"
                >
                  <div className="relative w-[370px] lg:w-[640px] my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-md font-semibold text-center">
                          {`Update - ${userProfileFromDb?.name}`}
                        </h3>
                        <button
                          className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                          onClick={() => setShowProfileUpdateModal(false)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                      {/*body*/}
                      <form className="py-6 px-10">
                        <div className="grid gap-4 grid-cols-2 sm:gap-x-6 sm:gap-y-4">
                          {/*  name */}
                          <div className="w-full">
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium"
                            >
                              Name
                            </label>

                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.name}`}
                              onChange={(e) => setUserNewName(e.target.value)}
                            />
                          </div>
                          {/*  address */}
                          <div className="w-full">
                            <label
                              htmlFor="address"
                              className="block mb-2 text-sm font-medium "
                            >
                              Address
                            </label>

                            <input
                              type="text"
                              name="Address"
                              id="Address"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.address?.address}`}
                              onChange={(e) => setUserAddress(e.target.value)}
                            />
                          </div>
                          {/* city */}
                          <div className="w-full">
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium "
                            >
                              City
                            </label>

                            <input
                              type="text"
                              name="city"
                              id="city"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.address?.city}`}
                              onChange={(e) => setUserCity(e.target.value)}
                            />
                          </div>
                          {/*  state */}
                          <div className="w-full">
                            <label
                              htmlFor="state"
                              className="block mb-2 text-sm font-medium "
                            >
                              State
                            </label>

                            <input
                              type="text"
                              name="state"
                              id="state"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.address?.state}`}
                              onChange={(e) => setUserState(e.target.value)}
                            />
                          </div>
                          {/*  country */}
                          <div className="w-full">
                            <label
                              htmlFor="country"
                              className="block mb-2 text-sm font-medium "
                            >
                              Country
                            </label>

                            <input
                              type="text"
                              name="country"
                              id="country"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.address?.country}`}
                              onChange={(e) => setUserCountry(e.target.value)}
                            />
                          </div>
                          {/*  postal code */}
                          <div className="w-full">
                            <label
                              htmlFor="postalCode"
                              className="block mb-2 text-sm font-medium "
                            >
                              Postal Code
                            </label>

                            <input
                              type="text"
                              name="postalCode"
                              id="postalCode"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.address?.postalCode}`}
                              onChange={(e) =>
                                setUserPostalCode(e.target.value)
                              }
                            />
                          </div>
                          {/*  mobile */}
                          <div className="w-full">
                            <label
                              htmlFor="mobile"
                              className="block mb-2 text-sm font-medium "
                            >
                              Mobile
                            </label>

                            <input
                              type="text"
                              name="mobile"
                              id="mobile"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder={`e.g. ${userProfileFromDb?.address?.mobile}`}
                              onChange={(e) => setUserMobile(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto disabled:cursor-not-allowed disabled:bg-gray-300"
                          onClick={(e) => handleUpdateProfile(e)}
                        >
                          Update Profile
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
              </>
            ) : null}
          </div>
          {/* profile photo update modal */}
          <div>
            {showProfilePhotoUpdateModal ? (
              <>
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                  data-aos="zoom-in"
                  data-aos-duration="500"
                >
                  <div className="relative w-[370px] lg:w-[640px] my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-md font-semibold text-center">
                          Update Profile Photo
                        </h3>
                        <button
                          className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                          onClick={() => setShowProfilePhotoUpdateModal(false)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                      {/*body*/}
                      <form className="py-6 px-10">
                        <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
                          {/* profile image */}
                          <div className="w-full">
                            <label
                              htmlFor="profileimage"
                              className="block mb-2 text-sm font-medium "
                            >
                              Profile Photo
                            </label>

                            <input
                              type="file"
                              name="profileimage"
                              id="profileimage"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              required
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];
                                if (selectedFile) {
                                  setNewProfileImage(selectedFile);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto disabled:cursor-not-allowed disabled:bg-gray-300"
                          onClick={(e) => handleProfilePhotoUpload(e)}
                          disabled={updateProfilePhotoOngoing}
                        >
                          {updateProfilePhotoOngoing
                            ? 'Updating Profile'
                            : 'Update Profile'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
              </>
            ) : null}
          </div>
          {/* password update modal */}
          <div>
            {showPasswordUpdateModal ? (
              <>
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                  data-aos="zoom-in"
                  data-aos-duration="500"
                >
                  <div className="relative w-[370px] lg:w-[640px] my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-md font-semibold text-center">
                          Update Password
                        </h3>
                        <button
                          className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                          onClick={() => setShowPasswordUpdateModal(false)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                      {/*body*/}
                      <form className="py-6 px-10">
                        <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
                          {/*  current password */}
                          <div className="w-full relative">
                            <label
                              htmlFor="currentpassword"
                              className="block mb-2 text-sm font-medium "
                            >
                              Current Password
                            </label>

                            <input
                              type="password"
                              name="currentpassword"
                              id="currentpassword"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder="e.g. awal123"
                              required
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />
                            <span
                              className="absolute cursor-pointer top-10 right-3"
                              onClick={toggleShowingCurrentPassword}
                            >
                              {isCurrentPasswordVisible ? (
                                <IoEyeOutline />
                              ) : (
                                <IoEyeOffOutline />
                              )}
                            </span>
                          </div>
                          {/* new password */}
                          <div className="w-full relative">
                            <label
                              htmlFor="newpassword"
                              className="block mb-2 text-sm font-medium"
                            >
                              New Password
                            </label>

                            <input
                              type="password"
                              name="newpassword"
                              id="newpassword"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder="e.g. newpassword123"
                              required
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                              className="absolute cursor-pointer top-10 right-3"
                              onClick={toggleShowingNewPassword}
                            >
                              {isNewPasswordVisible ? (
                                <IoEyeOutline />
                              ) : (
                                <IoEyeOffOutline />
                              )}
                            </span>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto"
                          onClick={(e) => handleUpdatePassword(e)}
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
              </>
            ) : null}
          </div>
        </div>
      </div>
  );
};

export default AdminProfile;

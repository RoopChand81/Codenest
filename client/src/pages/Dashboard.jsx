import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';
import ConfirmationModal from "../components/common/ConfirmationModal";
import { logout } from "../services/operations/authAPI";
import Footer from '../components/common/Footer';
import Spinner from '../components/common/Loading';
const Dashboard = () => {
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal((prev) => !prev);
  };

  const modalData = {
    text1: "Are you sure?",
    text2: "You will be logged out of your account.",
    btn1Text: "Logout",
    btn2Text: "Cancel",
    btn1Handler: () => dispatch(logout(navigate)),
    btn2Handler: showModalHandler,
  };

  

  if (authLoading || profileLoading) {
    return <div>
      <Spinner/>
    </div>;
  }

  return (
    <div className={`${showModal?"overflow-x-hidden overflow-y-hidden w-[100vw] h-[500px]":"w-[100vw] min-h-[calc(100vh-0rem)]"} flex flex-col relative`}>
      <div className={`flex flex-row ${showModal ? 'opacity-40' : 'opacity-100'}`}>
        <Sidebar showModalHandler={showModalHandler} showModal={showModal} />
        <div className='w-full min-h-[calc(100vh-3.5rem)] flex justify-center'>
          <Outlet />
        </div>
      </div>
      <Footer />
      {showModal && (
        <ConfirmationModal modalData={modalData} />
      )}
    </div>
  );
};

export default Dashboard;

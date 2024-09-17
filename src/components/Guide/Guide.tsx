import React, { useState, useEffect } from 'react';

const Guide = () => {
  const userRole = localStorage.getItem("user-role");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  const guideDetails = userRole === 'coach' ? (
    <>
      <p className="mb-4"> Private Classes - Use the availabilty tab to adjust your schedule for private coaching. This will set your regular weekly times for private bookings. If you wish to change this for a specific day or week (you may go on holiday or there is a bank holiday), you can simply click in the white space on a specific date and deselect all or add additional times if needed. Prices for private coaching is set through the settings section.</p>
          <p className="mb-4"> Group Classes - You can create group classes directly in the calendar. When you click in the white space on the date, you can create a group class with the option at the bottom. You can set the price, the maximum student numbers and repeat it accordingly. You can also delete individual sessions out of the series created. </p>
           <p className="mb-4"> Your Offering - As a coach you may want to limit or expand the classes on offer. As a default we have included a number of offerings you may want to teach. For example red ball, or green ball. However you may want to utilise a different approach to your students or offer things not listed such as wheelchair or cardio tennis. This can be adjusted for in the settings section.</p>
          <p className="mb-4"> Your Content - Use the exercises tab to add specific content and drills you plan to teach. For example, as a warm up you might want the student to skip. For the technical aspect you may want to teach a forehand. Any booked events can then be tagged and scored with these exercises ensuring you know whats been delivered and keeping your classes fresh and progressive. You can view what has been delivered historically through the event on the calendar or through the dashboard in the table information.</p>
          <p className="mb-4"> Payments - You may want to arrange your own payment structure with your students. In this case keep online payments disabled, and this will allow you students to book freely with you. If however you wish to allow for online payments, you need to create a stripe account through settings. Connect to stripe is a simple process and will ensure your students pay online to book lessons with you. Additionally this data will be tracked through the dashboard for your own accounting needs.</p>
          <p className="mb-4"> Track and Manage - You can monitor your coaching activities through the dashboard.</p>
          <p className="mb-4"> Personal Information - You can add or update your personal information including your picture in the accounts page. This information is available to Players.</p>
    <p className="mb-4"> Cancellations - Players need to provide at least 24 hours notice for cancellations. Coaches can cancel sessions at their own discretion. Refunds will automatically be processed if a lesson is cancelled.</p>

    </>
  ) : (
  <>
    <p className="mb-4"> Private Classes - Click on the white space on a date in the calendar to see what times your coach is available for a private training session and book accordingly. You can book 60min or 90min sessions. Once booked these are coloured green in the calendar. You may book up to 3 people for a private class.</p>
    <p className="mb-4"> Group Classes - The calendar will also show you group classes your coach runs. The light blue shade shows there is a class running that you have not booked into. The dark blue shows ones you have booked into. Simply click onto the event, and book into either one class or the series of classes that are of interest.</p>
    <p className="mb-4"> Adding Players - You may want to manage multiple players within the account, for example for your kids, or friends. Use the players tab to add details on the players you want associated with your account so you can add them to your bookings.</p>
    <p className="mb-4"> Coaches - If you ever need to change your coach and the coach is on the platform, ensure that all your booked sessions have completed before you change the coach.</p>
    <p className="mb-4"> Track and Manage - You can monitor your training activities through the dashboard.</p>
    <p className="mb-4"> Cancellations - You need to provide at least 24 hours notice to cancel a class. Beyond this it is up to the coaches discretion to provide a refund.</p>
  </>
  );


  return (
    <div onClick={handleExpand} className="flex flex-col items-start mt-5 ">
      <button className="font-bold text-gray-600 hover:text-blue-600">Guide +</button>
      {isExpanded && (
        <div className="mt-5 mx-auto">
          {guideDetails}
        </div>
      )}
    </div>
  );
};

export default Guide;
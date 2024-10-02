import ButtonPrimary from "shared/Button/ButtonPrimary";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

import { Helmet } from "react-helmet-async";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'; // Import timeGridPlugin
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dateClick
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
} from '@fullcalendar/core'
import DialogCoachAvailability from "components/Dialog/DialogCoachAvailability";
import DialogCoachEvent from "components/Dialog/DialogCoachEvent";
import DialogCoachGroupEvent from "components/Dialog/DialogCoachGroupEvent";
import Chatting from "components/Chatting";
import Guide from "components/Guide/Guide";


import { getAllEvents } from "services/coach/events";
import { getProductsForCalendar } from "services/shared/product";

export interface EventProps {
  className?: string;
  title: string;
  start: Date;
  text: string;
}

const events: EventProps[] = [
  { title: 'Meeting-Event-Coach-Player-Booking-Confirmed', start: new Date(), text: 'This is custom text' },
  { title: 'Meeting', start: new Date(), text: 'This is custom text' },
  { title: 'Meeting', start: new Date(), text: 'This is custom text' },
  { title: 'Meeting', start: new Date(), text: 'This is custom text' },
  { title: 'Meeting', start: new Date(), text: 'This is custom text' },
  { title: 'Meeting', start: new Date(), text: 'This is custom text' },
]

const PageCalenda: React.FC = () => {
  const navigate = useNavigate();
  const coach_id = localStorage.getItem("user") || "0";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpenAvailability, setIsOpenAvailability] = useState<boolean>(false);
  const [isOpenEvent, setIsOpenEvent] = useState<boolean>(false);
  const [isOpenGroupEvent, setIsOpenGroupEvent] = useState<boolean>(false);

  const [chatRooms, setChatRooms] = useState<any>([]);
  const [isOpenChatRooms, setIsOpenChatRooms] = useState<boolean>(false);
  const [roomInfo, setRoomInfo] = useState<any>(null);

  const [products, setProducts] = useState<any>([]);
  const getProducts = useCallback(async () => {
    const res = await getProductsForCalendar(coach_id);
    setProducts(res?.products);
  }, [products]);
  const [oldChatRooms, setOldChatRooms] = useState<any>([]);

  const [availabilityDialogData, setAvailabilityDialogData] = useState({
    date: new Date(),
  });
  const [eventDialogData, setEventDialogData] = useState({

  })
  const [groupEventDialogData, setGroupEventDialogData] = useState({
    date: new Date(),
    group_size: '3',
    content: [],
    description: "Junior - Red Ball",
    duration: "60 minutes",
    start_time: "",
  })

  const renderEventContent = (eventContent: EventContentArg) => {
    const { event_type, start_time, end_time, players, group_size } = eventContent.event.extendedProps;
    const group_bg = players.length < group_size ? "bg-cyan-400" : "bg-cyan-600";
    return (
      event_type === "Group" ? <div className={`w-full px-2 ${group_bg} text-white overflow-x-hidden overflow-y-hidden`}>
        <h3 className="flex"><span className="hidden sm:flex">Group : </span> {eventContent.event.title}</h3>
        <p className="flex"><span className="hidden sm:flex">START  : </span> {start_time}</p>
        <p className="hidden sm:flex">{`END    : ${end_time}`}</p>
        <p className="hidden sm:flex">{`PLAYERS: ${players.length} / ${group_size}`}</p>
        <div>{eventContent.event.extendedProps.text}</div>
      </div>
        : <div className="w-full px-2 bg-teal-500 text-white overflow-x-hidden overflow-y-hidden">
          <h3>{eventContent.event.title}</h3>
          <p className="flex"><span className="hidden sm:flex">START  : </span>{start_time}</p>
          <p className="hidden sm:flex">{`END    : ${end_time}`}</p>
          <p className="hidden sm:flex">{`PLAYERS: ${players.map((player: any) => ` ${player.first_name} ${player.last_name}`)}`}</p>
          <div>{eventContent.event.extendedProps.text}</div>
        </div>
    )
  }

  useEffect(() => {

    

    const userRole = localStorage.getItem('user-role');
    if (userRole != 'coach') {
      navigate('/player-calendar');
      return;
    }
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        getProducts();
        const allEvents: any = [...data.events, ...data.group_events]
        setEvents(allEvents);
        setChatRooms(data.chat_rooms);
        setOldChatRooms(data.chat_rooms);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [])


  const onOKDialogEvent = async () => {
    try {
      const data = await getAllEvents();
      const allEvents: any = [...data.events, ...data.group_events]
      setEvents(allEvents);

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }

  const onOKDialogGroup = async () => {
    try {
      const data = await getAllEvents();
      const allEvents: any = [...data.events, ...data.group_events]
      setEvents(allEvents);

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }

  const handleDateClick = (arg: any) => {
    setAvailabilityDialogData({
      date: arg.date,
    })
    openDialogAvailability();
  }

  const handleEventClick = (info: any) => {
    // Handle click event here, e.g., show event details, open modal, etc.
    const selectedEvent: any = events.find((item: any) => item.id == info.event._def.publicId);
    /**
     * 
     * check chatroom
     */
    const selectedRoom = chatRooms.find((chatroom: any) => chatroom.event === selectedEvent.id);
    if(selectedRoom) {
      setChatRooms([selectedRoom]);
    }
    if (selectedEvent.event_type === "Group") {
      const start_time = selectedEvent.start.split("T")[0];
      console.log(selectedEvent)
      setGroupEventDialogData({
        ...selectedEvent,
        date: new Date(start_time)
      });
      openDialogGroupEvent();
    } else {
      setEventDialogData(selectedEvent);
      // console.log('Event clicked:', selectedEvent);
  
      // setEventDialogData({
      //   id: info.event._def.publicId,
      //   ...info.event._def.extendedProps
      // });
  
      openDialogEvent();
    }
  };

  const openDialogAvailability = (): void => {
    setIsOpenAvailability(true);
  };

  const closeDialogAvailability = (): void => {
    setIsOpenAvailability(false);
  };

  const openDialogEvent = (): void => {
    setIsOpenEvent(true);
  };

  const openDialogGroupEvent = (): void => {
    setIsOpenGroupEvent(true);
  }

  const closeDialogEvent = async () => {
    setIsOpenChatRooms(false);
    try {
      const data = await getAllEvents();
      const allEvents: any = [...data.events, ...data.group_events]
      setEvents(allEvents);
      setChatRooms(data.chat_rooms);
      setOldChatRooms(data.chat_rooms);
      setLoading(false);
      setIsOpenEvent(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const closeDialogGroup = async() => {
    setIsOpenChatRooms(false);
    try {
      const data = await getAllEvents();
      const allEvents: any = [...data.events, ...data.group_events]
      setEvents(allEvents);
      setChatRooms(data.chat_rooms);
      setOldChatRooms(data.chat_rooms);
      setLoading(false);
      setIsOpenGroupEvent(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return <div className="nc-PageCalenda">
    <Helmet>
      <title>Calenda || Tennisbrain</title>
    </Helmet>
    <div className="container min-h-[calc(100vh-5rem)] relative pt-5 pb-16 lg:pb-20 lg:pt-5">
    <Guide />
      {/* HEADER */}
      <header className="text-center w-full mb-4 flex justify-between md:justify-center md:items-center gap-2 md:gap-4">

        <div className="flex gap-2 justify-center text-sm sm:text-base h-6 bg-teal-500 md:bg-transparent text-white md:text-teal-500 font-medium items-center w-1/3 md:w-fit">
          <span className="bg-teal-500 w-8 h-5 hidden md:inline"></span> <span>Private</span>
        </div>
        <div className="flex gap-2 justify-center text-sm sm:text-base h-6 bg-cyan-400 md:bg-transparent text-white md:text-cyan-400 font-medium items-center w-1/3 md:w-fit">
          <span className="bg-cyan-400 w-8 h-5 hidden md:inline"></span> <span>Group</span>
        </div>
        <div className="flex gap-2 justify-center text-sm sm:text-base h-6 bg-cyan-600 md:bg-transparent text-white md:text-cyan-600 font-medium items-center w-1/3 md:w-fit">
          <span className="bg-cyan-600 w-8 h-5 hidden md:inline"></span> <span>Group<span className="hidden md:inline"> -</span> Booked</span>
        </div>
      </header>



      <div className="mt-1">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          weekends={true}
          dayMaxEvents={true}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          height="auto"
          contentHeight="auto"
          eventContent={renderEventContent}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          firstDay={1}
        />
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </div>
      <DialogCoachAvailability
        isOpen={isOpenAvailability}
        data={availabilityDialogData}
        openDialogGroup={openDialogGroupEvent}
        setGroupEventDialogData={setGroupEventDialogData}
        dialogGroupData={groupEventDialogData}
        onOK={onOKDialogEvent}
        onClose={closeDialogAvailability}
      />
      <DialogCoachEvent
        setIsOpenChatRooms={setIsOpenChatRooms}
        setRoomInfo={setRoomInfo}
        rooms={chatRooms}
        isOpen={isOpenEvent}
        data={eventDialogData}
        products={products}
        onOK={onOKDialogEvent}
        onClose={closeDialogEvent}
      />
      <DialogCoachGroupEvent
        setIsOpenChatRooms={setIsOpenChatRooms}
        setRoomInfo={setRoomInfo}
        rooms={chatRooms}
        isOpen={isOpenGroupEvent}
        data={groupEventDialogData}
        onOK={onOKDialogGroup}
        onClose={closeDialogGroup}
      />
      <Chatting
        isOpen={isOpenChatRooms}
        setIsOpen={setIsOpenChatRooms}
        rooms={chatRooms}
        roomInfo={roomInfo}
        setRoomInfo={setRoomInfo}
        oldRooms={oldChatRooms}
        setRooms={setChatRooms}
      />
    </div>
  </div>
}

export default PageCalenda;

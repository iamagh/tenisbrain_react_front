import ButtonPrimary from "shared/Button/ButtonPrimary";
import React, { useState, useEffect, useCallback } from "react";

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
import DialogPlayerEvent from "components/Dialog/DialogPlayerEvent/DialogPlayerEvent";
import DialogPlayerGroupEvent from "components/Dialog/DialogPlayerGroupEvent/index";
import Chatting from "components/Chatting";
import Guide from "components/Guide/Guide";

import { toast } from "react-toastify";

import { getAllEvents } from "services/player/events";
import { getCoachById } from "services/player/coches";
import { getProductsForCalendar } from "services/shared/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setAllEvents, setDialogState, setMemberPlayers } from "store/playerSlice"

import { getAllMembers } from "services/player/members";

import { loadStripe, Stripe } from "@stripe/stripe-js";
import { setPlayerCoach } from "store/playerSlice";

import { getAllCoaches } from "services/player/coches";

const stripePromise: Promise<Stripe | null> = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);


export interface EventProps {
  className?: string;
  title: string;
  start: Date;
  text: string;
}

const PagePlayerCalenda: React.FC = () => {
  const coach_id = localStorage.getItem('player-coach') || "0";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpenAvailability, setIsOpenAvailability] = useState<boolean>(false);
  // const firstDialogState = useSelector((state: RootState) => state.player.dialogState)
  // console.log("$$$$$$$", firstDialogState)
  const [isOpenEvent, setIsOpenEvent] = useState<boolean>( false );
  const [chatRooms, setChatRooms] = useState<any>([]);
  const [isOpenChatRooms, setIsOpenChatRooms] = useState<boolean>(false);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [oldChatRooms, setOldChatRooms] = useState<any>([]);
  const [eventDialogData, setEventDialogData] = useState({});
  const [availabilityDialogData, setAvailabilityDialogData] = useState({ date: new Date(), });
  const [products, setProducts] = useState<any>([]);
  const [isOpenGroupEvent, setIsOpenGroupEvent] = useState<boolean>(false);
  const [myMembers, setMyMembers] = useState<any>([]);
  const [createOrDelete, setCreateOrDelete] = useState<string>('create');  // 'create' or 'edit'



  const dispatch = useDispatch();
  const getProducts = useCallback(async () => {
    const res = await getProductsForCalendar(coach_id);
    setProducts(res?.products);
  }, [products]);

  const [groupEventDialogData, setGroupEventDialogData] = useState({
    date: new Date(),
    group_size: '3',
    content: [],
    description: "Junior - Red Ball",
    duration: "60 minutes",
    start_time: "",
    discount: 0,
    unit:0 
  });

  

  const renderEventContent = (eventContent: EventContentArg) => {
    const { event_type, start_time, end_time, players, group_size, group_event_member } = eventContent.event.extendedProps;
    const group_bg = group_event_member > 0 && players.length > 0 ? "bg-cyan-600" : "bg-cyan-400";

    return (
      event_type === "Group" ? <div className={`w-full px-2 ${group_bg} text-white overflow-x-hidden overflow-y-hidden`}>
        <h3><span className="hidden sm:inline">Group : </span>{eventContent.event.title}</h3>
        <p><span className="hidden sm:inline">START  : </span>{start_time}</p>
        <p className="hidden sm:block">{`END    : ${end_time}`}</p>
        <p className="hidden sm:block">{`PLAYERS: ${players.length} / ${group_size}`}</p>
        <div>{eventContent.event.extendedProps.text}</div>
      </div>
        : <div className="w-full px-2 bg-teal-500 overflow-x-hidden text-white overflow-y-hidden">
          <h3>{eventContent.event.title}</h3>
          <p><span className="hidden sm:inline">START  : </span>{start_time}</p>
          <p className="hidden sm:block">{`END    : ${end_time}`}</p>
          <p className="hidden sm:block">{`PLAYERS: ${players.map((player: any) => ` ${player.first_name} ${player.last_name}`)}`}</p>
          <div>{eventContent.event.extendedProps.text}</div>
        </div>
    )
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const playerMembers = await get
        const my_members = await getAllMembers();
        console.log("$$$$$", my_members)
        setMyMembers(my_members.members);
        dispatch(setMemberPlayers(my_members.members))
        // dispatch(setPlayerCoach(my_members.coach))
        
        getAllCoaches().then(res => {
          console.log("result from get coach by id --->", res)
          const data = res.coaches.filter((e:any) => e.id == coach_id)
          console.log("result from get coaches --->", data[0])

          dispatch(setPlayerCoach(my_members.coach))

          console.log(dispatch(setPlayerCoach({
            id: Number(coach_id),
            first_name: data[0].first_name,
            last_name: data[0].last_name
          })))

        }).catch(err => {
          console.log("error in get coach by id --->", err)
        })

        /**
         * TODO: send coache id and date then get event data from server
         */

        const data = await getAllEvents();
        dispatch(setAllEvents(data.events))
        console.log('all events', data)
        const group_events = data.group_events;
        group_events.forEach((group_event: any) => {
          if (!group_event.players[0]?.is_paid) {
            group_event.players = [];
          }
          return group_event;
        });
        const eventSeriesCount = group_events.reduce((acc: any, group_event: any) => {
          const series = group_event.event_series;
          if (!series) return acc;

          const isMyPlayerInGroup = group_event.players.some((player: any) =>
            my_members.members.some((my_member: any) => my_member.id === player.id && player.is_paid)
          );

          if (isMyPlayerInGroup) {
            group_event.already_booked = true;
            acc.eventSeriesCount[series] = acc.eventSeriesCount[series] || 0;
          } else if (group_event.players.length === 0) {
            acc.eventSeriesCount[series] = (acc.eventSeriesCount[series] || 0) + 1;
          }

          return acc;
        }, { eventSeriesCount: {} });

        const updatedGroupEvents = group_events.map((group_event: any) => {
          const series = group_event.event_series;
          return {
            ...group_event,
            series_count: series ? eventSeriesCount[series] : 0,
            already_booked: series ? true : false,
          };
        });

        const allEvents: any = [...data.events, ...updatedGroupEvents]
        setEvents(allEvents);
        getProducts();
        // setchatrooms
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onOKDialogEvent = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data.events);

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }
  const handleDateClick = (arg: any) => {
    setEventDialogData({
      coach_id: coach_id,
      start: formatDate(arg.date)
    })
    openDialogEvent();
  }


  const handleEventClick = (info: any) => {
    /** --- start old codebase */
    // const selectedEvent: any = events.find((item: any) => item.id == info.event._def.publicId);
    // setEventDialogData(selectedEvent);
    // console.log('Event clicked:', selectedEvent);
    // openDialogEvent();
    /** --- end old codebase */
    console.log("@@@group event@@@: ", info)
    let unbookedEventCount = 0;
    const selectedEvent: any = events.find((item: any) => item.id == info.event._def.publicId);
    const group_events = events.filter((item: any) => item.event_series == selectedEvent.event_series);
    group_events.map((group_event: any) => {
      let isBooked = false;
      /**
       *TODO: filter data from the server   
       */
      group_event.players.forEach((player: any) => {
        myMembers.some((my_member: any) => {
          if (my_member.id == player.id) { isBooked = true; setCreateOrDelete("edit") }
        });
      });


      if (isBooked) {
        events.forEach((event: any) => {
          if (!Array.isArray(event.booked_dates)) {
            // event.booked_dates = [];
          }
          // event.booked_dates.push(group_event.start);
        });
      } else {
        unbookedEventCount++;
      }
    });
    selectedEvent.series_count = unbookedEventCount;
    const originTx = selectedEvent.players.filter((player: any) => player.is_repeat === false).map((player: any) => player.transaction_id);
    if (originTx.length > 0) selectedEvent.repeated = false;
    else selectedEvent.repeated = true;
    /**
     * 
     * check chatroom
     */
    const selectedRoom = chatRooms.find((chatroom: any) => chatroom.event === selectedEvent.id);
    if (selectedRoom) {
      setChatRooms([selectedRoom]);
    } else {
      setChatRooms([]);
    }
    if (selectedEvent.event_type === "Group") {
      const start_time = selectedEvent.start.split("T")[0];
      setGroupEventDialogData({
        ...selectedEvent,
        date: new Date(start_time)
      });
      openDialogGroupEvent();
    } else {
      setEventDialogData(selectedEvent);
      openDialogEvent();
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const openDialogAvailability = (): void => {
    setIsOpenAvailability(true);
  };

  const closeDialogAvailability = (): void => {
    setIsOpenAvailability(false);
  };

  const openDialogEvent = (): void => {
    setIsOpenEvent(true);
    dispatch(setDialogState("eventDialog"))
  };

  /** --- related with group event modal */
  const openDialogGroupEvent = (): void => {
    setIsOpenGroupEvent(true);
  }

  const exitDialogGroup = async() => {
    // setisOpenGroupEvent(false);
  }

  const closeDialogGroup = async () => {
    setIsOpenGroupEvent(false);
    setIsOpenChatRooms(false);
    try {
      const data = await getAllEvents();
      const my_members = await getAllMembers();
      const group_events = data.group_events;
      group_events.forEach((group_event: any) => {
        if (!group_event.players[0]?.is_paid) {
          group_event.players = [];
        }
        return group_event;
      });
      const eventSeriesCount = group_events.reduce((acc: any, group_event: any) => {
        const series = group_event.event_series;
        if (!series) return acc;

        const isMyPlayerInGroup = group_event.players.some((player: any) =>
          my_members.members.some((my_member: any) => my_member.id === player.id)
        );

        if (isMyPlayerInGroup) {
          group_event.already_booked = true;
          acc[series] = acc[series] || 0;
        } else if (group_event.players.length === 0) {
          acc[series] = (acc[series] || 0) + 1;
        }

        return acc;
      }, {});

      const updatedGroupEvents = group_events.map((group_event: any) => ({
        ...group_event,
        series_count: group_event.event_series ? eventSeriesCount[group_event.event_series] : 0,
        already_booked: !!group_event.event_series,
      }));

      const allEvents: any = [...data.events, ...updatedGroupEvents]
      setEvents(allEvents);
      setChatRooms(data.chat_rooms);
      setOldChatRooms(data.chat_rooms);
      setLoading(false);
      // // setisOpenGroupEvent(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const closeDialogEvent = async () => {
    setIsOpenEvent(false);
    setIsOpenChatRooms(false);
    try {
      const data = await getAllEvents();
      const my_members = await getAllMembers();
      const group_events = data.group_events;
      group_events.forEach((group_event: any) => {
        if (!group_event.players[0]?.is_paid) {
          group_event.players = [];
        }
        return group_event;
      });
      const eventSeriesCount = group_events.reduce((acc: any, group_event: any) => {
        const series = group_event.event_series;
        if (!series) return acc;

        const isMyPlayerInGroup = group_event.players.some((player: any) =>
          my_members.members.some((my_member: any) => my_member.id === player.id)
        );

        if (isMyPlayerInGroup) {
          group_event.already_booked = true;
          acc[series] = acc[series] || 0;
        } else if (group_event.players.length === 0) {
          acc[series] = (acc[series] || 0) + 1;
        }

        return acc;
      }, {});

      const updatedGroupEvents = group_events.map((group_event: any) => ({
        ...group_event,
        series_count: group_event.event_series ? eventSeriesCount[group_event.event_series] : 0
      }));

      const allEvents: any = [...data.events, ...updatedGroupEvents]
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

  const onOKDialogGroup = async () => {
    try {
      const data = await getAllEvents();
      const my_members = await getAllMembers();
      const group_events = data.group_events;
      group_events.forEach((group_event: any) => {
        if (!group_event.players[0]?.is_paid) {
          group_event.players = [];
        }
        return group_event;
      });
      const eventSeriesCount = group_events.reduce((acc: any, group_event: any) => {
        const series = group_event.event_series;
        if (!series) return acc;

        const isMyPlayerInGroup = group_event.players.some((player: any) =>
          my_members.members.some((my_member: any) => my_member.id === player.id)
        );

        if (isMyPlayerInGroup) {
          group_event.already_booked = true;
          acc[series] = acc[series] || 0;
        } else if (group_event.players.length === 0) {
          acc[series] = (acc[series] || 0) + 1;
        }

        return acc;
      }, {});

      const updatedGroupEvents = group_events.map((group_event: any) => ({
        ...group_event,
        series_count: group_event.event_series ? eventSeriesCount[group_event.event_series] : 0
      }));

      const allEvents: any = [...data.events, ...updatedGroupEvents]
      setEvents(allEvents);

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }

  return <div className="nc-PagePlayerCalenda">
    <Helmet>
      <title>Calenda || Tennisbrain</title>
    </Helmet>
    <div className="container relative min-h-[calc(100vh-5rem)] pt-5 pb-16 lg:pb-20 lg:pt-5">
      {/* HEADER */}
      <Guide />
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
      {/* <DialogCoachAvailability isOpen={isOpenAvailability} data={availabilityDialogData} onClose={closeDialogAvailability} /> */}
      <DialogPlayerEvent
        setIsOpenChatRooms={setIsOpenChatRooms}
        setRoomInfo={setRoomInfo}
        rooms={chatRooms}
        isOpen={isOpenEvent}
        data={eventDialogData}
        onOK={onOKDialogEvent}
        products={products}
        onClose={closeDialogEvent}
        stripePromise={stripePromise}
        creation={createOrDelete}
      />
      <DialogPlayerGroupEvent
        setIsOpenChatRooms={setIsOpenChatRooms}
        setRoomInfo={setRoomInfo}
        rooms={chatRooms}
        isOpen={isOpenGroupEvent}
        // isOpen={isOpenGroupEvent}
        data={groupEventDialogData}
        products={products}
        onOK={onOKDialogGroup}
        onClose={closeDialogGroup}
        onExit={exitDialogGroup}
      />
      <Chatting
        isOpen={isOpenChatRooms}
        setIsOpen={setIsOpenChatRooms}
        roomInfo={roomInfo}
        setRoomInfo={setRoomInfo}
        rooms={chatRooms}
        oldRooms={oldChatRooms}
        setRooms={setChatRooms}
      />
    </div>
  </div>
}

export default PagePlayerCalenda;

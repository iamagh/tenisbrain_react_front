import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import ButtonThird from "shared/Button/ButtonThird";
import ButtonSecondary from "shared/Button/ButtonSecondary";

import { toast } from "react-toastify";

import { updateEvent, deleteEvent } from "services/coach/events";
import { getAllExercises } from "services/coach/exercises";

import ChatButton from "components/Chatting/ChatButton";
import Nav from "shared/Nav/Nav";
import NavItem2 from "components/NavItem2";
import ContentAccordion from "components/CustomComponents/ContentAccordion";

interface DialogCoachEventProps {
  isOpen: boolean;
  data?: any;
  onOK: () => void;
  onClose: () => void;
  products: any;
  setRoomInfo: (param: any) => void;
  setIsOpenChatRooms: (param: boolean) => void;
  rooms: any;
}

const DialogCoachEvent: FC<DialogCoachEventProps> = ({ isOpen, data, onOK, onClose, setIsOpenChatRooms, rooms, products, setRoomInfo }) => {
  const eDate = new Date(data.start).toDateString();
  const [event, setEvent] = useState<any>({});

  const [availabilitys, setAvailabilitys]: any = useState([]);

  const [contents, setContents] = useState([]);
  const [tabActive, setTabActive] = useState('detail');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilitysState, setAvailabilitysState] = useState<string[]>([]);

  const DATA_availabilitys = [
    {
      name: "New Arrivals",
    },
    {
      name: "Sale",
    },
    {
      name: "Backpacks",
    },
    {
      name: "Travel Bags",
    },
    {
      name: "Laptop Sleeves",
    },
    {
      name: "Organization",
    },
    {
      name: "Accessories",
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      /** set start time */

      try {
        const data = await getAllExercises();
        setContents(data.contents);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };
    fetchData();

    setEvent({ ...data })
    /** --- set detailtab */
    return () => {
      setTabActive('detail');
    }
  }, [isOpen])


  const handleContentSelection = (checked: boolean, itemId: number, score: any) => {
    setEvent((prevEvent: any) => {
      if (checked) {
        // Find the selected item in the contents array
        const selectedContentItem: any = contents.find((item: any) => item.id === itemId);

        // If the item exists, update its score and append it to the content array
        if (selectedContentItem) {
          const updatedContent = [
            ...prevEvent.content.filter((item: any) => item.id !== itemId), // Remove the item if it already exists
            {
              ...selectedContentItem,
              score: score
            }
          ];

          return {
            ...prevEvent,
            content: updatedContent
          };
        }
      } else {
        // Remove the item with the matching ID from the content array
        const updatedContent = prevEvent.content.filter((item: any) => item.id !== itemId);

        return {
          ...prevEvent,
          content: updatedContent
        };
      }

      // If the item is not found or it's not checked, return the previous state
      return prevEvent;
    });
  };

  const handleChangeAvailabilitys = (checked: boolean, time: string) => {
    const dayIndex = data.date.getDay();
    const updatedData = availabilitys.map((avail: any) => {
      if (avail.time == time) {
        return {
          ...avail,
          days: avail.days.map((day: any, index: number) =>
            index === dayIndex ? { ...day, checked: checked } : day
          )
        };
      } else {
        return avail;
      }
    });
    setAvailabilitys(updatedData);

    // checked
    //   ? setAvailabilitysState([...availabilitysState, time])
    //   : setAvailabilitysState(availabilitysState.filter((i) => i !== time));

  };

  const isChecked = (time: string) => {

    const dayIndex = 0;//data.date.getDay();

    const availability = availabilitys.find((item: any) => item.time == time);
    const checked = availability.days[dayIndex].checked;

    return checked;
  }
  const handleSubmit = async () => {
    try {
      const res = await updateEvent(data.id, event);
      toast.success("Event updated successfully.");
      onOK()
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message);
    }
  }

  const handleDelete = async () => {
    if (!data.id) {
      console.log('can not delete');
      return;
    }
    try {
      const res = await deleteEvent(data.id);
      toast.success("Event removed successfully.");
      onOK();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message);
    }
  }

  const handleClose = () => {
    return;
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-[1000] overflow-y-auto"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900 text-center"
          >
            EVENT SCHEDULED - {eDate}
          </Dialog.Title>

          <div className="mt-4">
            <div className="text-sm text-gray-500">
              <div className="flex">
                <Nav
                  className="p-1 bg-white dark:bg-neutral-800 rounded-full shadow-lg"
                  containerClassName="mb-2 lg:mb-4 relative flex justify-center w-full text-sm md:text-base"
                >
                  {
                    [
                      {
                        name: 'Event Detail',
                        value: 'detail',
                      }, {
                        name: 'Content',
                        value: 'content',
                      }
                    ].map((item: any, index) => (
                      <NavItem2
                        key={index}
                        isActive={tabActive === item.value}
                        onClick={() => setTabActive(item.value)}
                      >
                        <div className="flex items-center justify-center sm:space-x-2.5 text-xs sm:text-sm ">
                          <span>{item.name}</span>
                        </div>
                      </NavItem2>
                    ))
                  }
                </Nav>
                {data.id !== undefined && <ChatButton setIsOpen={setIsOpenChatRooms} rooms={rooms} eventId={data.id} setRoomInfo={setRoomInfo} />} 
              </div>
              <div className="flex-grow mt-10 md:mt-0 max-w-3xl space-y-6">
                {
                  tabActive == "detail" ? <>
                    <div>
                      <Label>Group size</Label>
                      <Input className="mt-1.5" defaultValue={data.group_size} readOnly={true} />
                    </div>

                    {/* ---- */}
                    <div>
                      <Label>Event Players</Label>
                      <Textarea className="mt-1.5" defaultValue={data.players?.map((player: any) => `${player.first_name} ${player.last_name} \n`)} readOnly={true} />
                    </div>
                    {/* ---- */}
                    <div>
                      <Label>Description</Label>
                      <Select className="mt-1.5" defaultValue={data.description} onChange={(e) => setEvent({ ...event, description: e.target.value })
                      }>
                        <option value="Junior - Red Ball">Junior - Red Ball</option>
                        <option value="Junior - Orange Ball">Junior - Orange Ball</option>
                        <option value="Junior - Green Ball">Junior - Green Ball</option>
                        <option value="Junior - Adult Ball">Junior - Adult Ball</option>
                        <option value="Adult - Beginner">Adult - Beginner</option>
                        <option value="Adult - Intermediate">Adult - Intermediate</option>
                        <option value="Adult - Advanced">Adult - Advanced</option>
                      </Select>
                    </div>

                    {/* ---- */}
                    <div>
                      <Label>Start Time</Label>
                      <div className="mt-1.5 flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                          <i className="text-2xl las la-map-signs"></i>
                        </span>
                        <Input
                          className="!rounded-l-none"
                          defaultValue={data.start_time}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* ---- */}
                    <div>
                      <Label>Duaration</Label>
                      <Select className="mt-1.5" defaultValue={data.duration} onChange={(e) => setEvent({ ...event, duration: e.target.value })}>
                        <option value="60 minutes">60 minutes</option>
                        <option value="90 minutes">90 minutes</option>
                      </Select>
                    </div>
                  </> : <>
                    {/* --- add content section */}
                    <div>
                      {/* <Label>Add Content</Label> */}
                      <div className="mt-2 space-y-2">
                        <ContentAccordion
                          contents={contents}
                          groupContent={event.content}
                          handleContent={handleContentSelection}
                        />
                      </div>
                    </div>
                  </>
                }
              </div>
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                <ButtonPrimary
                  onClick={handleSubmit}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Apply
                </ButtonPrimary>
                <ButtonSecondary sizeClass="px-4 py-2 sm:px-5" onClick={handleDelete}>Delete</ButtonSecondary>
                <ButtonThird
                  onClick={() => {
                    onClose();
                    setAvailabilitysState([]);
                  }}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Cancel
                </ButtonThird>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogCoachEvent;

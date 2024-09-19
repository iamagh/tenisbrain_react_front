import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import Radiobox from "shared/Radio/Radio";
import ButtonThird from "shared/Button/ButtonThird";
import Nav from "shared/Nav/Nav";
import NavItem2 from "components/NavItem2";
import ContentAccordion from "components/CustomComponents/ContentAccordion";

import { toast } from "react-toastify";

import { createEvent, updateEvent, deleteEvent } from "services/coach/events";
import { getAllExercises } from "services/coach/exercises";
import { getAllProducts } from "services/shared/product";

import ChatButton from "components/Chatting/ChatButton";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { loadingMessage, convertDateStringToYYMMDD } from "utils/others";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { LayoutLoading } from "components/LayoutLoading";

interface DialogCoachEventProps {
  isOpen: boolean;
  data?: any;
  onOK: () => void;
  onClose: () => void;
  setIsOpenChatRooms: (param: boolean) => void;
  rooms: any;
  setRoomInfo: (param: any) => void;
}

const DialogCoachGroupEvent: FC<DialogCoachEventProps> = ({ isOpen, data, onOK, onClose, setIsOpenChatRooms, rooms, setRoomInfo }) => {
  const eDate = new Date(data.date).toDateString();
  const pickedDate = convertDateStringToYYMMDD(data.date);
  const dispatch = useDispatch();
  const availability: any = useSelector((state: RootState) => state.coach.availabilitys);
  const userId = localStorage.getItem('user') || "0";

  const [groupEvent, setGroupEvent] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [contents, setContents] = useState([]);
  const [tabActive, setTabActive] = useState('detail');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [repeated, setRepeated] = useState<any>({
    status: 'norepeat',
    date: null,
  });
  const [availabilitysState, setAvailabilitysState] = useState<string[]>([]);
  const times: string[] = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  useEffect(() => {
    if (!isOpen) {
      /** reset state repeat */
      setRepeated({
        status: 'norepeat',
        date: null,
      });
      return
    }
    const fetchData = async () => {
      /** set available times */
      /** set start time */

      try {
        const data = await getAllExercises();
        const p_data = await getAllProducts(userId);
        setContents(data.contents);
        setProducts(p_data.products);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };
    fetchData();
    if (data.id === undefined) {
      setGroupEvent({
        group_size: '3',
        content: [],
        description: "Junior - Red Ball",
        duration: "60 minutes",
        start_time: times[0],
        start: pickedDate,
        product_price: 10,
        discount: 0,
        unit: 0,
      })
    } else {
      setGroupEvent({ ...data })
    }
    /** --- set detailtab */
    return () => {
      setTabActive('detail');
    }
  }, [isOpen, availability]);

  const handleContentSelection = (checked: boolean, itemId: number, score: any) => {
    setGroupEvent((prevGroupEvent: any) => {
      if (checked) {
        // Find the selected item in the contents array
        const selectedContentItem: any = contents.find((item: any) => item.id === itemId);

        // If the item exists, update its score and append it to the content array
        if (selectedContentItem) {
          const updatedContent = [
            ...prevGroupEvent.content.filter((item: any) => item.id !== itemId), // Remove the item if it already exists
            {
              ...selectedContentItem,
              score: score
            }
          ];

          return {
            ...prevGroupEvent,
            content: updatedContent
          };
        }
      } else {
        // Remove the item with the matching ID from the content array
        const updatedContent = prevGroupEvent.content.filter((item: any) => item.id !== itemId);

        return {
          ...prevGroupEvent,
          content: updatedContent
        };
      }

      // If the item is not found or it's not checked, return the previous state
      return prevGroupEvent;
    });
  };

  const handleRepeatedRadio = (value: any) => {
    setRepeated((prevRepeated: any) => ({ ...prevRepeated, status: value }));
  }

  const handleSubmit = async () => {
    const reqData = groupEvent;
    reqData.event_type = "Group";
    if (!reqData.product_id) {
      reqData.product_id = products[0].id;
      reqData.description = products[0].product;
    }
    /** --- check repeated date */
    try {
      setLoading(true);
      if (data.id) {
        reqData.start = reqData.start.split("T")[0];
        await updateEvent(data.id, reqData);
        toast.success('Updated Event successfully.');
      } else {
        /** --- check repeated date */
        if (repeated.status !== 'norepeat' && repeated.date === null) {
          return toast.error("Please set repeated end date!");
        }
        /** --- set repeated date */
        if (repeated.status !== "norepeat") {
          reqData.repeated = repeated.status;
          reqData.repeated_date = repeated.date;
        }
        console.log('reqData', reqData)
        await createEvent(reqData);
        toast.success('Created New Event successfully.');
      }
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message || 'The error is occur while hanlding')
    }
    // const res = await updateEvent(data.id, event);
    onOK()
    onClose()
  }

  const handleRemove = async () => {
    // remove event
    try {
      setLoading(true);
      const res = await deleteEvent(data.id);
      setLoading(false);
      onOK();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message || 'The error is occur while hanlding');
    }
  }

  const handleClose = () => {
    return;
  }

  const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.currentTarget.value;
    const description = products.find((product: any) => product.id == productId).product;
    setGroupEvent((prevEvent: any) => ({
      ...prevEvent,
      description,
      product_id: productId
    }));
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-[1000] overflow-y-auto"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="min-h-screen px-4 text-center relative">
        <LayoutLoading show={loading} />
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
            GROUP CLASS SCHEDULED - {eDate}
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
                  tabActive === 'detail' ? <>
                    {/* --- group size */}
                    <div>
                      <Label>Group size - (Minimum: 3, Maximum: 20)</Label>
                      <Input className="mt-1.5" value={groupEvent.group_size} type="number" min="3" max="20" onChange={(e) => setGroupEvent({ ...groupEvent, group_size: e.target.value })} />
                    </div>
                    {/* --- event players */}
                    <div>
                      <Label>Event Players</Label>
                      <Textarea className="mt-1.5" defaultValue={data.players?.map((player: any) => `${player.first_name} ${player.last_name} \n`)} readOnly={true} />
                    </div>

                    {/* ---- select description */}
                    <div>
                      <Label>Select Description</Label>
                      <Select className="mt-1.5" value={groupEvent.product_id} onChange={handleChangeProduct}>
                        {products.map((product: any, index: number) => (
                          <option value={product.id} key={index}>{product.product}</option>
                        ))}
                      </Select>
                    </div>

                    {/* --- start available times */}
                    <div>
                      <Label>Start Time</Label>
                      <div className="mt-1.5 flex">
                        <Select className="mt-1.5" value={groupEvent.start_time} onChange={(e) => setGroupEvent({ ...groupEvent, start_time: e.target.value })}>
                          {
                            times.length > 0 ? times.map((time: any, index: number) => (
                              <option key={index} value={time}>{time}</option>
                            )) : <option>No available times</option>
                          }
                        </Select>
                      </div>
                    </div>

                    {/* --- class duration 60 mins / 90 mins */}
                    <div>
                      <Label>Duaration</Label>
                      <Select className="mt-1.5" value={groupEvent.duration} onChange={(e) => setGroupEvent({ ...groupEvent, duration: e.target.value })}>
                        <option value="60 minutes">60 minutes</option>
                        <option value="90 minutes">90 minutes</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Hourly Rate</Label>
                      <Input
                        name="price"
                        className="mt-1.5"
                        placeholder="10.00"
                        type="number"
                        value={groupEvent.product_price}
                        onChange={(e) => setGroupEvent({ ...groupEvent, product_price: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div>
                        <Label>Discount Rate</Label>
                        <Input
                          name="discount"
                          className="mt-1.5"
                          placeholder="10.00"
                          prefix="%"
                          type="number"
                          value={groupEvent.discount}
                          onChange={(e) => setGroupEvent({ ...groupEvent, discount: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Input
                          name="discount"
                          className="mt-1.5"
                          placeholder="6"
                          type="number"
                          value={groupEvent.unit}
                          onChange={(e) => setGroupEvent({ ...groupEvent, unit: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* --- add repeated field for creating new group class event */}
                    {data.id === undefined && <div className="mb-1.5">
                      <Label>Repeated</Label>
                      <div className="flex gap-2 mt-2">
                        <Radiobox
                          name="repeated"
                          label="No repeat"
                          id="norepeat"
                          defaultChecked={repeated.status === 'norepeat'}
                          onChange={(e) => handleRepeatedRadio(e)}
                        />
                        <Radiobox
                          name="repeated"
                          label="Daily"
                          id="daily"
                          defaultChecked={repeated.status === 'daily'}
                          onChange={(e) => handleRepeatedRadio(e)}
                        />
                        <Radiobox
                          name="repeated"
                          label="Weekly"
                          id="weekly"
                          defaultChecked={repeated.status === 'weekly'}
                          onChange={(e) => handleRepeatedRadio(e)}
                        />
                      </div>
                      {
                        repeated.status !== "norepeat" &&
                        <Input className="mt-1.5" defaultValue={repeated.date} type="date" min={pickedDate} onChange={(e) => setRepeated((prevState: any) => ({ ...prevState, date: e.target.value }))} />
                      }
                    </div>}
                  </> : <>
                    {/* --- add content section */}
                    <div>
                      {/* <Label>Add Content</Label> */}
                      <div className="mt-2 space-y-2">
                        <ContentAccordion
                          contents={contents}
                          groupContent={groupEvent.content}
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
                  {data.id === undefined ? 'Create ' : 'Update '}<span className="hidden sm:inline">&nbsp; Class</span>
                </ButtonPrimary>
                {
                  data.id === undefined ? '' : <ButtonSecondary
                    onClick={handleRemove}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Delete
                  </ButtonSecondary>
                }
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

export default DialogCoachGroupEvent;

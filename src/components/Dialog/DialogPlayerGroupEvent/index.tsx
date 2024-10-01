import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Checkbox from "shared/Checkbox/Checkbox";
import ButtonThird from "shared/Button/ButtonThird";
import Radiobox from "shared/Radio/Radio";

import Nav from "shared/Nav/Nav";
import NavItem2 from "components/NavItem2";
import ContentAccordion from "components/CustomComponents/ContentAccordion";

import { toast } from "react-toastify";

import { deleteEvent, updateEvent, getAllEventSeries } from "services/player/events";
import { getAllMembers } from "services/player/members";
import { getAllCoaches } from "services/player/coches";

import ChatButton from "components/Chatting/ChatButton";

import { loadingMessage, convertDateStringToYYMMDD } from "utils/others";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import StripeModal from "components/StripeModal";
import { cancelPaidProduct } from "services/shared/payment";
import { LayoutLoading } from "components/LayoutLoading";
import ButtonSecondary from "shared/Button/ButtonSecondary";

const stripePromise: Promise<Stripe | null> = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

interface DialogCoachEventProps {
  isOpen: boolean;
  data?: any;
  onOK: () => void;
  onClose: () => void;
  products: any;
  setIsOpenChatRooms: (param: boolean) => void;
  rooms: any;
  setRoomInfo: (param: any) => void;
}

const DialogPlayerGroupEvent: FC<DialogCoachEventProps> = ({ isOpen, data, onOK, onClose, setIsOpenChatRooms, rooms, setRoomInfo, products }) => {
  console.log("------ group data: ", data)
  const eData = new Date(data.date).toDateString();
  const pickedDate = convertDateStringToYYMMDD(data.date);

  const [groupEvent, setGroupEvent] = useState<any>({});
  const [coaches, setCoaches] = useState<any[]>([]);
  const [activeCoach, setActiveCoach] = useState(null);
  const [members, setMembers] = useState([]);
  const [tabActive, setTabActive] = useState('detail');
  const [onwerEmail, setOnwerEmail] = useState('');
  const [openStripeModal, setOpenStripeModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [reqEventData, setReqEventData] = useState<any>({});

  const [repeated, setRepeated] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originPlayers, setOriginPlayers] = useState<number>(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paidTxId, setPaidTxId] = useState<string>("");


  
  const closeStripeModal = () => {
    setOpenStripeModal(false)
    onOK()
    onClose();
  }

  const openModal = () => { setModalIsOpen(true); };
  const closeModal = () => { setModalIsOpen(false); };

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
    console.log("DialogPlayerGroupEvent useEffect");
       
    if (!isOpen) return;
    /** --- get all members from api */
    const fetchContent = async () => {
      // get all coaches
      const response: any = await getAllCoaches();
      setCoaches(response.coaches);
        
      const res_members = await getAllMembers();
      const updatedMembers = res_members.members.map((member: any) => {
        const isChecked = data?.players.some((player: any) => player.id === member.id);
        return { ...member, checked: isChecked };
      });
      setMembers(updatedMembers);
    }

    

    console.log("DialogPlayerGroupEvent before fetchContent");
    fetchContent();
    console.log("DialogPlayerGroupEvent after fetchContent", data);
    if (typeof data.id === 'undefined') {
      console.log('data undefined')
      setGroupEvent({
        group_size: '3',
        content: [],
        players: [],
        description: "Junior - Red Ball",
        duration: "60 minutes",
        start_time: times[0],
        start: pickedDate,
      })
    } else {
      setGroupEvent(data);
      console.log('data from server ~~~~~~~~~~',data)
      const originTx = data.players.filter((player: any) => player.is_repeat === false).map((player: any) => player.transaction_id);
      if (originTx.length > 0) {
        setPaidTxId(originTx[0])
      } else {
        setPaidTxId(data.players[0]?.transaction_id);
      }
      setOriginPlayers(data.players.length)
    }
    /** --- set detailtab */
    return () => {
      setTabActive('detail');
    }
  }, [isOpen, data]);

  const handleSubmit = async (leave:boolean = false) => {
    groupEvent.players = members.filter((member: any) => member.checked == true);
    const checkedCount = groupEvent.players.length;
    if (checkedCount === 0 && !leave) {
      toast.error('Please select at least one player.');
      return;
    }

    const coach: any = coaches.find((item: any) => item.id == data.coach_id);
    try {
      const reqData = groupEvent;
      reqData.group = true;
      reqData.dataId = data.id;
      reqData.isDelete = false;
      reqData.repeated = repeated;
      reqData.repeat_status = repeated || false;
      if (!reqData.product_id) {
        reqData.product_id = selectedProduct.id;
        reqData.description = selectedProduct.product;
      }
      if (typeof reqData.booked_dates == 'undefined') {
        reqData.booked_dates = [];
      }
      setReqEventData(reqData)
      setLoading(true)
      if (coach.enable_payment === 'disabled') {
        reqData.transaction_id = "";
        await updateEvent(data.id, reqData);
        onClose();
        onOK()
        toast.success('Updated Event.');
      } else {
        console.log('reqData.product_price',reqData.product_price)
        if (repeated) {
          const result = await getAllEventSeries(data.event_series);
          const event_series = result.events;
          const availableEvents = event_series.filter((v:any) => new Date(v.start_time) >= new Date(data.start));
          reqData.product_price = reqData.product_price * availableEvents.length * (availableEvents.length >= reqData.unit ? (100 - reqData.discount) / 100 : 1);
          reqData['event_last_time'] = availableEvents[availableEvents.length - 1].end_time;
        }
        if (data.id) {
          console.log('paidTxId',paidTxId)
          console.log('typeof paidTxId',typeof paidTxId)
          if (typeof paidTxId == "undefined") {
            setOpenStripeModal(true);
            onOK()
            onClose();
          } else {
            reqData.transaction_id = paidTxId;
            if (leave) {
              reqData.isDelete = true;
              reqData.repeat_status = data.repeated
              reqData.players = members.map((v:any) => {
                v.checked =false;
                return v;
              });
              const cancelRes = await cancelPaidProduct(paidTxId)
              await updateEvent(data.id, reqData);
            } else {
              reqData.repeat_status = data.repeated
              if(reqData.players.length !== data.players.length)
                setOpenStripeModal(true);
              else {
                reqData.players = members;
                await updateEvent(data.id, reqData);
              }
            }
            onClose();
            onOK()
            toast.success('Updated Event.');
          }
        }
      }
      setLoading(false)
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message || 'The error is occur while hanlding');
    }
  }

  const isChecked = (member: any) => {
    return groupEvent.players.some((item: any) => item.id == member.id);
  }
  const handleSelectMember = (checked: boolean, member: any) => {
    let newplayers = groupEvent?.players || [];

    const player = members.find((item: any) => item.id == member.id);
    if (checked && newplayers.length == groupEvent.group_size) {
      toast.error("Players couldn't be over group size");
      return;
    }

    if (checked && newplayers.length < groupEvent.group_size) {
      newplayers = [...newplayers, player];
      setOriginPlayers((preview) => preview + 1)
    } else {
      newplayers = groupEvent.players.filter((item: any) => item.id != member.id);
      setOriginPlayers((preview) => preview - 1)
    }
    setMembers((prevMembers: any) =>
      prevMembers.map((item: any) =>
        item.id === member.id ? { ...item, checked, selected: checked } : item
      )
    );
    setGroupEvent((prevGroupEvent: any) => {
      return {
        ...prevGroupEvent,
        players: newplayers
      };
    });
  }

  const getCoach = (coach_id: string) => {
    const coach: any = coaches.find((item: any) => item.id == coach_id);
    if (coach) {
      return `${coach.first_name} ${coach.last_name}`
    } else {
      return '';
    }
  }

  const handleRepeatedRadio = (value: boolean) => {
    if (typeof paidTxId == "undefined") {
      setRepeated(value);
    }
  }

  const handleClose = () => {
    return;
  }

  const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.currentTarget.value;
    setSelectedProduct(products.find((product: any) => product.id == productId))

  }

  return (
    <>
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
              GROUP CLASS SCHEDULED - {eData}
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
                  {data.id !== undefined && <ChatButton setIsOpen={setIsOpenChatRooms} rooms={rooms} setRoomInfo={setRoomInfo} eventId={data.id} />}
                </div>

                <div className="flex-grow mt-10 md:mt-0 max-w-3xl space-y-6">
                  {
                    tabActive === 'detail' ? <>
                      {/* --- group size */}
                      <div>
                        <Label>Group size - {data.group_size}</Label>
                        <Input
                          className="mt-1.5"
                          value={`${groupEvent.players ? groupEvent.players.length : 0}/${data.group_size}`}
                          type="text"
                          min="3"
                          max="20"
                          readOnly
                        />
                      </div>


                      {/* --- event players */}
                      <div>
                        <Label>Event Players</Label>
                        {/* <Textarea className="mt-1.5" defaultValue={data.players?.map((player: any) => `${player.first_name} ${player.last_name} \n`)} readOnly={true} /> */}
                        <div className="h-32 overflow-y-auto">
                          {/* <Textarea className="mt-1.5" defaultValue={data.players?.map((player: any) => `${player.first_name} ${player.last_name} \n`)} readOnly={true} /> */}
                          {members?.map((item: any, index: number) => (
                            <div key={index} className="py-1">
                              <Checkbox
                                name={item.id}
                                label={`${item.first_name} ${item.last_name}`}
                                checked={isChecked(item)}
                                onChange={(checked) =>
                                  handleSelectMember(checked, item)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* --- event coach */}
                      <div>
                        <Label>Event Coach</Label>
                        <Input className="mt-1.5" defaultValue={getCoach(data.coach_id)} readOnly={true} />
                      </div>
                      {/* ---- select description */}
                      <div>
                        <Label>Select Description</Label>
                        <Select
                          className="mt-1.5"
                          value={groupEvent.description}
                          readOnly={true}
                          onChange={handleChangeProduct}
                        >
                          {/* {products?.map((product: any, index: number) => (
                            <option value={product.id} key={index}>{product.product}</option>
                            ))} */}
                          <option value={data.id} key={data.id}>{data.description}</option>
                        </Select>
                      </div>

                      {/* --- start available times */}
                      <div>
                        <Label>Start Time</Label>
                        <div className="mt-1 flex">
                          <Select
                            className="mt-1"
                            readOnly={true}
                            value={groupEvent.start_time}
                          >
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
                        <Select
                          className="mt-1"
                          readOnly={true}
                          value={groupEvent.duration}
                        >
                          <option value="60 minutes">60 minutes</option>
                          <option value="90 minutes">90 minutes</option>
                        </Select>
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input className="mt-1" defaultValue={data.product_price} readOnly={true} />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Label>Discount Rate</Label>
                          <Input className="mt-1" defaultValue={data.discount} readOnly={true} />
                        </div>
                        <div>
                          <Label>Unit</Label>
                          <Input className="mt-1" defaultValue={data.unit} readOnly={true} />
                        </div>
                      </div>

                      {/* --- flag to apply for entire serialized class or not */}
                      {
                        data.event_series != "NoSeries" && (
                          <div>
                            <Label>Repeated</Label>
                            <div className="flex gap-2 mt-2">
                              <Radiobox
                                name="repeated"
                                label="No repeat"
                                id="norepeat"
                                defaultChecked={!repeated}
                                onChange={(e) => handleRepeatedRadio(false)}
                              />
                              <Radiobox
                                name="repeated"
                                label="Repeated"
                                id="repeat"
                                defaultChecked={repeated}
                                onChange={(e) => handleRepeatedRadio(true)}
                              />
                            </div>
                          </div>
                        )
                      }
                    </> : <>
                      {/* --- add content section */}
                      <div>
                        {/* <Label>Add Content</Label> */}
                        <div className="mt-2 space-y-2">
                          <ContentAccordion
                            isCoach={false}
                            contents={groupEvent.content}
                            groupContent={groupEvent.content}
                          />
                        </div>
                      </div>
                    </>
                  }
                </div>

                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  <ButtonPrimary
                    onClick={() => handleSubmit(false)}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Enter
                  </ButtonPrimary>
                  {paidTxId && (
                    <ButtonSecondary
                      onClick={() => handleSubmit(true)}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Leave
                    </ButtonSecondary>
                  )}
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
      {openStripeModal && <StripeModal
        stripePromise={stripePromise}
        modalIsOpen={openStripeModal}
        onRequestClose={closeStripeModal}
        coachId={data.coach_id}
        selectedProduct={selectedProduct}
        reqEventData={reqEventData}
        cancelPaidProduct={cancelPaidProduct}
        paidTxId={paidTxId}
        members={members}
      />}
    </>
  );
};

export default DialogPlayerGroupEvent;

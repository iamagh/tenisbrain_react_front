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
import { useSelector } from 'react-redux';
import { RootState } from 'store/index'; // Assuming your store file is in the parent directory

import EventPlayers from "./EventPlayers"


const stripePromise: Promise<Stripe | null> = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

interface DialogCoachEventProps {
  isOpen: boolean;
  data?: any;
  onOK: () => void;
  onClose: () => void;
  onExit: () => void;
  products: any;
  setIsOpenChatRooms: (param: boolean) => void;
  rooms: any;
  setRoomInfo: (param: any) => void;
}

const GetMemberPlayers = () => {
  const memberPlayers = useSelector((state: RootState) => state.player.memberPlayers)
  return memberPlayers
}


const DialogPlayerGroupEvent: FC<DialogCoachEventProps> = ({ isOpen, data, onOK, onClose, setIsOpenChatRooms, rooms, setRoomInfo, products, onExit }) => {
  console.log("------ group data: ", data)
  const [currentMemberPlayers, setCurrentMemberPlayers] = useState([]);
  // setCurrentMemberPlayers(data.players)
  console.log("#########", currentMemberPlayers)
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


  

  /**
   * TODO:
   *  Initial Data for dialog
   */

  const playerCoach = useSelector((state: RootState) => state.player.playerCoach);


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
      console.log('data from server ~~~~~~~~~~', data)
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
  }, [isOpen === true, tabActive]);

  const handleSubmit = async (leave: boolean = false) => {
    groupEvent.players = members
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
        console.log('reqData.product_price', reqData.product_price)
        if (repeated) {
          const result = await getAllEventSeries(data.event_series);
          const event_series = result.events;
          const availableEvents = event_series.filter((v: any) => new Date(v.start_time) >= new Date(data.start));
          reqData.product_price = reqData.product_price * availableEvents.length * (availableEvents.length >= reqData.unit ? (100 - reqData.discount) / 100 : 1);
          reqData['event_last_time'] = availableEvents[availableEvents.length - 1].end_time;
        }
        if (data.id) {
          console.log('paidTxId', paidTxId)
          console.log('typeof paidTxId', typeof paidTxId)
          if (typeof paidTxId == "undefined") {
            setOpenStripeModal(true);
            onOK()
            onClose();
          } else {
            reqData.transaction_id = paidTxId;
            if (leave) {
              reqData.isDelete = true;
              reqData.repeat_status = data.repeated
              reqData.players = members
              const cancelRes = await cancelPaidProduct(paidTxId)
              await updateEvent(data.id, reqData);
            } else {
              reqData.repeat_status = data.repeated
              if (reqData.players.length !== data.players.length)
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
      setLoading(false)
      toast.error(err.message);
      setError(err.message || 'The error is occur while hanlding');
    }
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
                    onClick={ async () => {
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

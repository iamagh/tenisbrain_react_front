import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Checkbox from "shared/Checkbox/Checkbox";
import ButtonThird from "shared/Button/ButtonThird";
import { getAllAvailabilitys } from "services/player/availabilitys";
import { createEvent, deleteEvent, updateEvent } from "services/player/events";
import { getAllCoaches } from "services/player/coches";
import { getAllMembers } from "services/player/members";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { toast } from "react-toastify";

import ChatButton from "components/Chatting/ChatButton";
import Nav from "shared/Nav/Nav";
import NavItem2 from "components/NavItem2";
import ContentAccordion from "components/CustomComponents/ContentAccordion";
import StripeModal from "components/StripeModal";
import { cancelPaidProduct, updatePaidProduct } from "services/shared/payment";
import { getProductStatusForPlayer } from "services/shared/product";

interface DialogPlayerEventProps {
  isOpen: boolean;
  data?: any;
  onOK: () => void;
  onClose: () => void;
  products: any;
  setIsOpenChatRooms: (param: boolean) => void;
  rooms: any;
  setRoomInfo: (param: any) => void;
  stripePromise: any;
}


const DialogPlayerEvent: FC<DialogPlayerEventProps> = ({ isOpen, data, onOK, onClose, setIsOpenChatRooms, rooms, setRoomInfo, products, stripePromise }) => {
  const eDate = new Date(data.start).toDateString();
  const coach_id: any = localStorage.getItem('player-coach');
  const player_id = localStorage.getItem("user") || "0";
  const [event, setEvent]: any = useState({});
  const [coaches, setCoaches] = useState([]);
  const [members, setMembers] = useState([]);
  const [eventMembers, setEventMembers] = useState([]);
  const [tabActive, setTabActive] = useState('detail');

  const [availabilitys, setAvailabilitys]: any = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openStripeModal, setOpenStripeModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [reqEventData, setReqEventData] = useState<any>({});
  const [bookCount, setBookCount] = useState(0);
  const [paidProducts, setPaidProducts] = useState<any>([]);
  // const [paidTxId, setPaidTxId] = useState<string>("");

  const closeStripeModal = () => {
    setOpenStripeModal(false);
    onOK();
    onClose();
  }

  useEffect(() => {
    if (!isOpen) { return }

    const fetchData = async () => {

      const response: any = await getAllCoaches();
      setCoaches(response.coaches);

      let res_avails: any;

      if (data.id) {
        res_avails = await getAllAvailabilitys(data?.coach_id, data?.start);
      } else {
        data.coach_id = coach_id;
        res_avails = await getAllAvailabilitys(coach_id, data?.start);
      }
      const date = new Date(data.start);
      const dayIndex = (date.getDay() + 6) % 7;// from Monday

      const filteredAvails = res_avails?.availability?.filter((item: any) => item.days[dayIndex].checked);
      const formatedAvails = filteredAvails.concat({
        time: data.start_time,
        day: []
      });

      formatedAvails.sort((a: any, b: any) => a.time?.localeCompare(b.time));
      setAvailabilitys(formatedAvails);

      const res_members = await getAllMembers();
      const updatedMembers = res_members.members.map((member: any) => {
        const isChecked = data?.players?.some((player: any) => player.id === member.id);
        return { ...member, checked: isChecked };
      });
      setMembers(updatedMembers);
      setEventMembers(res_members.all_members);
      setSelectedProduct(products.find((product: any) => product.id == data.product_id) || products[0]);
      // setPaidTxId(data.players[0]?.transaction_id)

      setEvent({
        group_size: '1',
        description: 'Junior - Red Ball',
        duration: '60 minutes',
        start_time: formatedAvails.length ? formatedAvails[0].time : '',
        select_players: [],
        content: [],
        select_coaches: data.coach_id,
        ...data
      });
    }

    fetchData();

    return () => {
      setTabActive('detail');
    }

  }, [isOpen, data])

  useEffect(() => {
    const getPaidProduct = async () => {
      const res = await getProductStatusForPlayer(player_id);
      console.log(res, '---> res')
      const products = res?.products;

      setPaidProducts(products);
    }
    getPaidProduct();
  }, [player_id]);

  const getCoach = (coach_id: string) => {
    const coach: any = coaches.find((item: any) => item.id == coach_id);
    if (coach) {
      return `${coach.first_name} ${coach.last_name}`
    } else {
      return '';
    }
  }

  /**
   * 
   * @param member Member
   * @returns setEvent
   */
  const isChecked = (member: any) => {
    const event_member: any = eventMembers.find((item: any) => item.user == member.id);
    const player = data.players?.find((item: any) => item.id == event_member.id)
    if (player) { return true }
    else { return false }
  }
  const handleSelectMember = (checked: boolean, member: any) => {
    let newplayers = event?.players || [];
    const player = members.find((item: any) => item.id == member.id);
    if (checked) {
      newplayers = [...newplayers, player]
    } else {
      newplayers = event.players.filter((item: any) => item.id != member.id)
    }
    setEvent({
      ...event,
      players: newplayers
    })
    setMembers((prevMembers: any) =>
      prevMembers.map((item: any) =>
        item.id === member.id ? { ...item, checked, selected: checked } : item
      )
    );
  }

  /**
   * 
   * @returns 
   */
  const handleSubmit = async () => {
    const checkedCount = members.filter((member: any) => member.checked == true).length;
    const coach: any = coaches.find((item: any) => item.id == data.coach_id);
    if (!event.players) {
      toast.error('Please select players');
      return;
    }
    const reqData = event;
    reqData.group = false;
    reqData.repeat_status = 'undefined';
    reqData.isDelete = false;

    if (!reqData.product_id) {
      reqData.product_id = selectedProduct.id;
      reqData.description = selectedProduct.product;
    }

    setReqEventData(reqData);
    if (checkedCount === 0) {
      reqData.isDelete = true;
    }
    try {
      if (coach.enable_payment === 'disabled') {
        reqData.product_price = "0";

        if (data.id) {
          const res = await updateEvent(data.id, reqData);
          toast.success('Updated Event successfully.');
        } else {
          reqData.transaction_id = "";
          const res = await createEvent(reqData);
          toast.success('Created New Event successfully.');
        }
      } else {
        const defaultProdcut = {
          players: [],
          book_count: 0,
          repeat: false,
          payment_intent_id: null,
        };
        const paidProdcut = paidProducts.length ? paidProducts.find((paidProduct: any) => paidProduct.product_id == selectedProduct.id) : null ;
        const selectedPaidProduct = paidProdcut || defaultProdcut;
        const isPaidProduct = !!paidProdcut;
        const product_price = isPaidProduct ? products.find((product: any) => product.id == selectedPaidProduct.product_id).price : selectedProduct.price;
        selectedPaidProduct.players = members;
        const book_count = selectedPaidProduct?.book_count || 0;
        const isSeries = selectedPaidProduct?.repeat || false;
        reqData.product_price = product_price;
        if (data.id) {
          reqData.repeat = selectedPaidProduct.repeat;
          reqData.transaction_id = selectedPaidProduct.payment_intent_id;
          const res = await updateEvent(data.id, reqData);
          toast.success('Updated Event successfully.');
        } else {
          if (isPaidProduct && isSeries) {
            if (book_count < 5) {
              // reqData.transaction_id = paidTxId;
              reqData.transaction_id = selectedPaidProduct.payment_intent_id;
              const updateRes = await updatePaidProduct(selectedProduct.id);
              if (updateRes) {
                const res = await createEvent(reqData);
              }
              toast.success('Created New Event successfully.');
            } else {
              toast.error("Your credit expired, please pay again");
              return;
            }
          } else {
            setOpenStripeModal(true);
          }
        }
      }
      onOK()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'The error is occur while hanlding')
    }

  }

  const handleDelete = async () => {
    if (!data.id) {
      toast.error('Can not Delete');
      return;
    }
    try {
      const coach: any = coaches.find((item: any) => item.id == data.coach_id);
      if (coach.enable_payment === 'disabled') {
        const res = await deleteEvent(data.id);
        if (res)
          toast.success('The event has been removed');
      } else {
        setLoading(false)
        const selectedPaidProduct = paidProducts.find((paidProduct: any) => paidProduct.product_id == selectedProduct.id);
        const cancelRes = await cancelPaidProduct(selectedPaidProduct?.payment_intent_id)
        console.log(cancelRes, '---> cancelRes')
        if (cancelRes) {
          const res = await deleteEvent(data.id);
        }
        setLoading(true)
      }
      onOK();
      onClose();
    } catch (err: any) {
      setError(err.message || 'The error is occur while hanlding');
      toast.error(err.message);
      setLoading(true);
    }
  }
  const handleClose = () => {
    return;
  }

  const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.currentTarget.value;
    const description = products.find((product: any) => product.id == productId).product;
    setSelectedProduct(products.find((product: any) => product.id == productId))
    setEvent((prevEvent: any) => ({
      ...prevEvent,
      description,
      product_id: productId
    }));
  }

  return (
    <>
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
              className="text-lg font-medium text-center leading-6 text-gray-900"
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
                  {data.id !== undefined && <ChatButton setIsOpen={setIsOpenChatRooms} rooms={rooms} setRoomInfo={setRoomInfo} eventId={data.id} />}
                </div>
                <div className="flex-grow mt-10 md:mt-0 max-w-3xl space-y-6">
                  {
                    tabActive === 'detail' ? <>
                      <div>
                        <Label>Group size</Label>
                        <Input className="mt-1.5" value={event.players ? event.players.length : 0} readOnly={true} />
                      </div>

                      {/* ---- */}
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
                                defaultChecked={isChecked(item)}
                                onChange={(checked) =>
                                  handleSelectMember(checked, item)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Event Coach</Label>
                        <Input className="mt-1.5" defaultValue={getCoach(data.coach_id)} readOnly={true} />
                      </div>

                      {/* ---- */}
                      <div>
                        <Label>Description</Label>
                        <Select className="mt-1.5" defaultValue={data.product_id} onChange={handleChangeProduct}>
                          {products?.map((product: any, index: number) => (
                            <option value={product.id} key={index}>{product.product}</option>
                          ))}
                        </Select>
                      </div>

                      {/* ---- */}
                      <div>
                        <Label>Start Time</Label>
                        <div className="mt-1.5 flex">
                          {/* <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-map-signs"></i>
                    </span> */}
                          {/* <Input
                      className="!rounded-l-none"
                      defaultValue={data.start_time}
                      readOnly
                    /> */}
                          <Select className="mt-1.5" defaultValue={data.start_time} onChange={(e) => setEvent({ ...event, start_time: e.target.value })}>
                            {/* <option value={data.start_time}>{data.start_time}</option> */}
                            {
                              availabilitys.map((avail: any, index: number) => (
                                <option key={index} value={avail.time}>{avail.time}</option>
                              ))
                            }
                          </Select>
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
                        <div className="mt-2 space-y-2">
                          <ContentAccordion
                            isCoach={false}
                            contents={event.content}
                            groupContent={event.content}
                          />
                        </div>
                      </div>
                    </>
                  }
                </div>
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                  {!loading ?
                    <div className="flex items-center justify-center w-full ">
                      <ButtonPrimary>
                        <svg aria-hidden="true" role="status" className="inline w-8 h-8 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                        </svg>
                        Deleting Event...
                      </ButtonPrimary>
                    </div>
                    :
                    <>
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
                        }}
                        sizeClass="px-4 py-2 sm:px-5"
                      >
                        Cancel
                      </ButtonThird>
                    </>}
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
      />}
    </>
  );
};

export default DialogPlayerEvent;

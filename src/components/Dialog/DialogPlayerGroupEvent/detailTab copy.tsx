import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
// import Label from "components/Label/Label";
// import ButtonPrimary from "shared/Button/ButtonPrimary";
// import Input from "shared/Input/Input";
// import Select from "shared/Select/Select";
// import Checkbox from "shared/Checkbox/Checkbox";
// import ButtonThird from "shared/Button/ButtonThird";
// import Radiobox from "shared/Radio/Radio";

// import Nav from "shared/Nav/Nav";
// import NavItem2 from "components/NavItem2";
// import ContentAccordion from "components/CustomComponents/ContentAccordion";

// import { toast } from "react-toastify";

// import { deleteEvent, updateEvent, getAllEventSeries } from "services/player/events";
// import { getAllMembers } from "services/player/members";
// import { getAllCoaches } from "services/player/coches";

// import ChatButton from "components/Chatting/ChatButton";

// import { loadingMessage, convertDateStringToYYMMDD } from "utils/others";
// import { loadStripe, Stripe } from "@stripe/stripe-js";
// import StripeModal from "components/StripeModal";
// import { cancelPaidProduct } from "services/shared/payment";
// import { LayoutLoading } from "components/LayoutLoading";
// import ButtonSecondary from "shared/Button/ButtonSecondary";
// import { useSelector } from 'react-redux';
// import { RootState } from 'store/index'; // Assuming your store file is in the parent directory

// import EventPlayers from "./EventPlayers"


// const stripePromise: Promise<Stripe | null> = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

export interface DialogDetailTabProps {
  products: any;
  data: any;
}

// const GetMemberPlayers = () => {
//   const memberPlayers = useSelector((state: RootState) => state.player.memberPlayers)
//   return memberPlayers
// }


// import { _Coach } from "dataTypes/Player";



const DialogDetailTab: FC<DialogDetailTabProps> = ({ products, data }) =>  {
  // const [currentMemberPlayers, setCurrentMemberPlayers] = useState([]);
  // const coach: _Coach = useSelector((state: RootState) => state.player.playerCoach);
  // const [selectedProduct, setSelectedProduct] = useState<any>({});
  // const [repeated, setRepeated] = useState<boolean>(false);
  // const [paidTxId, setPaidTxId] = useState<string>("");

  // const times: string[] = [
  //   "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

  // const handleRepeatedRadio = (value: boolean) => {
  //   if (typeof paidTxId == "undefined") {
  //     setRepeated(value);
  //   }
  // }

  // const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const productId = e.currentTarget.value;
  //   setSelectedProduct(products.find((product: any) => product.id == productId))

  // }

  return (
    <>
      {/* --- group size */}
      {/* <div>
        <Label>Group size - {data.group_size}</Label>
        <Input
          className="mt-1.5"
          value={`${data.players ? data.players.length : 0}/${data.group_size}`}
          type="text"
          min="3"
          max="20"
          readOnly
        />
      </div> */}
      {/* --- event players */}
      {/* <EventPlayers
        maxPlayerCount={data.group_size}
        currentPlayers={data.players}
        memberPlayers={currentMemberPlayers}
        onChangeMembers={setCurrentMemberPlayers}
      /> */}
      {/* --- event coach */}
      {/* <div>
        <Label>Event Coach</Label>
        <Input className="mt-1.5" defaultValue={coach?.first_name + ' ' + coach?.last_name} readOnly={true} />
      </div> */}
      {/* ---- select description */}
      {/* <div>
        <Label>Select Description</Label>
        <Select
          className="mt-1.5"
          value={data.description}
          readOnly={true}
          onChange={handleChangeProduct}
        > */}
          {/* {products?.map((product: any, index: number) => (
                             <option value={product.id} key={index}>{product.product}</option>
                             ))} */}
          {/* <option value={data.id} key={data.id}>{data.description}</option>
        </Select>
      </div> */}

      {/* --- start available times */}
      {/* <div>
        <Label>Start Time</Label>
        <div className="mt-1 flex">
          <Select
            className="mt-1"
            readOnly={true}
            value={data.start_time}
          >
            {
              // times.length > 0 ? times.map((time: any, index: number) => (
              //   <option key={index} value={time}>{time}</option>
              // )) : <option>No available times</option>
            }
          </Select>
        </div>
      </div> */}


      {/* --- class duration 60 mins / 90 mins */}
      {/* <div>
        <Label>Duaration</Label>
        <Select
          className="mt-1"
          readOnly={true}
          value={data.duration}
        >
          <option value="60 minutes">60 minutes</option>
          <option value="90 minutes">90 minutes</option>
        </Select>
      </div> */}


      {/* <div>
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
      </div> */}

      {/* --- flag to apply for entire serialized class or not */}
      {
        // data.event_series != "NoSeries" && (
        //   <div>
        //     <Label>Repeated</Label>
        //     <div className="flex gap-2 mt-2">
        //       <Radiobox
        //         name="repeated"
        //         label="No repeat"
        //         id="norepeat"
        //         defaultChecked={!repeated}
        //         onChange={(e) => handleRepeatedRadio(false)}
        //       />
        //       <Radiobox
        //         name="repeated"
        //         label="Repeated"
        //         id="repeat"
        //         defaultChecked={repeated}
        //         onChange={(e) => handleRepeatedRadio(true)}
        //       />
        //     </div>
        //   </div>
        // )
      }
    </>
  )
}



export default DialogDetailTab;

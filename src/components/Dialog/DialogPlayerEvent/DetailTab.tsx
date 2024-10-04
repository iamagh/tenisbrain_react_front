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
import { _Player } from "dataTypes/Player";
import EventPlayers from "./EventPlayers"
import { _Coach } from "dataTypes/Player";
import {times} from "data/Constants";
const stripePromise: Promise<Stripe | null> = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

export interface DialogDetailTabProps {
  products: any;
  data: any;
  sendGroupPlayers: (players: _Player[]) => void;
}



const GetMemberPlayers= (): _Player[]  => {
  const memberPlayers: _Player[] = useSelector((state: RootState) => state.player.memberPlayers)
  return memberPlayers
}



const DialogDetailTab: FC<DialogDetailTabProps> = ({ products, data, sendGroupPlayers }) =>  {
  
  const [currentMemberPlayers, setCurrentMemberPlayers] = useState<_Player[]>(GetMemberPlayers());
  const coach: _Coach = useSelector((state: RootState) => state.player.playerCoach);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [memberCount, setMemberCount] = useState<number>(0);
  

  const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.currentTarget.value;
    setSelectedProduct(products.find((product: any) => product.id == productId))
  }

  useEffect(() => {

  }, []);

  return (
    <>
      {/* --- group size */}
      <div>
        <Label>Group size - {data.group_size}</Label>
        <Input
          className="mt-1.5"
          value={`${data.players ? memberCount : 0}/${data.group_size}`}
          type="text"
          min="3"
          max="20"
          readOnly
        />
      </div>
      {/* --- event players */}
      <EventPlayers
        maxPlayerCount={data.group_size}
        currentPlayers={[]}
        memberPlayers={currentMemberPlayers}
        onChangeMembers={(players: _Player[]) => {
          // setCurrentMemberPlayers(players);
          console.log("players", players)
          sendGroupPlayers(players);
          setMemberCount(players.length);
        }}
      />
      {/* --- event coach */}
      <div>
        <Label>Event Coach</Label>
        <Input className="mt-1.5" defaultValue={coach?.first_name + ' ' + coach?.last_name} readOnly={true} />
      </div>
      {/* ---- select description */}
      <div>
        <Label>Select Description</Label>
        <Select
          className="mt-1.5"
          value={data.description}
          readOnly={false}
          onChange={handleChangeProduct}
        >
          {products?.map((product: any, index: number) => (
                             <option value={product.id} key={index}>{product.product}</option>
                             ))}
          <option value={data.id} key={data.id}>{data.description}</option>
        </Select>
      </div>

      {/* --- start available times */}
      <div>
        <Label>Start Time</Label>
        <div className="mt-1 flex">
          <Select
            className="mt-1"
            readOnly={false}
            value={data.start_time}
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
          readOnly={false}
          value={data.duration}
        >
          <option value="60 minutes">60 minutes</option>
          <option value="90 minutes">90 minutes</option>
        </Select>
      </div>
    </>
  )
}



export default DialogDetailTab;

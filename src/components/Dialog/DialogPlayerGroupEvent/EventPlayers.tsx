import React, { useEffect, useState } from 'react';
import Checkbox from "shared/Checkbox/Checkbox";
import Label from "components/Label/Label";
import { toast } from "react-toastify";

import { OVER_CHECK_COUNT } from "data/messages"

interface Player {
  id: string;
  first_name: string;
  last_name: string;
}

interface EventPlayersProps {
  maxPlayerCount: number;
  currentPlayers: Player[];
  memberPlayers: Player[];
  onChangeMembers: any;
}


const EventPlayers: React.FC<EventPlayersProps> = ({ maxPlayerCount, currentPlayers, memberPlayers, onChangeMembers }) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const preSelectMembers:string[] = memberPlayers.map((member: any) => {
    const res = currentPlayers.filter((player: any) => player.id == member.id);
    if (res.length > 0) {
      console.log("member in event players", member)
      return member.id
    }
  });


  // const able_count = maxPlayerCount - currentPlayers
  const isChecked = (player: Player) => selectedMembers.includes(player.id);

  const handleSelectMember = (checked: boolean, player: Player) => {

    if (checked) {
      const checkArray:string[] = [...selectedMembers, player.id]
      console.log("length--------", currentPlayers.length  + checkArray.length - preSelectMembers.length)
      console.log("length--------", currentPlayers.length)
      const totalCount = currentPlayers.length  + checkArray.length - (preSelectMembers.filter(e => e != undefined)).length
      if (totalCount > maxPlayerCount) {
        toast.error(OVER_CHECK_COUNT);
        return;
      }
      setSelectedMembers(checkArray);
      onChangeMembers(checkArray);
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== player.id));
      onChangeMembers(selectedMembers.filter(id => id !== player.id));
    }
    // console.log("##########result from Event ccheck", selectedMembers)
  };

  

  useEffect(() => {
    setSelectedMembers(preSelectMembers.filter(e => e != undefined))
  }, [maxPlayerCount])


  return (
    <div>
      <Label>Event Players</Label>
      <div className="h-32 overflow-y-auto">
        {memberPlayers?.map((item, index) => (
          <div key={index} className="py-1">
            <Checkbox
              name={item.id}
              label={`${item.first_name} ${item.last_name}`}
              checked={isChecked(item)}
              onChange={(checked) => handleSelectMember(checked, item)} // Directly using the `checked` value
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPlayers;

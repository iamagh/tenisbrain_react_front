import React, { useState, useEffect } from "react";
import NavigationItem from "./NavigationItem";
import { NAVIGATION_LOGGED, NAVIGATION_LOGGED_AS_PLAYER } from "data/navigation";

function NavigationLogged() {
  const [isCoach, setIsCoach] = useState(false); 
  useEffect(()=>{
    const userRole = localStorage.getItem('user-role');
    if(userRole == 'coach') {
      setIsCoach(true);
    } else {
      setIsCoach(false)
    }
  }, [])
  return (
    <ul className="nc-Navigation flex items-center">
      {isCoach ? NAVIGATION_LOGGED.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      )) :
        NAVIGATION_LOGGED_AS_PLAYER.map((item) => (
          <NavigationItem key={item.id} menuItem={item} />
        ))
      }
    </ul>
  );
}

export default NavigationLogged;

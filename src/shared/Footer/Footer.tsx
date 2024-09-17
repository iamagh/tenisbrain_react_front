import Logo from "shared/Logo/Logo";
import SocialsList1 from "shared/SocialsList1/SocialsList1";
import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { CustomLink } from "data/types";
import React, { useState, useEffect } from "react";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "5",
    title: "Getting started",
    menus: [
      { href: "#", label: "Release Notes" },
      { href: "#", label: "Upgrade Guide" },
      { href: "#", label: "Browser Support" },
      { href: "#", label: "Dark Mode" },
    ],
  },
  {
    id: "1",
    title: "Explore",
    menus: [
      { href: "#", label: "Prototyping" },
      { href: "#", label: "Design systems" },
      { href: "#", label: "Pricing" },
      { href: "#", label: "Security" },
    ],
  },
  {
    id: "2",
    title: "Resources",
    menus: [
      { href: "#", label: "Best practices" },
      { href: "#", label: "Support" },
      { href: "#", label: "Developers" },
      { href: "#", label: "Learn design" },
    ],
  },
  {
    id: "4",
    title: "Community",
    menus: [
      { href: "#", label: "Discussion Forums" },
      { href: "#", label: "Code of Conduct" },
      { href: "#", label: "Contributing" },
      { href: "#", label: "API Reference" },
    ],
  },
];

const Footer: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 400) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="nc-Footer relative py-10 bg-[rgba(0,0,0,0.8)]">
      <div className="container flex flex-col gap-4 mb-5">
        <div className="flex justify-between items-center cursor-pointer  border-b-2 border-neutral-500 pb-2" onClick={toggleCollapse}>
          <h1 className="text-3xl text-white font-semibold">Our Story</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transform transition-transform text-white duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </div>
        <div className={`text-left space-y-2 text-sm text-neutral-200 ${isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-auto transition-height duration-300 opacity-100'}`}>
          <p>Hi guys welcome to my site. I am the <a className="text-blue-400" href="https://www.instagram.com/tennis_brain/">TennisBrain</a> (my superhero name according to my kids), but you can call me Sam. I am a tennis coach and a data practitioner. Tennis became my biggest passion from an early age and I now have over 30 years’ experience in the game. My first national tournament was at the age of 12, and I haven’t stopped competing since, regularly taking part in <a href="https://www.itftennis.com/en/players/samir-thakrar/800680223/gbr/vt/s/">ITF Masters Tour</a> and <a className="text-blue-400" href="https://competitions.lta.org.uk/player-profile/7EA56AAC-E332-4ED0-9CF9-C4013D8DC3C7">LTA</a> Events.</p>
          <p>Aside from tennis, I graduated with a BSc in Statistics and Economics, and have headed up and led <a className="text-blue-400" href="https://www.linkedin.com/in/samir-thakrar-86a9aa12b/">data science and insights teams</a>  at multiple large organisations in London. I have been lucky enough to combine my passion in tennis with my skills in data, and created <a className="text-blue-400" href="https://www.tennisbrain.com/">www.tennisbrain.com</a> in 2018, which provides insights and predictions on professional tour matches. I've stuck to the same name with this platform.</p>
          <p>Despite coaching for over 20 years, only recently I have managed to step away from corporate life and fully commit to sharing my love of the game with the world. As my time on the tennis court increased and my desire to effectively track and monitor my students development www.tennisbrain.coach came to life.</p>
          <p>As a coach I aim to establish the technical building blocks of a tennis stroke whilst allowing a student to develop their own personality and style on the court. With additional emphasis in movement, balance, breathwork, court etiquette and intellect, I'm here to help tennis enthusiasts, both players and coaches achieve their goals, maximising their potential and have a lot of fun while doing it. For me coaching is the best job in the world, and I hope this platform can help other coaches get the most out of their time and students development.</p>
        </div>
      </div>
      <div className="container flex flex-col sm:flex-row justify-between">
        <Logo isWhite="white" />
        <SocialsList1 className="flex items-center gap-4 items-start" />
      </div>
      { showScrollButton && <button
        className="fixed z-[1000] right-5 bottom-5 asf text-white border-2 border-solid-white p-3 rounded-full bg-black shadow"
        onClick={scrollToTop}
      >
        <ChevronDoubleUpIcon className="w-8 h-8" />
      </button> }
    </div>
  );
};

export default Footer;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BACKGROUND_IMGS } from "data/data";
import Label from "components/Label/Label";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { contactUs } from "services/contact";
import { toast } from "react-toastify";
export interface SectionPromo3Props {
  className?: string;
}
const NUM_IMAGES = 22; // Total number of images

const SectionContact: React.FC<SectionPromo3Props> = ({ className = "py-8 lg:py-20 bg-white" }) => {
  const [randomImage, setRandomImage] = useState<string>("");
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);
  const [contactMessage, setContactMessage] = useState({
    fullname: "",
    email: "",
    message: ""
  });

  const generateRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * NUM_IMAGES); // Random index from 0 to 22
    setRandomImage(BACKGROUND_IMGS[randomIndex]);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -200 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };
  const containerVariants1 = {
    hidden: { opacity: 0, x: 200 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };
  const containerVariants2 = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };


  useEffect(() => {
    generateRandomImage();
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect(); // Stop observing after the first intersection
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observer && sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [sectionRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await contactUs(contactMessage);
      if (res) {
        toast.success('Your message has been sent to Admin');
      }
    } catch (err: any) {
      toast.error("Server had an issue right now. Try to send later!")
    }    
  }

  const handleEventChange = (e: any) => {
    console.log('onchange', e.target.name, e.target.value);
    setContactMessage({
      ...contactMessage,
      [e.currentTarget.name] : e.currentTarget.value
    })
  }

  return (
    <div id="contact" className={`nc-SectionPromo3 relative ${className}`} ref={sectionRef}>
      <div className="flex flex-col lg:flex-row ">
        <div
          id="player-image"
          className="mt-0 absolute left-0 bottom-0 top-0 w-2/3 bg-cover bg-no-repeat bg-left-top"
          style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.7) , rgba(255, 255, 255, 1) 100%), url(${randomImage})` }}
        >
        </div>
        <div className="relative container mx-auto mb-10">
          <h1 className="font-semibold text-4xl mb-10 md:text-5xl text-center">
            CONTACT US
          </h1>
          { inView && (<>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <div>
                  <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit} method="post">
                    <label className="block">
                      <Label className="">Full name</Label>

                      <Input
                        placeholder="John Doe"
                        type="text"
                        name="fullname"
                        onChange={handleEventChange}
                        required
                      />
                    </label>
                    <label className="block">
                      <Label className="">Email address</Label>

                      <Input
                        type="email"
                        placeholder="tennis@brain.com"
                        name="email"
                        onChange={handleEventChange}
                        required
                      />
                    </label>
                    <label className="block">
                      <Label className="">Message</Label>

                      <Textarea
                        rows={6}
                        name="message"
                        required
                      />
                    </label>
                    <div>
                      <ButtonPrimary type="submit">Send Message</ButtonPrimary>
                    </div>
                  </form>
                </div>
              </motion.div>
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={containerVariants1}
              >
                <div className="flex flex-col gap-3 sm:mt-3 w-[80%] sm:mx-auto">
                  <blockquote>
                    <p className="">
                      Please do not hesitate to reach out to me, I'm happy to answer any questions you have or discuss your options.
                    </p>
                  </blockquote>

                  <p className="my-5">Email : <a href="mailto:tennisbrain.coach@outlook.com" target="_blank" className="text-blue-500 hover:text-blue-700 underline">tennisbrain.coach@outlook.com</a></p>

                  <p className="">All classes are held at Wembley and Sudbury Tennis and Squash Club, Sylvester Road, Wembley, HA0 3AB.</p>
                  
                  <a className="text-blue-500 hover:text-blue-700 underline" href="https://wstsclub.co.uk/"> https://wstsclub.co.uk/</a>
              </div>
              </motion.div>
            </div>
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={containerVariants2}
            >
            <div className="mt-5 h-[30%]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.7184910924684!2d-0.30829122239742784!3d51.55506080721934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876124a9e7c5fbb%3A0x1da31bc79e76a5eb!2sWembley%20and%20Sudbury%20Tennis%20and%20Squash%20Club!5e0!3m2!1sen!2suk!4v1698880120300!5m2!1sen!2suk"
                width="100%"
                height="100%"
                allowFullScreen={false}
                loading="lazy"
                className="border-none"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            </motion.div>
          </>) }
        </div>
      </div>
    </div>
  );
};

export default SectionContact;

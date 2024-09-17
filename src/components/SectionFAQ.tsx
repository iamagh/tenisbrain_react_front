import React, { FC, useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export interface SectionFaqProps {
  className?: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: 'How do players make payments',
        answer: 'TennisBrain uses a time based credit system for private coaching which allows players to book their coaches time slots on their credit. Group sessions are paid for directly.',
    },
    {
        question: 'Are there any fees to use the platform ',
        answer: 'A small fee is applied to coaches for the use of our payment provider Stripe, with TennisBrain receiving 2% on transactions',
    },
    {
        question: 'Can any type of coach use the platform',
        answer: 'In practice you can use it for any type of coaching program, but will just have to put up with TennisBrain as the name',
    },
    {
        question: 'Can coaches expect new students to come through the platform ',
        answer: 'It is suggested that coaches encourage their existing students to utilise the platform first. As the userbase of the platform grows, a coach may increase their client base',
    },
    {
        question: 'How do players use the platform',
        answer: `1) Sign up as a player
    2) Add details of players relevant to your account
    3) Select your coach
    4) Add funds into the account
    5) Make a booking directly into your coach's calendar`,
    },
    {
        question: 'How do coaches use the platform',
        answer: `1) Sign up as a coach
    2) Add your bank account details to receive payments
    3) Set your availability
    4) Add exercises if you wish to track these for your students
    5) Score your sessions
        `,
    },
    {
        question: 'Will you be adding functionality to improve analytics',
        answer: 'This is a new platform, and the very 1st step is to collect data. As more data is captured, additional reporting will be provided',
    },
];


const SectionFaq: FC<SectionFaqProps> = ({ className = "py-8 lg:py-20 " }) => {
    return (
        <div className={`nc-SectionFaq bg-[rgba(0,0,0,0.8)] relative ${className}`} id="faq">
            <div className="flex flex-col lg:flex-row">
                <div className="relative container mx-auto mb-10">
                    <h1 className="font-semibold text-white text-4xl mb-10 md:text-5xl text-center">
                        FREQUENTLY ASKED QUESTIONS
                    </h1>
                    {faqData.map((item, index) => (
                        <Disclosure key={index}>
                        {({ open }) => (
                        <>
                            <Disclosure.Button className="flex items-center justify-between w-full mx-auto mb-3 px-4 py-2 font-medium text-left bg-white hover:bg-slate-100/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                            <span>{item.question}</span>
                            {!open ? (
                                <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            ) : (
                                <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            )}
                            </Disclosure.Button>
                            <Disclosure.Panel
                            className="p-4 pt-3 last:pb-0 px-0 text-white text-sm text-left dark:text-slate-300 leading-6"
                            as="div"
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                            ></Disclosure.Panel>
                        </>
                        )}
                    </Disclosure>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionFaq;

import React from 'react';
// import type {IconType} from 'react-icons';
// import {FiCreditCard, FiMail, FiUser, FiUsers} from 'react-icons/fi';
import {ShoppingCart} from 'lucide-react';

const HoverDevCards = () => {
  return (
    <div className="px-12 mb-14">
      <p className="text-xl font-semibold mb-2">We Accept</p>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
          title="Cash on delivery"
          subtitle="Pay on delivery"
          href="#"
          Icon={ShoppingCart}
        />
        <Card
          title="Paypal"
          subtitle="Manage email"
          href="#"
          Icon={ShoppingCart}
        />
        <Card
          title="Home Credit"
          subtitle="Manage team"
          href="#"
          Icon={ShoppingCart}
        />
        <Card
          title="Visa/Mastercard"
          subtitle="Manage cards"
          href="#"
          Icon={ShoppingCart}
        />
      </div>
    </div>
  );
};

interface CardType {
  title: string;
  subtitle: string;
  Icon: any;
  href: string;
}

const Card = ({title, subtitle, Icon, href}: CardType) => {
  return (
    <div className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
        {subtitle}
      </p>
    </div>
  );
};

export default HoverDevCards;

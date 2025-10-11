'use client';

import { Switch } from '@shopify-clone/ui';
import { useState } from 'react';
import { PricingCard } from './pricing-card';

export interface PricingItem {
  priceMonthly: number;
  priceAnnualy: number;
  title: string;
  descr: string;
  link: string;
  features: string[];
}

const pricingItems: PricingItem[] = [
  {
    title: 'Indiviadual',
    priceAnnualy: 9.99,
    priceMonthly: 14.99,
    descr: 'Something cool',
    features: ['Look at this'],
    link: '',
  },
  {
    title: 'Team',
    priceAnnualy: 19.99,
    priceMonthly: 24.99,
    descr: 'Something very cool',
    features: ['Everything in individual', 'Some extra stuff'],
    link: '',
  },
  {
    title: 'Entreprise',
    priceAnnualy: 49.99,
    priceMonthly: 54.99,
    descr: 'Something even cooler',
    features: ['Everything in team', 'Other extra stuff'],
    link: '',
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  return (
    <section className="py-24">
      <div className="flex flex-col justify-center items-center gap-8 pb-8">
        <h1 className="text-8xl font-medium">Pricing</h1>
        <p className="text-muted-foreground text">
          Start for free and then do stuff
        </p>
        <div className="flex justify-center items-center gap-2">
          <span>Monthly</span>
          <Switch checked={isAnnual} onClick={() => setIsAnnual(!isAnnual)} />
          <span>Annualy</span>
        </div>
      </div>

      <div className="grid w-full md:w-auto px-4 sm:px-12 md:px-16 lg:px-20 xl:px-28 2xl:px-48 gap-4 grid-cols-1 md:grid-cols-3">
        {pricingItems.map((item, i) => (
          <PricingCard key={i} item={item} isAnnual={isAnnual} />
        ))}
      </div>
    </section>
  );
}

'use client';

import { Button } from '@shopify-clone/ui';
import { BadgeCheck } from 'lucide-react';
import { PricingItem } from './pricing';

interface PricingCardProps {
  item: PricingItem;
  isAnnual: boolean;
}

export function PricingCard(props: PricingCardProps) {
  return (
    <div className="flex w-full sm:w-auto border rounded-sm p-4 sm:p-4 flex-col md:min-h-72">
      <h3 className="text-xl pb-4">{props.item.title}</h3>
      <h5 className="text-2xl font-bold">
        {props.isAnnual ? props.item.priceAnnualy : props.item.priceMonthly} €
      </h5>
      <p className="text-muted-foreground text-sm pb-4">{props.item.descr}</p>
      <div className="flex flex-col gap-2 h-full pb-4">
        {props.item.features.map((feature, i) => (
          <div key={i} className="flex gap-1">
            <BadgeCheck />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <Button variant="default">Get started</Button>
    </div>
  );
}

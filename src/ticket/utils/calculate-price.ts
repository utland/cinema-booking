import { differenceInMinutes } from "date-fns";

export const calculatePrice = (basePrice: number, startTime: Date): number => {
    let discount = 0;

    const toStart = differenceInMinutes(new Date(), startTime);

    if (toStart < 30) discount += 0.2;

    return basePrice * discount;
};

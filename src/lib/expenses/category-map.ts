import type { Expense } from "@/server/db/schema";
import {
  IconCar,
  IconCreditCard,
  IconDeviceGamepad2,
  IconDeviceTv,
  IconGhost,
  IconHeartbeat,
  IconHome,
  IconShield,
  IconShoppingBag,
  IconShoppingCart,
  IconSolarElectricity,
  IconSteeringWheel,
  IconToolsKitchen2,
  type Icon,
} from "@tabler/icons-react";

export const expenseCategoryMap: Record<
  Expense["category"],
  {
    icon: Icon;
    name: string;
    description: string;
  }
> = {
  housing: {
    icon: IconHome,
    name: "Housing",
    description:
      "Fixed housing costs such as rent, mortgage, HOA fees, and housing-related payments.",
  },

  utilities: {
    icon: IconSolarElectricity,
    name: "Utilities",
    description:
      "Household services including electricity, water, gas, internet, and phone bills.",
  },

  groceries: {
    icon: IconShoppingCart,
    name: "Groceries",
    description:
      "Food, household essentials, and everyday purchases from grocery stores.",
  },

  dining: {
    icon: IconToolsKitchen2,
    name: "Dining",
    description:
      "Restaurants, takeout, coffee shops, and meals purchased outside the home.",
  },

  transportation: {
    icon: IconCar,
    name: "Transportation",
    description:
      "Fuel, parking, public transit, tolls, rideshares, and commuting costs.",
  },

  vehicle: {
    icon: IconSteeringWheel,
    name: "Vehicle",
    description:
      "Car payments, maintenance, repairs, registration, and ownership costs.",
  },

  insurance: {
    icon: IconShield,
    name: "Insurance",
    description:
      "Recurring insurance expenses including vehicle, renters, health, and other coverage.",
  },

  debt: {
    icon: IconCreditCard,
    name: "Debt",
    description:
      "Payments toward loans and balances such as student loans and credit cards.",
  },

  subscriptions: {
    icon: IconDeviceTv,
    name: "Subscriptions",
    description:
      "Recurring memberships and services such as streaming, software, and gyms.",
  },

  shopping: {
    icon: IconShoppingBag,
    name: "Shopping",
    description:
      "General purchases including clothing, home goods, gifts, and non-essential spending.",
  },

  healthcare: {
    icon: IconHeartbeat,
    name: "Healthcare",
    description:
      "Medical expenses including appointments, prescriptions, dental, vision, and wellness costs.",
  },

  entertainment: {
    icon: IconDeviceGamepad2,
    name: "Entertainment",
    description:
      "Optional spending for hobbies, movies, games, events, and leisure activities.",
  },

  other: {
    icon: IconGhost,
    name: "Other",
    description: "Expenses that do not fit into another category.",
  },
};

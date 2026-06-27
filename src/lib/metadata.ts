import type { Metadata } from "next";

const BASE_URL = "https://padpal.avery.gg";

export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "PadPal",
  authors: [
    {
      name: "Avery Herring",
      url: "https://www.avery.gg",
    },
  ],
  keywords: [
    "household",
    "roommates",
    "shared living",
    "chores",
    "expenses",
    "bills",
  ],
  openGraph: {
    siteName: "PadPal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@padpal",
  },
};

export const landingMetadata: Metadata = {
  ...baseMetadata,
  title: "PadPal — Your home, sorted.",
  description:
    "Manage your household with ease. Share tasks, split expenses, and keep your roommates in the loop — without the group chat chaos.",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "PadPal — Your home, sorted.",
    description:
      "Manage your household with ease. Share tasks, split expenses, and keep your roommates in the loop.",
    url: BASE_URL,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "PadPal — Your home, sorted.",
    description:
      "Manage your household with ease. Share tasks, split expenses, and keep your roommates in the loop.",
  },
};

export const signInMetadata: Metadata = {
  ...baseMetadata,
  title: "Sign in — PadPal",
  description: "Sign in to your PadPal household.",
  robots: { index: false, follow: false },
};

export const signUpMetadata: Metadata = {
  ...baseMetadata,
  title: "Create your household — PadPal",
  description:
    "Get started with PadPal. Create a household, invite your roommates, and take the chaos out of shared living.",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Create your household — PadPal",
    description:
      "Get started with PadPal. Create a household, invite your roommates, and take the chaos out of shared living.",
    url: `${BASE_URL}/sign-up`,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Create your household — PadPal",
    description:
      "Get started with PadPal. Create a household and invite your roommates.",
  },
};

export const dashboardMetadata: Metadata = {
  ...baseMetadata,
  title: "Dashboard — PadPal",
  description: "Manage your household tasks, expenses, and members.",
  robots: { index: false, follow: false },
};

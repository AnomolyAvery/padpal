import { Button } from "@/components/ui/button";
import { getSession } from "@/server/better-auth/server";
import Link from "next/link";

import {
  IconCheck,
  IconCreditCard,
  IconKey,
  IconUserPlus,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import { landingMetadata } from "@/lib/metadata";

export const metadata: Metadata = landingMetadata;

export default async function Home() {
  const session = await getSession();

  return (
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">PadPal</span>
        <div className="flex items-center gap-3">
          {session ? (
            <Button asChild size="sm" className="rounded-full">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-24 text-center">
        <div
          aria-hidden
          className="text-primary mb-10 select-none"
          style={{ transform: "rotate(-15deg)", display: "inline-block" }}
        >
          <IconKey size={56} stroke={1.5} />
        </div>

        <h1
          className="mb-6 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          Your home, <span className="text-primary">sorted.</span>
        </h1>

        <p className="text-muted-foreground mb-10 max-w-xl text-lg leading-relaxed sm:text-xl">
          PadPal keeps everyone in your household on the same page — shared
          tasks, expenses, and members, without the group chat chaos.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {session ? (
            <Button asChild size="lg" className="rounded-full">
              <Link href="/dashboard">
                Welcome back, {session.user.name.split(" ")[0]} →
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/sign-up">Create your household</Link>
              </Button>
              <Button asChild variant="link" className="text-muted-foreground">
                <Link href="/sign-in">Already have one? Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Feature row */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="bg-border border-border grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
          {[
            {
              label: "Members",
              desc: "Invite roommates and manage who has access — roles, not chaos.",
              icon: <IconUserPlus className="text-primary" stroke={1.8} />,
            },
            {
              label: "Tasks",
              desc: "Assign chores, set due dates, and actually know who did the dishes.",
              icon: <IconCheck className="text-primary" stroke={1.8} />,
            },
            {
              label: "Expenses",
              desc: "Split bills fairly and track who owes what, without the awkward asks.",
              icon: <IconCreditCard className="text-primary" stroke={1.8} />,
            },
          ].map(({ label, desc, icon }) => (
            <div
              key={label}
              className="bg-background flex flex-col gap-4 px-8 py-8"
            >
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-xl">
                {icon}
              </div>
              <div>
                <p className="mb-1 font-semibold">{label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border text-muted-foreground mx-auto flex max-w-5xl items-center justify-between border-t px-6 py-6 text-xs">
        <span>© {new Date().getFullYear()} PadPal</span>
        <span>Made for people who share a roof</span>
      </footer>
    </main>
  );
}

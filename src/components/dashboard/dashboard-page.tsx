import type { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ThemeToggle } from "../elements/theme-toggle";

interface DashboardPageProps {
  title?: string;
  children?: ReactNode;
}

export function DashboardPage({ title, children }: DashboardPageProps) {
  return (
    <Fragment>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:my-auto data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title ?? "Dashboard"}</h1>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="hidden sm:flex"
            >
              <a
                href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                rel="noopener noreferrer"
                target="_blank"
                className="dark:text-foreground"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 md:gap-6 md:py-6">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

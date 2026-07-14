"use client";

import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur">
      <SearchBar />

      <UserMenu />
    </header>
  );
}
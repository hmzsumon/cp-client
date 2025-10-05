/* ── Navbar ─────────────────────────────────────────────────────────────────── */

import Link from "next/link";
import React from "react";
import CapitaliseLogo from "../branding/CapitaliseLogo";
import Button from "./Button";
import Container from "./Container";

const Navbar: React.FC = () => (
  <header className="sticky top-0 z-50 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur">
    <Container className="flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <CapitaliseLogo
          variant="full"
          size={28}
          className="text-white"
          wordmarkClassName="text-white"
        />
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-neutral-300 md:flex">
        <a href="#features" className="hover:text-white">
          Features
        </a>
        <a href="#markets" className="hover:text-white">
          Markets
        </a>
        <a href="#security" className="hover:text-white">
          Security
        </a>
        <a href="#podcast" className="hover:text-white">
          Podcast
        </a>
        <a href="#news" className="hover:text-white">
          Updates
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href={{ pathname: "/register-login", query: { tab: "signin" } }}
          scroll={false}
        >
          <Button
            as="span"
            className="border border-neutral-800 bg-neutral-900 text-neutral-200"
          >
            Log in
          </Button>
        </Link>

        <Link
          href={{ pathname: "/register-login", query: { tab: "create" } }}
          scroll={false}
        >
          <Button
            as="span"
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
          >
            Register
          </Button>
        </Link>
      </div>
    </Container>
  </header>
);

export default Navbar;

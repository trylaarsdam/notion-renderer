import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { Center, Tooltip, UnstyledButton, Stack, rem, Image } from "@mantine/core";
import Link from "next/link";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconSitemap,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./DoubleNavbar.module.css";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", link: "/" },
  { icon: IconSitemap, label: "Courses", link: "/courses" },
  //   { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  //   { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: "Account", link: "/account" },
];

export function DoubleNavbar() {
  const router = useRouter();
  const [active, setActive] = useState(3);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const links = mockdata.map((link, index) => (
    <Link href={link.link} key={link.label}>
      <NavbarLink
        {...link}
        key={link.label}
        active={index === active}
        onClick={() => setActive(index)}
      />
    </Link>
  ));

  useEffect(() => {
    var setItem = false;
    mockdata.forEach((link, index) => {
      if (link.link === window.location.pathname) {
        setActive(index);
        setItem = true;
      }
    });

    if (setItem == false) {
      setActive(-1);
    }
  }, []);

  return (
    <nav className={classes.navbar}>
      <Center>
        <Image alt="logo" src="https://toddr.org/assets/images/t-logo.png"/>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink onClick={handleLogout} icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}

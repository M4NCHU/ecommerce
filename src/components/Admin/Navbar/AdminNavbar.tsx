"use client";

import { useSidebar } from "@/context/SidebarContext";
import { getAuthSession } from "@/lib/auth";
import NavbarStyles from "@/styles/admin/NavBar.module.css";
import IconOnlyButton from "@/styles/buttons/IconOnlyButton.module.css";
import Avatar from "@/styles/images/Avatar.module.css";
import { Button, Input } from "@nextui-org/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FC, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaBars, FaSearch } from "react-icons/fa";

interface NavBarProps {
  session: Session | null;
}

const NavBar: FC<NavBarProps> = ({ session }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);

  return (
    <nav className={NavbarStyles.Navbar}>
      <div className={NavbarStyles.NavLeft}>
        <div>
          <Button
            onClick={() => setIsSidebarOpen()}
            className={
              IconOnlyButton.DefaultIconOnly + " " + NavbarStyles.sidebarBtnOpen
            }
            isIconOnly
          >
            <FaBars />
          </Button>
        </div>
        <div>
          <Button
            onClick={() => setIsSearchBarOpen(true)}
            startContent={<FaSearch />}
            className={NavbarStyles.NavSearchBtn}
          >
            Search...
          </Button>
        </div>
      </div>
      <div className={NavbarStyles.NavRight}>
        <div className={Avatar.AvatarParent}>
          <Image
            src={session?.user.image as string}
            fill
            className={Avatar.AvatarImg}
            alt="Profile img"
          />
        </div>
        {/* <Button onClick={() => signIn("google")}>login</Button> */}
      </div>
      {isSearchBarOpen && (
        <div className={NavbarStyles.SearchBarOpen}>
          <Input
            title="asdfas"
            className={``}
            startContent={<FaSearch />}
            placeholder="Search..."
          />
          <Button
            onClick={() => setIsSearchBarOpen(false)}
            className={IconOnlyButton.DefaultIconOnly}
            isIconOnly
          >
            <AiOutlineClose />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

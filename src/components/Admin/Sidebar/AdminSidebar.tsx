"use client";
import { FC, useEffect } from "react";
import SidebarStyles from "@/styles/admin/Sidebar.module.css";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import {
  AiFillAccountBook,
  AiFillDashboard,
  AiOutlineClose,
} from "react-icons/ai";
import * as Routes from "@/config";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { FaProductHunt, FaShoppingBag } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {}

const AdminSidebar: FC<AdminSidebarProps> = ({}) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();

  const MainSection = [
    {
      href: Routes.ADMIN,
      title: "Dashboard",
      icon: <AiFillDashboard />,
    },
    {
      href: Routes.ADMIN,
      title: "Shop",
      icon: <FaShoppingBag />,
    },
  ];

  const AccordionSection = [
    {
      title: "Products",
      icon: <FaProductHunt />,
      links: [
        {
          href: Routes.ADMIN + "/products/create",
          title: "Add product",
          icon: <AiFillDashboard />,
        },
        {
          href: Routes.ADMIN + "/products/list",
          title: "Products list",
          icon: <AiFillDashboard />,
        },
      ],
    },

    {
      title: "Categories",
      icon: <FaProductHunt />,
      links: [
        {
          href: Routes.ADMIN + "/categories/create",
          title: "Add category",
          icon: <AiFillDashboard />,
        },
        {
          href: Routes.ADMIN + "/categories/list",
          title: "Categories list",
          icon: <AiFillDashboard />,
        },
      ],
    },
  ];

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen();
    }
  }, [pathname]);

  return (
    <>
      <aside
        className={`${SidebarStyles.Sidebar} ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0">
          <div className={SidebarStyles.SidebarLogo}>Logo</div>
          <div className={SidebarStyles.SidebarNav}>
            <div className={SidebarStyles.SidebarSection}>
              <h3 className={SidebarStyles.SidebarSectionHeader}>Home</h3>
              <ul className={SidebarStyles.SidebarList}>
                {MainSection.map((item, i) => (
                  <li key={i} className={SidebarStyles.SidebarListElement}>
                    <Link
                      href={item.href}
                      className={SidebarStyles.SidebarListLink}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={SidebarStyles.SidebarSection}>
              <h3 className={SidebarStyles.SidebarSectionHeader}>E-commerce</h3>
              <ul className={SidebarStyles.SidebarList}>
                {AccordionSection.map((items, i) => (
                  <Accordion key={i}>
                    <AccordionItem
                      className={SidebarStyles.SidebarListAccordion}
                      key={`products`}
                      aria-label="Accordion products"
                      title={items.title}
                      startContent={items.icon}
                    >
                      {items.links.map((item, index) => (
                        <Link key={index} href={item.href}>
                          {item.icon}
                          {item.title}
                        </Link>
                      ))}
                    </AccordionItem>
                  </Accordion>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen()}
            className={SidebarStyles.SidebarBlackBg}
          >
            <Button onClick={() => setIsSidebarOpen()} isIconOnly>
              <AiOutlineClose />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default AdminSidebar;

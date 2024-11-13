import { Activity, FileText, Users, File, FilePlus, Grid, Home, Folder, List, Clipboard, Layers, BarChart2, Calendar, Briefcase, Tag, PieChart, Settings, Archive, Database, Columns, FileSignature, Shield, Ticket, BarChart, Code, Users2Icon, Table, Sliders, ClipboardList, DollarSign, Banknote } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/components/ui/resizable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, CircleUser, Menu, Package2, Search, } from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import Logo from "../../../assets/logo.png"

export const description = "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

const iconMap = {
  "Masters": Table,
  "Management": Briefcase,
  "Task": Clipboard,
  "Activity": Activity,
  "Task Activity Document": FileText,
  "Items": List,
  "Customers": Users,
  "Invoices": FileText,
  "Users": Users,
  "Template Value": File,
  "Template": FilePlus,
  "Documents": FileText,
  "PCS": Layers,
  "PCS Group": Layers,
  "Company Identities": Home,
  "Company": Home,
  "Master Group": Folder,
  "Activity Document": FileText,
  "Dashboard": BarChart2,
  "Client Group": Users,
  "Master Data": Database,
  "Departments": Columns,
  "RecurringTask": Calendar,
  "Tags": Tag,
  "Register of Directors": Users,
  "Company Type": FileText,
  "Register Of Holdings": Archive,
  "MBP-1": FileSignature,
  "MBP-2": FileSignature,
  "MBP-3": FileSignature,
  "MGT-1": FileText,
  "MGT-2": FileText,
  "MGT-3": FileText,
  "CHG-7": FileText,
  "Tickets": Ticket,
  "KPI": PieChart,
  "Clauses": FileText,
  "Committee": Users2Icon,
  "Registers": FileText,
  "AdminPanel": Settings,
  "Company Registers": FileText,
  "Client Group": Users,
  "Register of Directors": Users,
  "Company Type": Shield,
  "RecurringTask": Calendar,
  "Clauses": Code,
  "KPI": BarChart,
  "Company": Banknote,
  "Register Of Holdings": Archive
};

export default function Dashboard() {
  const navigate = useNavigate();
  const screenWidth = useWindowWidth();
  const userData = JSON.parse(sessionStorage.getItem("UserData"))
  const [menuData, setMenuData] = useState(userData.menu);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const showIconsOnly = sidebarWidth < 15;
  const topLevelMenus = menuData && menuData.filter(menu => menu.parentMenuID === null);

  const getChildMenus = (parentId) => {
    return menuData && menuData.filter(menu => menu.parentMenuID === parentId);
  };

  const handleResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full overflow-hidden w-full rounded-lg border md:min-w-[450px]">
      {screenWidth >= 786 && (
        <ResizablePanel defaultSize={18} onResize={handleResize}>
          <div className="h-full md:block overflow-hidden">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
                <Link to="/" className="flex items-center gap-2 font-semibold ml-2">
                  {showIconsOnly ? <Package2 className="h-6 w-6" /> : <span className="flex items-center gap-2 flex-wrap text-neutral-600"><img src={Logo} className='size-6' /><span className="">COSEC</span></span>}
                </Link>
                {showIconsOnly ? <span></span> : <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                  <Bell className="h-4 w-4" /> <span className="sr-only">Toggle notifications</span>
                </Button>
                }
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Accordion type="single" collapsible className="w-full">
                    {topLevelMenus && topLevelMenus.map((menu) => {
                      const children = getChildMenus(menu.menuId);
                      const IconComponent = iconMap[menu.menuIcon] || Users;
                      if (children.length === 0) {
                        return (
                          <li key={menu.menuId} onClick={() => navigate(`/dashboard/${menu.menuLocation}`)} className="block py-4 border-b hover:underline transition-all hover:text-primary">   {showIconsOnly ? "" : menu.menuPage} </li>
                        );
                      }
                      return (
                        <AccordionItem key={menu.menuId} value={`item-${menu.menuId}`} >
                          <AccordionTrigger > <div className="flex justify-between gap-4 px-2"><IconComponent className="h-5 w-5" /> {showIconsOnly ? "" : menu.menuPage}</div></AccordionTrigger>
                          <AccordionContent>
                            <ul>
                              {children.map((child) => {
                                const IconComponent = iconMap[child.menuIcon] || Users;
                                return (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <li key={child.menuId}>
                                          <Button variant="link" className="block flex gap-4 px-4 py-2 text-muted-foreground transition-all hover:text-primary" onClick={() => navigate(`/dashboard/${child.menuLocation}`)}>
                                            <IconComponent className="h-5 w-5" />
                                            {showIconsOnly ? "" : child.menuPage}
                                          </Button>
                                        </li>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{child.menuPage}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                );
                              })}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </nav> */}
                <nav className="space-y-1 font-normal px-4">
                  <Link to="/dashboard/home" className="block px-4 py-2 rounded hover:bg-gray-200">
                    🏠 Dashboard
                  </Link>
                  <Link to="/dashboard/tasks" className="block px-4 py-2 rounded hover:bg-gray-200">
                    📋 Tasks
                  </Link>
                  <Link to="/dashboard/departments" className="block px-4 py-2 rounded hover:bg-gray-200">
                    💼 Departments
                  </Link>
                  <Link to="/dashboard/activity" className="block px-4 py-2 rounded hover:bg-gray-200">
                    ✅ Activity
                  </Link>
                  <Link to="/dashboard/document" className="block px-4 py-2 rounded hover:bg-gray-200">
                    📄 Documents
                  </Link>
                  <Link to="/dashboard/users" className="block px-4 py-2 rounded hover:bg-gray-200">
                    👥 Users
                  </Link>
                </nav>
              </div>
              {!showIconsOnly && (
                <div className="mt-auto p-4">
                  <Card x-chunk="dashboard-02-chunk-0">
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle>Upgrade to Cosec Pro</CardTitle>
                      <CardDescription> Unlock all the latest features and get extra 5 support tickets monthly. </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Button size="sm" className="animate-pulse w-full bg-green-600"> Upgrade Pro now, 50% Off!! </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      )}

      <ResizableHandle  />
      <ResizablePanel defaultSize={75}>
        <div className="flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex w-80 h-14 items-center px-1 lg:h-[60px] lg:px-6">
                  <Link to="/" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span className="">COSEC</span>
                  </Link>

                </div>
                <div className="flex-1">
                  <nav className="space-y-2">
                    <Link to="/dashboard/home" className="block px-4 py-2 rounded hover:bg-gray-200">
                      🏠 Dashboard
                    </Link>
                    <Link to="/dashboard/tasks" className="block px-4 py-2 rounded hover:bg-gray-200">
                      📋 Tasks
                    </Link>
                    <Link to="/dashboard/departments" className="block px-4 py-2 rounded hover:bg-gray-200">
                      💼 Departments
                    </Link>
                    <Link to="/dashboard/activity" className="block px-4 py-2 rounded hover:bg-gray-200">
                      ✅ Activity
                    </Link>
                    <Link to="/dashboard/document" className="block px-4 py-2 rounded hover:bg-gray-200">
                      📄 Documents
                    </Link>
                    <Link to="/dashboard/users" className="block px-4 py-2 rounded hover:bg-gray-200">
                      👥 Users
                    </Link>
                  </nav>
                  {/* <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Accordion type="single" collapsible className="w-full">
                      {topLevelMenus.map((menu) => {
                        const children = getChildMenus(menu.menuId);

                        if (children.length === 0) {
                          return (
                            <Link key={menu.menuId} to={`#${menu.menuId}`} className="block py-4 border-b hover:underline transition-all hover:text-primary" >
                              {menu.menuPage}
                            </Link>
                          );
                        }
                        return (
                          <AccordionItem key={menu.menuId} value={`item-${menu.menuId}`}>
                            <AccordionTrigger>{menu.menuPage}</AccordionTrigger>
                            <AccordionContent>
                              <ul>
                                {children.map((child) => (
                                  <li key={child.menuId}>
                                    <Button variant="link" className="block px-4 py-2 text-muted-foreground transition-all hover:text-primary">
                                      <div>{child.menuPage}</div>
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </nav> */}
                </div>
                <div className="mt-auto">
                <Card x-chunk="dashboard-02-chunk-0">
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle>Upgrade to Cosec Pro</CardTitle>
                      <CardDescription> Unlock all the latest features and get extra 5 support tickets monthly. </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Button size="sm" className="animate-pulse w-full bg-green-600"> Upgrade Pro now, 50% Off!! </Button>
                    </CardContent>
                  </Card>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> <Input type="search" placeholder="Search products..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
                </div>
              </form>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <img alt="Product image" className="aspect-square rounded-full object-cover" height="30" width="30" src="https://github.com/shadcn.png" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="h-[90vh] overflow-y-auto p-4 lg:gap-6 lg:px-6 lg:py-2">
            <Outlet />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

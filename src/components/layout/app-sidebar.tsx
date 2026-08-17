"use client";

import {
  Archive01Icon,
  Book01Icon,
  Building02Icon,
  Chart01Icon,
  Home01Icon,
  Invoice01Icon,
  Logout01Icon,
  Package01Icon,
  TagsIcon,
  TruckIcon,
  WeightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useGetUserProfile, useLogout } from "@/features/auth";
import { warehouses } from "@/lib/mock/data";

const navItems = [
  {
    name: "Nghiệp vụ",
    items: [
      { title: "Tổng quan", url: "/", icon: Home01Icon },
      {
        title: "Kho",
        url: "/warehouses",
        icon: Building02Icon,
        isWarehouse: true,
      },
      { title: "Tồn kho", url: "/inventory", icon: Archive01Icon },
      { title: "Sổ kho", url: "/stock-movements", icon: Book01Icon },
      { title: "Phiếu nhập", url: "/inbound-notes", icon: Invoice01Icon },
      { title: "Báo cáo", url: "/reports", icon: Chart01Icon },
    ],
  },
  {
    name: "Danh mục",
    items: [
      { title: "Vật tư", url: "/materials", icon: Package01Icon },
      { title: "Danh mục vật tư", url: "/material-categories", icon: TagsIcon },
      { title: "Đơn vị tính", url: "/units", icon: WeightIcon },
      { title: "Nhà cung cấp", url: "/suppliers", icon: TruckIcon },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: profile } = useGetUserProfile();
  const logout = useLogout();

  const isWarehouseActive = pathname.startsWith("/warehouses");

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon icon={Building02Icon} strokeWidth={2} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">con-wms</span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  Quản lý vật tư
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);

                  if (item.isWarehouse) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          render={<Link href={item.url} />}
                          isActive={isWarehouseActive}
                        >
                          <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                          <span>{item.title}</span>
                        </SidebarMenuButton>

                        <SidebarMenuSub>
                          {warehouses.map((wh) => (
                            <SidebarMenuSubItem key={wh.id}>
                              <SidebarMenuSubButton
                                render={<Link href={`/warehouses/${wh.id}`} />}
                                isActive={pathname === `/warehouses/${wh.id}`}
                              >
                                {wh.name}
                              </SidebarMenuSubButton>
                              <SidebarMenuAction>
                                {wh.itemCount}
                              </SidebarMenuAction>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                      >
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 rounded-md p-2 text-sm">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {profile?.lastName?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profile?.lastName
                    ? `${profile.lastName} ${profile.firstName}`
                    : "Người dùng"}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {profile?.role ?? "Đang tải..."}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout.mutate(undefined)}>
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

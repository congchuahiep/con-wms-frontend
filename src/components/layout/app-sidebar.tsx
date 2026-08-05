"use client";

import {
  Archive01Icon,
  ArrowDown01Icon,
  Building02Icon,
  Chart01Icon,
  Home01Icon,
  Logout01Icon,
  Package01Icon,
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
  { title: "Tổng quan", url: "/", icon: Home01Icon },
  { title: "Kho", url: "/warehouses", icon: Building02Icon, hasChildren: true },
  { title: "Vật tư", url: "/materials", icon: Package01Icon },
  { title: "Tồn kho", url: "/inventory", icon: Archive01Icon },
  { title: "Báo cáo", url: "/reports", icon: Chart01Icon },
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

      {/* ---- Navigation ---- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);

                if (item.hasChildren) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isWarehouseActive}
                      >
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                        <span>{item.title}</span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          strokeWidth={2}
                          className="ml-auto transition-transform group-data-[active=true]/menu-button:rotate-180"
                        />
                      </SidebarMenuButton>

                      {/* Sub-list: Warehouses */}
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            render={<Link href="/warehouses" />}
                            isActive={pathname === "/warehouses"}
                          >
                            Tất cả kho
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {warehouses.map((wh) => (
                          <SidebarMenuSubItem key={wh.id}>
                            <SidebarMenuSubButton
                              render={<Link href={`/warehouses/${wh.id}`} />}
                              isActive={pathname === `/warehouses/${wh.id}`}
                            >
                              <span className="truncate">{wh.name}</span>
                              <span className="ml-auto text-xs text-sidebar-foreground/50 tabular-nums">
                                {wh.itemCount}
                              </span>
                            </SidebarMenuSubButton>
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
      </SidebarContent>

      <SidebarSeparator />

      {/* ---- User Footer ---- */}
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

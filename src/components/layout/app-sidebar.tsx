"use client";

import {
  Archive01Icon,
  Book01Icon,
  Building02Icon,
  ConstructionIcon,
  HomeIcon,
  Invoice01Icon,
  Logout01Icon,
  Package01Icon,
  TagsIcon,
  TruckIcon,
  WarehouseIcon,
  WeightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useGetUserProfile, useLogout } from "@/features/auth";

const navItems = [
  {
    name: "Trang chủ",
    items: [{ title: "Tổng quan", url: "/", icon: HomeIcon }],
  },
  {
    name: "Nghiệp vụ",
    items: [
      {
        title: "Kho",
        url: "/warehouses",
        icon: WarehouseIcon,
        isWarehouse: true,
      },
      { title: "Tồn kho", url: "/inventory", icon: Archive01Icon },
      { title: "Sổ kho", url: "/stock-movements", icon: Book01Icon },
      { title: "Phiếu chứng từ", url: "/notes", icon: Invoice01Icon },
      { title: "Công trường", url: "/sites", icon: ConstructionIcon },
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
  const router = useRouter();
  const { data: profile } = useGetUserProfile();
  const logout = useLogout();

  const handleLogout = () => {
    router.push("/login");
    logout.mutate();
  };

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
            <SidebarMenuButton onClick={handleLogout}>
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

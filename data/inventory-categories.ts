import { InventoryCategory } from "./types";

export const inventoryCategories: InventoryCategory[] = [
  {
    slug: "nnn",
    name: "NNN Properties",
    route: "/inventory/nnn",
    note: "Triple net lease investment properties",
    heroImage: "/inventory/nnn-1031-exchange.jpg",
  },
  {
    slug: "single-tenant-retail",
    name: "Single Tenant Retail",
    route: "/inventory/single-tenant-retail",
    heroImage: "/inventory/single-tenant-retail-1031-exchange.png",
  },
  {
    slug: "net-lease",
    name: "Net Lease Properties",
    route: "/inventory/net-lease",
    heroImage: "/inventory/net-lease-1031-exchange.jpg",
  },
  {
    slug: "ground-lease",
    name: "Ground Lease Properties",
    route: "/inventory/ground-lease",
    heroImage: "/inventory/ground-lease-1031-exchange.jpg",
  },
  {
    slug: "industrial",
    name: "Industrial Properties",
    route: "/inventory/industrial",
    heroImage: "/inventory/industrial-1031-exchange.jpg",
  },
  {
    slug: "medical",
    name: "Medical Properties",
    route: "/inventory/medical",
    heroImage: "/inventory/medical-office-1031-exchange.jpg",
  },
];


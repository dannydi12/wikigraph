import { create } from "zustand";
import { Property } from "../types/Property";

type DrawerStore = {
  isOpen: boolean;
  selectedProperty: Property | null;
  closeDrawer: () => void;
  selectProperty: (property: Property) => void;
};

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  selectedProperty: null,
  closeDrawer: () => set(() => ({ isOpen: false, selectedProperty: null })),
  selectProperty: (property: Property) =>
    set(() => ({ isOpen: true, selectedProperty: property })),
}));

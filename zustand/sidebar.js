import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useSidebarStore = create(
    immer(
        (set) => ({
            isActive: false,
            toggle: () => set((state) => ({ isActive: !state.isActive })),
            setActive: (bool) => set(() => ({ isActive: bool })),
        })
    )
)

export default useSidebarStore
import { createContext, ReactNode, useContext, useState } from "react"

type MembersContextType = {
    showNewSubForm: boolean;
    opeNewSubForm: () => void;
    closeNewSubForm: () => void;
}
const MembersContext = createContext<MembersContextType | null>(null);

export const MembersProvider = ({ children }: { children: ReactNode }) => {
    const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);
    const opeNewSubForm = () => {
        setShowNewSubForm(true)
    }
    const closeNewSubForm = () => {
        setShowNewSubForm(false)
    }
    return (
        <MembersContext.Provider value={{ showNewSubForm, opeNewSubForm, closeNewSubForm }}>
            {children}
        </MembersContext.Provider>
    )
}

export function useMembersContext() {
    const ctx = useContext(MembersContext);
    if (!ctx) {
        throw new Error('useMemberships must be used within MembershipsProvider');
    }
    return ctx;
}
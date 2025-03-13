import { EmailOtpType } from "@supabase/supabase-js"
import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react"

type OTPContextType = {
  state: { email: string; type: EmailOtpType } | null
  setOTP: (newState: { email: string; type: EmailOtpType }) => void
  clear: () => void
}

const OTPContext = createContext<OTPContextType | null>(null)

export const useOTP = () => {
  const currentOTPContext = useContext(OTPContext)

  if (!currentOTPContext) throw new Error("useOTP has to be used within <OTPProvider>")

  return currentOTPContext
}

export default function OTPProvider({ children }: PropsWithChildren) {
  const [state, setCurrentState] = useState<{ email: string; type: EmailOtpType } | null>(null)

  const clear = useCallback(() => {
    setCurrentState(null)
  }, [])

  const setOTP = useCallback(({ ...rest }: { email: string; type: EmailOtpType }) => {
    setCurrentState({ ...rest })
  }, [])

  return <OTPContext.Provider value={{ state, clear, setOTP }}>{children}</OTPContext.Provider>
}

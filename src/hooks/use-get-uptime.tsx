import { useState, useEffect } from "react"
import { parseISO, differenceInSeconds } from "date-fns"

type UseDeviceUptimeArgs = {
  presence_ref: string
  online_at: string
} | null

const useDeviceUptime = (uptime: UseDeviceUptimeArgs) => {
  const [time, setTime] = useState("00:00:00:00")

  useEffect(() => {
    if (!uptime?.online_at) {
      setTime("Off")
      return
    }

    const updateUptime = () => {
      try {
        const parsedDate = parseISO(uptime.online_at)
        const seconds = differenceInSeconds(new Date(), parsedDate)

        const days = Math.floor(seconds / (24 * 3600))
          .toString()
          .padStart(2, "0")
        const hours = Math.floor((seconds % (24 * 3600)) / 3600)
          .toString()
          .padStart(2, "0")
        const minutes = Math.floor((seconds % 3600) / 60)
          .toString()
          .padStart(2, "0")
        const secs = (seconds % 60).toString().padStart(2, "0")

        setTime(`${days}:${hours}:${minutes}:${secs}`)
      } catch (error) {
        console.error("Invalid date format", error)
        setTime("Invalid date")
      }
    }

    updateUptime()
    const interval = setInterval(updateUptime, 1000)

    return () => clearInterval(interval)
  }, [uptime?.online_at])

  return time
}

export default useDeviceUptime

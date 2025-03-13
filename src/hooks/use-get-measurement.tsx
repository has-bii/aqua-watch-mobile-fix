import { TSupabase } from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

type Args = {
  supabase: TSupabase
  id: string
  subscribed?: boolean
}

const useGetMeasurement = ({ id, supabase, subscribed }: Args) =>
  useQuery({
    queryKey: ["measurement", id],
    subscribed,
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("env_id", id)
        .order("id", { ascending: false })

      if (error) throw new Error("Failed to get current aquarium data!")

      return data
    },
  })

export default useGetMeasurement

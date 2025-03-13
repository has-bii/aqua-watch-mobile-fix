import { TSupabase } from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

type Args = {
  supabase: TSupabase
  subscribed: boolean
  id: string
}

const useGetAquariumByID = ({ id, subscribed, supabase }: Args) =>
  useQuery({
    queryKey: ["aquarium", id],
    subscribed,
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase.from("aquarium").select("*").eq("id", id).single()

      if (error) throw new Error("Failed to get aquarium data")

      return data
    },
  })

export default useGetAquariumByID

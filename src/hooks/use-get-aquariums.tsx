import { TSupabase } from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

type Args = {
  supabase: TSupabase
  subscribed?: boolean
}

const useGetAquarium = ({ subscribed, supabase }: Args) =>
  useQuery({
    queryKey: ["aquarium"],
    subscribed,
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase.from("aquarium").select("*")

      if (error) throw new Error(error.message)

      return data
    },
  })

export default useGetAquarium

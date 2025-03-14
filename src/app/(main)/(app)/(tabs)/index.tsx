import { View, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Pressable } from "react-native"
import { Heading } from "@/components/ui/heading"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Plus } from "lucide-react-native"
import useGetAquarium from "@/hooks/use-get-aquariums"
import { Card } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { format } from "date-fns"
import { Link, useRouter } from "expo-router"
import { supabase } from "@/utils/supabase"
// import { useIsFocused } from "@react-navigation/native"

export default function Tab() {
  // const subscribed = useIsFocused()
  const { data: aquariums, isRefetching, refetch } = useGetAquarium({ supabase })
  const router = useRouter()

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["grey"]} />
        }
      >
        {/* Header */}
        <View className="flex h-fit flex-row items-center justify-between">
          <Heading>My Aquarium</Heading>
          <Button
            size="lg"
            className="rounded-full p-3"
            onPress={() => router.push("/add-aquarium")}
          >
            <ButtonIcon as={Plus} />
          </Button>
        </View>

        <View className="mt-10 flex flex-row">
          {aquariums && aquariums.length > 0 ? (
            aquariums.map((aquarium) => (
              <Link
                key={aquarium.id}
                asChild
                push
                href={{
                  pathname: "/aquarium/[id]",
                  params: { id: aquarium.id },
                }}
              >
                <Pressable className="aspect-video w-1/2 p-2">
                  <View className="flex-1 rounded-xl bg-[#E7FAF9] p-4">
                    <Heading size="md" className="mb-1">
                      {aquarium.name}
                    </Heading>
                    <Text size="sm">{format(aquarium.created_at, "PPP")}</Text>
                  </View>
                </Pressable>
              </Link>
            ))
          ) : (
            <View className="flex flex-1 items-center justify-center">
              <Card size="md" variant="elevated" className="bg-transparent">
                <Heading size="md" className="mb-1 text-center">
                  No Aquariums
                </Heading>
                <Text size="sm">Add new aquariums to start monitoring your fish tanks</Text>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
})

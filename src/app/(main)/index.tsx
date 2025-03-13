import { supabase } from "@/utils/supabase"
import { Button } from "@rneui/themed"
import { Text, View } from "react-native"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button onPress={() => supabase.auth.signOut()}>Sign out</Button>
    </View>
  )
}

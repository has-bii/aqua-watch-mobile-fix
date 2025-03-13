import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/utils/supabase"
import { useRouter } from "expo-router"
import { LogOut } from "lucide-react-native"
import React from "react"
import { View, Text, StyleSheet, Alert } from "react-native"

export default function Tab() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const logout = React.useCallback(async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)

    if (error) {
      Alert.alert(error.message)
      return
    }

    router.reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
      <Button onPress={logout} disabled={loading}>
        <ButtonText>Sign out</ButtonText>
        <ButtonIcon as={loading ? Spinner : LogOut} />
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    paddingHorizontal: 20,
  },
})

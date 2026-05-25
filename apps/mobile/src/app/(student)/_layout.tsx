import { Tabs } from 'expo-router'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Home01Icon, Search01Icon, BookmarkIcon, Message01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { Colors } from '@/constants/colors'

export default function StudentTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={Home01Icon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={Search01Icon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={BookmarkIcon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={Message01Icon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={UserIcon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen name="listing/[id]" options={{ href: null }} />
      <Tabs.Screen name="chats/[conversationId]" options={{ href: null }} />
      <Tabs.Screen name="profile/bookings" options={{ href: null }} />
      <Tabs.Screen name="profile/review/[bookingId]" options={{ href: null }} />
    </Tabs>
  )
}

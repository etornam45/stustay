import { Tabs } from 'expo-router'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { DashboardSquare01Icon, Building01Icon, Calendar01Icon, Message01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { Colors } from '@/constants/colors'

export default function HomeownerTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={DashboardSquare01Icon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Listings',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={Building01Icon} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <HugeiconsIcon icon={Calendar01Icon} size={24} color={color} />,
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
      <Tabs.Screen name="listings/new" options={{ href: null }} />
      <Tabs.Screen name="listings/[id]/edit" options={{ href: null }} />
      <Tabs.Screen name="chats/[conversationId]" options={{ href: null }} />
    </Tabs>
  )
}

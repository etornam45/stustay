import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'

interface Tab {
  key: string
  label: string
}

interface TabSwitcherProps {
  tabs: Tab[]
  activeKey: string
  onChange: (key: string) => void
}

export function TabSwitcher({ tabs, activeKey, onChange }: TabSwitcherProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.tab, activeKey === tab.key && styles.tabActive]}
          onPress={() => onChange(tab.key)}
        >
          <Text style={[styles.tabText, activeKey === tab.key && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.border,
    borderRadius: 10,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.surface },
  tabText: { fontSize: FontSize.body, fontWeight: '500', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '600' },
})

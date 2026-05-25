import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import type { UserPublic } from '@stustay/shared'

export interface SavedAccount {
  userId: string
  token: string
  user: UserPublic
}

const ACCOUNTS_KEY = 'saved_accounts'

interface AuthState {
  token: string | null
  user: UserPublic | null
  savedAccounts: SavedAccount[]
  isLoading: boolean
  setAuth: (token: string, user: UserPublic) => Promise<void>
  switchAccount: (userId: string) => Promise<boolean>
  removeAccount: (userId: string) => Promise<void>
  logout: () => Promise<void>
  loadStoredAuth: () => Promise<void>
  setUser: (user: UserPublic) => Promise<void>
}

async function readSavedAccounts(): Promise<SavedAccount[]> {
  const raw = await SecureStore.getItemAsync(ACCOUNTS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as SavedAccount[]
  } catch {
    return []
  }
}

async function writeSavedAccounts(accounts: SavedAccount[]) {
  await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts))
}

async function persistActiveSession(token: string, user: UserPublic) {
  await SecureStore.setItemAsync('auth_token', token)
  await SecureStore.setItemAsync('auth_user', JSON.stringify(user))
}

async function clearActiveSession() {
  await SecureStore.deleteItemAsync('auth_token')
  await SecureStore.deleteItemAsync('auth_user')
}

function upsertAccount(accounts: SavedAccount[], token: string, user: UserPublic): SavedAccount[] {
  const entry: SavedAccount = { userId: user.id, token, user }
  const idx = accounts.findIndex((a) => a.userId === user.id)
  if (idx >= 0) {
    const next = [...accounts]
    next[idx] = entry
    return next
  }
  return [...accounts, entry]
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  savedAccounts: [],
  isLoading: true,

  setAuth: async (token: string, user: UserPublic) => {
    const accounts = upsertAccount(await readSavedAccounts(), token, user)
    await writeSavedAccounts(accounts)
    await persistActiveSession(token, user)
    set({ token, user, savedAccounts: accounts, isLoading: false })
  },

  switchAccount: async (userId: string) => {
    const accounts = get().savedAccounts.length ? get().savedAccounts : await readSavedAccounts()
    const account = accounts.find((a) => a.userId === userId)
    if (!account) return false

    await persistActiveSession(account.token, account.user)
    set({ token: account.token, user: account.user, savedAccounts: accounts })
    return true
  },

  removeAccount: async (userId: string) => {
    const accounts = (await readSavedAccounts()).filter((a) => a.userId !== userId)
    await writeSavedAccounts(accounts)

    const { user } = get()
    if (user?.id === userId) {
      await clearActiveSession()
      const next = accounts[0]
      if (next) {
        await persistActiveSession(next.token, next.user)
        set({ token: next.token, user: next.user, savedAccounts: accounts })
      } else {
        set({ token: null, user: null, savedAccounts: [] })
      }
      return
    }

    set({ savedAccounts: accounts })
  },

  logout: async () => {
    const { user } = get()
    if (user) {
      await get().removeAccount(user.id)
      return
    }
    await clearActiveSession()
    set({ token: null, user: null, savedAccounts: await readSavedAccounts() })
  },

  loadStoredAuth: async () => {
    try {
      let accounts = await readSavedAccounts()
      const token = await SecureStore.getItemAsync('auth_token')
      const userJson = await SecureStore.getItemAsync('auth_user')

      if (token && userJson) {
        const user = JSON.parse(userJson) as UserPublic
        accounts = upsertAccount(accounts, token, user)
        await writeSavedAccounts(accounts)
        set({ token, user, savedAccounts: accounts, isLoading: false })
      } else if (accounts.length > 0) {
        const first = accounts[0]
        await persistActiveSession(first.token, first.user)
        set({ token: first.token, user: first.user, savedAccounts: accounts, isLoading: false })
      } else {
        set({ token: null, user: null, savedAccounts: accounts, isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },

  setUser: async (user: UserPublic) => {
    const { token, savedAccounts } = get()
    if (token) {
      const accounts = upsertAccount(savedAccounts, token, user)
      await writeSavedAccounts(accounts)
      await persistActiveSession(token, user)
      set({ user, savedAccounts: accounts })
      return
    }
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user))
    set({ user })
  },
}))

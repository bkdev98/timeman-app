import create from 'zustand'
import { persist } from "zustand/middleware"
import axios from "axios"
import { toast } from "react-hot-toast"

// const API_URL = 'http://localhost:6152'
const API_URL = 'http://timeman.quocs.com'

export const useStore = create(persist((set, get) => ({
  webhook: null,
  currentUser: null,
  userStatus: null,
  getStatus: async () => {
    const webhook = get().webhook;
    if (!webhook) {
      toast.error('Invalid webhook!');
    } else {
      try {
        const response = await axios.post(`${API_URL}/api/status`, {webhook})
        if (response.status === 200) {
          console.log(response.data)
          set({ userStatus: response.data.result })
        } else {
          toast.error(response.data)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  },
  startSchedule: async (webhook) => {
    console.log(webhook)
    try {
      const response = await axios.post(`${API_URL}/api/schedule`, {webhook})
      if (response.status === 200) {
        console.log(response.data)
        set({ webhook, currentUser: response.data.result })
        toast.success('Start schedule successfully!')
      } else {
        toast.error(response.data)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  },
  stopSchedule: async () => {
    try {
      const response = await axios.post(`${API_URL}/api/cancel`, {webhook: get().webhook})
      if (response.status === 200) {
        console.log(response.data)
        set({ currentUser: null })
        toast.success('Stop schedule successfully!')
      } else {
        toast.error(response.data)
      }
    } catch (error) {
      toast.error(error.message)
    }
  },
  resetWebhook: () => set({ webhook: null, currentUser: null, userStatus: null }),
}), {
  name: 'timeman'
}))

import create from 'zustand'
import { persist } from "zustand/middleware"
import axios from "axios"
import { toast } from "react-hot-toast"

export const useStore = create(persist((set, get) => ({
  webhook: null,
  currentUser: null,
  userStatus: null,
  getStatus: async () => {
    const webhook = get().webhook;
    if (!webhook) {
      toast.error('Invalid webhook!');
    } else {
      const response = await axios.post('http://timeman.quocs.com/api/status', {webhook})
      if (response.status === 200) {
        console.log(response.data)
        set({ userStatus: response.data.result })
      } else {
        toast.error(response.data)
      }
    }
  },
  startSchedule: async (webhook) => {
    console.log(webhook)
    const response = await axios.post('http://timeman.quocs.com/api/schedule', {webhook})
    if (response.status === 200) {
      console.log(response.data)
      set({ webhook, currentUser: response.data.result })
    } else {
      toast.error(response.data)
    }
  },
  stopSchedule: async () => {
    const response = await axios.post('http://timeman.quocs.com/api/cancel', {webhook: get().webhook})
    if (response.status === 200) {
      console.log(response.data)
      set({ currentUser: null })
    } else {
      toast.error(response.data)
    }
  },
  resetWebhook: () => set({ webhook: null, currentUser: null, userStatus: null }),
}), {
  name: 'timeman'
}))

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Text, Div, Input, Icon, Button, Image, Tag } from "atomize"

import './App.css'
import {useStore} from './store'

const STATUS_COLOR_MAP = {
  PAUSED: 'warning',
  OPENED: 'info',
  CLOSED: 'danger',
  EXPIRED: 'gray',
}

function App() {
  const [inputValue, setInputValue] = useState('')
  const {webhook, currentUser, startSchedule, stopSchedule, resetWebhook, getStatus, userStatus} = useStore()

  useEffect(() => {
    let intervalId;
    if (currentUser) {
      intervalId = setInterval(() => getStatus(), 30000)
    }

    return () => intervalId &&  clearInterval(intervalId)
  }, [currentUser, getStatus])

  function handleStartSchedule(w) {
    if (!w && (!inputValue || inputValue.length < 10)) {
      toast.error('Invalid webhook, please try again!')
    } else {
      startSchedule(w || inputValue)
      setInputValue('')
    }
  }

  function handleStopSchedule() {
    stopSchedule();
  }

  function handleResetWebhook() {
    resetWebhook();
  }

  return (
    <Div d="flex" align="center" flexDir="column" p="2rem" className="App">
      <Text textSize="heading">Timeman for Bitrix24 🕰</Text>
      <Text textSize="subheader">Never miss an attendance again!</Text>
      {!webhook ? (
        <>
          <Div
            m="2rem"
            p="1rem"
            rounded="lg"
            shadow="3"
          >
            <Text>1. Generate a webhook: Go to Bitrix / Applications / Webhooks / Add Inbound Webhook / Select <code>Users (user)</code> and <code>Working Time Management (timeman)</code>.</Text>
            <Text>2. Copy webhook URL, it should looks like this: <code>https://BITRIX_URL/rest/1/WEBHOOK_TOKEN</code> and paste to input below.</Text>
          </Div>
          <Input
            placeholder="Your Bitrix Webhook"
            minW="16rem"
            autoFocus
            m="1rem"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            suffix={
              <Button
                pos="absolute"
                onClick={() => handleStartSchedule()}
                bg="info700"
                hoverBg="info800"
                w="3rem"
                top="0"
                right="0"
                rounded={{ r: "md" }}
              >
                <Icon
                  name="Checked"
                  size="20px"
                  color="white"
                  cursor="pointer"
                />
              </Button>
            }
          />
        </>
      ) : !currentUser ? (
        <>
          <Div
            m="2rem"
            p="1rem"
            rounded="lg"
            shadow="3"
          >
            <Text>Your current webhook: <code>{webhook}</code>.</Text>
          </Div>
          <Div d="flex" p="2rem">
            <Button
              onClick={handleResetWebhook}
              bg="danger700"
              hoverBg="danger800"
              rounded={{ l: "md" }}
              prefix={
                <Icon
                  name="Delete"
                  size="20px"
                  color="white"
                  cursor="pointer"
                  m={{ r: "1rem" }}
                />
              }
            >
              Reset webhook
            </Button>
            <Button
              onClick={() => handleStartSchedule(webhook)}
              bg="info700"
              hoverBg="info800"
              rounded={{ r: "md" }}
              prefix={
                <Icon
                  name="Play"
                  size="20px"
                  color="white"
                  cursor="pointer"
                  m={{ r: "1rem" }}
                />
              }
            >
              Continue schedule
            </Button>
          </Div>
        </>
      ) : (
        <>
          <Div
            m="2rem"
            p="1rem"
            rounded="lg"
            shadow="3"
            d="flex"
          >
            <Image src={currentUser.PERSONAL_PHOTO} w="5rem" h="5rem" rounded="lg" />
            <Div m={{ l: "1rem" }}>
              <Text>Schedule set for <b>{currentUser.EMAIL}</b></Text>
              {userStatus && (
                <Div d="flex">
                  <Text>Current status:</Text>
                  <Tag
                    bg={`${STATUS_COLOR_MAP[userStatus.STATUS]}100`}
                    border="1px solid"
                    borderColor={`${STATUS_COLOR_MAP[userStatus.STATUS]}500`}
                    textColor={`${STATUS_COLOR_MAP[userStatus.STATUS]}800`}
                    m={{ l: "1rem" }}
                  >
                    {userStatus.STATUS}
                  </Tag>
                </Div>
              )}
            </Div>
          </Div>
          <Button
            onClick={handleStopSchedule}
            bg="danger700"
            hoverBg="danger600"
            prefix={
              <Icon
                name="Pause"
                size="20px"
                color="white"
                cursor="pointer"
                m={{ r: "1rem" }}
              />
            }
          >
            Stop schedule
          </Button>
        </>
      )}
    </Div>
  )
}

export default App

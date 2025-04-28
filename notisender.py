import requests
import json
from datetime import datetime
import pytz

baseURL = 'https://uevent.app/EventHubTest/rest'
usersURL = baseURL + '/users'
eventsURL = baseURL + '/events'

def getEvent(eventId):
    print('Getting Event with id ' + eventId)
    response = requests.get(eventsURL + '/get/' + eventId)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

def getPushTokens():
    response = requests.get(usersURL + '/getPushToken/all')
    if response.status_code == 200:
      print('Confirm send to all users? (' + str(len(response.json())) + ' devices) (Y/N)')
      confirm = input()
      if confirm == 'Y' or confirm == 'y':
        return response.json()
      else:
        return []
    else:
      print('pushToken request error')
      return []
    
    #return [{'userId':5, 'pushToken':'ExponentPushToken[y4tqnCExADJYMmR_vcH5RI]'}, 
            #{'userId':5, 'pushToken':'ExponentPushToken[28DZa9PZFiMgh9H5ulMXtv]'},
            #{'userId':5, 'pushToken':'ExponentPushToken[YHji26KT6-9Cjp8YxvfFbu]'},
            #{'userId':5, 'pushToken':'ExponentPushToken[nQdtRBOEbFh9zLPYJwn5Gf]'}]
            
def record(eventjson):
  file = open('sentIds.txt', 'a')
  file.write(' ' + str(eventjson['id']))

  file2 = open('sentEvents.txt', 'a')
  file2.write('\n\n' + str(datetime.now().astimezone(pytz.timezone('US/Eastern'))))
  file2.write('\n' + str(eventjson))
  
def handleErrors(pushResponse, pushTokens, eventjson):
    if 'data' in pushResponse:
        for i in range(len(pushResponse['data'])):
            response = pushResponse['data'][i]
            if response['status'] == 'error':
                if response['details']['error'] == 'DeviceNotRegistered':
                    print('deleting bad token')
                    requests.delete(usersURL + '/deletePushToken', headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}, data = json.dumps({'pushToken': pushTokens[i]['pushToken']}))
    record(eventjson)
    
def sendNotis(pushTokens, eventjson, mode):
    if(len(pushTokens) == 0):
      print('Cancelled or no pushTokens to send to')
      return
    
    pushArr = []
    for tokendict in pushTokens:
        if not tokendict['pushToken'] == 'N/A' and tokendict['enabled']:
            if mode == 'Trending':
                pushArr.append(
                    {
                        'to': tokendict['pushToken'],
                        'sound': 'default',
                        'title': 'Trending Event',
                        'body': eventjson['name'] + ' is trending! Tap to learn more about this event.',
                        'data': {
                            'eventId': eventjson['id'],
                            'type': 'Invitation',
                        }
                    }
                )
            elif mode == 'Revamp':
                pushArr.append(
                    {
                        'to': tokendict['pushToken'],
                        'sound': 'default',
                        'title': 'Events Are Back!',
                        'body': 'Hey Wolverines, on-campus events are back! Check UEvent to discover and share the latest events, including frat/sorority rush, extracurriculars, career opportunities, and more.'
                    }
                )
    reqheaders = {
        'host': 'exp.host',
        'accept': 'application/json',
        'accept-encoding': 'gzip, deflate',
        'content-type': 'application/json'
    }
    for x in range(int(len(pushArr)/99)+1):
      postResponse = requests.post('https://exp.host/--/api/v2/push/send', headers = reqheaders, data = json.dumps(pushArr[x*99:min(x*99+99, len(pushArr))]))

      if postResponse.status_code == 200:
          print('Push notifications sent successfully, batch #' + str(x))
      else:
          print('something went wrong when sending push notifications, batch #' + str(x))
          print(postResponse.json()['errors'])

      handleErrors(postResponse.json(), pushTokens[x*99:min(x*99+99, len(pushTokens))], eventjson)

def main():
    print('Enter the event id or the share link:', end = ' ')
    eventId = input()

    if 'https://' in eventId and ('uevent.app' in eventId or 'eventhubum.com' in eventId) and 'eventId=' in eventId:
        eventId = str(int(eventId[eventId.rindex('eventId=') + 8:]) + 10351)
    
    eventjson = getEvent(eventId)
    
    f = open('sentIds.txt', 'r')
    sentIds = f.read().split(' ')

    if (not eventjson is None) and (not eventjson['disabled']) and (not eventjson['privateEvent']) and datetime.now() < datetime.strptime(eventjson['endTime'].strip(), '%Y-%m-%d %H:%M:%S'):
        print()
        for key in eventjson:
            print(key + ': ' + str(eventjson[key]))
        print()
        print('Confirm this is the right event (Y/N):', end = ' ')
        confirm = input()
        
        confirm3 = 'Y'
        if datetime.now() > datetime.strptime(eventjson['startTime'].strip(), '%Y-%m-%d %H:%M:%S'):
            print('This event has already started. Do you still want to send out a notification? (Y/N)')
            confirm3 = input()

        if (confirm == 'Y' or confirm == 'y') and (confirm3 == 'Y' or confirm3 == 'y'):
            if str(eventjson['id']) in sentIds:
                print()
                print('A notification was already sent about this event. Are you sure you want to send another? (Y/N)')
                confirm2 = input()
                if confirm2 == 'Y' or confirm2 == 'y':
                    print()
                    tokenArray = getPushTokens()
                    sendNotis(tokenArray, eventjson, 'Trending')
                    #sendNotis(tokenArray, eventjson, 'Revamp')
            else:
                print()
                tokenArray = getPushTokens()
                sendNotis(tokenArray, eventjson, 'Trending')
                #sendNotis(tokenArray, eventjson, 'Revamp')
    else:
        print('Event Request Failed, or the event is private, past, or cancelled')

if __name__ == '__main__':
    main()

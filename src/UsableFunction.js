function getFilesByName(fileName, folderId) {
  const folder = getFolderPathInDrive(folderId);
  const files = folder.getFilesByName(fileName);
  return files;
}

function getFolderPathInDrive(folderId) {
  // const driverFolderId = PropertiesService.getScriptProperties().getProperty(folderId);
  const path = DriveApp.getFolderById(folderId);

  return path;
}

function getYear(date) {
  return date.getFullYear();
}

function getMonth(date) {
  return date.getMonth();
}

function getDay(date) {
  return date.getDate();
}

function setDateLastMeeting(previousMeeting) {
  const lastMeeting = previousMeeting.setDate(previousMeeting.getDate() - 7);
  return lastMeeting;
}

function instantiateDate(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date;
}

function slackPayload(fileName, fileURL, mention) {
  let payload = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": mention + " " + fileName + " meeting minutes created"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Meeting Document Link: " + fileURL
        }
      }
    ]
  };

  return payload;
}

function sendAlertToSlack(payload, webhookURL) {
  const webhook = webhookURL;
  var options = {
    "method": "post", 
    "contentType": "application/json", 
    "muteHttpExceptions": true, 
    "payload": JSON.stringify(payload) 
  };
  
  try {
    UrlFetchApp.fetch(webhook, options);
  } catch(e) {
    Logger.log(e);
  }
}
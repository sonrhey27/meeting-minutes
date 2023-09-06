function leadersSubLeadersMeetingDriveFolderId() {
  const folderId = PropertiesService.getScriptProperties().getProperty("LSM_DRIVE_FOLDER_ID");
  return folderId;
}

function leadersSubLeadersMeetingWebHookURL() {
  const webhookURL = PropertiesService.getScriptProperties().getProperty("LSM_WEBHOOK_URL");
  return webhookURL;
}

function leadersSubLeadersWeeklyMeeting() {
  const folderId = leadersSubLeadersMeetingDriveFolderId();
  const webhookURL = leadersSubLeadersMeetingWebHookURL();

  let currentDate = instantiateDate();
  let previousMeeting = instantiateDate(currentDate);
  setDateLastMeeting(previousMeeting);
  const oldFileName = fileNameLSM(previousMeeting);
  const newFileName = fileNameLSM(currentDate);
  const files = getFilesByName(oldFileName, folderId);

  if (files.hasNext()) {
    const file = files.next();
    const destination = getFolderPathInDrive(folderId);
    const copiedFile = file.makeCopy(newFileName, destination);
    const fileURL = copiedFile.getUrl();
    const payload = slackPayload(newFileName, fileURL, '@lead-and-sub');
    sendAlertToSlack(payload, webhookURL);
  }
}

function fileNameLSM(date) {
  const oldDate = formatAndManipulateDateLSM(date);
  const fileName = oldDate+'_Leaders/Subleaders-MTG';

  return fileName;
}

function formatAndManipulateDateLSM(date) {
  const year = getYear(date);
  let month = getMonth(date) + 1;
  let day = getDay(date);

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  const formattedDateString = year + '-' + month + '-' + day;

  return formattedDateString;
}

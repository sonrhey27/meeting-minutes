function trainingMeetingDriveFolderId() {
  const folderId = PropertiesService.getScriptProperties().getProperty("TM_DRIVE_FOLDER_ID");
  return folderId;
}

function trainingMeetingWebHookURL() {
  const webhookURL = PropertiesService.getScriptProperties().getProperty("TM_WEBHOOK_URL");
  return webhookURL;
}

function trainingTeamWeeklyMeeting() {
  const folderId = trainingMeetingDriveFolderId();
  const webhookURL = trainingMeetingWebHookURL();

  let currentDate = instantiateDate();
  let previousMeeting = instantiateDate(currentDate);
  setDateLastMeeting(previousMeeting);
  const oldFileName = fileNameTM(previousMeeting);
  const newFileName = fileNameTM(currentDate);
  const files = getFilesByName(oldFileName, folderId);

  if (files.hasNext()) {
    const file = files.next();
    const destination = getFolderPathInDrive(folderId);
    const copiedFile = file.makeCopy(newFileName, destination);
    const fileURL = copiedFile.getUrl();
    const payload = slackPayload(newFileName, fileURL, '@trainers');
    sendAlertToSlack(payload, webhookURL);
  }
}

function fileNameTM(date) {
  const oldDate = formatAndManipulateDateTM(date);
  const fileName = oldDate+' | Regular MTG w/ Training team';

  return fileName;
}

function formatAndManipulateDateTM(date) {
  const month = monthNames()[getMonth(date)];
  const day = getDay(date);
  const year = getYear(date);

  const formattedDate = month + ' ' + day + ', ' +year;

  return formattedDate;
}

function monthNames() {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return monthNames;
}

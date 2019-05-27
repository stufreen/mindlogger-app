import { getApplets, registerOpenApplet } from '../../services/network';
import { scheduleNotifications } from '../../services/pushNotifications';
import { downloadResponses } from '../responses/responses.thunks';
import { activitiesSelector } from './applets.selectors';
import { authSelector, userInfoSelector, loggedInSelector } from '../user/user.selectors';
import {
  setNotifications,
  setDownloadingApplets,
  replaceApplets,
} from './applets.actions';
import { transformApplet } from '../../models/json-ld';

export const scheduleAndSetNotifications = () => (dispatch, getState) => {
  const state = getState();
  const activities = activitiesSelector(state);
  // This call schedules the notifications and returns a list of scheduled notifications
  const updatedNotifications = scheduleNotifications(activities);
  dispatch(setNotifications(updatedNotifications));
};

export const downloadApplets = () => (dispatch, getState) => {
  const state = getState();
  const auth = authSelector(state);
  const userInfo = userInfoSelector(state);
  dispatch(setDownloadingApplets(true));
  getApplets(auth.token, userInfo._id).then((applets) => {
    console.log(applets);
    if (loggedInSelector(getState())) { // Check that we are still logged in when fetch finishes
      const transformedApplets = applets.map(applet => transformApplet(applet));
      dispatch(replaceApplets(transformedApplets));
      dispatch(downloadResponses(transformedApplets));
    }
  }).finally(() => {
    dispatch(setDownloadingApplets(false));
  });
};

export const joinOpenApplet = appletURI => (dispatch, getState) => {
  dispatch(setDownloadingApplets(true));
  const state = getState();
  const auth = authSelector(state);
  registerOpenApplet(
    auth.token,
    appletURI,
  )
    .then(() => {
      downloadApplets()(dispatch, getState);
    })
    .catch((e) => {
      console.warn(e);
    })
    .finally(() => {
      dispatch(setDownloadingApplets(false));
    });
};

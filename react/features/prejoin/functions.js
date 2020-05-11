// @flow


/**
 * Mutes or unmutes a track.
 *
 * @param {Object} track - The track to be configured.
 * @param {boolean} shouldMute - If it should mute or not.
 * @returns {Promise<void>}
 */
function applyMuteOptionsToTrack(track, shouldMute) {
    if (track.isMuted() === shouldMute) {
        return;
    }

    if (shouldMute) {
        return track.mute();
    }

    return track.unmute();
}

/**
 * Selector for the visibility of the 'join by phone' buttons.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function areJoinByPhoneButtonsVisible(state: Object): boolean {
    return state['features/prejoin'].buttonsVisible;
}

/**
 * Selector for determining if the device status strip is visible or not.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isDeviceStatusVisible(state: Object): boolean {
    return !((isAudioDisabled(state) && isPrejoinVideoDisabled(state))
        || (isPrejoinAudioMuted(state) && isPrejoinVideoMuted(state)));
}

/**
 * Selector for getting the active video/content sharing track.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function getActiveVideoTrack(state: Object): Object {
    const track = getVideoTrack(state) || getContentSharingTrack(state);

    if (track && track.isActive()) {
        return track;
    }

    return null;
}

/**
 * Returns a list with all the prejoin tracks configured according to
 * user's preferences.
 *
 * @param {Object} state - The state of the app.
 * @returns {Promise<Object[]>}
 */
export async function getAllPrejoinConfiguredTracks(state: Object): Promise<Object[]> {
    const tracks = [];
    const audioTrack = getAudioTrack(state);
    const videoTrack = getVideoTrack(state);
    const csTrack = getContentSharingTrack(state);

    if (csTrack) {
        tracks.push(csTrack);
    } else if (videoTrack) {
        await applyMuteOptionsToTrack(videoTrack, isPrejoinVideoMuted(state));
        tracks.push(videoTrack);
    }

    if (audioTrack) {
        await applyMuteOptionsToTrack(audioTrack, isPrejoinAudioMuted(state));
        isPrejoinAudioMuted(state) && audioTrack.mute();
        tracks.push(audioTrack);
    }

    return tracks;
}

/**
 * Selector for getting the prejoin audio track.
 *
 * @param {Object} state - The state of the app.
 * @returns {Object}
 */
export function getAudioTrack(state: Object): Object {
    return state['features/prejoin'].audioTrack;
}

/**
 * Selector for getting the prejoin content sharing track.
 *
 * @param {Object} state - The state of the app.
 * @returns {Object}
 */
export function getContentSharingTrack(state: Object): Object {
    return state['features/prejoin'].contentSharingTrack;
}

/**
 * Returns the text for the prejoin status bar.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
export function getDeviceStatusText(state: Object): string {
    return state['features/prejoin'].deviceStatusText;
}

/**
 * Returns the type of the prejoin status bar: 'ok'|'warning'.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
export function getDeviceStatusType(state: Object): string {
    return state['features/prejoin'].deviceStatusType;
}

/**
 * Selector for getting the prejoin video track.
 *
 * @param {Object} state - The state of the app.
 * @returns {Object}
 */
export function getVideoTrack(state: Object): Object {
    return state['features/prejoin'].videoTrack;
}

/**
 * Selector for getting the mute status of the prejoin audio.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isPrejoinAudioMuted(state: Object): boolean {
    return state['features/prejoin'].audioMuted;
}

/**
 * Selector for getting the name that the user filled while configuring.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function getPrejoinName(state: Object): string {
    return state['features/prejoin'].name;
}

/**
 * Selector for getting the mute status of the prejoin video.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isPrejoinVideoMuted(state: Object): boolean {
    return state['features/prejoin'].videoMuted;
}

/**
 * Selector for getting the error if any while creating streams.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
export function getRawError(state: Object): string {
    return state['features/prejoin'].rawError;
}

/**
 * Selector for getting state of the prejoin audio.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isAudioDisabled(state: Object): Object {
    return state['features/prejoin'].audioDisabled;
}

/**
 * Selector for getting state of the prejoin video.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isPrejoinVideoDisabled(state: Object): Object {
    return state['features/prejoin'].videoDisabled;
}

/**
 * Selector for getting the visiblity state for the 'JoinByPhoneDialog'.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isJoinByPhoneDialogVisible(state: Object): boolean {
    return state['features/prejoin'].showJoinByPhoneDialog;
}

/**
 * Returns true if the prejoin page is enabled and no flag
 * to bypass showing the page is present.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isPrejoinPageEnabled(state: Object): boolean {
    return state['features/base/config'].prejoinPageEnabled;
}

/**
 * Returns true if the prejoin page is visible & active.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export function isPrejoinPageVisible(state: Object): boolean {
    return isPrejoinPageEnabled(state) && state['features/prejoin'].showPrejoin;
}

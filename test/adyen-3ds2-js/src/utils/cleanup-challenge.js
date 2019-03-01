/**
 * @function removeContainer
 * @private
 * @desc Remove the iframe used to POST the form used for the call to the 3DS Method URL
 * TODO: Improve removal functionality to accept container (optionally)
 */
export const removeChallenge = (challengeDiv) => {
    if (challengeDiv) {
        challengeDiv.innerHTML = '';
    }
};

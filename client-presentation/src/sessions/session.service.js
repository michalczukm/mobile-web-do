const getCurrentSessionId = () => window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

export default {
    getCurrentSessionId
};

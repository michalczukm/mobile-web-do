export const createEventsSubscription = (target = window) => {
    const eventHandlers = [];

    return {
        subscribe: (eventName, handler, ...options) => {
            target.addEventListener(eventName, handler, options);
            eventHandlers.push({
                eventName,
                handler,
            });
        },
        unsubscribeAll: () => {
            eventHandlers.forEach(({ eventName, handler }) =>
                target.removeEventListener(eventName, handler),
            );
        },
    };
};

export const globalEventListener = (() => {
    const events = new Map();

    //add globalEventListener
    const add = (listenerType, selector, onEvent) => {
        //if events has a listener tex; 'click' set it as a array
        if (!events.has(listenerType)) {
            events.set(listenerType, []);

            // Attach the global listener to the document
            document.addEventListener(listenerType, handleEvent);
        }
        //push it to the new listener params into the array
        events.get(listenerType).push({ selector, onEvent });
    };

    //remove globalEventListener
    const remove = (listenerType, selector, onEvent) => {
        if (events.has(listenerType)) {
            const listeners = events.get(listenerType);
    
            // Loop through the listeners to remove the one we want
            for (let i = 0; i < listeners.length; i++) {
                // if the listener's selector and onEvent match
                if (listeners[i].selector === selector && listeners[i].onEvent === onEvent) {
                    // Remove the listener from the array
                    listeners.splice(i, 1);
                    break; // Exit the loop once we've removed the listener
                }
            }
    
            // If no listeners are left for this event type, remove the event listener from the document
            if (listeners.length === 0) {
                document.removeEventListener(listenerType, handleEvent);
                events.delete(listenerType);
            }
        }
    };

    //execute event
    const handleEvent = (event) => {
        const { target } = event;
        const listenerType = event.type;

        if (events.has(listenerType)) {
            events.get(listenerType).forEach(({ selector, onEvent }) => {
                if (target instanceof Element) {
                    const matchingElement = target.closest(selector);
                    if (matchingElement) {
                        onEvent(event, matchingElement); // Pass matching element
                    }
                }
            });
        }
    };

    return { add, remove };
})();
export default class EventSource implements IEventSource {
    private eventHandlerCounter = 0;
    private eventHandlers: {} = {};

    public fire(eventName: string, params: any): void {
        Object.keys(this.eventHandlers)
            .filter(t => t.startsWith(eventName + '#'))
            .forEach(t => this.eventHandlers[t](params));
    }

    public on(eventName: string, fn: (e) => void): () => void {
        this.eventHandlerCounter++;
        var key = eventName + '#' + this.eventHandlerCounter;
        this.eventHandlers[key] = fn;

        return () => delete this.eventHandlers[key];
    }
}

/**
 * Represents an object that has an event stream. 
 */
export interface IEventSource {
    /**
     * Triggers an event on this object.
     * @param eventName Name of the event to trigger.
     * @param params Event's parameters if any.
     */
    fire(eventName: string, params?: any): void;

    /**
     * Subscribes to this object's event. 
     * @param eventName Name of the event to subscribe to.
     * @param fn Callback function to invoke when event occurs. When invoked, the callback will be supplied with the event args.
     * @returns Unsubscribe function.
     */
    on(eventName: string, fn: (e?:any) => void): () => void;
}
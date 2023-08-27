
import ipc from 'node-ipc';

class AsyncProcessSubscription {
    constructor(private emitter: { unsubscribe(listener: (value: any) => void): void }, private listener: (value: any) => Promise<void>) {
        //
    }
    unsubscribe() {
        this.emitter.unsubscribe(this.listener);
    }
}

class AsyncProcessEventEmitter<T> {
    listener: any;
    private connected = false
    constructor() {

    }

    async emit(value: T): Promise<void> {
        if (this.connected) {
            ipc.of.asyncEvents.emit('message', value);
        } else {
            ipc.config.id = 'asyncEvents';
            
        }
    }

    subscribe(next: (value: T) => void | Promise<void>): AsyncProcessSubscription {
        // create new listener
        this.listener = (event: { target: any, value: any }) => {
            if (event.target && event.target === 'ProcessEventEmitter') {
                void next(event.value);
            }
        };
        // attach listener
        process.on('message', this.listener);
        // and return subscription
        return new AsyncProcessSubscription(this, this.listener);
    }

    unsubscribe() {
        process.removeListener('message', this.listener);
    }
}

export {
    AsyncProcessEventEmitter
}
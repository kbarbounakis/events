
import ipc from 'node-ipc';

class AsyncProcessEventService {
    
    constructor() {

    }

    start(): void {
        ipc.config.id = 'asyncEvents';
        ipc.serve(
            () => {
                ipc.server.on(
                    'message',
                    (data: any,socket: any) => {
                        ipc.server.emit(
                            socket,
                            'message',
                            data
                        );
                    }
                );
            }
        );
        ipc.server.start();
    }

    stop() {
        ipc.server.stop();
    }

    emit(value: any): void {
        //
        ipc.server.emit('message', value);
    }

}

export {
    AsyncProcessEventService
}
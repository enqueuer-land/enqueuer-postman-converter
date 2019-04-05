import {RequisitionModel} from 'enqueuer/js/models/inputs/requisition-model';
import {Event} from 'enqueuer/js/models/events/event';
import * as postman from './postman-types';
import {Variable} from './postman-types';
import {PublisherModel} from 'enqueuer/js/models/inputs/publisher-model';
import {SubscriptionModel} from 'enqueuer/js/models/inputs/subscription-model';

export class EnqueuerRequisitionMapper {
    public convert(postmanCollection: postman.Collection): RequisitionModel {
        const requisition: any = {
            name: postmanCollection.info.name,
            id: postmanCollection.info._postman_id,
            subscriptions: [],
            publishers: [],
            requisitions: this.createRequisitions(postmanCollection)
        };
        const onInit = this.extractOnInitEvent(postmanCollection);
        if (onInit !== undefined) {
            requisition.onInit = onInit;
        }
        const onFinish = this.extractOnFinishEvent(postmanCollection);
        if (onFinish !== undefined) {
            requisition.onFinish = onFinish;
        }
        // @ts-ignore
        return requisition;
    }

    private extractOnInitEvent(element: { event?: postman.Event[], variable?: Variable[] }): Event | undefined {
        let event: any = this.extractEvent('prerequest', element);
        if (element.variable) {
            if (!event) {
                event = {};
            }
            event.store = {};
            (element.variable || [])
                .forEach(element => event!.store![element.key] = `\`${element.value}\``);
        }
        return event;
    }

    private extractOnMessageReceivedEvent(element: { event?: postman.Event[] }): Event | undefined {
        return this.extractEvent('test', element);
    }

    private extractOnFinishEvent(element: { event?: postman.Event[] }): Event | undefined {
        return this.extractEvent('test', element);
    }

    private extractEvent(eventName: string, element: { event?: postman.Event[] }): Event | undefined {
        if (element.event) {
            const event = element.event
                .find((event: postman.Event) => event.listen === eventName, {});
            if (event && Array.isArray(event.script.exec) && event.script.exec.length > 0) {
                // @ts-ignore
                return {
                    script: event.script.exec.join('; ')
                };
            }

        }
    }

    private createFolder(folder: postman.Folder): RequisitionModel {
        const result: any = {
            name: folder.name,
            subscriptions: [],
            publishers: [],
            requisitions: this.createRequisitions(folder)
        };
        const onInit = this.extractOnInitEvent(folder);
        if (onInit !== undefined) {
            result.onInit = onInit;
        }
        const onFinish = this.extractOnFinishEvent(folder);
        if (onInit !== undefined) {
            result.onFinish = onFinish;
        }

        return result;

    }

    private createRequisitions(postmanCollection: postman.Collection | postman.Folder): RequisitionModel[] {
        const requisitions: RequisitionModel[] = postmanCollection
            .item
            .map((item: postman.Item | postman.Folder) => {
                if ((item as any).request === undefined) {
                    return this.createFolder(item as postman.Folder);
                } else {
                    return this.createItem(item as postman.Item);
                }
            });
        return requisitions;
    }

    private createItem(item: postman.Item): RequisitionModel {
        // @ts-ignore
        const requisition: any = {
            name: item.name,
            subscriptions: (item.response || []).map(response => this.createSubscription(response)),
            publishers: [this.createPublisher(item.request, this.extractOnInitEvent(item), this.extractOnMessageReceivedEvent(item))],
            requisitions: []
        };
        if (item.id) {
            requisition.id = item.id;
        }
        return requisition;
    }

    private createPublisher(request: postman.Request, onInit?: Event, onMessageReceived?: Event): PublisherModel {
        const publisher: any = {
            type: request.url.protocol,
            url: request.url.raw,
            method: request.method,
            payload: request.body.raw,
            headers: this.createHeaders(request.header),
        };

        const auth = request.auth;
        if (auth) {
            publisher.authentication = {};
            publisher.authentication[auth.type] = {};
            const authType = auth[auth.type];
            if (Array.isArray(authType)) {
                authType.forEach((element) => {
                    publisher.authentication[auth.type][element.key] = element.value;
                });
            }
        }

        if (onInit !== undefined) {
            publisher.onInit = onInit;
        }
        if (onInit !== undefined) {
            publisher.onMessageReceived = onMessageReceived;
        }
        return publisher;

    }

    private createSubscription(response: postman.Response): SubscriptionModel {
        const protocol = response.originalRequest.url.protocol;
        let port: any = response.originalRequest.url.port;
        if (port === undefined) {
            port = protocol.toLowerCase() === 'http' ? 8080 : 443;
        }
        const subscription: any = {
            name: response.name,
            type: protocol,
            method: response.originalRequest.method,
            endpoint: response.originalRequest.url.path.join('/'),
            port: port,
            response: {
                headers: this.createHeaders(response.header),
                status: response.code || 200,
                payload: response.body
            }
        };
        if (response.id) {
            subscription.id = response.id;
        }
        return subscription;
    }

    private createHeaders(headers?: postman.Header[]) {
        const result: any = {};
        (headers || [])
            .filter(element => element.disabled !== false)
            .forEach(element => {
                result[element.key] = element.value;
            });
        return result;
    }

}

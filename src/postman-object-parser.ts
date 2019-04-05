import {ObjectParser} from 'enqueuer/js/object-parser/object-parser';
import {MainInstance} from 'enqueuer/js/plugins/main-instance';
import {EnqueuerRequisitionMapper} from './enqueuer-requisition-mapper';

export class PostmanObjectParser implements ObjectParser {
    parse(value: string, query?: any): object {
        return new EnqueuerRequisitionMapper().convert(JSON.parse(value));
    }

}

export function entryPoint(mainInstance: MainInstance) {
    mainInstance.objectParserManager
        .addObjectParser(() => new PostmanObjectParser(), 'postman');

}

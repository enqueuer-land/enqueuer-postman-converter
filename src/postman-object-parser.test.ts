import {entryPoint, PostmanObjectParser} from './postman-object-parser';
import {EnqueuerRequisitionMapper} from './enqueuer-requisition-mapper';

let convertMock = jest.fn();
jest.mock('./enqueuer-requisition-mapper');
// @ts-ignore
EnqueuerRequisitionMapper.mockImplementation(() => {
    return {
        convert: convertMock
    };
});

describe('PostmanObjectParser', () => {

    it('should call and return mappers result', () => {
        const postmanCollection = JSON.stringify({stringifiable: true});
        const convertReturn = 'anyReturn';
        convertMock = jest.fn(() => convertReturn);

        const parsed = new PostmanObjectParser().parse(postmanCollection);

        expect(parsed).toBe(convertReturn);
        expect(convertMock).toBeCalledWith(JSON.parse(postmanCollection));
    });

    it('should expose entryPoint', done => {
        const mainInstance: any = {
            objectParserManager: {
                addObjectParser: (createFunction: any, tag: any) => {
                    expect(tag).toBe('postman');
                    expect(createFunction()).toBeInstanceOf(PostmanObjectParser);
                    done();
                }
            }
        };

        entryPoint(mainInstance);
    });

});

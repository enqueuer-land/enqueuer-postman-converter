#!/usr/bin/env node
import {EnqueuerRequisitionMapper} from './enqueuer-requisition-mapper';
import * as fs from 'fs';
import * as yaml from 'yamljs';
import {MainInstance} from 'enqueuer/js/plugins/main-instance';
import * as parser from './postman-object-parser';

if (require.main === module) {

    if (process.argv.length != 4) {
        console.log(`Wrong usage`);
        console.log(`Usage: $ postman-nqr-converter postman-input-file enqueuer-output-file`);
    } else {
        const postmanFilename = process.argv[2];
        const nqrFilename = process.argv[3];
        const postmanFile = JSON.parse(fs.readFileSync(postmanFilename).toString());
        const enqueuerRequisition = new EnqueuerRequisitionMapper().convert(postmanFile);
        fs.writeFileSync(nqrFilename, yaml.stringify(enqueuerRequisition, 100, 2));
    }
}

export function entryPoint(mainInstance: MainInstance) {
    parser.entryPoint(mainInstance);
}

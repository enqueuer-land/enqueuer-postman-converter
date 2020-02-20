#!/usr/bin/env node
import {EnqueuerRequisitionMapper} from './enqueuer-requisition-mapper';
import * as fs from 'fs';
import * as yaml from 'yamljs';
import {MainInstance} from 'enqueuer/js/plugins/main-instance';
import * as parser from './postman-object-parser';

if (require.main === module) {

    if (process.argv.length < 4) {
        console.log(`Wrong usage`);
        console.log(`\tUsage: $ postman-nqr-converter postman-input-file enqueuer-output-file`);
        console.log(`\tUsage: $ postman-nqr-converter -a postman-input-file1 postman-input-file2 postman-input-file3 ...`);
    } else if (process.argv[2] === '-a') {
        process.argv
            .filter((filename: string, index: number) => index > 2)
            .forEach((filename: string) => {
                const postmanFile = JSON.parse(fs.readFileSync(filename).toString());
                const enqueuerRequisition = new EnqueuerRequisitionMapper().convert(postmanFile);
                const lastIndexOfDot = filename.lastIndexOf('.');
                const dotlessFilename = filename.substr(0, lastIndexOfDot !== -1 ? lastIndexOfDot : filename.length);
                const outputFilename = `${dotlessFilename}.nqr.yml`;
                fs.writeFileSync(outputFilename, yaml.stringify(enqueuerRequisition, 100, 2));
            });
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

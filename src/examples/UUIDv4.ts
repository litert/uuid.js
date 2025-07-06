import * as LibUUID from '../lib';

const generator = new LibUUID.Uuid4Generator();

for (let i = 0; i < 10; i++) {
    console.log(generator.generate());
}

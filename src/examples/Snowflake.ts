import * as LibUUID from '../lib';

const generator = new LibUUID.SnowflakeGenerator({ machineId: 123 });

for (let i = 0; i < 10; i++) {
    console.log(generator.generate().toString());
}

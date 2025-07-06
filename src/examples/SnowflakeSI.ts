import * as LibUUID from '../lib';

const generator = new LibUUID.SnowflakeSiGenerator({
    machineId: 1,
    epoch: Date.parse('2020-01-11T11:11:11+0800'),
    clockBitWidth: 41,
});

for (let i = 0; i < 10; i++) {
    console.log(generator.generate().toString());
}

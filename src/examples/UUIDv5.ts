import * as LibUUID from '../lib';

const generator = new LibUUID.Uuid5Generator({
    namespace: LibUUID.EUuid5PredefinedNamespaces.URL
});

console.log(generator.generate('https://litert.org/projects/uuid.js'));
console.log(generator.generate('https://litert.org/projects/config-loader.js'));
console.log(generator.generate('https://litert.org/projects/otp.js'));

const sdk = require('@zerodev/sdk');
Object.keys(sdk).filter(k => k.includes('KERNEL')).forEach(k => console.log(k));

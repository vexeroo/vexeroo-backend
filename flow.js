const memoryUsage = process.memoryUsage();
console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
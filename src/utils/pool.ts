type PromiseExecutor = () => Promise<any>;

export default class PromisePool<T> {
    private maxConcurrent: number;
    private executorQueue: PromiseExecutor[];
    private activeCount: number;

    constructor(maxConcurrent: number, executorQueue: PromiseExecutor[] = []) {
        this.maxConcurrent = maxConcurrent;
        this.executorQueue = executorQueue;
        this.activeCount = 0;
    }

    set(executor: PromiseExecutor[]) {
        this.executorQueue = executor
    }

    push(executor: PromiseExecutor) {
        this.executorQueue.push(executor);
    }

    // Run all tasks in the pool with limited concurrency
    async run(): Promise<void> {
        const results: T[] = [];

        const executeNext = async (): Promise<void> => {
            if (this.activeCount >= this.maxConcurrent || this.executorQueue.length === 0) {
                return;
            }

            const executor = this.executorQueue.shift();
            if (!executor) return;

            this.activeCount++;
            
            try {
                await executor();
                await executeNext(); // Recursively start next task before current finishes
            } catch (error) {
                console.error('A promise failed:', error);
            } finally {
                this.activeCount--;
                await executeNext(); // Start next task after current finishes
            }
        };

        // Start initial set of concurrent tasks
        const initialExecutions = Array.from({ length: Math.min(this.maxConcurrent, this.executorQueue.length) }).map(() => executeNext());
        
        await Promise.all(initialExecutions);
    }
}
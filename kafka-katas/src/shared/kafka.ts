import { Kafka, logLevel, Partitioners, type Consumer, type Producer } from "kafkajs";

export const BROKERS = (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",");

export const TOPICS = {
  taskEvents: "task-events",
  taskEventsDlq: "task-events.dlq",
  taskerEvents: "tasker-events",
  smoke: "smoke-test",
} as const;

export type TopicName = (typeof TOPICS)[keyof typeof TOPICS];

export function makeKafka(clientId: string): Kafka {
  return new Kafka({ clientId, brokers: BROKERS, logLevel: logLevel.WARN });
}

export function makeProducer(kafka: Kafka): Producer {
  return kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
    idempotent: true,
    maxInFlightRequests: 1,
  });
}

/** Disconnect cleanly on Ctrl+C / SIGTERM so the group rebalances promptly. */
export function onShutdown(...clients: Array<Producer | Consumer>): void {
  const stop = async (signal: string) => {
    console.log(`\n${signal} received, disconnecting...`);
    await Promise.allSettled(clients.map((c) => c.disconnect()));
    process.exit(0);
  };
  process.once("SIGINT", () => void stop("SIGINT"));
  process.once("SIGTERM", () => void stop("SIGTERM"));
}

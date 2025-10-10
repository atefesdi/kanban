declare module "@rails/actioncable" {
  type Subscription = {
    send(data: unknown): void;
    unsubscribe: () => void;
  };

  type Cable = {
    subscriptions: {
      create(
        params: { channel: string },
        callbacks: {
          connected?: () => void;
          disconnected?: () => void;
          received?: (data: unknown) => void;
        }
      ): Subscription;
    };
  };

  export function createConsumer(url?: string): Cable;
}

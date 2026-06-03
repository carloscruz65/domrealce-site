import { useEffect, useRef } from "react";

type PaypalButtonProps = {
  onCreateOrder: () => Promise<string>;
  onSuccess?: (details: any) => void;
  onError?: (err: any) => void;
};

declare global {
  interface Window {
    paypal: any;
  }
}

export function PaypalButton({
  onCreateOrder,
  onSuccess,
  onError,
}: PaypalButtonProps) {
  const paypalRef = useRef<HTMLDivElement | null>(null);

  const onCreateOrderRef = useRef(onCreateOrder);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCreateOrderRef.current = onCreateOrder;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onCreateOrder, onSuccess, onError]);

  useEffect(() => {
    if (!window.paypal || !paypalRef.current) {
      console.warn("⚠️ PayPal SDK ainda não carregou.");
      return;
    }

    paypalRef.current.innerHTML = "";

    const button = window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
      },

      // Server creates the PayPal order so that custom_id = internalOrderId,
      // binding the PayPal transaction to our specific internal order.
      createOrder: async () => {
        try {
          return await onCreateOrderRef.current();
        } catch (err) {
          onErrorRef.current?.(err);
          throw err;
        }
      },

      onApprove: async (_data: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          console.log("Pagamento PayPal capturado:", details);
          onSuccessRef.current?.(details);
        } catch (err) {
          console.error("Erro ao capturar pagamento PayPal:", err);
          onErrorRef.current?.(err);
        }
      },

      onError: (err: any) => {
        console.error("Erro PayPal:", err);
        onErrorRef.current?.(err);
      },
    });

    button.render(paypalRef.current);

    return () => {
      try {
        button.close();
      } catch {}
    };
  }, []); // only mount once; callbacks use refs

  return <div ref={paypalRef} />;
}

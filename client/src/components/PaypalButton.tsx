import React, { useEffect, useRef } from "react";

type PaypalButtonProps = {
  amount: number;
  onSuccess?: (details: any) => void;
  onError?: (err: any) => void;
};

declare global {
  interface Window {
    paypal: any;
  }
}

export function PaypalButton({
  amount,
  onSuccess,
  onError,
}: PaypalButtonProps) {
  const paypalRef = useRef<HTMLDivElement | null>(null);

  // ✅ guardar callbacks sem causar rerender do effect
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

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

      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: amount.toFixed(2),
              },
            },
          ],
        });
      },

      onApprove: async (_data: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          console.log("Pagamento PayPal OK:", details);
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
  }, [amount]); // ✅ só depende do amount

  return <div ref={paypalRef} />;
}

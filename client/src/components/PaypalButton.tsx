import React, { useEffect, useRef } from "react";

type PaypalButtonProps = {
  amount: number; // total em euros
  onSuccess?: (details: any) => void;
  onError?: (err: any) => void;
};

declare global {
  interface Window {
    paypal: any;
  }
}

export function PaypalButton({ amount, onSuccess, onError }: PaypalButtonProps) {
  const paypalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.paypal || !paypalRef.current) {
      console.warn("⚠️ PayPal SDK ainda não carregou.");
      return;
    }

    // limpar botões antigos (evita duplicados)
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
                value: amount.toFixed(2),
                currency_code: "EUR",
              },
            },
          ],
        });
      },

      onApprove: async (_data: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          console.log("Pagamento PayPal OK:", details);
          onSuccess?.(details);
        } catch (err) {
          console.error("Erro ao capturar pagamento PayPal:", err);
          onError?.(err);
        }
      },

      onError: (err: any) => {
        console.error("Erro PayPal:", err);
        onError?.(err);
      },
    });

    button.render(paypalRef.current);

    return () => {
      try {
        button.close();
      } catch {}
    };
  }, [amount, onSuccess, onError]);

  return <div ref={paypalRef} />;
}

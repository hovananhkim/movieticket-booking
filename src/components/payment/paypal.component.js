import React, { useRef, useEffect } from "react";
import {
  getTicket,
  payment,
  removeTicket,
} from "../../services/payment.service";
import { success, error } from "../notification/notification";

export default function Paypal(props) {
  const paypal = useRef();
  const { handlePaymentOK } = props;

  useEffect(() => {
    const ticket = JSON.parse(getTicket());
    const price = ticket.price * ticket.seatsStatus.length;
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `${ticket.movie.name}`,
                amount: {
                  currency_code: "CAD",
                  value: price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          const { orderID, payerID } = data;
          payment(orderID, payerID, price)
            .then(async () => {
              success("Thanh toán thành công");
              // const order = await actions.order.capture();
              removeTicket();
            })
            .catch(() => error("Thanh toán thất bại"));
          handlePaymentOK();
        },
        onError: (err) => {
          console.log(err);
          error("Thanh toán thất bại");
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="payment" ref={paypal}></div>
    </div>
  );
}

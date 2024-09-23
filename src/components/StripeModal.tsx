import { Dialog, Transition } from "@headlessui/react";
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { FC, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { createEvent, updateEvent } from "services/player/events";
import { createPayment, updatePaidProductFields } from 'services/shared/payment';
import Radio from "shared/Radio/Radio";
import './PaymentForm.css';
import { deleteEvent } from "services/coach/events";

interface Props {
  stripePromise: any;
  modalIsOpen: boolean;
  onRequestClose: any;
  coachId: string;
  selectedProduct: any;
  reqEventData: any;
  cancelPaidProduct?: Function;
  paidTxId?: string;
  members?: any;
}

const StripeModal: FC<Props> = ({ stripePromise, modalIsOpen, onRequestClose, coachId, selectedProduct, reqEventData,cancelPaidProduct,paidTxId, members }) => {
  return (
    <Elements stripe={stripePromise} >
      <MyComponent
        stripePromise={stripePromise}
        modalIsOpen={modalIsOpen}
        onRequestClose={onRequestClose}
        coachId={coachId}
        selectedProduct={selectedProduct}
        reqEventData={reqEventData}
        cancelPaidProduct={cancelPaidProduct}
        paidTxId={paidTxId}
        members={members}
      />
    </Elements>
  )
}

const formatDate = (dateTimeStr:string) => {
  const date = new Date(dateTimeStr);

  // Manual mapping for short month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = monthNames[date.getMonth()]; // Get the short month name
  const day = date.getDate();                // Get the day
  const year = date.getFullYear();           // Get the full year
  const hours = date.getHours();             // Get the hour (24-hour format)
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Get the minutes and pad if needed
  const ampm = hours >= 12 ? 'PM' : 'AM';    // Determine AM/PM
  const formattedHour = hours % 12 || 12;    // Convert 24-hour to 12-hour format

  // Combine to create the desired format
  return `${month} ${day}, ${year}, ${formattedHour}:${minutes} ${ampm}`;
};

const MyComponent: FC<Props> = ({ stripePromise, modalIsOpen, onRequestClose, coachId, selectedProduct, reqEventData, cancelPaidProduct, paidTxId, members }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [privateType, setPrivateType] = useState(false);
  const [realPrice, setRealPrice] = useState(reqEventData.product_price || "10");

  console.log(reqEventData, '----> reqEventData')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('CardElement not found');
      return;
    }
    setIsLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    console.log('reqEventData', reqEventData)

    if (error) {
      setError(error.message || 'An unknown error occurred.');
    } else {
      try {
        const seriesPrice = selectedProduct.price * selectedProduct.unit * (100 - selectedProduct.discount_percent) / 100;

        const data:Record<string,any> = {
          eventId: reqEventData.dataId,  /// must check
          paymentMethodId: paymentMethod.id,
          coachId: coachId,
          price: (reqEventData.duration === '60 minutes' ? 1 : 1.5) * (reqEventData.group ? reqEventData.product_price * reqEventData.players.length : (privateType ? seriesPrice : selectedProduct.price)),
          productId: reqEventData.group ? reqEventData.product_id : selectedProduct.id,
          privateType: privateType,
          group: reqEventData.group,
          repeat: reqEventData.repeat_status == 'undefined' ? privateType : reqEventData.repeat_status,
          startTime: reqEventData.start,
          book_count: reqEventData.players.length
        };
        if(paidTxId && cancelPaidProduct) {
          await cancelPaidProduct(paidTxId);
          const deletePlayers = members.map((v:any) => ({...v, checked: false}));
          if(reqEventData.group)
            await updateEvent(reqEventData.dataId, {...reqEventData, players: deletePlayers, isDelete: true});
          else await deleteEvent(reqEventData.dataId);
        }
        data['package_count'] = data.repeat ? selectedProduct.unit : 1
        const res = await createPayment(data);
        reqEventData.transaction_id = res.paymentIntent.id;
        if (res.success) {
          toast.success('Your payment successfully.');
          if (reqEventData.group) {
            await updateEvent(reqEventData.dataId, reqEventData);
            toast.success('Updated Event successfully.');
          } else {
            const response = await createEvent(reqEventData);
            await updatePaidProductFields(res.paymentIntent.id, {event_id: response.event.id})
            toast.success('Created New Event successfully.');
          }
          onRequestClose();
        } else {
          toast.success('Your payment failed.');
          onRequestClose();
        }
      } catch (err: any) {
        toast.error(err.error || 'The Error was occured')
      }

    }
    setIsLoading(false);
  };
  return (
    <Transition show={modalIsOpen} as={React.Fragment}>
      <Dialog
        open={modalIsOpen}
        onClose={onRequestClose}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="bg-white p-6 rounded shadow-lg z-50">
            {isLoading &&
              <div className="d-flex py-2.5 px-5 mb-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 inline-flex items-center justify-center"
                style={{
                  minWidth: '600px',
                  position: 'absolute',
                  zIndex: 9999,
                  height: !reqEventData.group ? '255px' : '212px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <svg aria-hidden="true" role="status" className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                </svg>
                Confirming Payment...
              </div>
            }
            <>
              <div className="relative text-center">
                <button onClick={onRequestClose} className="absolute left-0">Close</button>
                {reqEventData.repeat_status && reqEventData.repeat_status !== "undefined" ? `${formatDate(reqEventData.start)} - ${formatDate(reqEventData.event_last_time)}` : formatDate(reqEventData.start.split('T')[0] + 'T' +  reqEventData.start_time)}
              </div>
              <form onSubmit={handleSubmit} className="payment-form">

                <h2>Complete Your Payment</h2>
                <div className="form-group">
                  <CardElement className="card-element mb-5" />
                  {!reqEventData.group && (
                    <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Radio
                        label={`<span class="text-sm font-medium"> Package of ${selectedProduct.unit} </span>`}
                        id="Address-type-home"
                        name="Address-type"
                        onChange={() => {
                          setPrivateType(true);
                          setRealPrice((reqEventData.duration === '60 minutes' ? 1 : 1.5) * selectedProduct.price * selectedProduct.unit * (100 - selectedProduct.discount_percent) / 100);
                        }}
                      />
                      <Radio
                        label={`<span class="text-sm font-medium">Individual</span>`}
                        id="Address-type-office"
                        name="Address-type"
                        defaultChecked={true}
                        onChange={() => {
                          setPrivateType(false);
                          setRealPrice((reqEventData.duration === '60 minutes' ? 1 : 1.5) * selectedProduct.price);
                        }}
                      />
                    </div>
                  )}
                </div>
                <button type="submit" disabled={isLoading || !stripe} className="submit-button">
                  <span id="button-text">Pay £ {reqEventData.group ? (reqEventData.duration === '60 minutes' ? 1 : 1.5) * (reqEventData.repeat_status ? reqEventData.product_price : realPrice) * reqEventData.players.length : realPrice}</span>
                </button>
                {error && <div className="error-message">{error}</div>}
              </form>
            </>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );

}

export default StripeModal;
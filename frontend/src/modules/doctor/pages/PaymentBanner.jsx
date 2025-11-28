import React from 'react'
import { badge } from '../../../styles/componentsStyle'

function PaymentBanner({ payments }) {
  return (
        <div className={`${payments?.status ? badge.successSm : badge.dangerSm} md:text-xl md:p-4 p-3 leading-relaxed rounded shadow-sm`}>
            {!payments?.status && (
                <>
                <span className="block text-lg font-semibold mb-2">
                    ⚠️ Payment Required
                </span>

                <span className="text-base opacity-90 text-wrap">
                    {payments?.message}
                </span>

                <div className="mt-4 space-y-1 text-base">
                    <div>
                    <span className="font-semibold">📞 Contact Us: </span>
                    <a className="font-bold underline" href="tel:+93 783231188">
                        +93 783231188
                    </a>
                    </div>

                    <div>
                    <span className="font-semibold">📧 Mail Us: </span>
                    <a className="font-bold underline" href="mailto:PaikarSoftware@gmail.com">
                        PaikarSoftware@gmail.com
                    </a>
                    </div>
                </div>
                </>
            )}

            {payments?.status && (
                <span className="font-semibold">✔ Payment Active — Thank you!</span>
            )}
        </div>
  )
}

export default PaymentBanner
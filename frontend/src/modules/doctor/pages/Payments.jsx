import React, { useEffect, useState } from 'react'
import { banner } from '../../../styles/componentsStyle'
import { Link } from 'react-router-dom'
import PaymentBanner from './PaymentBanner'
import { ArrowBigLeftDashIcon, CheckCircle, XCircle } from 'lucide-react'
import { getAllPayments } from '../../../api/doctorAPI'
import SectionContainer from '../../../componenets/SectionContainer'
import PaymentOptions from './PaymentOptions'


function Payments({ payments }) {
    const [userPayments, setUserPayments] = useState([])

    useEffect(() => { 
        getAllPayments({ seter: setUserPayments }) 
    }, [])

    const hasNoPayments = !userPayments || Object.keys(userPayments).length === 0

    return (
        <div>
            <Link to="/doctor" className={banner.back}>
                <ArrowBigLeftDashIcon /> Back
            </Link>

            {!payments?.status && <PaymentBanner payments={payments} />}

            <PaymentOptions />


            <div className="mt-4 space-y-6">

                {/* No payments message */}
                {hasNoPayments && (
                    <div className="text-center bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-6 rounded-md shadow">
                        <p className="text-xl font-semibold">No Payments Found</p>
                        <p className="text-sm opacity-80">
                            You have no recorded payments for any year.
                        </p>
                    </div>
                )}

                {/* Payments per year */}
                {!hasNoPayments &&
                    Object.keys(userPayments)
                        .sort((a, b) => b - a) // Latest year first
                        .map((year) => (
                            <SectionContainer key={year} title={`Payments for ${year}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                                    {[...userPayments[year]]
                                        .sort((a, b) => b.month_number - a.month_number) // Latest month first
                                        .map((m) => (
                                            <div
                                                key={`${year}-${m.month_number}`}
                                                className={`p-4 rounded-xl shadow transition hover:shadow-xl hover:cursor-pointer border
                                                    ${
                                                        m.is_paid
                                                            ? "bg-green-50 border-green-300"
                                                            : "bg-red-50 border-red-300"
                                                    }
                                                `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-lg font-semibold">{m.month_name}</h3>
                                                    {m.is_paid ? (
                                                        <CheckCircle className="text-green-600" />
                                                    ) : (
                                                        <XCircle className="text-red-600" />
                                                    )}
                                                </div>

                                                <div className="mt-2 text-sm opacity-75">
                                                    <p>
                                                        <strong>Amount sdfs:</strong>{" "}
                                                        {m.total_amount ? `${m.total_amount} AFN` : "0 AFN"}
                                                    </p>
                                                    <p>
                                                        <strong>Status:</strong>{" "}
                                                        {m.is_paid ? "Paid" : "Unpaid"}
                                                    </p>

                                                    {m.paid_at && (
                                                        <p>
                                                            <strong>Paid At:</strong>{" "}
                                                            {new Date(m.paid_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </SectionContainer>
                        ))}
            </div>
        </div>
    )
}

export default Payments

import React from 'react';
import './OrderDetailsSection.css';

const OrderDetailsSection = ({ prefix = "ods" }) => {
    const orders = [
        {
            title: "Your Order",
            date: "Fri Dec 26 2025",
            items: [
                { name: "Name", qty: 1, duration: "2 days", price: 100000 }
            ],
            subtotal: 100000,
            fee: 100,
            total: 100100
        },
        {
            title: "Order extension",
            date: "Fri Dec 26 2025",
            items: [
                { name: "Extend duration", qty: 1, duration: "1 day", price: 100 }
            ],
            total: 100200
        }
    ];

    return (
        <div className={`${prefix}-details-section`}>
            <div className={`${prefix}-review-header`}>
                <h2>Order Details</h2>
                <div className={`${prefix}-header-line`}></div>
            </div>

            {orders.map((order, idx) => (
                <div key={idx} className={`${prefix}-order-card`}>
                    <div className={`${prefix}-card-header`}>
                        <span className={`${prefix}-card-title`}>{order.title}</span>
                        <span className={`${prefix}-card-date`}>{order.date}</span>
                    </div>
                    <div className={`${prefix}-table`}>
                        <div className={`${prefix}-tr ${prefix}-th`}>
                            <div>Item</div>
                            <div>Qty.</div>
                            <div>Duration</div>
                            <div className={`${prefix}-right`}>Price</div>
                        </div>
                        {order.items.map((item, iIdx) => (
                            <div key={iIdx} className={`${prefix}-tr`}>
                                <div data-label="Item">{item.name}</div>
                                <div data-label="Qty">{item.qty}</div>
                                <div data-label="Duration">{item.duration}</div>
                                <div data-label="Price" className={`${prefix}-right`}>${item.price}</div>
                            </div>
                        ))}
                        {order.subtotal !== undefined && (
                            <div className={`${prefix}-tr ${prefix}-sum`}>
                                <div data-label="Subtotal" className={`${prefix}-span3`}>Subtotal</div>
                                <div data-label="Amount" className={`${prefix}-right`}>${order.subtotal}</div>
                            </div>
                        )}
                        {order.fee !== undefined && (
                            <div className={`${prefix}-tr ${prefix}-sum`}>
                                <div data-label="Service Fee" className={`${prefix}-span3`}>Service fee</div>
                                <div data-label="Amount" className={`${prefix}-right`}>${order.fee}</div>
                            </div>
                        )}
                        <div className={`${prefix}-tr ${prefix}-total`}>
                            <div data-label="Total" className={`${prefix}-span3`}>Total</div>
                            <div data-label="Amount" className={`${prefix}-right`}>${order.total}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderDetailsSection;

import React from "react";
import "./OrderDetailsSection.css";

const formatMoney = (amount) => {
    const num = Number(amount || 0);
    return `$${num.toLocaleString()}`;
};

const formatDate = (value) => {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return value;
    }
};

const OrderDetailsSection = ({ prefix = "ods", blocks = [] }) => {
    const normalizedBlocks = Array.isArray(blocks) ? blocks : [];

    return (
        <div className={`${prefix}-details-section`}>
            <div className={`${prefix}-review-header`}>
                <h2>Order Details</h2>
                <div className={`${prefix}-header-line`}></div>
            </div>

            {normalizedBlocks.length === 0 ? (
                <div className={`${prefix}-order-card`}>
                    <div className={`${prefix}-card-header`}>
                        <span className={`${prefix}-card-title`}>Order</span>
                        <span className={`${prefix}-card-date`}>—</span>
                    </div>
                    <div className={`${prefix}-table`}>
                        <div className={`${prefix}-tr`}>
                            <div>No order details available.</div>
                        </div>
                    </div>
                </div>
            ) : (
                normalizedBlocks.map((order, idx) => (
                    <div key={idx} className={`${prefix}-order-card`}>
                        <div className={`${prefix}-card-header`}>
                            <span className={`${prefix}-card-title`}>{order.title || "Order"}</span>
                            <span className={`${prefix}-card-date`}>{formatDate(order.date)}</span>
                        </div>

                        <div className={`${prefix}-table`}>
                            <div className={`${prefix}-tr ${prefix}-th`}>
                                <div>Item</div>
                                <div>Qty.</div>
                                <div>Duration</div>
                                <div className={`${prefix}-right`}>Price</div>
                            </div>

                            {(order.items || []).map((item, iIdx) => (
                                <div key={iIdx} className={`${prefix}-tr`}>
                                    <div data-label="Item">{item.name || "—"}</div>
                                    <div data-label="Qty">{item.qty ?? "—"}</div>
                                    <div data-label="Duration">{item.duration || "—"}</div>
                                    <div data-label="Price" className={`${prefix}-right`}>
                                        {formatMoney(item.price)}
                                    </div>
                                </div>
                            ))}

                            {order.subtotal !== undefined && (
                                <div className={`${prefix}-tr ${prefix}-sum`}>
                                    <div data-label="Subtotal" className={`${prefix}-span3`}>
                                        Subtotal
                                    </div>
                                    <div data-label="Amount" className={`${prefix}-right`}>
                                        {formatMoney(order.subtotal)}
                                    </div>
                                </div>
                            )}

                            {order.fee !== undefined && (
                                <div className={`${prefix}-tr ${prefix}-sum`}>
                                    <div data-label="Service Fee" className={`${prefix}-span3`}>
                                        Service fee
                                    </div>
                                    <div data-label="Amount" className={`${prefix}-right`}>
                                        {formatMoney(order.fee)}
                                    </div>
                                </div>
                            )}

                            <div className={`${prefix}-tr ${prefix}-total`}>
                                <div data-label="Total" className={`${prefix}-span3`}>
                                    Total
                                </div>
                                <div data-label="Amount" className={`${prefix}-right`}>
                                    {formatMoney(order.total)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderDetailsSection;
import React, { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "./MyCartPage.css";

const INITIAL_CART = [
  {
    id: 1,
    title: "Title",
    category: "Description",
    price: 210,
    total: 120,
    quantity: 1,
  },
  {
    id: 2,
    title: "Musk Rose Cooper",
    category: "Perfumes",
    price: 210,
    total: 120,
    quantity: 1,
  },
  {
    id: 3,
    title: "Dusk Dark Hue",
    category: "Perfumes",
    price: 210,
    total: 120,
    quantity: 1,
  },
];

export default function MyCartPage({ theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_CART);

  useEffect(() => {
    setSidebarOpen(false);
    setShowSettings(false);
  }, []);

  const summary = useMemo(() => {
    const subtotal = 360;
    const delivery = 45;
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  }, []);

  const updateQuantity = (id, next) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, next) }
          : item,
      ),
    );
  };

  return (
    <div className={`my-cart-page user-page ${theme || "light"} min-h-screen relative overflow-hidden`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        theme={theme}
        onDropdownChange={setIsDropdownOpen}
      />

      <div className="pt-[72px] flex relative w-full">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-0 overflow-hidden w-full">
          <div className="relative overflow-y-auto h-[calc(100vh-72px)] w-full">
            <main className={`my-cart-main ${isDropdownOpen ? "blurred" : ""}`}>
              <section className="my-cart-shell">
                <header className="my-cart-head">
                  <h1 className="my-cart-title">My Cart</h1>
                </header>

                <section className="my-cart-board">
                  <div className="my-cart-tableHead">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Total</span>
                  </div>

                  <div className="my-cart-list">
                    {items.map((item) => (
                      <article key={item.id} className="my-cart-card">
                        <div className="my-cart-product">
                          <h2 className="my-cart-productTitle">{item.title}</h2>
                          <p className="my-cart-productCategory">{item.category}</p>
                          <strong>${item.price}</strong>
                        </div>

                        <div className="my-cart-qtyCol">
                          <div className="my-cart-stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="my-cart-totalCol">${item.total}</div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="my-cart-summary">
                  <div className="my-cart-summaryRow">
                    <span>Subtotal</span>
                    <strong>${summary.subtotal.toFixed(2)}</strong>
                  </div>
                  <div className="my-cart-summaryRow">
                    <span>Delivery Charger</span>
                    <strong>${summary.delivery.toFixed(2)}</strong>
                  </div>
                  <div className="my-cart-summaryDivider" />
                  <div className="my-cart-summaryRow total">
                    <span>Total</span>
                    <strong>${summary.total.toFixed(2)}</strong>
                  </div>
                </section>

                <div className="my-cart-actions">
                  <button type="button" className="my-cart-payBtn">
                    Continue to payment
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

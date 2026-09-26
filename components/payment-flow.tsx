/*
  An illustration of Tenant101's automatic payment, drawn in the portfolio's own
  style from the amounts in the recorded demo. Its caption, set by WorkMedia,
  labels it as an illustration, not a screenshot. Its sequence runs once when
  it enters view (see .flow in globals.css); without motion it shows the finished state.
*/
export function PaymentFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flow${compact ? " flow--compact" : ""}`} aria-hidden={compact || undefined}>
      <div className="flow__card">
        <p className="flow__label">Balance</p>
        <p className="flow__balance">
          <span className="flow__old"><span className="visually-hidden">From </span>₱81,675</span>
          <span className="flow__new"><span className="visually-hidden"> to </span>₱0<span className="visually-hidden"> once PayMongo confirms the payment</span></span>
        </p>
        {!compact && (
          <ol className="flow__steps">
            <li className="flow__step">
              <span className="flow__dot" aria-hidden="true" />
              <span>Tenant taps Pay and picks <strong>GCash</strong>, Maya or a card</span>
            </li>
            <li className="flow__step">
              <span className="flow__dot" aria-hidden="true" />
              <span>They pay on PayMongo&apos;s secure page</span>
            </li>
            <li className="flow__step">
              <span className="flow__dot" aria-hidden="true" />
              <span>PayMongo confirms it, and the balance clears on its own</span>
            </li>
          </ol>
        )}
        <p className="flow__chip">
          <span className="flow__pending" aria-hidden="true">Processing</span>
          <span className="flow__approved">Paid</span>
        </p>
      </div>
    </div>
  );
}

/*
  An illustration of Tenant101's payment review, drawn in the portfolio's own
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
          <span className="flow__new"><span className="visually-hidden"> to </span>₱65,175<span className="visually-hidden"> after approval</span></span>
        </p>
        {!compact && (
          <ol className="flow__steps">
            <li className="flow__step">
              <span className="flow__dot" aria-hidden="true" />
              <span>Tenant reports a <strong>₱16,500</strong> transfer, with its reference and receipt</span>
            </li>
            <li className="flow__step">
              <span className="flow__dot" aria-hidden="true" />
              <span>Waiting for review. The balance doesn&apos;t change yet</span>
            </li>
            <li className="flow__step">
              <span className="flow__dot" aria-hidden="true" />
              <span>Landlord approves, and only then the balance drops</span>
            </li>
          </ol>
        )}
        <p className="flow__chip">
          <span className="flow__pending" aria-hidden="true">Waiting for review</span>
          <span className="flow__approved">Approved</span>
        </p>
      </div>
    </div>
  );
}

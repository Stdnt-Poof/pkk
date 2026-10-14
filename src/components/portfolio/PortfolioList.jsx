import { isValidExternalUrl } from "./portfolioUtils"

const KIND_LABEL = { project: "Portfolio", cv: "CV", external: "Link" }

function PortfolioList({ items, onOpen }) {
  if (items.length === 0) {
    return <p className="feed-empty">No portfolio items yet. Tap + to add one.</p>
  }

  return (
    <ul className="pf-list">
      {items.map((item) => {
        const isCv = item.kind === "cv"
        return (
          <li key={item.id}>
            <button
              type="button"
              className="pf-row"
              onClick={() => onOpen(item)}
              title={isCv ? "Opens preview" : "Opens in a new browser tab"}
            >
              <span className="pf-thumb" aria-hidden="true">
                {isCv ? (
                  <span className="pf-thumb-pdf">PDF</span>
                ) : (
                  <span className="pf-thumb-link">↗</span>
                )}
              </span>
              <span className="pf-row-body">
                <span className="pf-row-title">{item.title}</span>
                <span className="pf-row-sub">
                  <span className="pf-badge">{KIND_LABEL[item.kind] || item.kind}</span>
                  {isCv ? (
                    <span>PDF · preview + .pdf download</span>
                  ) : (
                    <span>
                      {isValidExternalUrl(item.externalUrl) ? "Opens in new tab" : "Check link"}
                    </span>
                  )}
                </span>
              </span>
              <span className="pf-row-open" aria-hidden="true">
                {isCv ? "›" : "↗"}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default PortfolioList

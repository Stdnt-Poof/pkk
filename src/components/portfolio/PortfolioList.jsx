import { isValidExternalUrl } from "./portfolioUtils"

const KIND_LABEL = { project: "Portfolio", cv: "CV", external: "Link" }

function PortfolioList({ items, onOpen }) {
  if (items.length === 0) {
    return <p className="feed-empty">No portfolio items yet. Tap + to add one.</p>
  }

  return (
    <ul className="pf-list">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="pf-row"
            onClick={() => onOpen(item)}
            title={item.openMode === "external" ? "Opens in a new browser tab" : "Opens preview"}
          >
            <span className="pf-thumb" aria-hidden="true">
              {item.kind === "cv" || !item.preview ? (
                <span className="pf-thumb-pdf">PDF</span>
              ) : (
                <img className="no-drag" src={item.preview} alt="" />
              )}
            </span>
            <span className="pf-row-body">
              <span className="pf-row-title">{item.title}</span>
              <span className="pf-row-sub">
                <span className="pf-badge">{KIND_LABEL[item.kind] || item.kind}</span>
                {item.kind === "project" ? (
                  <span>
                    {item.images.length} slides · ♥ {item.likes} · 👁 {item.views}
                  </span>
                ) : item.kind === "cv" ? (
                  <span>PDF · downloads as .pdf</span>
                ) : (
                  <span>
                    {isValidExternalUrl(item.externalUrl) ? "Valid https link" : "Check link"} · new
                    tab
                  </span>
                )}
              </span>
            </span>
            <span className="pf-row-open" aria-hidden="true">
              {item.openMode === "external" ? "↗" : "›"}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default PortfolioList
